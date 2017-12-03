'use strict'

import * as THREE from 'three'
import { Viewer } from '../Viewer'

export class AnimationManager {
    
    private _viewer: Viewer

    private static __instance: AnimationManager

    public static getInstance (viewer: Viewer) {

        // create instance if not yet existing
        if (!this.__instance) {
            this.__instance = new AnimationManager(viewer)
        }

        return this.__instance
    }
    
    constructor (viewer: Viewer) {
        this._viewer = viewer
        // requestAnimationFrame(this._animate)
    }
    
    public _animate () {
        // TODO
    }
}
