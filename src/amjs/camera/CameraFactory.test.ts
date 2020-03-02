import CameraFactory from './CameraFactory'

test('It creates a perspective camera', () => {
    const canvasMock = document.createElement('canvas')
    const perspectiveCamera = CameraFactory.createPerspectiveCamera(canvasMock)
    expect(perspectiveCamera.aspect).toEqual(canvasMock.offsetWidth / canvasMock.offsetHeight)
})

test('It creates an orthographic camera', () => {
    const canvasMock = document.createElement('canvas')
    const orthographicCamera = CameraFactory.createOrthographicCamera(canvasMock)
    expect(orthographicCamera.left).toEqual(canvasMock.offsetWidth / -2)
})
