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
    
    private _viewer: Viewer
    private _canvas: HTMLCanvasElement
    private _camera: THREE.PerspectiveCamera | THREE.OrthographicCamera
    private _controls: THREE.OrbitControls

    private static __instance: CameraManager

    public static getInstance (viewerInstance: Viewer) {

        // create instance if not yet existing
        if (!this.__instance) {
            this.__instance = new CameraManager(viewerInstance)
        }

        return this.__instance
    }
    
    constructor (viewerInstance: Viewer) {
        this._viewer = viewerInstance
        this._canvas = this._viewer.getCanvas()
        this.setCameraType(CAMERA_TYPES.PERSPECTIVE)
    }

    /**
     * Get the current camera object.
     * @returns {PerspectiveCamera | OrthographicCamera}
     */
    public getCamera () {
        return this._camera
    }

    /**
     * Switch the camera type between perspective and orthographic modes.
     * @param type
     */
    public setCameraType (type: CAMERA_TYPES) {
        
        // set the camera types
        if (type === CAMERA_TYPES.ORTHOGRAPHIC) {
            this._camera = CameraManager._createOrthographicCamera(this._canvas)
        } else if (type === CAMERA_TYPES.PERSPECTIVE) {
            this._camera = CameraManager._createPerspectiveCamera(this._canvas)
        } else {
            console.error(`Camera type ${type} is not a valid camera type.`)
        }
        
        // set the correct 'up' direction to the z axis
        this._camera.up.set(0,0,1)
        
        // reset position and target to center of build volume
        const buildVolume = this._viewer.getBuildVolumeBoundingBox()
        
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
        
        console.log('camera', this._camera)
        
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
    }

    /**
     * Update the camera controls after a new camera was created.
     * @private
     */
    private _updateCameraControls (cameraTarget: THREE.Vector3) {
        
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

    /**
     * Create a new orthographic camera based on a given canvas size.
     * @param {HTMLCanvasElement} canvas
     * @returns {OrthographicCamera}
     * @private
     */
    private static _createOrthographicCamera (canvas: HTMLCanvasElement) {
        return new THREE.OrthographicCamera(
            canvas.offsetWidth / -2,
            canvas.offsetWidth / 2,
            canvas.offsetHeight / 2,
            canvas.offsetHeight / - 2,
            1,
            100
        )
    }

    /**
     * Create a new perspective camera based on a given canvas size.
     * @param {HTMLCanvasElement} canvas
     * @returns {PerspectiveCamera}
     * @private
     */
    private static _createPerspectiveCamera(canvas: HTMLCanvasElement) {
        return new THREE.PerspectiveCamera(
            60,
            canvas.offsetWidth / canvas.offsetHeight,
            0.1,
            100000
        )
    }
}
