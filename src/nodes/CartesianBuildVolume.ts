'use strict'

import {BuildVolume} from './BuildVolume'
import * as THREE from 'three'

export class CartesianBuildVolume extends BuildVolume {
    
    constructor (width, depth, height) {
        super(width, depth, height)
    }
    
    protected _createGeometry () {
        this.geometry = new THREE.BoxGeometry(1, 1, 1)
        this._resize()
    }
}
