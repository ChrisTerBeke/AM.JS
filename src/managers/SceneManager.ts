'use strict'

import * as THREE from 'three'
import { Viewer } from '../Viewer'
import { Node } from '../nodes/NodeInterface'
import { SceneNode } from '../nodes/SceneNode'
import { MeshNode } from '../nodes/MeshNode'
import { SimpleMeshFactory } from '../nodes/SimpleMeshFactory'
import { RENDER_TYPES } from './RenderManager'

export class SceneManager {
    
    private _viewer: Viewer
    private _sceneRootNode: SceneNode

    private static __instance: SceneManager

    public static getInstance (viewerInstance: Viewer) {

        // create instance if not yet existing
        if (!this.__instance) {
            this.__instance = new SceneManager(viewerInstance)
        }

        return this.__instance
    }
    
    constructor (viewer: Viewer) {
        this._viewer = viewer
        this._sceneRootNode = new SceneNode()
        
        // add lighting
        this._addAmbientLight(new THREE.Color(0x909090))
        this._addDirectionalLight(new THREE.Vector3(-500, -700, -400), new THREE.Color(0xdddddd), 0.2)
        this._addShadowedLight(new THREE.Vector3(500, 700, 400), new THREE.Color(0xffffff), 0.9)
    }

    /**
     * Get the scene tree root.
     * @returns {SceneNode}
     */
    public getSceneNode (): SceneNode {
        return this._sceneRootNode
    }

    /**
     * Add a mesh node to the scene.
     * By default will be added as child of the scene root.
     * @param {MeshNode} meshNode
     * @param {string} [parentNodeId]
     * @returns {MeshNode}
     */
    public addMesh (meshNode: MeshNode, parentNodeId?: string): MeshNode {
        
        // center mesh around it's geometry
        const offset = meshNode.geometry.center()
        meshNode.position.sub(offset)
        
        // when the mesh node changes, the renderer should be signalled to re-render
        meshNode.onPropertyChanged.connect(this._onMeshNodePropertyChanged.bind(this))
        
        const buildVolume = this._viewer.getBuildVolumeBoundingBox()
        const meshNodePosition = new THREE.Vector3(
            (buildVolume.max.x - buildVolume.min.x) / 2,
            (buildVolume.max.y - buildVolume.min.y) / 2,
            buildVolume.min.z + (meshNode.geometry.boundingBox.max.z - meshNode.geometry.boundingBox.min.z) / 2
        )
        
        meshNode.position.set(meshNodePosition.x, meshNodePosition.y, meshNodePosition.z)
        
        // TODO: place model where available space is in build volume
        
        // add new mesh as child to specified parent node
        if (parentNodeId) {
            const parentNode = this._findNodeById(this._sceneRootNode, parentNodeId)
            if (parentNode) {
                parentNode.addChild(meshNode)
            }
        } else {
            this._sceneRootNode.addChild(meshNode)
        }
        
        this._viewer.onRender.emit({
            type: RENDER_TYPES.MESH,
            source: SceneManager.name
        })
        
        return meshNode
    }

    /**
     * Add a simple cube mesh.
     * @returns {MeshNode}
     */
    public addCube (parentNodeId?: string) {
        const cube = SimpleMeshFactory.createCube()
        return this.addMesh(cube, parentNodeId)
    }

    /**
     * Remove a mesh node from the scene and all other relations.
     * @param {string} nodeId
     */
    public removeMeshNode (nodeId: string) {
        
        // find the meshNode by ID
        let meshNode = this._findNodeById(this._sceneRootNode, nodeId)
        
        // unload the geometry
        meshNode.geometry.dispose()
        
        // remove the actual mesh from the scene
        this._sceneRootNode.getScene().remove(meshNode)
        
        // disconnect the signal
        meshNode.onPropertyChanged.disconnect(this._onMeshNodePropertyChanged)
        
        // make sure the mesh node is not hanging around in memory anymore
        meshNode = undefined
    }

    /**
     * Add a camera to the scene.
     * @param {Camera} camera
     */
    public addCamera (camera: THREE.Camera) {
        // TODO: move to scene node
        this._sceneRootNode.getScene().add(camera)
    }

    /**
     * Add a light source to the scene.
     * @param {Light} light
     */
    public addLight (light: THREE.Light) {
        this._sceneRootNode.getScene().add(light)
    }

    /**
     * Handle property changes from any of the meshNodes in the scene tree.
     * @param propertyChangedData
     * @private
     */
    private _onMeshNodePropertyChanged (propertyChangedData: any) {
        this._viewer.onRender.emit({
            type: RENDER_TYPES.MESH,
            source: `meshNode_${propertyChangedData.nodeId}`
        })
    }

    /**
     * Find a node by ID recursively
     * @param {Node} parentNode
     * @param {string} nodeId
     * @returns {Node}
     * @private
     */
    private _findNodeById (parentNode: THREE.Object3D, nodeId: string): MeshNode | null {
        let nodeToFind = null
        
        parentNode.traverse(child => {
            if (child.uuid === nodeId) {
                nodeToFind = child
            }
        })
        
        return nodeToFind
    }

    /**
     * Add a spotlight with shadow casting to the scene.
     * @param {Vector3} position
     * @param {Color} color
     * @param intensity
     * @private
     */
    private _addShadowedLight (position: THREE.Vector3, color: THREE.Color, intensity): void {
        const spotLight = new THREE.SpotLight(color, intensity)
        spotLight.position.set(position.x, position.y, position.z)
        spotLight.castShadow = true
        spotLight.shadow.bias = 0.00001
        spotLight.shadow.mapSize.width = 2048
        spotLight.shadow.mapSize.height = 2048
        this.addLight(spotLight)
    }

    /**
     * Add a directional light source to the scene.
     * @param {Vector3} position
     * @param {Color} color
     * @param intensity
     * @private
     */
    private _addDirectionalLight (position: THREE.Vector3, color: THREE.Color, intensity): void {
        const directionalLight = new THREE.DirectionalLight(color, intensity)
        directionalLight.position.set(position.x, position.y, position.z)
        directionalLight.castShadow = false
        this.addLight(directionalLight)
    }

    /**
     * Add an ambient light source to the scene.
     * @param {Color} color
     * @private
     */
    private _addAmbientLight (color: THREE.Color): void {
        const ambientLight = new THREE.AmbientLight(color)
        this.addLight(ambientLight)
    }
}
