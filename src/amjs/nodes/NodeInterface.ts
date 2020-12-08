import {
    Object3D,
} from 'three'

/**
 * Enum of allowed node types.
 */
export enum NODE_TYPES {
    NONE = 'none',
    ROOT = 'root',
    MESH = 'mesh',
    GROUP = 'group',
    BUILD_VOLUME = 'buildVolume',
    BUILD_PLATE = 'buildPlate',
}

/**
 * Shared interface for all node types.
 */
interface INode extends Object3D {

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
     * @returns {INode}
     */
    getParent(): INode | null

    /**
     * Get child nodes.
     * @returns {INode[]}
     */
    getChildren(): INode[]

    /**
     * Add a child node.
     * @param {INode} childNode
     */
    addChild(node: INode): void

    /**
     * Remove a child node.
     * @param {INode} childNode
     */
    removeChild(node: INode): void

    /**
     * Render this node.
     */
    render(): void
}

export default INode
