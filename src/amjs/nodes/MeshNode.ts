import {
    BufferGeometry,
    Color,
    Geometry,
    Material,
    MeshPhongMaterial,
} from 'three'
import BaseNode from './BaseNode'
import BuildVolume from './BuildVolume'
import { NODE_TYPES } from './NodeInterface'

class MeshNode extends BaseNode {

    public defaultMaterial: MeshPhongMaterial

    constructor(geometry: Geometry | BufferGeometry) {
        super(NODE_TYPES.MESH, geometry)

        // material
        this.defaultMaterial = new MeshPhongMaterial({
            color: new Color(.5, .5, .5),
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

    public setMaterial(material: Material): void {
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
