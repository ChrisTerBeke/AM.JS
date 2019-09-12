import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
// import { TransformControls } from 'three/examples/jsm/controls/TransformControls'
import Signal from '../../helpers/Signal'

/**
 * Manages the user interaction via orbit controls.
 */
class ControlsManager {

    public onCameraControlsChanged: Signal<void> = new Signal()

    private _cameraControls: OrbitControls
    // private _transformControls: TransformControls
    private _canvas: HTMLCanvasElement

    constructor(canvas: HTMLCanvasElement) {
        this._canvas = canvas
    }

    public enableTransformControls(): void {
        this._cameraControls.enabled = false
        // this._transformControls.enabled = true
    }

    public disableTransformControls(): void {
        this._cameraControls.enabled = true
        // this._transformControls.enabled = false
    }

    public initControlsForCamera(camera: THREE.Camera): void {
        this._cameraControls = new OrbitControls(camera, this._canvas)
        this._cameraControls.addEventListener('change', () => this.onCameraControlsChanged.emit())
        this.disableTransformControls()
    }

    public setCameraControlsTarget(target: THREE.Vector3): void {
        this._cameraControls.target.set(target.x, target.y, target.z)
    }
}

export default ControlsManager
