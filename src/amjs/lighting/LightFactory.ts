import {
    AmbientLight,
    Color,
    DirectionalLight,
    SpotLight,
    Vector3,
} from 'three'

/**
 * Factory class that creates lights with good default settings.
 */
class LightFactory {

    public static createAmbientLight(): AmbientLight {
        const color = new Color(0x909090)
        const ambientLight = new AmbientLight(color)
        return ambientLight
    }

    public static createDirectionalLight(): DirectionalLight {
        const color = new Color(0xdddddd)
        const position = new Vector3(-500, -700, -400)
        const directionalLight = new DirectionalLight(color, 0.2)
        directionalLight.position.set(position.x, position.y, position.z)
        directionalLight.castShadow = false
        return directionalLight
    }

    public static createShadowedLight(): SpotLight {
        const color = new Color(0xffffff)
        const position = new Vector3(500, 700, 400)
        const spotLight = new SpotLight(color, 0.9)
        spotLight.position.set(position.x, position.y, position.z)
        spotLight.castShadow = true
        spotLight.shadow.bias = 0.00001
        spotLight.shadow.mapSize.width = 2048
        spotLight.shadow.mapSize.height = 2048
        return spotLight
    }
}

export default LightFactory
