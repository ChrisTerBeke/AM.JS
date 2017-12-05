'use strict'

import * as THREE from 'three'
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
        
        // reset position and target
        this.setCameraPosition(new THREE.Vector3(50, 50, 50))
        this.setCameraTarget(new THREE.Vector3(0, 0, 0))
        
        // trigger a render update
        this._viewer.onRender.emit({
            force: true,
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
