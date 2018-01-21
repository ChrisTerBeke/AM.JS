'use strict'

import { Viewer } from '../Viewer'
import { BuildVolume } from '../nodes/BuildVolume'
import { CartesianBuildVolume } from '../nodes/CartesianBuildVolume'
import { BuildPlate } from '../nodes/BuildPlate'
import { CartesianBuildPlate } from '../nodes/CartesianBuildPlate'
import { RENDER_TYPES } from './RenderManager'

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
        this.setBuildVolumeSize(200, 200, 200)
        
        // create the virtual volume and build plate mesh
        this._createBuildVolume()
        this._createBuildPlate()
        this._showDisallowedAreas()
    }
    
    public getBuildVolume (): BuildVolume {
        return this._buildVolume
    }
    
    public getBuildPlate (): BuildPlate {
        return this._buildPlate
    }
    
    public setBuildVolumeSize (width: number, depth: number, height: number): void {
        this._width = width
        this._depth = depth
        this._height = height
        
        // adjust the build volume if needed
        if (this._buildVolume) {
            this._buildVolume.setSize(width, depth, height)
            this._viewer.buildVolumeChanged.emit(this._buildVolume.getBoundingBox())
        }
        
        // adjust the build plate if needed
        if (this._buildPlate) {
            this._buildPlate.setSize(width, depth)
        }
        
        this._viewer.onRender.emit({
            source: BuildVolumeManager.name,
            type: RENDER_TYPES.SCENE
        })
    }
    
    private _createBuildVolume (): void {
        this._buildVolume = new CartesianBuildVolume(this._width, this._depth, this._height)
        this._viewer.getSceneNode().addChild(this._buildVolume)
    }
    
    private _createBuildPlate (): void {
        this._buildPlate = new CartesianBuildPlate(this._width, this._depth)
        this._viewer.getSceneNode().addChild(this._buildPlate)
    }
    
    private _showDisallowedAreas () {
        // TODO
    }
}
