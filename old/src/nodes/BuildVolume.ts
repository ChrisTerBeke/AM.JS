'use strict'

import * as THREE from 'three'
import { Node, NODE_TYPES } from './NodeInterface'
import {RenderOptions} from '../managers/RenderManager'

export class BuildVolume extends THREE.Mesh implements Node {
    
    private _width: number
    private _depth: number
    private _height: number
    
    constructor (width, depth, height) {
        super()
        
        // set size
        this._width = width
        this._depth = depth
        this._height = height

        // override type
        this.type = NODE_TYPES.BUILD_VOLUME

        // defaults
        this.castShadow = false
        this.receiveShadow = false
        
        this._createGeometry()
        this.geometry.computeBoundingBox()
        
        this._createMaterial()
        
        // axis helper
        const zeroPoint = new THREE.AxisHelper(5)
        zeroPoint.position.set(0, 0, 0)
        this.children.push(zeroPoint)
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
    
    public setSize (width: number, depth: number, height: number): void {
        this._width = width
        this._depth = depth
        this._height = height
        this._resize()
    }

    /**
     * Get the min and max values for the bounding box.
     * @returns {Box3}
     */
    public getBoundingBox (): THREE.Box3 {
        this.geometry.computeBoundingBox()
        return new THREE.Box3(
            this.geometry.boundingBox.min.multiply(this.scale).add(this.position),
            this.geometry.boundingBox.max.multiply(this.scale).add(this.position)
        )
    }

    protected _resize () {
        const preventBottomFlickeringOffset = 0.5 // TODO: fix this for real later
        this.position.set(this._width / 2, this._depth / 2, this._height / 2 - preventBottomFlickeringOffset)
        this.scale.set(this._width, this._depth, this._height)
    }
    
    protected _createGeometry () {
        console.warn('_createGeometry not implemented')
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
