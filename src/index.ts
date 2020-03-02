import benchy from './3DBenchy.stl'
import AMJS from './amjs/AMJS'

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
    amjs.selectMesh(node) // remove this when object selection in the UI works
})

amjs.onMeshError.connect(({ error }) => {
    console.log('mesh loading error', error)
})

amjs.onMeshProgress.connect(({ progress }) => {
    console.log('mesh loading progress', progress)
})

amjs.init()
amjs.loadStlFile(benchy)
