'use strict'

import * as THREE from 'three'
import { BaseNode } from './BaseNode'
import { NODE_TYPES } from './NodeInterface'
import { MeshNode } from './MeshNode'

export class SceneNode extends BaseNode {

    protected _nodeType: NODE_TYPES = NODE_TYPES.SCENE
    private _scene: THREE.Scene
    
    constructor () {
        super()
        this._scene = new THREE.Scene()
    }

    /**
     * Get THREE.Scene object.
     * @returns {Scene}
     */
    public getScene (): THREE.Scene {
        return this._scene
    }

    /**
     * Add a child mesh.
     * @param {MeshNode} node
     */
    public addChild (node: MeshNode): void {
        super.addChild(node)
        this._scene.add(node.getMesh())
    }
}
