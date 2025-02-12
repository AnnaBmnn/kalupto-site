import * as THREE from 'three'
import Experience from '../Experience.js'
import screenVertexShader from '../../shaders/sorting/vertex.glsl'
import screenFragmentShader from '../../shaders/sorting/fragment.glsl'
import gsap from 'gsap'

export default class Plans
{
    constructor()
    {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.time = this.experience.time
        this.audio = this.experience.world.audio
        this.debug = this.experience.debug
        this.textures = [
            this.resources.items.picture2Texture,
            this.resources.items.picture3Texture,
            this.resources.items.picture1Texture,
            this.resources.items.picture4Texture,
        ]
        this.meshes = []
        this.materials = []


        this.setGeometry()


        for(let i = 0; i < this.textures.length; i++){
            this.setMaterial(i)
            this.setMesh(i)
        }
        window.setTimeout(()=>{
            this.setAnimations()
        }, 200)  
    }

    setGeometry()
    {
        this.geometry = new THREE.PlaneGeometry( 5, 5, 768, 768);
    }

    setMaterial(i)
    {
        /*
        this.material = new THREE.MeshStandardMaterial({
            map: this.textures[i],
            normalMap: this.textures[i],
            transparent: true,
            opacity: 0.8,
            side: THREE.DoubleSide,
            //blending: THREE.SubtractiveBlending  
        })
        */
        
        this.materials[i] = new THREE.ShaderMaterial({
            depthWrite: true,
            // blending: THREE.AdditiveBlending,
            vertexColors: false,
            vertexShader: screenVertexShader,
            fragmentShader: screenFragmentShader,
            transparent: true,
            side: THREE.DoubleSide,
            // opacity: 0.8,
            uniforms: {
                uTime: {value: 0},
                uTexture: { type: "t", value: this.textures[i]},
                uTextureAlpha: { type: "t", value: this.textures[(i + 1) % 3]},
                uFrequenceAverage: {value: 0},
                uStep: {value: 0},
            }
        })
        
    }

    setMesh(i)
    {
        this.mesh = new THREE.Mesh(this.geometry, this.materials[i])
        this.mesh.position.z = -2 - i * 2.5
        this.mesh.position.y = 0 - i * 3.0

        // this.mesh.rotation.x = - Math.PI * 0.5

        this.mesh.receiveShadow = true
        this.scene.add(this.mesh)
        this.meshes.push(this.mesh)
       // Debug
       if(this.debug.active)
       {
           this.debugFolder = this.debug.ui.addFolder('Plan')

           this.debugFolder
               .add(this.meshes[0].position, 'x')
               .name('position x')
               .min(-100)
               .max(100)
               .step(0.01)
           this.debugFolder
               .add(this.meshes[0].position, 'y')
               .name('position y')
               .min(-100)
               .max(100)
               .step(0.01)
           this.debugFolder
               .add(this.meshes[0].position, 'z')
               .name('position z')
               .min(-100)
               .max(100)
               .step(0.01)

           this.debugFolder
               .add(this.meshes[0].scale, 'x')
               .name('scale x')
               .min(0)
               .max(100)
               .step(0.01)
           this.debugFolder
               .add(this.meshes[0].scale, 'y')
               .name('scale y')
               .min(0)
               .max(100)
               .step(0.01)
           this.debugFolder
               .add(this.meshes[0].scale, 'z')
               .name('scale z')
               .min(0)
               .max(100)
               .step(0.01)

           this.debugFolder
               .add(this.meshes[0].rotation, 'x')
               .name('rotation x')
               .min(0)
               .max(7)
               .step(0.01)
           this.debugFolder
               .add(this.meshes[0].rotation, 'y')
               .name('rotation y')
               .min(0)
               .max(7)
               .step(0.01)
           this.debugFolder
               .add(this.meshes[0].rotation, 'z')
               .name('rotation z')
               .min(0)
               .max(7)
               .step(0.01)
       }
    }
    setAnimations()
    {
        this.experience.animations.on('animation-second-step', ()=>{
            window.setTimeout(()=>{
                this.isAnim = true

                for(let i = 0; i < this.materials.length; i++)
                {
                    this.materials[i].transparent = false
                    this.materials[i].uniforms.uStep.value = 1

                    // this.meshes[i].rotation.x = Math.Pi * 0.5
                }
            }, 6000)


        })
    }
    update()
    {
        
        
        if(this.materials && this.materials.length > 0)
        {
            
            for(let i = 0; i < this.materials.length; i++ ){
                this.materials[i].uniforms.uTime.value = this.time.elapsed
                this.materials[i].uniforms.uFrequenceAverage.value = this.experience.world.audio.frequenceAverage 

            }
        }
        if(this.meshes && this.meshes.length > 0)
        {
            //this.material.uniforms.uTime.value = this.time.elapsed
            
            for(let i = 0; i < this.meshes.length; i++ ){
                // this.meshes[i].rotation.z += 0.0005 * i * Math.random()

                if(!this.experience.world.audio.domAudio.paused)
                {
                    this.meshes[i].scale.x += 0.001
                    this.meshes[i].scale.y += 0.0005

                    // this.meshes[i].position.z -= 0.5 
                    // this.meshes[i].position.z = -3 + i * 0.1 + Math.sin(this.time.elapsed * 0.00001 + i + 3) * 10
                    // this.meshes[i].position.y = Math.cos(this.time.elapsed * 0.0001 + i + 0) * 10
                    // this.meshes[i].position.x = Math.cos(this.time.elapsed * 0.0001 + i + 0) * 10

                }
                if(this.isAnim){
                    this.meshes[i].position.x += Math.cos(this.time.elapsed * 0.0001 + i + 1) * 0.05
                    // this.meshes[i].position.z += Math.sin(this.time.elapsed * 0.0002 + i + 2) * 0.005
                    this.meshes[i].position.y -= Math.sin(this.time.elapsed * 0.0001 + i + 3) * 0.01
                }
            }
            
        }
    }
}