import benchy from './3DBenchy.stl'
import AMJS from './amjs/AMJS'

const canvas: HTMLCanvasElement = document.getElementById('canvas') as HTMLCanvasElement
const amjs = new AMJS(canvas)

amjs.onReady.connect(() => {
	console.log('init')
})

amjs.onMeshLoaded.connect(({ node }) => {
    console.log('mesh loaded', node)
    amjs.selectMesh(node)
})

amjs.onMeshError.connect(({ error }) => {
    console.log('mesh loading error', error)
})

amjs.init()
amjs.loadStlFile(benchy)
