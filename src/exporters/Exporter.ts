'use strict'

import { Viewer } from '../Viewer'

/**
 * The base exporter class is an abstract class to base specific exporters on.
 * Each exporter should at least implement a _parse method.
 */
export class Exporter {
    
    protected _viewer: Viewer
    protected _options
    protected _parsedData
    
    constructor (viewer: Viewer, options = {}) {
        this._viewer = viewer
        this._options = options
    }

    /**
     * Run the parser and return the parsed data.
     * @returns {any}
     */
    public export () {
        this._parse()
        return this._parsedData
    }
    
    protected _parse () {
        console.warn('Each exporter should implement _parse')
    }
}
