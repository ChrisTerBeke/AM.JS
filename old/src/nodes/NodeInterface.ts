'use strict'

import * as THREE from 'three'
import { RenderOptions } from '../managers/RenderManager'

/**
 * Enum of allowed node types.
 */
export enum NODE_TYPES {
    NONE = 'none',
    SCENE = 'scene',
    MESH = 'mesh',
    GROUP = 'group',
    BUILD_VOLUME = 'buildVolume',
    BUILD_PLATE = 'buildPlate'
}

/**
 * Shared interface for all node types.
 */
export interface Node {

    /**
     * Get the unique ID of a node.
     * @returns {string}
     */
    getId(): string

    /**
     * Get the node type.
     * @returns {NODE_TYPES}
     */
    getType(): string

    /**
     * Get the parent node.
     * @returns {Node}
     */
    getParent(): THREE.Object3D | null

    /**
     * Get child nodes.
     * @returns {Node[]}
     */
    getChildren(): THREE.Object3D[]

        /**
     * Add a child node.
     * @param {Node} childNode
     */
    addChild(childNode: THREE.Object3D): void

    /**
     * Remove a child node.
     * @param {Node} childNode
     */
    removeChild(childNode: THREE.Object3D): void

    /**
     * Re-render this node
     */
    render(renderOptions?: RenderOptions): void
}
