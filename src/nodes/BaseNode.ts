'use strict'

import { Node, NODE_TYPES } from './NodeInterface'
import { RenderOptions } from '../managers/RenderManager'

export class BaseNode implements Node {
    
    protected _nodeType: NODE_TYPES = NODE_TYPES.NONE
    protected _children: Node[] = []
    
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
        this._render()
        
        // render children if existing
        for (let child of this._children) {
            child.render()
        }
    }
    
    protected _render () {
        console.warn('The _render method needs to be implemented per node type.')
    }
}
