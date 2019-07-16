import * as THREE from 'three'
import BaseNode from './BaseNode'
import { NODE_TYPES } from './NodeInterface'
import Node from './NodeInterface'

/**
 * The root node contains the scene and all objects in it.
 *
 * @class RootNode
 * @extends {BaseNode}
 */
class RootNode extends THREE.Object3D {

    private _scene: THREE.Scene = new THREE.Scene()

    // constructor() {
    //     super(NODE_TYPES.ROOT)
    // }

    public getScene(): THREE.Scene {
        return this._scene
    }

    public addCamera(camera: THREE.Camera): void {
        this._scene.add(camera)
    }

    public addChild(node: Node): void {
        this._scene.add(node)
    }

    public removeChild(node: Node): void {
        this._scene.remove(node)
    }

    public getChildren(): Node[] {
        return this._scene.children as Node[]
    }

    public render(): void {
        for (let node of this.getChildren()) {
            // TODO: this is ugly, maybe userData should be used instead of a custom node tree.
            node.render && node.render()
        }
    }
}

export default RootNode
