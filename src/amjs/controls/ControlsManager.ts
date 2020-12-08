import {
    Camera,
    Vector3,
} from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { TransformControls } from 'three/examples/jsm/controls/TransformControls'
import Signal from '../../helpers/Signal'
import INode, { NODE_TYPES } from '../nodes/NodeInterface'

// available transform controls modes
export enum TRANSFORM_CONTROL_MODES {
    TRANSLATE = 'translate',
    ROTATE = 'rotate',
    SCALE = 'scale',
}

/**
 * Manages the user interaction via multiple controls types.
 */
class ControlsManager {

    public onCameraControlsChanged: Signal<void> = new Signal()
    public onTransformControlsChanged: Signal<void> = new Signal()
    public onSelectedNodeTransformed: Signal<void> = new Signal()

    private _canvas: HTMLCanvasElement
    private _cameraControls: OrbitControls
    private _transformControls: TransformControls

    constructor(canvas: HTMLCanvasElement) {
        this._canvas = canvas
    }

    public initControlsForCamera(camera: Camera): void {
        this._initCameraControls(camera)
        this._initTransformControls(camera)
    }

    public initControlsForNode(node?: INode): void {
        if (!node) {
            this._transformControls.detach()
            return
        }
        if (node.getType() !== NODE_TYPES.MESH) {
            return
        }
        this._transformControls.attach(node)
        this.onTransformControlsChanged.emit()
    }

    public setTransformControlsMode(mode: TRANSFORM_CONTROL_MODES): void {
        this._transformControls.setMode(mode)
        this._transformControls.setSpace(mode === TRANSFORM_CONTROL_MODES.SCALE ? 'local' : 'world')
        this.onTransformControlsChanged.emit()
    }

    public getTransformControls(): TransformControls {
        return this._transformControls
    }

    public enableTransformControls(): void {
        this._cameraControls.enabled = false
        this.onCameraControlsChanged.emit()
    }

    public disableTransformControls(): void {
        this._cameraControls.enabled = true
        this.onCameraControlsChanged.emit()
    }

    public setCameraControlsTarget(target: Vector3): void {
        this._cameraControls.target.set(target.x, target.y, target.z)
    }

    private _initCameraControls(camera: Camera): void {
        this._cameraControls = new OrbitControls(camera, this._canvas)
        this._cameraControls.addEventListener('change', () => this.onCameraControlsChanged.emit())
    }

    private _initTransformControls(camera: Camera): void {
        this._transformControls = new TransformControls(camera, this._canvas)
        this._transformControls.setSize(2)
        this._transformControls.addEventListener('change', () => this.onTransformControlsChanged.emit())
        this._transformControls.addEventListener('mouseDown', () => this.enableTransformControls())
        this._transformControls.addEventListener('mouseUp', () => this.disableTransformControls())
        this._transformControls.addEventListener('objectChange', () => this.onSelectedNodeTransformed.emit())
    }
}

export default ControlsManager
