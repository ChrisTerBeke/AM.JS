'use strict'

import { Viewer } from '../Viewer'

/**
 * The build volume manager handles everything related to the 3D printer build volume.
 * It shows the print bed, volume outline and simulated print head.
 */
export class BuildVolumeManager {

    private _viewer: Viewer

    private static __instance: BuildVolumeManager

    public static getInstance (viewer: Viewer) {

        // create instance if not yet existing
        if (!this.__instance) {
            this.__instance = new BuildVolumeManager(viewer)
        }

        return this.__instance
    }

    public constructor (viewer: Viewer) {
        this._viewer = viewer
    }
    
    
}
