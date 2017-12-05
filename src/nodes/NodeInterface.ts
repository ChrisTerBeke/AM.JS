'use strict'

import { RenderOptions } from '../managers/RenderManager'

/**
 * Enum of allowed node types.
 */
export enum NODE_TYPES {
    NONE = 'none',
    SCENE = 'scene',
    MESH = 'mesh',
    GROUP = 'group'
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
    getType(): NODE_TYPES

    /**
     * Get child nodes.
     * @returns {Node[]}
     */
    getChildren(): Node[]

    /**
     * Add a child node.
     * @param {Node} childNode
     */
    addChild(childNode: Node)

    /**
     * Re-render this node
     */
    render(renderOptions?: RenderOptions): void
}
