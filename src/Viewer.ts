'use strict'

// three.js
import * as THREE from 'THREE'

// utils
import { Signal } from './utils/Signal'

// managers
import { SceneManager } from './managers/SceneManager'
import { CameraManager, CAMERA_TYPES } from './managers/CameraManager'
import { RenderManager, RenderOptions, RENDER_TYPES } from './managers/RenderManager'
import { AnimationManager } from './managers/AnimationManager'
import { BuildVolumeManager } from './managers/BuildVolumeManager'

// nodes
import { SceneNode } from './nodes/SceneNode'
import { MeshNode } from './nodes/MeshNode'

/**
 * The Viewer class holds one complete instance of the 3D viewer.
 * It has one instance for each manager, a list of signals and the public API.
 */
export class Viewer {
    
    private _canvas: HTMLCanvasElement
    
    // managers
    private _sceneManager: SceneManager
    private _cameraManager: CameraManager
    private _renderManager: RenderManager
    private _animationManager: AnimationManager
    private _buildVolumeManager: BuildVolumeManager

    // signals used for event based triggering
    public onRender: Signal<RenderOptions>
    public onReady: Signal<any>

    /**
     * Only use the constructor for creating signals.
     * All other actions should be done in the init method.
     */
    constructor () {
        this.onRender = new Signal()
        this.onReady = new Signal()
    }

    /**
     * Initialize the viewer on a target canvas element.
     * The reason this is not done in the constructor is to allow for signal binding before initializing.
     * @param {HTMLCanvasElement} canvas
     */
    public init (canvas: HTMLCanvasElement): void {
        
        // set the canvas element to start rendering
        this.setCanvas(canvas)

        // initialize manager singletons
        this._sceneManager = SceneManager.getInstance(this)
        this._cameraManager = CameraManager.getInstance(this)
        this._renderManager = RenderManager.getInstance(this)
        this._animationManager = AnimationManager.getInstance(this)
        this._buildVolumeManager = BuildVolumeManager.getInstance(this)
        
        // add the camera
        this._sceneManager.addCamera(this._cameraManager.getCamera())
        
        // add a temporary light source
        const ambientLight = new THREE.AmbientLight(0x909090)
        this._sceneManager.addLight(ambientLight)

        // finished with initializing
        this.onReady.emit()
    }

    /**
     * Get the targeted canvas element.
     * @returns {HTMLCanvasElement}
     */
    public getCanvas (): HTMLCanvasElement {
        return this._canvas
    }

    /**
     * Set the targeted canvas element.
     * Will trigger a forced re-render.
     * @param {HTMLCanvasElement} canvas
     */
    public setCanvas (canvas: HTMLCanvasElement): void {
        this._canvas = canvas
        this.onRender.emit({
            force: true,
            source: Viewer.name,
            type: RENDER_TYPES.CANVAS
        })
    }

    /**
     * Get the scene node tree.
     * @returns {SceneNode}
     */
    public getSceneNode (): SceneNode {
        return this._sceneManager.getSceneNode()
    }

    /**
     * Get the scene manager instance.
     * @returns {SceneManager}
     */
    public getSceneManager (): SceneManager {
        return this._sceneManager
    }

    /**
     * Get the camera manager instance.
     * @returns {CameraManager}
     */
    public getCameraManager (): CameraManager {
        return this._cameraManager
    }

    /**
     * Get the render manager instance.
     * @returns {RenderManager}
     */
    public getRenderManager (): RenderManager {
        return this._renderManager
    }

    /**
     * Get the build volume manager instance.
     * @returns {BuildVolumeManager}
     */
    public getBuildVolumeManager (): BuildVolumeManager {
        return this._buildVolumeManager
    }

    /**
     * Set the camera type.
     * Allowed types are 'perspective' and 'orthographic'.
     * @param {CAMERA_TYPES} type
     */
    public setCameraType (type: CAMERA_TYPES): void {
        this._cameraManager.setCameraType(type)
    }

    /**
     * Adds a simple cube/box mesh to the scene.
     * @returns {MeshNode}
     */
    public addCube (): MeshNode {
        return this._sceneManager.addCube()
    }
}
