'use strict'

import * as _ from 'underscore'
import * as THREE from 'three'
import { Viewer } from '../Viewer'

export const RENDER_EVENTS_LIMIT = 10

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
    type: RENDER_TYPES
    force?: boolean
}

export class RenderManager {
    
    private _viewer: Viewer
    private _canvas: HTMLCanvasElement
    private _renderer: THREE.WebGLRenderer
    private _renderEvents: RenderOptions[] = []

    private static __instance: RenderManager

    public static getInstance (viewer: Viewer) {

        // create instance if not yet existing
        if (!this.__instance) {
            this.__instance = new RenderManager(viewer)
        }

        return this.__instance
    }

    public constructor (viewer: Viewer) {
        this._viewer = viewer
        this._canvas = viewer.getCanvas()
        
        // create WebGL renderer
        this._renderer = new THREE.WebGLRenderer({
            canvas: this._canvas,
            antialias: true,
            alpha: true,
            preserveDrawingBuffer: true
        })
        
        // set other rendering options that are not available in constructor
        this._renderer.shadowMapEnabled = true
        this._renderer.shadowMapType = THREE.PCFSoftShadowMap
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
            type: RENDER_TYPES.SCENE,
            force: false
        })
    }
    
    private _render (renderOptions?: RenderOptions): void {

        // add options to list
        this._renderEvents.push(renderOptions)
        
        // clear the scene
        this._renderer.clear()
        
        // render when forced
        if (renderOptions.force) {
            this._renderNodes()
        }
        
        // render when event limit is reached
        else if (this._renderEvents.length >= RENDER_EVENTS_LIMIT) {
            
            // get a list of unique render types
            const uniqueRenderTypes = _(this._renderEvents).chain().flatten().pluck('type').unique().value()
            
            // render all nodes when needed
            if (_.intersection(uniqueRenderTypes, [
                RENDER_TYPES.CANVAS,
                RENDER_TYPES.MESH,
                RENDER_TYPES.SCENE,
                RENDER_TYPES.TRANSFORMATION
            ])) {
                this._renderNodes(uniqueRenderTypes)
            }
            
            // clear render events list
            this._clearRenderEvents()
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
    
    private _clearRenderEvents () {
        this._renderEvents = []
    }
}
