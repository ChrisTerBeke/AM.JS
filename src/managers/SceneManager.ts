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
        
        // TODO: create helper function or even automatically
        const offset = meshNode.getMesh().geometry.center()
        meshNode.getMesh().position.sub(offset)
        
        // when the mesh node changes, the renderer should be signalled to re-render
        meshNode.onPropertyChanged.connect(this._onMeshNodePropertyChanged.bind(this))
        
        // TODO: offset depending on build volume type
        // TODO: place model where available space is in build volume
        // TODO: fire meshes + geometry changed events?
        
        // add new mesh as child to specified parent node
        if (parentNodeId) {
            const parentNode = this._findNodeById(this._sceneRootNode, parentNodeId)
            if (parentNode) {
                parentNode.addChild(meshNode)
            }
        } else {
            this._sceneRootNode.addChild(meshNode)
        }
        
        // make sure the new object gets rendered
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
    private _findNodeById (parentNode: Node, nodeId: string): Node | null {
        let nodeToFind = null
        
        // loop over all children and children's children to find the node
        for (let child of parentNode.getChildren()) {
            if (child.getId() === nodeId) {
                nodeToFind = child
            } else {
                nodeToFind = this._findNodeById(child, nodeId)
            }
        }
        
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
