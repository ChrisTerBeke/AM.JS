'use strict'

import * as THREE from 'three'
import { Node, NODE_TYPES } from './NodeInterface'
import {RenderOptions} from '../managers/RenderManager'

export class BuildVolume extends THREE.Mesh implements Node {
    
    constructor (width, depth, height) {
        super()

        // override type
        this.type = NODE_TYPES.BUILD_VOLUME
        
        this._createGeometry(width, depth, height)
        this.geometry.computeBoundingBox()
        
        this._createMaterial()
    }

    public getId (): string {
        return undefined
    }

    public getType (): string {
        return this.type
    }

    public getParent (): Node | THREE.Object3D | null {
        return null
    }

    public getChildren (): Node[] | THREE.Object3D[] {
        return []
    }

    public addChild (childNode: Node | THREE.Object3D): void {
        return
    }

    public removeChild (childNode: Node | THREE.Object3D): void {
        return
    }

    public render (renderOptions?: RenderOptions): void {
        return
    }

    /**
     * Get the min and max values for the bounding box.
     * @returns {Box3}
     */
    public getBoundingBox (): THREE.Box3 {
        this.geometry.computeBoundingBox()
        return this.geometry.boundingBox
    }
    
    protected _createGeometry (width, depth, height) {
        console.warn('Geometry should be implemented in BuildVolume sub types')
    }
    
    protected _createMaterial () {
        this.material = new THREE.MeshBasicMaterial({
            color: 0x46b1e6,
            transparent: true,
            opacity: 0.2,
            side: THREE.BackSide
        })
    }
}
