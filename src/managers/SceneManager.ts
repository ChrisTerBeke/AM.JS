'use strict'

import * as THREE from 'three'
import { Viewer } from '../Viewer'
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
     * @param {MeshNode} [parentNode]
     */
    public addMesh (meshNode: MeshNode, parentNode?: MeshNode) {
        // TODO: create helper function or even automatically
        const offset = meshNode.getMesh().geometry.center()
        meshNode.getMesh().position.sub(offset)
        
        // TODO: offset depending on build volume type
        // TODO: place model where available space is in build volume
        // TODO: fire meshes + geometry changed events
        
        // add new mesh as child of scene root
        // TODO: add to different parent node if requested, must be existing node in tree by ID
        this._sceneRootNode.addChild(meshNode)
        
        // make sure the new object gets rendered
        this._viewer.onRender.emit({
            force: true,
            type: RENDER_TYPES.MESH,
            source: SceneManager.name
        })
    }
    
    public addCube () {
        const cube = SimpleMeshFactory.createCube()
        this.addMesh(cube)
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
        // TODO: move to scene node
        this._sceneRootNode.getScene().add(light)
    }
}
