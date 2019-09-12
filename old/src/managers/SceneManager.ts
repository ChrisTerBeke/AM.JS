'use strict'

import * as THREE from 'three'
window['THREE'] = THREE
import 'three/examples/js/controls/TransformControls.js'

import { Viewer } from '../Viewer'
import { Node, NODE_TYPES } from '../nodes/NodeInterface'
import { SceneNode } from '../nodes/SceneNode'
import { MeshNode } from '../nodes/MeshNode'
import { SimpleMeshFactory } from '../nodes/SimpleMeshFactory'
import { RENDER_TYPES } from './RenderManager'

export class SceneManager {
    
    private _viewer: Viewer
    private _canvas: HTMLCanvasElement
    private _camera: THREE.Camera
    
    private _sceneRootNode: SceneNode
    private _controls: THREE.TransformControls
    private _selectedNode: Node
    private _raycaster: THREE.Raycaster
    
    // stores the mouse up and down positions so we know if it was a click or a drag
    private _mouseDownPosition: THREE.Vector2
    private _mouseUpPosition: THREE.Vector2

    private static __instance: SceneManager

    public static getInstance (viewerInstance: Viewer) {

        // create instance if not yet existing
        if (!this.__instance) {
            this.__instance = new SceneManager(viewerInstance)
        }

        return this.__instance
    }
    
    constructor (viewer: Viewer) {
        this._viewer = viewer
        this._canvas = this._viewer.getCanvas()
        
        // create the root scene node
        this._sceneRootNode = new SceneNode()
        this._sceneRootNode.nodeAdded.connect(this._onSceneChanged.bind(this))
        this._sceneRootNode.nodeRemoved.connect(this._onSceneChanged.bind(this))
        
        // setup the raycaster helper
        this._raycaster = new THREE.Raycaster()

        // initialize the transform controls on the camera object
        viewer.cameraCreated.connect(camera => {
            this._camera = camera
            this._updateTransformControls()
        })
        
        // start listening for mouse events
        this._addEventListeners()
    }

    /**
     * Get the scene tree root.
     * @returns {SceneNode}
     */
    public getSceneNode (): SceneNode {
        return this._sceneRootNode
    }

    /**
     * Add a mesh node to the scene.
     * By default will be added as child of the scene root.
     * @param {MeshNode} meshNode
     * @param {string} [parentNodeId]
     * @returns {MeshNode}
     */
    public addMesh (meshNode: MeshNode, parentNodeId?: string): MeshNode {
        
        // center mesh around it's geometry
        const offset = meshNode.geometry.center()
        meshNode.position.sub(offset)
        
        // when the mesh node changes, the renderer should be signalled to re-render
        meshNode.onPropertyChanged.connect(this._onMeshNodePropertyChanged.bind(this))
        
        const buildVolume = this._viewer.getBuildVolumeBoundingBox()
        const meshNodePosition = new THREE.Vector3(
            (buildVolume.max.x - buildVolume.min.x) / 2,
            (buildVolume.max.y - buildVolume.min.y) / 2,
            buildVolume.min.z + (meshNode.geometry.boundingBox.max.z - meshNode.geometry.boundingBox.min.z) / 2
        )
        
        meshNode.position.set(meshNodePosition.x, meshNodePosition.y, meshNodePosition.z)
        
        // TODO: place model where available space is in build volume
        
        // add new mesh as child to specified parent node
        if (parentNodeId) {
            const parentNode = this._findNodeById(this._sceneRootNode, parentNodeId)
            if (parentNode) {
                parentNode.addChild(meshNode)
            }
        } else {
            this._sceneRootNode.addChild(meshNode)
        }
        
        this._viewer.onRender.emit({
            type: `${RENDER_TYPES.MESH}`,
            source: SceneManager.name
        })
        
        return meshNode
    }

    /**
     * Add a simple cube mesh.
     * @returns {MeshNode}
     */
    public addCube (parentNodeId?: string) {
        const cube = SimpleMeshFactory.createCube()
        return this.addMesh(cube, parentNodeId)
    }

    /**
     * Add a simple cylinder mesh.
     * @param {string} parentNodeId
     * @returns {MeshNode}
     */
    public addCylinder (parentNodeId?: string) {
        const cylinder = SimpleMeshFactory.createCylinder()
        return this.addMesh(cylinder, parentNodeId)
    }

    /**
     * Remove a mesh node from the scene and all other relations.
     * @param {string} nodeId
     */
    public removeMeshNode (nodeId: string) {
        
        // find the meshNode by ID
        let meshNode = this._findNodeById(this._sceneRootNode, nodeId)

        // disconnect the signal
        meshNode.onPropertyChanged.disconnect(this._onMeshNodePropertyChanged)
        
        // unload the geometry
        meshNode.geometry.dispose()

        // remove the actual mesh from the scene
        this._sceneRootNode.getScene().remove(meshNode)
    }

    /**
     * Set the snapping distance for transformations.
     * @param {number} distance
     */
    public setControlSnapDistance (distance: number) {
        this._controls.setSnap(distance)
    }

    /**
     * Find a node by ID recursively
     * @param {Node} parentNode
     * @param {string} nodeId
     * @returns {Node}
     * @private
     */
    private _findNodeById (parentNode: THREE.Object3D, nodeId: string): MeshNode | null {
        let nodeToFind = null
        
        parentNode.traverse(child => {
            if (child.uuid === nodeId) {
                return nodeToFind = child
            }
        })
        
        return nodeToFind
    }

    /**
     * Start listening to mouse events for object selection.
     * @private
     */
    private _addEventListeners () {
        this._canvas.addEventListener('mousedown', this._onMouseDown.bind(this), false)
        this._canvas.addEventListener('mouseup', this._onMouseUp.bind(this), false)
    }
    
    private _onMouseDown (event: MouseEvent) {
        
        event.preventDefault()
        
        // get the mouse position in scene
        const mousePosition = this._getMousePosition(event.clientX, event.clientY)
        this._mouseDownPosition = new THREE.Vector2().fromArray(mousePosition)
    }
    
    private _onMouseUp (event: MouseEvent) {

        event.preventDefault()
        
        // get the mouse position in scene
        const mousePosition = this._getMousePosition(event.clientX, event.clientY)
        this._mouseUpPosition = new THREE.Vector2().fromArray(mousePosition)

        // ignore if it was a drag, not a click
        if (this._mouseDownPosition.distanceTo(this._mouseUpPosition) > 0) {
            return
        }

        this._handleMouseClick()
    }
    
    private _getMousePosition (x, y) {
        const canvasBounds = this._canvas.getBoundingClientRect()
        return [
            (x - canvasBounds.left) / canvasBounds.width,
            (y - canvasBounds.top) / canvasBounds.height
        ]
    }

    /**
     * Handle a potential mouse click.
     * This method detects any ray cast intersects and selected the targeted scene node.
     * @private
     */
    private _handleMouseClick () {
        
        // detach the transform controls from their current object binding
        this._controls.detach()

        // get all intersects between the mouse position and the scene node tree
        const intersects = this._intersectsNode(this._mouseUpPosition, this._sceneRootNode)
        
        let selectedNode = null
        
        // find the first intersection that intersects with an object of type mesh
        intersects.forEach((intersection: THREE.Intersection) => {
            
            // ignore non-mesh nodes or when something was already selected
            if (selectedNode || intersection.object.type !== NODE_TYPES.MESH) {
                return
            }
            
            // TODO: use flag for disabling transformations

            selectedNode = intersection.object
        })
        
        // properly set selected flag on all objects
        this._sceneRootNode.traverse(object => {
            
            // ignore non-mesh nodes
            if (object.type !== NODE_TYPES.MESH) {
                return
            }

            let node = object as MeshNode
            
            // check and set if the node is the selected node or not
            if (selectedNode && node.getId() == selectedNode.getId()) {
                node.setSelected(true)
                this._viewer.nodeSelected.emit(node)
                this._selectedNode = node
                this._setTransformControlsForNode(node)
            } else {
                node.setSelected(false)
                this._viewer.nodeDeselected.emit(node)
            }
        })
        
        // detach the transform controls when no node was selected
        if (!selectedNode) {
            this._setTransformControlsForNode()
        }
        
        // render so selected model can be highlighted
        this._viewer.onRender.emit({
            source: SceneManager.name,
            type: `${RENDER_TYPES.SCENE}`
        })
    }

    /**
     * Check if a given mouse click point intersects with a scene node.
     * @param {Vector3} point
     * @param {Object3D} node
     * @returns {Intersection[]}
     * @private
     */
    private _intersectsNode (point: THREE.Vector2, node: THREE.Object3D): THREE.Intersection[] {
        
        // create a line from the cursor position through the camera
        const intersectionLine = new THREE.Vector3(
            (point.x * 2) - 1,
            - (point.y * 2) + 1,
            0.5
        )
        intersectionLine.unproject(this._camera)
        
        // set the raycaster to use the intersection line
        this._raycaster.set(this._camera.position, intersectionLine.sub(this._camera.position).normalize())
        
        // check if the given node is intersected by that line
        return this._raycaster.intersectObject(node, true)
    }
}
