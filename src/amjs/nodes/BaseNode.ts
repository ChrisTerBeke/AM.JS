import * as THREE from 'three'
import INode, { NODE_TYPES } from './NodeInterface'

class BaseNode extends THREE.Mesh implements INode {

    // override for typing
    public geometry: THREE.Geometry | THREE.BufferGeometry

    // the type of node, can be used to hide/show certain types
    private _type: NODE_TYPES

    // determines if re-rendering is needed or not
    private _isDirty: boolean = true

    constructor(
        type: NODE_TYPES = NODE_TYPES.NONE,
        geometry: THREE.Geometry | THREE.BufferGeometry = new THREE.BufferGeometry(),
    ) {
        super(geometry)
        this._type = type
    }

    public getId(): string {
        return this.uuid
    }

    public getType(): NODE_TYPES {
        return this._type
    }

    public getParent(): INode {
        throw new Error('Method not implemented.')
    }

    public getChildren(): INode[] {
        throw new Error('Method not implemented.')
    }

    public addChild(node: INode): void {
        throw new Error('Method not implemented.')
    }

    public removeChild(node: INode): void {
        throw new Error('Method not implemented.')
    }

    public render(): void {
        throw new Error('Method not implemented.')
    }
}

export default BaseNode
