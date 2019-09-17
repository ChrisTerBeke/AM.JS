import * as THREE from 'three'
import CameraFactory from './CameraFactory'

/**
 * Available camera types.
 */
export enum CAMERA_TYPES {
	ORTHOGRAPHIC = 'orthographic',
	PERSPECTIVE = 'perspective',
}

/**
 * Map of camera types to factory functions.
 */
const cameraTypeToFactoryMap: {[type: string]: (canvas: HTMLCanvasElement) => THREE.Camera} = {
    [CAMERA_TYPES.ORTHOGRAPHIC]: CameraFactory.createOrthographicCamera,
    [CAMERA_TYPES.PERSPECTIVE]: CameraFactory.createPerspectiveCamera,
}

/**
 * Manages the active camera in the application.
 */
class CameraManager {

	private _canvas: HTMLCanvasElement
	private _camera: THREE.Camera

	constructor(canvas: HTMLCanvasElement, type: CAMERA_TYPES = CAMERA_TYPES.PERSPECTIVE) {
        this._canvas = canvas
        this.setCameraType(type)
        this.setCameraPosition(new THREE.Vector3(300, 300, 300))
	}

	public getCamera(): THREE.Camera {
		return this._camera
	}

	public setCameraType(type: CAMERA_TYPES) {
		this._camera = cameraTypeToFactoryMap[type](this._canvas)
		this._camera.up.set(0, 0, 1)
    }

    public setCameraPosition(position: THREE.Vector3): void {
        this._camera.position.set(position.x, position.y, position.z)
    }

    public lookAt(target: THREE.Vector3): void {
        this._camera.lookAt(target)
    }
}

export default CameraManager
