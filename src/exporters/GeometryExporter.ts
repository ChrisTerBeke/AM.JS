'use strict'

import * as THREE from 'three'
import { Exporter } from './Exporter'
import { NODE_TYPES } from '../nodes/NodeInterface'

/**
 * The geometry exporter exports all faces and vertices as plain arrays.
 * Useful for fast exporting and direct parsing into other 3D software.
 */
export class GeometryExporter extends Exporter {
    
    protected _parse () {
        
        let geometries = []
        
        // TODO: select a root node to start parsing from
        
        const rootSceneNode = this._viewer.getSceneNode()

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
            
            // transform the geometry to the parent node's world matrix
            const transformation = new THREE.Matrix4().makeRotationX(Math.PI / 2)
            newGeometry.applyMatrix(node.matrixWorld)
            newGeometry.applyMatrix(transformation)
            
            // store the faces (indices) and vertices
            geometries.push({
                faces: newGeometry.faces,
                vertices: newGeometry.vertices
            })
        })
        
        // set the export output
        this._parsedData = geometries
    }
}
