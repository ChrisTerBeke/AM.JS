// Copyright (c) 2018 Chris ter Beke
// am.js is open source under the terms of LGPLv3 or higher

// helpers
import generateUUID from '../helpers/generateUUID'
import Signal from '../helpers/Signal'

// interfaces
import AMJSInterface from './AMJSInterface'

// config
import Config from './Config'

// managers
import CameraManager from './camera/CameraManager'

/**
 * The main class that kick-starts an instance of am.js.
 */
class AMJS implements AMJSInterface {

	// unique generated ID for this instance of am.js.
	private _UUID: string = generateUUID()

	// application config
	private _config: Config = {
		debug: true
	}

	// HTML canvas element to bind this instance to.
	private _canvas: HTMLCanvasElement

	// managers
	private _cameraManager: CameraManager

	// signals
	public onReady: Signal<{success: boolean}> = new Signal()

	/**
	 * Creates an instance of AMJS.
	 * @param {HTMLCanvasElement} canvas
	 * @memberof AMJS
	 */
	public constructor(canvas: HTMLCanvasElement) {
		console.debug(this._UUID, 'Creating application instance...')

		// set the initial canvas element
		this.setCanvas(canvas)
	}

	/**
	 * Initialize the application.
	 */
	public init(): void {
		// initialize the managers
		this._cameraManager = new CameraManager(this)

		// indicate that we're ready to roll
		this.onReady.emit({ success: true })
	}

	/**
	 * Get application config.
	 */
	public getConfig(): Config {
		return this._config
	}

	/**
	 * Get application UUID.
	 */
	public getUUID(): string {
		return this._UUID
	}

	/**
	 * Get the bound canvas element.
	 */
	public getCanvas(): HTMLCanvasElement {
		return this._canvas
	}

	/**
	 * Bind to a new canvas element.
	 * Will trigger a forced re-render.
	 * @param canvas The canvas element to bind to.
	 */
	public setCanvas(canvas: HTMLCanvasElement): void {
		this._canvas = canvas
	}

	/**
	 * Get the camera manager.
	 */
	public getCameraManager(): CameraManager {
		return this._cameraManager
	}
}

export default AMJS
