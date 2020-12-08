import {
    BufferGeometry,
    Box3,
    Geometry,
    Mesh,
} from 'three'
import INode, { NODE_TYPES } from './NodeInterface'

class BaseNode extends Mesh implements INode {

    // override for typing
    public geometry: Geometry | BufferGeometry

    // the type of node, can be used to hide/show certain types
    private _type: NODE_TYPES

    // determines if re-rendering is needed or not
    private _isDirty: boolean = true

    constructor(
        type: NODE_TYPES = NODE_TYPES.NONE,
        geometry: Geometry | BufferGeometry = new BufferGeometry(),
    ) {
        super(geometry)
        this.geometry.computeBoundingBox()
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

    public getBoundingBox(): Box3 {
        this.geometry.computeBoundingBox()
        return new Box3(
            this.geometry.boundingBox.min.multiply(this.scale).add(this.position),
            this.geometry.boundingBox.max.multiply(this.scale).add(this.position),
        )
    }
}

export default BaseNode
