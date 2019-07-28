/**
 * Base interace for all file loaders.
 */
interface IFileLoader {
    load(
        url: string,
        onLoad: (geometry: THREE.BufferGeometry) => void,
        onProgress?: (event: ProgressEvent) => void,
        onError?: (event: ErrorEvent) => void,
    ): void
}

export default IFileLoader
