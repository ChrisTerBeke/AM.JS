'use strict'

import * as THREE from 'three'
import { BuildPlate } from './BuildPlate'
import CartesianBuildPlateGridTexture from '../resources/textures/CartesianBuildPlateGridTexture'

export class CartesianBuildPlate extends BuildPlate {
    
    protected _createGeometry (width, depth) {
        this.geometry = new THREE.BoxGeometry(width, depth, 4)
        this.geometry.translate(width / 2, depth / 2, -2)
    }
    
    protected _createMaterial () {
        this.material = new THREE.MeshBasicMaterial({
            color: new THREE.Color(.8, .8, .8),
            map: new THREE.TextureLoader().load(CartesianBuildPlateGridTexture)
        })
    }
}
