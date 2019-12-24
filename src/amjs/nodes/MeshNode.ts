import * as THREE from 'three'
import BaseNode from './BaseNode'
import BuildVolume from './BuildVolume'
import { NODE_TYPES } from './NodeInterface'

class MeshNode extends BaseNode {

    public defaultMaterial: THREE.MeshPhongMaterial

    constructor(geometry: THREE.Geometry | THREE.BufferGeometry) {
        super(NODE_TYPES.MESH, geometry)

        // material
        this.defaultMaterial = new THREE.MeshPhongMaterial({
            color: new THREE.Color(.5, .5, .5),
            shininess: 50,
        })
        this.material = this.defaultMaterial

        // shadows
        this.castShadow = true
        this.receiveShadow = true
    }

    public render(): void {
        // TODO
    }

    public isInBuildVolume(buildVolume: BuildVolume): boolean {
        return buildVolume.getBoundingBox().containsBox(this.getBoundingBox())
    }

    public setMaterial(material: THREE.Material): void {
        this.material = material
    }

    public resetMaterial(): void {
        if (this.material === this.defaultMaterial) {
            return
        }
        this.material = this.defaultMaterial
    }
}

export default MeshNode
