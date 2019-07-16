// import { RenderOptions } from '../managers/RenderManager'

/**
 * Enum of allowed node types.
 */
export enum NODE_TYPES {
    NONE = 'none',
    ROOT = 'root',
    MESH = 'mesh',
    GROUP = 'group',
    BUILD_VOLUME = 'buildVolume',
    BUILD_PLATE = 'buildPlate'
}

/**
 * Shared interface for all node types.
 */
interface Node extends THREE.Object3D {

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
     * Get the parent node.
     * @returns {Node}
     */
    getParent(): Node | null

    /**
     * Get child nodes.
     * @returns {Node[]}
     */
    getChildren(): Node[]

        /**
     * Add a child node.
     * @param {Node} childNode
     */
    addChild(node: Node): void

    /**
     * Remove a child node.
     * @param {Node} childNode
     */
    removeChild(node: Node): void

    /**
     * Render this node.
     */
    render(): void
}

export default Node
