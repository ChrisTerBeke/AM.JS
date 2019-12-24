import * as THREE from 'three'
import { TransformControls } from 'three/examples/jsm/controls/TransformControls'
import Signal from '../../helpers/Signal'
import StlImporter from '../files/StlImporter'
import BuildVolume from './BuildVolume'
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
    private _buildVolumeNode: BuildVolume = null

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

    public getBuildVolume(): BuildVolume {
        return this._buildVolumeNode
    }

    public setBuildVolume(buildVolume: BuildVolume): void {
        this._buildVolumeNode = buildVolume
        this._rootNode.addChild(buildVolume)
        this.detectMeshOutOfBuildVolume()
    }

    public render(): void {
        this._rootNode.render()
    }

    public loadStlFile(filename: string): void {
        this._stlImporter.load(filename)
    }

    public detectMeshOutOfBuildVolume(): void {
        for (const node of this._rootNode.getMeshChildren()) {
            if (!node.isInBuildVolume(this._buildVolumeNode)) {
                node.setMaterial(new THREE.MeshPhongMaterial({
                    color: new THREE.Color(1, .25, .25),
                    shininess: 25,
                }))
            } else {
                node.resetMaterial()
            }
        }
    }

    private _meshImported(data: { node: INode }): void {
        this.addNode(data.node)
    }
}

export default NodeManager
