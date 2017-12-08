'use strict'

import * as THREE from 'three'
import { Viewer } from '../Viewer'

/**
 * The build volume manager handles everything related to the 3D printer build volume.
 * It shows the print bed, volume outline and simulated print head.
 */
export class BuildVolumeManager {

    private _viewer: Viewer
    private _buildVolume: THREE.Mesh

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
        this._createCartesianBuildVolume(200, 200, 200)
    }
    
    public getBuildVolumeBoundingBox () {
        this._buildVolume.geometry.computeBoundingBox()
        return this._buildVolume.geometry.boundingBox
    }
    
    private _createCartesianBuildVolume (width, depth, height) {
        const buildVolumeGeometry = new THREE.BoxGeometry(width, depth, height)
        const buildVolumeFaceMaterials = new THREE.MeshBasicMaterial({
            color: 0x46b1e6,
            transparent: true,
            opacity: 0.2,
            side: THREE.BackSide
        })
        const buildVolume = new THREE.Mesh(buildVolumeGeometry, buildVolumeFaceMaterials)
        buildVolume.geometry.computeBoundingBox()
        buildVolumeGeometry.translate(width / 2, depth / 2, height / 2)
        this._buildVolume = buildVolume
        this._viewer.getSceneNode().addChild(this._buildVolume)
    }
}
