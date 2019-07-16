import { STLLoader } from 'three/examples/jsm/loaders/STLLoader'
import Signal from '../../helpers/Signal'
import MeshNode from './MeshNode'
import Node from './NodeInterface'

/**
 * The STL importer is responsible for importing Binary and ASCII STL files
 * and converting them to MeshNode objects.
 * Because loading a file can take some type, this is done asynchronously
 * and the loaded node can be retrieved by listening to the `onMeshImported` signal.
 */
class StlImporter {

    public onMeshImported: Signal<{node: Node}> = new Signal()
    public onMeshError: Signal<{error: ErrorEvent}> = new Signal()
    public onMeshProgress: Signal<{progress: ProgressEvent}> = new Signal()

    /**
     * Load a mesh by local filename.
     *
     * @param {string} filename The path to the local file.
     * @memberof StlImporter
     */
    public load(filename: string): void {
        const loader = new STLLoader()
        loader.load(filename, this._load.bind(this), this._progress.bind(this), this._error.bind(this))
    }

    public _load(geometry): void {
        const node = new MeshNode(geometry)
        this.onMeshImported.emit({ node })
    }

    public _progress(progress: ProgressEvent): void {
        this.onMeshProgress.emit({ progress })
    }

    public _error(error: ErrorEvent): void {
        this.onMeshError.emit({ error })
    }
}

export default StlImporter
