'use strict'

// utils
import * as THREE from 'three'
import { Signal } from './utils/Signal'

// managers
import { CONTROL_MODES, SceneManager } from './managers/SceneManager'
import { CameraManager, CAMERA_TYPES } from './managers/CameraManager'
import { RenderManager, RenderOptions, RENDER_TYPES } from './managers/RenderManager'
import { AnimationManager } from './managers/AnimationManager'
import { BuildVolumeManager } from './managers/BuildVolumeManager'

// nodes
import { SceneNode } from './nodes/SceneNode'
import { MeshNode } from './nodes/MeshNode'

// exporters
import { GeometryExporter } from './exporters/GeometryExporter'
import { BinarySTLExporter } from './exporters/BinarySTLExporter'
import { AsciiSTLExporter } from './exporters/AsciiSTLExporter'

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
    public onRender: Signal<RenderOptions> = new Signal()
    public onReady: Signal<any> = new Signal()
    public transformStarted: Signal<any> = new Signal()
    public transformEnded: Signal<any> = new Signal()
    public cameraCreated: Signal<THREE.Camera> = new Signal()
    public nodeSelected: Signal<THREE.Object3D> = new Signal()
    public nodeDeselected: Signal<THREE.Object3D> = new Signal()
    public buildVolumeChanged: Signal<THREE.Box3> = new Signal()
    
    // other public properties
    public CONTROL_MODES = CONTROL_MODES

    /**
     * Initialize the viewer on a target canvas element.
     * The reason this is not done in the constructor is to allow for signal binding before initializing.
     * @param {HTMLCanvasElement} canvas
     */
    public init (canvas: HTMLCanvasElement): void {
        
        // set the canvas element to start rendering
        this.setCanvas(canvas)

        // initialize manager singletons
        // note: they have to be loaded in this specific order
        this._sceneManager = SceneManager.getInstance(this)
        this._buildVolumeManager = BuildVolumeManager.getInstance(this)
        this._cameraManager = CameraManager.getInstance(this)
        this._renderManager = RenderManager.getInstance(this)
        this._animationManager = AnimationManager.getInstance(this)
        
        // add the camera
        this._sceneManager.addCamera(this._cameraManager.getCamera())

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
            type: `${RENDER_TYPES.CANVAS}`
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
    public addCube (parentNodeId?: string): MeshNode {
        return this._sceneManager.addCube(parentNodeId)
    }

    /**
     * Adds a simple cylinder mesh to the scene.
     * @param {string} parentNodeId
     * @returns {MeshNode}
     */
    public addCylinder (parentNodeId?: string): MeshNode {
        return this._sceneManager.addCylinder(parentNodeId)
    }

    /**
     * Remove a mesh node from the scene.
     * @param {string} nodeId
     */
    public removeMeshNode (nodeId: string): void {
        this._sceneManager.removeMeshNode(nodeId)
    }

    /**
     * Get the bounding box of the build volume.
     * @returns {Box3}
     */
    public getBuildVolumeBoundingBox (): THREE.Box3 {
        return this._buildVolumeManager.getBuildVolume().getBoundingBox()
    }

    /**
     * Set the build volume size in mm.
     * @param {number} width
     * @param {number} depth
     * @param {number} height
     */
    public setBuildVolumeSize (width: number, depth: number, height: number): void {
        this._buildVolumeManager.setBuildVolumeSize(width, depth, height)
    }

    /**
     * Set the control mode for mesh transformations.
     * @param {CONTROL_MODES} controlMode
     */
    public setControlMode (controlMode: CONTROL_MODES) {
        this._sceneManager.setControlMode(controlMode)
    }

    /**
     * Set the snap distance for mesh transformations.
     * @param {number} distance
     */
    public setControlSnapDistance (distance: number) {
        this._sceneManager.setControlSnapDistance(distance)
    }

    /**
     * Get a new instance of the geometry exporter.
     * @param options
     * @returns {GeometryExporter}
     */
    public getGeometryExporter (options?) {
        return new GeometryExporter(this, options)
    }

    /**
     * Get a new instance of the binary STL exporter.
     * @param options
     * @returns {BinarySTLExporter}
     */
    public getBinarySTLExporter (options?) {
        return new BinarySTLExporter(this, options)
    }

    /**
     * Get a new instance of the ASCII STL exporter.
     * @param options 
     */
    public getAsciiSTLExporter (options?) {
        return new AsciiSTLExporter(this, options)
    }
}
