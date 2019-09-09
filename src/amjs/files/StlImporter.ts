import { STLLoader } from 'three/examples/jsm/loaders/STLLoader'
import FileImporter from './FileImporter'

/**
 * The STL importer is responsible for importing Binary and ASCII STL files.
 */
class StlImporter extends FileImporter {
    constructor() {
        super(new STLLoader())
    }
}

export default StlImporter
