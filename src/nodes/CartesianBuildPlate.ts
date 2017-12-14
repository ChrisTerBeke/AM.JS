'use strict'

import * as THREE from 'three'
import { BuildPlate } from './BuildPlate'
import CartesianBuildPlateGridTexture from '../resources/textures/CartesianBuildPlateGridTexture'

export class CartesianBuildPlate extends BuildPlate {
    
    protected _createGeometry () {
        this.geometry = new THREE.BoxGeometry(1, 1, 1)
        this._resize()
    }
    
    protected _createMaterial () {
        this.material = new THREE.MeshBasicMaterial({
            color: new THREE.Color(.8, .8, .8),
            map: new THREE.TextureLoader().load(CartesianBuildPlateGridTexture)
        })
    }
}
