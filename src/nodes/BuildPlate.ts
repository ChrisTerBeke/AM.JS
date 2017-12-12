'use strict'

import * as THREE from 'three'
import { Node, NODE_TYPES } from './NodeInterface'
import { RenderOptions } from '../managers/RenderManager'

export class BuildPlate extends THREE.Mesh implements Node {
    
    constructor (width, depth) {
        super()
        
        // override type
        this.type = NODE_TYPES.BUILD_PLATE
        
        // defaults
        this.castShadow = false
        this.receiveShadow = true
        
        this._createGeometry(width, depth)
        this.geometry.computeBoundingBox()

        this._createMaterial()
    }

    public getId (): string {
        return this.uuid
    }

    public getType (): string {
        return this.type
    }

    public getParent (): THREE.Object3D | null {
        return null
    }

    public getChildren (): THREE.Object3D[] {
        return []
    }

    public addChild (childNode: THREE.Object3D): void {
        return
    }

    public removeChild (childNode: THREE.Object3D): void {
        return
    }

    public render (renderOptions?: RenderOptions): void {
        return
    }

    protected _createGeometry (width, depth) {
        console.warn('Geometry should be implemented in BuildPlate sub types')
    }

    protected _createMaterial () {
        console.warn('Material should be implemented in BuildPlate sub types')
    }
}
