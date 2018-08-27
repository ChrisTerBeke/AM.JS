'use strict'

import { Viewer } from '../Viewer'

/**
 * The base importer class is an abstract class to base specific importers on.
 * Each exporter should at least implement a _parse method and one data retrieval method.
 */
export class Importer {

	protected _viewer: Viewer
    protected _options
	protected _parsedData
	
	constructor (viewer: Viewer, options = {}) {
        this._viewer = viewer
        this._options = options
	}
    
    protected _parse (data) {
        console.warn('Each importer should implement _parse')
    }
}
