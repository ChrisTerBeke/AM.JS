'use strict'

import { Node, NODE_TYPES } from './NodeInterface'
import { RenderOptions } from '../managers/RenderManager'
import { Signal } from '../utils/Signal'

export class BaseNode implements Node {
    
    protected _nodeType: NODE_TYPES = NODE_TYPES.NONE
    protected _children: Node[] = []
    
    // event fired when property changes
    public onPropertyChanged: Signal<any> = new Signal()
    
    public getId (): string {
        return 'none'
    }
    
    public getType (): NODE_TYPES {
        return this._nodeType
    }
    
    public getChildren (): Node[] {
        return this._children
    }
    
    public addChild (childNode: Node) {
        this._children.push(childNode)
    }
    
    public render (renderOptions?: RenderOptions) {

        // render self
        this._render(renderOptions)
        
        // render children if existing
        for (let child of this._children) {
            child.render(renderOptions)
        }
    }
    
    protected _render (renderOptions?: RenderOptions) {
        // nothing here, should be implemented per node type
    }
}
