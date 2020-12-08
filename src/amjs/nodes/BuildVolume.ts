import {
    AxesHelper,
    BackSide,
    BoxBufferGeometry,
    MeshBasicMaterial,
    Vector3,
} from 'three'
import BaseNode from './BaseNode'
import { NODE_TYPES } from './NodeInterface'

interface IBuildVolumeConfig {
    x: number,
    y: number,
    z: number,
}

class BuildVolume extends BaseNode {

    private _width: number
    private _height: number
    private _depth: number

    constructor(config: IBuildVolumeConfig) {
        super(NODE_TYPES.BUILD_VOLUME, new BoxBufferGeometry(1, 1, 1))

        // defaults
        this.castShadow = false
        this.receiveShadow = false

        // material
        this.material = new MeshBasicMaterial({
            color: 0x46b1e6,
            opacity: 0.2,
            side: BackSide,
            transparent: true,
        })

        // size
        this._width = config.x
        this._depth = config.y
        this._height = config.z
        this.position.set(this._width / 2, this._depth / 2, this._height / 2)
        this.scale.set(this._width, this._depth, this._height)
        this.geometry.computeBoundingBox()

        // axes helper
        const zeroPoint = new AxesHelper(10)
        zeroPoint.position.set(0, 0, 0)
        this.children.push(zeroPoint)
    }

    public render(): void {
        // todo
    }

    public getCenter(): Vector3 {
        return this.getBoundingBox().getCenter(new Vector3())
    }
}

export default BuildVolume
