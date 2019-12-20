import * as THREE from 'three'
import BaseNode from './BaseNode'
import { NODE_TYPES } from './NodeInterface'
import BuildVolume from './BuildVolume'

class MeshNode extends BaseNode {

    constructor(geometry: THREE.Geometry | THREE.BufferGeometry) {
        super(NODE_TYPES.MESH, geometry)

        // material
        // TODO: store default base material apart from this.material property
        this.material = new THREE.MeshPhongMaterial({
            color: new THREE.Color(.5, .5, .5),
            shininess: 50,
        })

        // shadows
        this.castShadow = true
        this.receiveShadow = true
    }

    public render(): void {
        // TODO
    }

    public isInBuildVolume(buildVolume: BuildVolume): boolean {
        if (this.getBoundingBox().intersectsBox(buildVolume.getBoundingBox())) {
            return true
        }
        return false
    }
}

export default MeshNode
