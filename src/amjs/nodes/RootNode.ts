import * as THREE from 'three'
import INode from './NodeInterface'

/**
 * The root node contains the scene and all objects in it.
 *
 * @class RootNode
 * @extends {BaseNode}
 */
class RootNode extends THREE.Object3D {

    private _scene: THREE.Scene = new THREE.Scene()

    public getScene(): THREE.Scene {
        return this._scene
    }

    public addCamera(camera: THREE.Camera): void {
        this._scene.add(camera)
    }

    public addLight(light: THREE.Light): void {
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

    public render(): void {
        for (const node of this.getChildren()) {
            // TODO: this is ugly, maybe userData should be used instead of a custom node tree.
            if (typeof(node.render) === 'function') {
                node.render()
            }
        }
    }
}

export default RootNode
