import {
	OrthographicCamera,
	PerspectiveCamera,
}from 'three'

/**
 * A factory class for creating camera objects.
 */
class CameraFactory {

	public static createPerspectiveCamera(canvas: HTMLCanvasElement): PerspectiveCamera {
		return new PerspectiveCamera(
			60, // field of view
			canvas.offsetWidth / canvas.offsetHeight, // aspect ratio
			0.1, // minimum render distance
			100000, // maximum render distance
		)
	}

	public static createOrthographicCamera(canvas: HTMLCanvasElement): OrthographicCamera {
		return new OrthographicCamera(
			canvas.offsetWidth / -2, // top left
            canvas.offsetWidth / 2, // top right
            canvas.offsetHeight / 2, // bottom left
            canvas.offsetHeight / - 2, // bottom right
            1, // minimum render distance
            100, // maximum render distance
		)
	}
}

export default CameraFactory
