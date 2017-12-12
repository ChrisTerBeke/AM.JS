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
        
        // setup the raycaster helper
        this._raycaster = new THREE.Raycaster()
        
        // add lighting
        this._addAmbientLight(new THREE.Color(0x909090))
        this._addDirectionalLight(new THREE.Vector3(-500, -700, -400), new THREE.Color(0xdddddd), 0.2)
        this._addShadowedLight(new THREE.Vector3(500, 700, 400), new THREE.Color(0xffffff), 0.9)

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
            type: RENDER_TYPES.MESH,
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
     * Remove a mesh node from the scene and all other relations.
     * @param {string} nodeId
     */
    public removeMeshNode (nodeId: string) {
        
        // find the meshNode by ID
        let meshNode = this._findNodeById(this._sceneRootNode, nodeId)
        
        // unload the geometry
        meshNode.geometry.dispose()
        
        // remove the actual mesh from the scene
        this._sceneRootNode.getScene().remove(meshNode)
        
        // disconnect the signal
        meshNode.onPropertyChanged.disconnect(this._onMeshNodePropertyChanged)
        
        // make sure the mesh node is not hanging around in memory anymore
        meshNode = undefined
    }

    /**
     * Add a camera to the scene.
     * @param {Camera} camera
     */
    public addCamera (camera: THREE.Camera) {
        // TODO: move to scene node
        this._sceneRootNode.getScene().add(camera)
    }

    /**
     * Add a light source to the scene.
     * @param {Light} light
     */
    public addLight (light: THREE.Light) {
        this._sceneRootNode.getScene().add(light)
    }

    /**
     * Handle property changes from any of the meshNodes in the scene tree.
     * @param propertyChangedData
     * @private
     */
    private _onMeshNodePropertyChanged (propertyChangedData: any) {
        this._viewer.onRender.emit({
            type: RENDER_TYPES.MESH,
            source: `meshNode_${propertyChangedData.nodeId}`
        })
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
     * Add a spotlight with shadow casting to the scene.
     * @param {Vector3} position
     * @param {Color} color
     * @param intensity
     * @private
     */
    private _addShadowedLight (position: THREE.Vector3, color: THREE.Color, intensity): void {
        const spotLight = new THREE.SpotLight(color, intensity)
        spotLight.position.set(position.x, position.y, position.z)
        spotLight.castShadow = true
        spotLight.shadow.bias = 0.00001
        spotLight.shadow.mapSize.width = 2048
        spotLight.shadow.mapSize.height = 2048
        this.addLight(spotLight)
    }

    /**
     * Add a directional light source to the scene.
     * @param {Vector3} position
     * @param {Color} color
     * @param intensity
     * @private
     */
    private _addDirectionalLight (position: THREE.Vector3, color: THREE.Color, intensity): void {
        const directionalLight = new THREE.DirectionalLight(color, intensity)
        directionalLight.position.set(position.x, position.y, position.z)
        directionalLight.castShadow = false
        this.addLight(directionalLight)
    }

    /**
     * Add an ambient light source to the scene.
     * @param {Color} color
     * @private
     */
    private _addAmbientLight (color: THREE.Color): void {
        const ambientLight = new THREE.AmbientLight(color)
        this.addLight(ambientLight)
    }

    /**
     * Start listening to mouse events for object selection.
     * @private
     */
    private _addEventListeners () {
        this._canvas.addEventListener('mousedown', this._onMouseDown.bind(this), false)
        this._canvas.addEventListener('mouseup', this._onMouseUp.bind(this), false)
    }

    /**
     * Update the transform controls when needed.
     * This is executed after a camera change.
     * @private
     */
    private _updateTransformControls () {
        
        this._controls = new THREE.TransformControls(this._camera, this._canvas)

        // disable the camera controls while transforming
        this._controls.addEventListener('mouseDown', event => {
            this._viewer.transformStarted.emit()
        })
        
        // enable the camera controls when done transforming
        this._controls.addEventListener('mouseUp', event => {
            this._viewer.transformEnded.emit()
        })
        
        // re-render when transforming an object
        this._controls.addEventListener('change', event => {
            this._viewer.onRender.emit({
                source: SceneManager.name,
                type: RENDER_TYPES.TRANSFORMATION
            })
        })
        
        // update the controls when rendering (scaling)
        this._viewer.onRender.connect(renderOptions => {
            this._controls.update()
        })
        
        // add the controls to the scene so they can be interacted with
        this._sceneRootNode.add(this._controls)
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
            type: RENDER_TYPES.SCENE
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
    
    private _setTransformControlsForNode (node?) {
        
        // if node is not given, detach the controls from everything
        if (!node) {
            this._controls.detach()
            return
        }
        
        // prevent attaching controls to non-mesh node
        if (node.type !== NODE_TYPES.MESH) {
            return
        }

        // TODO: set mode dynamically
        this._controls.setMode('translate')
        
        // attach the controls to the target node
        this._controls.attach(node)
    }
}
