import * as THREE from 'three'
import Experience from '../Experience.js'
import screenVertexShader from '../../shaders/sorting/vertex.glsl'
import screenFragmentShader from '../../shaders/sorting/fragment.glsl'

export default class Ear
{
    constructor()
    {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.time = this.experience.time
        this.debug = this.experience.debug
        this.textures = [
            this.resources.items.picture2Texture,
            this.resources.items.picture3Texture,
            this.resources.items.picture4Texture,
            this.resources.items.picture1Texture,
        ]
        // Debug
        if(this.debug.active)
        {
            // this.debugFolder = this.debug.ui.addFolder('fox')
        }

        // Resource
        this.resource = this.resources.items.earModel
        console.log('LA')
        console.log(this.resource)

        this.setModel()
    }

    setModel()
    {
        this.model = this.resource.scene
        // this.model.scale.set(0.1, 0.1, 0.1)
        this.model.position.y = 0

        this.scene.add(this.model)
        console.log(this.model)

        this.model.traverse((child) =>
        {
            if(child instanceof THREE.Mesh)
            {
                child.castShadow = true
            }
        })
    }


    update()
    {
        if(this.experience){
            let _scale = this.experience.world.audio.frequenceAverage * 0.005
            this.model.scale.set(_scale, _scale, _scale)

        }

    }
}