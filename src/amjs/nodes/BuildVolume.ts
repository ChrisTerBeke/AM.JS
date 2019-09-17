import * as THREE from 'three'
import BaseNode from './BaseNode'
import { NODE_TYPES } from './NodeInterface'

class BuildVolume extends BaseNode {

    private _width: number
    private _height: number
    private _depth: number

    constructor(width: number, height: number,  depth: number) {
        super(NODE_TYPES.MESH, new THREE.BoxBufferGeometry(1, 1, 1))

        // defaults
        this.castShadow = false
        this.receiveShadow = false

        // material
        this.material = new THREE.MeshBasicMaterial({
            color: 0x46b1e6,
            opacity: 0.2,
            side: THREE.BackSide,
            transparent: true,
        })

        // size
        this._width = width
        this._height = height
        this._depth = depth
        this.position.set(this._width / 2, this._depth / 2, this._height / 2)
        this.scale.set(this._width, this._depth, this._height)
        this.geometry.computeBoundingBox()

        // axes helper
        const zeroPoint = new THREE.AxesHelper(10)
        zeroPoint.position.set(0, 0, 0)
        this.children.push(zeroPoint)
    }

    public render(): void {
        // todo
    }

    public getBoundingBox(): THREE.Box3 {
        return new THREE.Box3(
            this.geometry.boundingBox.min.multiply(this.scale).add(this.position),
            this.geometry.boundingBox.max.multiply(this.scale).add(this.position),
        )
    }

    public getCenter(): THREE.Vector3 {
        return this.getBoundingBox().getCenter(new THREE.Vector3())
    }
}

export default BuildVolume
