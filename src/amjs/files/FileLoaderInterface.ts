/**
 * Base interace for all file loaders.
 */
interface FileLoader {
    load(
        url: string,
        onLoad: (geometry: THREE.BufferGeometry) => void,
        onProgress?: (event: ProgressEvent) => void,
        onError?: (event: ErrorEvent) => void
    ) : void;
}

export default FileLoader
