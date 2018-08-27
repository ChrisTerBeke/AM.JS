'use strict'

import { Exporter } from './Exporter'
import * as THREE from 'three'
import { NODE_TYPES } from '../nodes/NodeInterface'

const STL_HEADER_OFFSET = 80

/**
 * The binary STL exporter converts the mesh nodes into a binary STL file.
 * The file is then presented as downloadable blob.
 */
export class BinarySTLExporter extends Exporter {
    
    protected _parse () {
        
        let objects = []
        let triangles = 0
        const fileHeader = 'Created with AM.JS, a browser based 3D viewer.' // everything after 80 characters will be ignored

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
            
            // keep track of the total amount of triangles (used for buffer size allocation)
            triangles += newGeometry.faces.length

            // store the object for parsing later
            objects.push({
                matrixWorld: node.matrixWorld,
                vertices: newGeometry.vertices,
                faces: newGeometry.faces
            })
        })
        
        // compute the buffer length, 96 bytes are needed to store 1 triangle
        const bufferLength = (triangles * 96) + STL_HEADER_OFFSET + 4
        const arrayBuffer = new ArrayBuffer(bufferLength)
        const output = new DataView(arrayBuffer)
        
        // convert the header text into int8 characters
        for (let i = 0; i < STL_HEADER_OFFSET; i++) {
            output.setUint8(i, fileHeader.charCodeAt(i))
        }
        
        // start the offset with header size
        let offset = STL_HEADER_OFFSET
        output.setUint32(offset, triangles, true)
        offset += 4

        // we loop again, this time getting the actual mesh data
        for (let node of objects) {

            const matrixWorld = node.matrixWorld
            const vertices = node.vertices
            const faces = node.faces
            const normalMatrixWorld = new THREE.Matrix3()
            normalMatrixWorld.getNormalMatrix(matrixWorld)

            for (let face of faces) {

                // get the normalized vector for each face
                const vector = new THREE.Vector3()
                vector.copy(face.normal).applyMatrix3(normalMatrixWorld).normalize()

                // write face normals to output buffer
                output.setFloat32(offset, vector.x, true)
                offset += 4

                output.setFloat32(offset, vector.y, true)
                offset += 4

                output.setFloat32(offset, vector.z, true)
                offset += 4
                
                // get the triangle corners as indices
                const indices = [face.a, face.b, face.c]
                
                for (let j = 0; j < indices.length; j++) {

                    // get world vector for each point in the triangle
                    vector.copy(vertices[indices[j]]).applyMatrix4(matrixWorld)

                    // write triangle corners to output buffer
                    output.setFloat32(offset, vector.x, true)
                    offset += 4

                    output.setFloat32(offset, vector.y, true)
                    offset += 4

                    output.setFloat32(offset, vector.z, true)
                    offset += 4
                }

                // fill byte
                output.setUint16(offset, 0, true)
                offset += 2
            }
        }

        // set the export output
        this._parsedData = output
    }
}
