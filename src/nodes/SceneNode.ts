'use strict'

import * as THREE from 'three'
import { Node, NODE_TYPES } from './NodeInterface'
import { RenderOptions } from '../managers/RenderManager'
import { MeshNode } from './MeshNode'

export class SceneNode extends THREE.Scene implements Node {
    
    constructor () {
        super()

        // override type
        this.type = NODE_TYPES.SCENE
    }

    public getId (): string {
        return this.uuid
    }

    /**
     * Get THREE.Scene object.
     * @returns {Scene}
     */
    public getScene (): THREE.Scene {
        return this
    }

    public getType (): string {
        return this.type
    }

    public addChild (node: THREE.Object3D): void {
        this.add(node)
    }

    public removeChild (node: THREE.Object3D): void {
        this.remove(node)
    }

    public getChildren (): THREE.Object3D[] {
        // @ts-ignore
        // noinspection TypeScriptValidateTypes
        return this.children
    }

    public getParent (): THREE.Object3D {
        // @ts-ignore
        // noinspection TypeScriptValidateTypes
        return this.parent
    }

    public render (renderOptions?: RenderOptions) {
        for (let child of this.getChildren()) {
            if (child.type === NODE_TYPES.MESH) {
                const node = child as MeshNode
                node.render(renderOptions)
            }
        }
    }
}
