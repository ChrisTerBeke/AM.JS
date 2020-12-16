import {
    BufferGeometry,
} from 'three'

/**
 * Base interace for all file loaders.
 */
interface IFileLoader {
    load(
        url: string,
        onLoad: (geometry: BufferGeometry) => void,
        onProgress?: (event: ProgressEvent) => void,
        onError?: (event: ErrorEvent) => void,
    ): void
}

export default IFileLoader
