'use strict'

import * as THREE from 'three'
import { BaseNode } from './BaseNode'
import { NODE_TYPES} from './NodeInterface'
import { RenderOptions } from '../managers/RenderManager'

export enum TRANSFORM_MODES {
    TRANSLATE = 'translate',
    ROTATE = 'rotate',
    SCALE = 'scale'
}

export class MeshNode extends BaseNode {

    protected _nodeType: NODE_TYPES = NODE_TYPES.MESH
    private _mesh: Mesh
    
    constructor (geometry?: THREE.Geometry) {
        super()
        this._mesh = new Mesh(geometry)
    }
    
    public getGeometry (): THREE.Geometry {
        return this._mesh.geometry
    }
    
    public getMesh (): THREE.Mesh {
        return this._mesh
    }
    
    protected _render () {
        this._mesh.render()
    }
}

export class Mesh extends THREE.Mesh {
    
    // transforms
    private _selected: boolean // TODO: move to MeshNode?
    private _transformMode: TRANSFORM_MODES
    private _allowTransform: boolean
    
    // bounds
    private _originalBounds: THREE.Box3
    private _currentBounds: THREE.Box3
    private _modelHeight: number
    
    // color
    public geometry: THREE.Geometry // override for typing
    public material: THREE.MeshPhongMaterial // override with specific material type for typing
    private _baseColor: THREE.Color
    private _selectionColor: THREE.Color
    
    constructor (geometry?: THREE.Geometry) {
        super()
        
        // extend THREE.Mesh with new type
        this.type = 'MeshNode'
        
        // geometry from existing or create new
        this.geometry = geometry || new THREE.Geometry()
        
        // set default material
        this._baseColor = new THREE.Color().setRGB(0, 0, 0)
        this.material = new THREE.MeshPhongMaterial({
            color: this._baseColor,
            shininess: 50
        })

        // shadows
        this.castShadow = true
        this.receiveShadow = true
        
        // custom properties
        this._selected = false
        this._transformMode = TRANSFORM_MODES.TRANSLATE
        this._allowTransform = true
        this._originalBounds = this._currentBounds = this._calculateBounds()
        this._modelHeight = this._calculateModelHeight()
    }

    /**
     * Get the base color of the mesh.
     * @returns {Color}
     */
    public getColor (): THREE.Color {
        return this._baseColor
    }

    /**
     * Check if the mesh is selected.
     * @returns {boolean}
     */
    public isSelected (): boolean {
        return this._selected
    }

    /**
     * Apply correct styles with each render cycle.
     */
    public render (renderOptions?: RenderOptions) {
        if (this._selected) {
            this.material.color = this._selectionColor
        } else {
            this.material.color = this._baseColor
        }
    }
    
    private _calculateBounds () {
        const bounds = new THREE.Box3()
        bounds.setFromObject(this)
        return bounds
    }
    
    private _calculateModelHeight () {
        return this._currentBounds.max.z - this._currentBounds.min.z
    }
}
