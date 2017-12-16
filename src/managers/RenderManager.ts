'use strict'

import * as THREE from 'three'
import { Viewer } from '../Viewer'

/**
 * Render types allow the render manager to only render parts of the scene that were actually updated.
 */
export enum RENDER_TYPES {
    SCENE = 'scene',
    CAMERA = 'camera',
    MESH = 'mesh',
    TRANSFORMATION = 'transformation',
    CANVAS = 'canvas'
}

/**
 * Render options are passed to the render manager via the onRender event.
 * Each render event contains at least these options so the render manager can be smart about what to render.
 */
export interface RenderOptions {
    source: string
    type: string
    force?: boolean
}

export class RenderManager {
    
    private _viewer: Viewer
    private _canvas: HTMLCanvasElement
    private _renderer: THREE.WebGLRenderer

    private static __instance: RenderManager

    public static getInstance (viewer: Viewer) {

        // create instance if not yet existing
        if (!this.__instance) {
            this.__instance = new RenderManager(viewer)
        }

        return this.__instance
    }

    public constructor (viewer: Viewer) {
        
        // find the canvas element to render on
        this._viewer = viewer
        this._canvas = viewer.getCanvas()
        
        // create WebGL renderer
        this._renderer = new THREE.WebGLRenderer({
            canvas: this._canvas,
            // antialias: true,
            alpha: true,
            // preserveDrawingBuffer: true
        })
        
        // set other rendering options that are not available in constructor
        this._renderer.shadowMap.enabled = true
        this._renderer.shadowMap.type = THREE.PCFSoftShadowMap
        this._renderer.setPixelRatio(window.devicePixelRatio ? window.devicePixelRatio : 1)
        this._renderer.setSize(this._canvas.offsetWidth, this._canvas.offsetHeight)
        this._renderer.setClearColor(0xffffff)
        
        // execute render cycle when render event is emitted
        this._viewer.onRender.connect(this._render.bind(this))
    }

    /**
     * Manually trigger a render event
     */
    public render (): void {
        this._render({
            source: RenderManager.name,
            type: `${RENDER_TYPES.SCENE}`,
            force: false
        })
    }
    
    private _render (renderOptions?: RenderOptions): void {
        
        // these render types should trigger a re-render of scene nodes
        const NODE_RENDER_TYPES = [
            `${RENDER_TYPES.CANVAS}`,
            `${RENDER_TYPES.MESH}`,
            `${RENDER_TYPES.SCENE}`,
            `${RENDER_TYPES.TRANSFORMATION}`
        ]
        
        // render all nodes when needed
        if (renderOptions.force || NODE_RENDER_TYPES.indexOf(renderOptions.type) > -1) {
            this._renderNodes(renderOptions)
        }
        
        // target THREE.Scene with THREE.Camera
        this._renderer.render(this._viewer.getSceneNode().getScene(), this._viewer.getCameraManager().getCamera())
    }
    
    private _renderNodes (renderOptions?: RenderOptions): void {
        
        // get the scene node tree from viewer
        const sceneRootNode = this._viewer.getSceneNode()

        // render the scene root and all children recursively
        sceneRootNode.render(renderOptions)
    }
}
