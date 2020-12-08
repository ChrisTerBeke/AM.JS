import StlImporter from './StlImporter'
import cube from '../../20mm_cube.stl'

test('It can import STL files', (done) => {
    const stlImporter = new StlImporter()
    stlImporter.onMeshImported.connect(() => done())
    stlImporter.load(cube)
})

test('It prevents importing faulty STL files', (done) => {
    const stlImporter = new StlImporter()
    const invalidFile = 'data:application/octet-stream;base64,c29saWQgbW9kZWwKZmFjZXQg'
    stlImporter.onMeshError.connect(() => done())
    stlImporter.load(invalidFile)
})
