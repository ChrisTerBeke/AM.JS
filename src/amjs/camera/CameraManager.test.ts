import {
    Vector3
} from 'three'
import CameraManager, {
    CAMERA_TYPES,
} from './CameraManager'

test('Creates a perspective camera when initialized', () => {
    const canvasMock = document.createElement('canvas')
    const cameraManager = new CameraManager(canvasMock)
    expect(cameraManager.getCamera().type).toEqual('PerspectiveCamera')
})

test('Creates an ortographic camera when initialized with that type', () => {
    const canvasMock = document.createElement('canvas')
    const cameraManager = new CameraManager(canvasMock, CAMERA_TYPES.ORTHOGRAPHIC)
    expect(cameraManager.getCamera().type).toEqual('OrthographicCamera')
})

test('It can point a camera at the given coordinates', () => {
    const canvasMock = document.createElement('canvas')
    const cameraManager = new CameraManager(canvasMock)
    const target = new Vector3(10, 10, 10)
    cameraManager.lookAt(target)
    expect(cameraManager.getCamera().rotation.x).toEqual(-0.7853981633974485)
})
