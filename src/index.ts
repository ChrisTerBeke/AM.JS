import { Raycaster, Vector2 } from 'three'
import AMJS from './amjs/AMJS'
import benchy from './3DBenchy.stl'
import cube from './20mm_cube.stl'
import MeshNode from './amjs/nodes/MeshNode'

const canvas: HTMLCanvasElement = document.getElementById('canvas') as HTMLCanvasElement
const amjs = new AMJS(canvas, {
    buildVolumeConfig: { x: 230, y: 210, z: 220 },
    detectMeshOutOfBuildVolume: true,
})

amjs.onReady.connect(() => {
	console.log('init')
})

amjs.onMeshLoaded.connect(({ node }) => {
    console.log('mesh loaded', node)
})

amjs.onMeshError.connect(({ error }) => {
    console.log('mesh loading error', error)
})

amjs.onMeshProgress.connect(({ progress }) => {
    console.log('mesh loading progress', progress)
})

amjs.init()
amjs.loadStlFile(benchy)
amjs.loadStlFile(cube)


// object selection test
window.addEventListener('click', (event) => {
    event.preventDefault()
    const renderer = amjs.getRenderer()
    const camera = amjs.getCamera()
    const mouse = new Vector2()
    mouse.x = (event.clientX / renderer.domElement.clientWidth) * 2 - 1
    mouse.y = -(event.clientY / renderer.domElement.clientHeight) * 2 + 1
    const raycaster = new Raycaster()
    raycaster.setFromCamera(mouse, camera)
    const meshes = amjs.getMeshes()
    const intersects = raycaster.intersectObjects(meshes, true)
    const selectedMesh = intersects.shift()
    if (selectedMesh) {
        amjs.selectMesh(selectedMesh.object as MeshNode)
    }
}, false)
