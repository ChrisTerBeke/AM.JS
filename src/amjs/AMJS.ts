import * as THREE from 'three'
import Config from './Config'
import generateUUID from '../helpers/generateUUID'
import Signal from '../helpers/Signal'
import AMJSInterface from './AMJSInterface'
import CameraManager from './camera/CameraManager'
import NodeManager from './nodes/NodeManager'
import Node from './nodes/NodeInterface'
import LightFactory from './lighting/LightFactory'

/**
 * The main class that kick-starts an instance of am.js.
 */
class AMJS implements AMJSInterface {

	// unique generated ID for this instance of am.js.
	private _UUID: string = generateUUID()

	// application config
	private _config: Config = {
		debug: true
	}

	// HTML canvas element to bind this instance to.
    private _canvas: HTMLCanvasElement
    private _renderer: THREE.WebGLRenderer

	// managers
    private _cameraManager: CameraManager
    private _nodeManager: NodeManager
    
	// signals
    public onReady: Signal<{}> = new Signal()
    public onMeshLoaded: Signal<{node: Node}> = new Signal()
    public onMeshError: Signal<{error: ErrorEvent}> = new Signal()
    public onMeshProgress: Signal<{progress: ProgressEvent}> = new Signal()

	constructor(canvas: HTMLCanvasElement) {
		this.setCanvas(canvas)
	}

	public init(): void {
        this._loadNodeManager()
        this._loadCameraManager()
        this._loadLighting()
		this.onReady.emit({ success: true })
	}

	public getConfig(): Config {
		return this._config
	}

	public getUUID(): string {
		return this._UUID
    }
    
	public getCanvas(): HTMLCanvasElement {
		return this._canvas
	}

	public setCanvas(canvas: HTMLCanvasElement): void {
        this._canvas = canvas
        this._renderer = new THREE.WebGLRenderer({
            canvas: this._canvas,
            alpha: true,
        })
        this._renderer.shadowMap.enabled = true
        this._renderer.shadowMap.type = THREE.PCFSoftShadowMap
        this._renderer.setPixelRatio(window.devicePixelRatio ? window.devicePixelRatio : 1)
        this._renderer.setSize(this._canvas.width, this._canvas.height)
        this._renderer.setClearColor(0xffffff)
	}

    public loadMesh(mesh: Node): void {
        this._nodeManager.addNode(mesh)
    }

    public loadStlFile(filename: string): void {
        this._nodeManager.loadStlFile(filename)
    }

    private _loadNodeManager(): void {
        this._nodeManager = new NodeManager()
        this._nodeManager.onMeshAdded.connect(data => {
            this._render()
            this.onMeshLoaded.emit(data)
        })
        this._nodeManager.onMeshError.connect(data => this.onMeshError.emit(data))
        this._nodeManager.onMeshProgress.connect(data => this.onMeshProgress.emit(data))
    }

    private _loadCameraManager(): void {
        this._cameraManager = new CameraManager(this._canvas)
        this._nodeManager.addCamera(this._cameraManager.getCamera())
        this._render()
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
}

export default AMJS
