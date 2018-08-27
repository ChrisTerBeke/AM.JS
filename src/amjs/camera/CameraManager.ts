// Copyright (c) 2018 Chris ter Beke
// am.js is open source under the terms of LGPLv3 or higher
import * as THREE from 'three'

// interfaces
import AMJSInterface from '../AMJSInterface'

// factories
import CameraFactory from './CameraFactory'

/**
 * Available camera types.
 */
export enum CAMERA_TYPES {
	ORTHOGRAPHIC = 'orthographic',
	PERSPECTIVE = 'perspective'
}

/**
 * Manages the active camera in the application.
 */
class CameraManager {

	private _application: AMJSInterface
	private _camera: THREE.Camera

	/**
	 * Creates an instance of CameraManager.
	 * @param {AMJSInterface} application
	 * @memberof CameraManager
	 */
	public constructor(application: AMJSInterface) {
		console.debug(application.getUUID(), 'Creating camera manager...')
		this._application = application
	}

	/**
	 * Get the active camera type.
	 */
	public getCamera() {
		return this._camera
	}

	/**
	 * Set the active camera type.
	 * Creates a new instance of the selected type and targets it on the canvas.
	 * @param {CAMERA_TYPES} type The camera type to switch to.
	 */
	public setCameraType(type: CAMERA_TYPES) {

		// maps camera type to camera object creation method
		const cameraTypeToFactoryMap: {[type: string]: (canvas: HTMLCanvasElement) => THREE.Camera} = {
			[CAMERA_TYPES.ORTHOGRAPHIC]: CameraFactory.createOrthographicCamera,
			[CAMERA_TYPES.PERSPECTIVE]: CameraFactory.createPerspectiveCamera
		}

		// create the camera and target it at the canvas
		this._camera = cameraTypeToFactoryMap[type](this._application.getCanvas())

		// set the 'up' direction in the z-axis
		this._camera.up.set(0, 0, 1)

		// TODO: center at build plate
	}
}

export default CameraManager
