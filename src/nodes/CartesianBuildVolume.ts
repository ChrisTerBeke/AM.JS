'use strict'

import {BuildVolume} from './BuildVolume'
import * as THREE from 'three'

export class CartesianBuildVolume extends BuildVolume {
    
    constructor (width, depth, height) {
        super(width, depth, height)
    }
    
    protected _createGeometry (width, depth, height) {
        this.geometry = new THREE.BoxGeometry(width, depth, height)
        this.geometry.translate(width / 2, depth / 2, height / 2)
    }
}
