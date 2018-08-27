'use strict'

import { Exporter } from './Exporter'
import * as THREE from 'three'
import { NODE_TYPES } from '../nodes/NodeInterface'

/**
 * The ASCII STL exporter converts the mesh nodes into a ASCII STL file.
 * The file is then presented as downloadable blob.
 */
export class AsciiSTLExporter extends Exporter {

	protected _parse() {

		// TODO: select a root node to start parsing from
		const rootSceneNode = this._viewer.getSceneNode()
		
		// start with the STL solid header
		let output = 'solid exported \n'

		// find all mesh nodes
		rootSceneNode.traverse((node: THREE.Mesh) => {

			// only export mesh nodes
			if (node.type !== NODE_TYPES.MESH) {
                return
			}

			// clone the geometry before doing any transformations
			let newGeometry = node.geometry.clone()

			// parse a buffer geometry to a normal geometry if needed
            if (newGeometry instanceof THREE.BufferGeometry) {
                newGeometry = new THREE.Geometry().fromBufferGeometry(newGeometry)
			}
			
			// go over all geometry faces and stringify the into ASCII format
			for (let i = 0; i < newGeometry.faces.length; i++) {
				output += `facet normal ${this._stringifyVector(newGeometry.faces[i].normal)} \n`
				output += 'outer loop \n'
				output += `${this._stringifyVertex(newGeometry.vertices[newGeometry.faces[i].a])}`
				output += `${this._stringifyVertex(newGeometry.vertices[newGeometry.faces[i].b])}`
				output += `${this._stringifyVertex(newGeometry.vertices[newGeometry.faces[i].c])}`
				output += 'endloop \n'
				output += 'endfacet \n'
			}
		})

		output += 'endsolid'

		// set the export output
        this._parsedData = output
	}

	private _stringifyVertex(vector: THREE.Vector3) {
		return `vertex ${this._stringifyVector(vector)} \n`
	}

	private _stringifyVector(vector: THREE.Vector3) {
		return `${vector.x} ${vector.y} ${vector.z}`
	}
}
