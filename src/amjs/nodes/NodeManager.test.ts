import NodeManager from './NodeManager'
import cube from '../../20mm_cube.stl'

test('It loads an STL file', done => {
    const manager = new NodeManager()
    manager.loadStlFile(cube)
    manager.onMeshAdded.connect(() => done())
})
