'use strict'

import * as THREE from 'three'
import { Node, NODE_TYPES } from './NodeInterface'
import { RenderOptions } from '../managers/RenderManager'
import { Signal } from '../utils/Signal'

export enum TRANSFORM_MODES {
    TRANSLATE = 'translate',
    ROTATE = 'rotate',
    SCALE = 'scale'
}

export class MeshNode extends THREE.Mesh implements Node {

    public geometry: THREE.Geometry // override for typing
    public material: THREE.MeshPhongMaterial // override with specific material type for typing
    
    // transforms
    private _selected: boolean
    private _transformMode: TRANSFORM_MODES
    private _allowTransform: boolean
    
    // bounds
    private _originalBounds: THREE.Box3
    private _currentBounds: THREE.Box3
    private _modelHeight: number

    // properties
    private _baseColor: THREE.Color
    private _selectionColor: THREE.Color

    // event fired when property changes
    public onPropertyChanged: Signal<any> = new Signal()
    
    // rendering
    private _isDirty: boolean
    
    constructor (geometry?: THREE.Geometry) {
        super()
        
        // override type
        this.type = NODE_TYPES.MESH
        
        // geometry from existing or create new
        this.geometry = geometry || new THREE.Geometry()
        
        // set default material
        this._baseColor = new THREE.Color().setRGB(.5, .5, .5)
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
        this._isDirty = true
    }

    public getId (): string {
        return this.uuid
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

    public getChildren (): Node[] {
        // @ts-ignore
        // noinspection TypeScriptValidateTypes
        return this.children
    }

    public getParent (): Node {
        // @ts-ignore
        // noinspection TypeScriptValidateTypes
        return this.parent
    }

    /**
     * Get the base color of the mesh.
     * @returns {Color}
     */
    public getColor (): THREE.Color {
        return this._baseColor
    }

    /**
     * Set the base color of the mesh.
     * @param {Color} color
     */
    public setColor (color: THREE.Color): void {
        this._baseColor = color
        this._propertyChanged('color', color)
    }

    /**
     * Set the mesh selected or not.
     * @param {boolean} selected
     */
    public setSelected(selected?: boolean = true) {
        this._selected = selected
    }

    /**
     * Check if the mesh is selected.
     * @returns {boolean}
     */
    public isSelected (): boolean {
        return this._selected
    }

    /**
     * Check if the mesh can be transformed.
     * @returns {boolean}
     */
    public canTransform () {
        return this._allowTransform
    }

    /**
     * Update the mesh node properties before a canvas render cycle is executed.
     * @param {RenderOptions} renderOptions
     */
    public render (renderOptions?: RenderOptions) {
        

        // render self
        this._render(renderOptions)

        // render children if existing
        for (let child of this.getChildren()) {
            if (child.render) {
                child.render(renderOptions)
            }
        }
    }

    protected _render (renderOptions?: RenderOptions) {
        
        // don't re-render anything when we're sure nothing changed
        if (!this._isDirty && renderOptions.source === `meshNode_${this.getId()}`) {
            return
        }
        
        // set the base color
        this.material.color = this._baseColor

        // set the highlight color if selected
        if (this._selected) {
            this.material.emissive = new THREE.Color(
                this._baseColor.r * 0.2,
                this._baseColor.g * 0.2,
                this._baseColor.b * 0.2
            )
        } else {
            this.material.emissive = new THREE.Color(0, 0, 0)
        }

        // mark as clean as we're done rendering all the changes
        this._isDirty = false
    }
    
    private _calculateBounds () {
        const bounds = new THREE.Box3()
        bounds.setFromObject(this)
        return bounds
    }
    
    private _calculateModelHeight () {
        return this._currentBounds.max.z - this._currentBounds.min.z
    }

    private _propertyChanged (propertyName: string, value: any) {
        this._isDirty = true
        this.onPropertyChanged.emit({ nodeId: this.getId(), propertyName, value })
    }
}
