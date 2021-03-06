import * as THREE from 'three'
import generateUUID from '../helpers/generateUUID'
import Signal from '../helpers/Signal'
import CameraManager from './camera/CameraManager'
import ControlsManager from './controls/ControlsManager'
import LightFactory from './lighting/LightFactory'
import BuildVolume from './nodes/BuildVolume'
import INode from './nodes/NodeInterface'
import NodeManager from './nodes/NodeManager'

interface IAMJSConfig {
    buildVolumeConfig?: {
        x: number,
        y: number,
        z: number,
    },
    detectMeshOutOfBuildVolume?: boolean,
}

/**
 * The main class that kick-starts an instance of am.js.
 */
class AMJS {

    // signals
    public onReady: Signal<{}> = new Signal()
    public onMeshLoaded: Signal<{ node: INode }> = new Signal()
    public onMeshError: Signal<{ error: ErrorEvent }> = new Signal()
    public onMeshProgress: Signal<{ progress: ProgressEvent }> = new Signal()

    // unique generated ID for this instance of am.js.
    private _UUID: string = generateUUID()

    // config
    private _config: IAMJSConfig

    // HTML canvas element to bind this instance to.
    private _canvas: HTMLCanvasElement
    private _renderer: THREE.WebGLRenderer

    // managers
    private _cameraManager: CameraManager
    private _nodeManager: NodeManager
    private _controlsManager: ControlsManager

    constructor(canvas: HTMLCanvasElement, config?: IAMJSConfig) {
        this.setCanvas(canvas)
        this.setConfig(config)
    }

    public init(): void {
        this._loadNodeManager()
        this._loadCameraManager()
        this._loadControlsManager()
        this._loadLighting()
        this._loadBuildVolume()
        this._loadBehaviour()
        this._render()
        this.onReady.emit({ success: true })
    }

    public getUUID(): string {
        return this._UUID
    }

    public getCanvas(): HTMLCanvasElement {
        return this._canvas
    }

    public setConfig(config?: IAMJSConfig) {
        if (config) {
            this._config = config
        }
    }

    public setCanvas(canvas: HTMLCanvasElement): void {
        this._canvas = canvas
        this._renderer = new THREE.WebGLRenderer({ alpha: true, canvas: this._canvas })
        this._renderer.shadowMap.enabled = true
        this._renderer.shadowMap.type = THREE.PCFSoftShadowMap
        this._renderer.setPixelRatio(window.devicePixelRatio ? window.devicePixelRatio : 1)
        this._renderer.setSize(this._canvas.width, this._canvas.height)
        this._renderer.setClearColor(0xffffff)
    }

    public loadMesh(mesh: INode): void {
        this._nodeManager.addNode(mesh)
    }

    public loadStlFile(filename: string): void {
        this._nodeManager.loadStlFile(filename)
    }

    public selectMesh(mesh: INode): void {
        this._controlsManager.initControlsForNode(mesh)
    }

    private _loadNodeManager(): void {
        this._nodeManager = new NodeManager()
        this._nodeManager.onMeshAdded.connect((data) => this._onMeshLoaded(data))
        this._nodeManager.onMeshError.connect((data) => this.onMeshError.emit(data))
        this._nodeManager.onMeshProgress.connect((data) => this.onMeshProgress.emit(data))
    }

    private _loadBuildVolume(): void {
        const buildVolume = new BuildVolume(this._config && this._config.buildVolumeConfig
            ? this._config.buildVolumeConfig : { x: 200, y: 200, z: 200 })
        this._nodeManager.setBuildVolume(buildVolume)
        const centerPoint = buildVolume.getCenter()
        this._cameraManager.lookAt(centerPoint)
        this._controlsManager.setCameraControlsTarget(centerPoint)
    }

    private _onMeshLoaded(data: {node: INode}): void {
        this._render()
        this.onMeshLoaded.emit(data)
    }

    private _loadCameraManager(): void {
        this._cameraManager = new CameraManager(this._canvas)
        this._nodeManager.addCamera(this._cameraManager.getCamera())
    }

    private _loadControlsManager(): void {
        this._controlsManager = new ControlsManager(this._canvas)
        this._controlsManager.initControlsForCamera(this._cameraManager.getCamera())
        this._controlsManager.onCameraControlsChanged.connect(() => this._render())
        this._controlsManager.onTransformControlsChanged.connect(() => this._render())
        this._nodeManager.addControls(this._controlsManager.getTransformControls())
    }

    private _loadLighting(): void {
        this._nodeManager.addLight(LightFactory.createAmbientLight())
        this._nodeManager.addLight(LightFactory.createDirectionalLight())
        this._nodeManager.addLight(LightFactory.createShadowedLight())
    }

    private _render(): void {
        this._nodeManager.render()
        this._renderer.render(this._nodeManager.getScene(), this._cameraManager.getCamera())
    }

    private _loadBehaviour(): void {
        if (this._config && this._config.detectMeshOutOfBuildVolume) {
            this._controlsManager.onSelectedNodeTransformed.connect(
                () => this._nodeManager.detectMeshOutOfBuildVolume())
        }
    }
}

export default AMJS
