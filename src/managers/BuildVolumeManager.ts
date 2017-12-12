'use strict'

import { Viewer } from '../Viewer'
import { BuildVolume } from '../nodes/BuildVolume'
import { CartesianBuildVolume } from '../nodes/CartesianBuildVolume'
import { BuildPlate } from '../nodes/BuildPlate'
import { CartesianBuildPlate } from '../nodes/CartesianBuildPlate'

/**
 * The build volume manager handles everything related to the 3D printer build volume.
 * It shows the print bed, volume outline and simulated print head.
 */
export class BuildVolumeManager {

    private _width: number
    private _depth: number
    private _height: number
    
    private _viewer: Viewer
    private _buildVolume: BuildVolume
    private _buildPlate: BuildPlate

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
        
        // set size (hardcoded for now)
        this._width = 200
        this._depth = 200
        this._height = 200
        
        // create the virtual volume and build plate mesh
        this._createBuildVolume()
        this._createBuildPlate()
        this._showDisallowedAreas()
    }
    
    public getBuildVolume () {
        return this._buildVolume
    }
    
    public getBuildPlate () {
        return this._buildPlate
    }
    
    private _createBuildVolume () {
        this._buildVolume = new CartesianBuildVolume(this._width, this._depth, this._height)
        this._viewer.getSceneNode().addChild(this._buildVolume)
    }
    
    private _createBuildPlate () {
        this._buildPlate = new CartesianBuildPlate(this._width, this._depth)
        this._viewer.getSceneNode().addChild(this._buildPlate)
    }
    
    private _showDisallowedAreas () {
        // TODO
    }
}
