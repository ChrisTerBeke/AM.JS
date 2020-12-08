import {
    Camera,
    Light,
    Object3D,
    Scene
} from 'three'
import {
    TransformControls,
} from 'three/examples/jsm/controls/TransformControls'
import MeshNode from './MeshNode'
import INode, {
    NODE_TYPES,
} from './NodeInterface'

/**
 * The root node contains the scene and all objects in it.
 *
 * @class RootNode
 * @extends {BaseNode}
 */
class RootNode extends Object3D {

    private _scene: Scene = new Scene()

    public getScene(): Scene {
        return this._scene
    }

    public addCamera(camera: Camera): void {
        this._scene.add(camera)
    }

    public addControls(controls: TransformControls): void {
        this._scene.add(controls)
    }

    public addLight(light: Light): void {
        this._scene.add(light)
    }

    public addChild(node: INode): void {
        this._scene.add(node)
    }

    public removeChild(node: INode): void {
        this._scene.remove(node)
    }

    public getChildren(): INode[] {
        return this._scene.children as INode[]
    }

    public getMeshChildren(): MeshNode[] {
        return this._scene.children.filter((child: INode) => {
            // TODO: this is ugly, maybe userData should be used instead of a custom node tree.
            return typeof (child.getType) === 'function' && child.getType() === NODE_TYPES.MESH
        }) as MeshNode[]
    }

    public render(): void {
        for (const node of this.getChildren()) {
            // TODO: this is ugly, maybe userData should be used instead of a custom node tree.
            if (typeof (node.render) === 'function') {
                node.render()
            }
        }
    }
}

export default RootNode
