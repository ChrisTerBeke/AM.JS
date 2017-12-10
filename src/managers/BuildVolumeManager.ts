'use strict'

import { Viewer } from '../Viewer'
import { BuildVolume } from '../nodes/BuildVolume'
import { CartesianBuildVolume } from '../nodes/CartesianBuildVolume'

/**
 * The build volume manager handles everything related to the 3D printer build volume.
 * It shows the print bed, volume outline and simulated print head.
 */
export class BuildVolumeManager {

    private _viewer: Viewer
    private _buildVolume: BuildVolume

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
        this._buildVolume = new CartesianBuildVolume(200, 200, 200)
        this._viewer.getSceneNode().addChild(this._buildVolume)
    }
    
    public getBuildVolume () {
        return this._buildVolume
    }
}
