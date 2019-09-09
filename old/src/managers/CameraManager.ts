'use strict'

import * as THREE from 'three'
window['THREE'] = THREE
import 'three/examples/js/controls/OrbitControls.js'

import { Viewer } from '../Viewer'
import { RENDER_TYPES } from './RenderManager'

export enum CAMERA_TYPES {
    ORTHOGRAPHIC = 'orthographic',
    PERSPECTIVE = 'perspective'
}

/**
 * The camera manager is a singleton class that handles camera actions.
 */
export class CameraManager {
    
    private _controls: THREE.OrbitControls
    private _focusOnBuildVolumeCenter: boolean = true
    
    constructor (viewerInstance: Viewer) {

        // disable the camera controls while transforming
        this._viewer.transformStarted.connect(this.enableCameraControls.bind(this, false))

        // enable the camera controls when done transforming
        this._viewer.transformEnded.connect(this.enableCameraControls.bind(this, true))

        // update the camera target when the build volume changes
        this._viewer.buildVolumeChanged.connect(this._buildVolumeChanged.bind(this))
    }

    /**
     * Switch the camera type between perspective and orthographic modes.
     * @param type
     */
    public setCameraType (type: CAMERA_TYPES) {
        

        // target at build volume center
        this._setTargetAtBuildVolume()
        
        // trigger camera bindings
        this._viewer.cameraCreated.emit(this._camera)
        
        // trigger a render update
        this._viewer.onRender.emit({
            source: CameraManager.name,
            type: RENDER_TYPES.CAMERA
        })
    }

    /**
     * Set the position of the camera in 3D space.
     * @param {Vector3} position
     */
    public setCameraPosition (position: THREE.Vector3) {
        this._camera.position.set(position.x, position.y, position.z)
    }

    /**
     * Set the position where the camera will look at in 3D space.
     * @param {Vector3} target
     */
    public setCameraTarget (target: THREE.Vector3) {
        this._camera.lookAt(target)
        this._updateCameraControls(target)
    }

    /**
     * Enable or disable the camera controls.
     * Only one set of controls can be active at the same time so the camera controls are disabled when transforming nodes.
     * @param {boolean} enabled
     */
    public enableCameraControls (enabled: boolean = true): void {
        this._controls.enabled = enabled
        
        this._viewer.onRender.emit({
            source: CameraManager.name,
            type: RENDER_TYPES.CAMERA
        })
    }

    /**
     * Update the camera target after the build volume changed.
     * @param {Box3} buildVolumeBoundingBox
     * @private
     */
    private _buildVolumeChanged (buildVolumeBoundingBox: THREE.Box3): void {
        
        // do nothing if we shouldn't focus on the center of the build plate
        if (!this._focusOnBuildVolumeCenter) {
            return
        }
        
        this._setTargetAtBuildVolume(buildVolumeBoundingBox)
    }

    /**
     * Helper function to set the camera target at the center of the build volume.
     * @private
     */
    private _setTargetAtBuildVolume (buildVolumeBoundingBox?: THREE.Box3): void {

        // get the correct bounding box
        const buildVolume = buildVolumeBoundingBox || this._viewer.getBuildVolumeBoundingBox()

        // zoom the camera our far enough to see the build volume
        this.setCameraPosition(new THREE.Vector3(
            buildVolume.max.x * 2,
            buildVolume.max.y * 2,
            buildVolume.max.z * 2
        ))

        // focus the camera and controls on the center of the build volume surface
        this.setCameraTarget(new THREE.Vector3(
            (buildVolume.max.x - buildVolume.min.x) / 2,
            (buildVolume.max.y - buildVolume.min.y) / 2,
            buildVolume.min.z
        ))
    }

    /**
     * Update the camera controls after a new camera was created.
     * @private
     */
    private _updateCameraControls (cameraTarget: THREE.Vector3): void {
        
        // create camera controls if needed
        if (!this._controls) {
            this._controls = new THREE.OrbitControls(this._camera, this._canvas)
            this._controls.addEventListener('change', event => {
                this._viewer.onRender.emit({
                    source: CameraManager.name,
                    type: RENDER_TYPES.CAMERA
                })
            })
        }
        
        // set the target position to be in sync with the camera
        this._controls.target.set(cameraTarget.x, cameraTarget.y, cameraTarget.z)
    }


}
