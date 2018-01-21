'use strict'

import * as THREE from 'three'
import { MeshNode } from './MeshNode'

/**
 * The simple mesh factory is responsible for creating simple mesh node instances.
 */
export class SimpleMeshFactory {

    /**
     * Create a 10x10x10 cube.
     * @returns {MeshNode}
     */
    public static createCube () {
        const geometry = new THREE.BoxGeometry(10, 10, 10)
        return new MeshNode(geometry)
    }

    /**
     * Create a 10x10 cylinder.
     * @returns {MeshNode}
     */
    public static createCylinder () {
        const geometry = new THREE.CylinderGeometry(10, 10, 10, 24)
        geometry.rotateX(Math.PI)
        return new MeshNode(geometry)
    }
}
