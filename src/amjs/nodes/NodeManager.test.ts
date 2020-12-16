import { TransformControls } from 'three/examples/jsm/controls/TransformControls'
import NodeManager from './NodeManager'
import CameraFactory from '../camera/CameraFactory'
import LightFactory from '../lighting/LightFactory'
import cube from '../../20mm_cube.stl'
import BuildVolume from './BuildVolume'

test('It can load an STL file', (done) => {
    const manager = new NodeManager()
    manager.onMeshAdded.connect((data) => {
        expect(data.node).not.toBeNull()
        done()
    })
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

test('An existing node can be removed', (done) => {
    const manager = new NodeManager()
    manager.onMeshAdded.connect((data) => {
        expect(data.node).not.toBeNull()
        manager.removeNode(data.node)
    })
    manager.onMeshRemoved.connect(() => done())
    manager.loadStlFile(cube)
})

test('It returns the build volume', () => {
    const manager = new NodeManager()
    const buildVolume = manager.getBuildVolume()
    expect(buildVolume).not.toBeUndefined()
})

test('A build volume can be set', () => {
    const buildVolume = new BuildVolume({ x: 200, y: 200, z: 200 })
    const manager = new NodeManager()
    manager.setBuildVolume(buildVolume)
})

test('It can render', () => {
    const manager = new NodeManager()
    manager.render()
    // TODO: actually render some nodes
})

test('It returns the mesh children', () => {
    const manager = new NodeManager()
    const meshChildren = manager.getMeshChildren()
    expect(meshChildren).toEqual([])
    // TODO: test with actual meshes added
})
