import { TransformControls } from 'three/examples/jsm/controls/TransformControls'
import NodeManager from './NodeManager'
import CameraFactory from '../camera/CameraFactory'
import LightFactory from '../lighting/LightFactory'
import cube from '../../20mm_cube.stl'

test('It loads an STL file', (done) => {
    const manager = new NodeManager()
    manager.onMeshAdded.connect(() => done())
    manager.loadStlFile(cube)
})

test('It does not load a broken STL file', (done) => {
    const manager = new NodeManager()
    const invalidFile = 'data:application/octet-stream;base64,c29saWQgbW9kZWwKZmFjZXQg'
    manager.onMeshError.connect(() => done())
    manager.loadStlFile(invalidFile)
})

test('It returns the scene', () => {
    const manager = new NodeManager()
    const scene = manager.getScene()
    expect(scene).not.toBeUndefined()
})

test('A camera can be added', () => {
    const manager = new NodeManager()
    const canvasMock = document.createElement('canvas')
    const camera = CameraFactory.createOrthographicCamera(canvasMock)
    manager.addCamera(camera)
})

test('A light can be added', () => {
    const manager = new NodeManager()
    const light = LightFactory.createAmbientLight()
    manager.addLight(light)
})

test('Controls can be added', () => {
    const manager = new NodeManager()
    const canvasMock = document.createElement('canvas')
    const camera = CameraFactory.createOrthographicCamera(canvasMock)
    const controls = new TransformControls(camera, canvasMock)
    manager.addControls(controls)
})
