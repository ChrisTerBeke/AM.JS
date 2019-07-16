import * as THREE from 'three'
import BaseNode from './BaseNode'
import { NODE_TYPES } from './NodeInterface'

class MeshNode extends BaseNode {

    constructor(geometry: THREE.Geometry | THREE.BufferGeometry) {
        super(NODE_TYPES.MESH, geometry)

        // material
        this.material = new THREE.MeshPhongMaterial({
            color: new THREE.Color(.5, .5, .5),
            shininess: 50
        })

        // shadows
        this.castShadow = true
        this.receiveShadow = true
    }

    public render(): void {
        console.log('render mesh node')
    }
}

export default MeshNode
