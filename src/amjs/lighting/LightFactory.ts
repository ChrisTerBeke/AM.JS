import * as THREE from 'three'

/**
 * Factory class that creates lights with good default settings.
 */
class LightFactory {

    public static createAmbientLight(): THREE.AmbientLight {
        const color = new THREE.Color(0x909090)
        const ambientLight = new THREE.AmbientLight(color)
        return ambientLight
    }

    public static createDirectionalLight(): THREE.DirectionalLight {
        const color = new THREE.Color(0xdddddd)
        const position = new THREE.Vector3(-500, -700, -400)
        const directionalLight = new THREE.DirectionalLight(color, 0.2)
        directionalLight.position.set(position.x, position.y, position.z)
        directionalLight.castShadow = false
        return directionalLight
    }

    public static createShadowedLight(): THREE.SpotLight {
        const color = new THREE.Color(0xffffff)
        const position = new THREE.Vector3(500, 700, 400)
        const spotLight = new THREE.SpotLight(color, 0.9)
        spotLight.position.set(position.x, position.y, position.z)
        spotLight.castShadow = true
        spotLight.shadow.bias = 0.00001
        spotLight.shadow.mapSize.width = 2048
        spotLight.shadow.mapSize.height = 2048
        return spotLight
    }
}

export default LightFactory
