import Signal from '../../helpers/Signal'
import MeshNode from '../nodes/MeshNode'
import INode from '../nodes/NodeInterface'
import IFileLoader from './FileLoaderInterface'

/**
 * The file importer is responsible for importing files and converting them to MeshNode objects.
 * Because loading a file can take some type, this is done asynchronously
 * and the loaded node can be retrieved by listening to the `onMeshImported` signal.
 */
class FileImporter {

    public onMeshImported: Signal<{node: INode}> = new Signal()
    public onMeshError: Signal<{error: ErrorEvent}> = new Signal()
    public onMeshProgress: Signal<{progress: ProgressEvent}> = new Signal()

    private _loader: IFileLoader = null

    constructor(loader: IFileLoader) {
        this._loader = loader
    }

    public load(filename: string): void {
        this._loader.load(filename, this._load.bind(this), this._progress.bind(this), this._error.bind(this))
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

export default FileImporter
