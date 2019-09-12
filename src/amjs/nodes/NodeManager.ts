import { TransformControls } from 'three/examples/jsm/controls/TransformControls'
import Signal from '../../helpers/Signal'
import StlImporter from '../files/StlImporter'
import INode from './NodeInterface'
import RootNode from './RootNode'

/**
 * Class responsible for orchestrating all nodes in the scene.
 */
class NodeManager {

    // signals
    public onMeshAdded: Signal<{node: INode}> = new Signal()
    public onMeshRemoved: Signal<{}> = new Signal()
    public onMeshError: Signal<{error: ErrorEvent}> = new Signal()
    public onMeshProgress: Signal<{progress: ProgressEvent}> = new Signal()

    // importers
    private _stlImporter: StlImporter = new StlImporter()

    // scene
    private _rootNode: RootNode = new RootNode()

    constructor() {
        this._stlImporter.onMeshImported.connect(this._meshImported.bind(this))
        this._stlImporter.onMeshError.connect((data) => this.onMeshError.emit(data))
        this._stlImporter.onMeshProgress.connect((data) => this.onMeshProgress.emit(data))
    }

    public getScene(): THREE.Scene {
        return this._rootNode.getScene()
    }

    public addCamera(camera: THREE.Camera): void {
        this._rootNode.addCamera(camera)
    }

    public addLight(light: THREE.Light): void {
        this._rootNode.addLight(light)
    }

    public addControls(controls: TransformControls): void {
        this._rootNode.addControls(controls)
    }

    public addNode(node: INode): void {
        this._rootNode.addChild(node)
        this.onMeshAdded.emit({ node })
    }

    public removeNode(node: INode): void {
        this._rootNode.removeChild(node)
        this.onMeshRemoved.emit()
    }

    public render(): void {
        this._rootNode.render()
    }

    public loadStlFile(filename: string): void {
        this._stlImporter.load(filename)
    }

    private _meshImported(data: { node: INode }): void {
        this.addNode(data.node)
    }
}

export default NodeManager
