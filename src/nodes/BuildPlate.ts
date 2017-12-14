'use strict'

import * as THREE from 'three'
import { Node, NODE_TYPES } from './NodeInterface'
import { RenderOptions } from '../managers/RenderManager'

export class BuildPlate extends THREE.Mesh implements Node {

    private _width: number
    private _depth: number
    private _height: number
    
    constructor (width, depth) {
        super()

        // set size
        this._width = width
        this._depth = depth
        this._height = 1
        
        // override type
        this.type = NODE_TYPES.BUILD_PLATE
        
        // defaults
        this.castShadow = false
        this.receiveShadow = true
        
        this._createGeometry()
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

    public setSize (width: number, depth: number): void {
        this._width = width
        this._depth = depth
        this._resize()
    }
    
    protected _resize () {
        this.position.set(this._width / 2, this._depth / 2, -this._height / 2)
        this.scale.set(this._width, this._depth, this._height)
    }

    protected _createGeometry () {
        console.warn('Geometry should be implemented in BuildPlate sub types')
    }

    protected _createMaterial () {
        console.warn('Material should be implemented in BuildPlate sub types')
    }
}
