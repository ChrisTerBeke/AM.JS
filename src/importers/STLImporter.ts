'use strict'

import * as THREE from 'three'
import * as STLLoader from 'three-stl-loader'
import { Importer } from './Importer'
import { MeshNode } from '../nodes/MeshNode'

export class STLImporter extends Importer {

	public importFromRemoteURL(remoteURL: string) {
		const request = new XMLHttpRequest()
		request.open('GET', remoteURL, false)
		request.send(null)
		if (request.status == 200) {
			return this._parse(request.responseText)
		} else {
			return false
		}
	}

	protected _parse(data) {
		const stlLoader = new STLLoader(THREE)
		const loader = new stlLoader()
		const geometry = loader.parse(data)
		return new MeshNode(geometry)
	}
}
