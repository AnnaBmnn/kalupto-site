import * as THREE from 'three'
import Experience from '../Experience.js'
import screenVertexShader from '../../shaders/box/vertex.glsl'
import screenFragmentShader from '../../shaders/box/fragment.glsl'
import gsap from 'gsap'

export default class Box
{
    constructor()
    {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.time = this.experience.time
        this.audio = this.experience.world.audio
        this.camera = this.experience.camera
        this.videos = document.querySelectorAll('.js-video-texture')
        
        this.rotationAmount = 0

        this.uniformColorChange = 1

        this.debug = this.experience.debug


        this.setGeometry()
        this.setMaterial(0)
        this.setMesh(0)
        this.setAnimations()

        // Debug
        if(this.debug.active)
        {
            this.debugFolder = this.debug.ui.addFolder('Plan')

            this.debugFolder
                .add(this.mesh.position, 'x')
                .name('position x')
                .min(-100)
                .max(100)
                .step(0.01)
            this.debugFolder
                .add(this.mesh.position, 'y')
                .name('position y')
                .min(-100)
                .max(100)
                .step(0.01)
            this.debugFolder
                .add(this.mesh.position, 'z')
                .name('position z')
                .min(-100)
                .max(100)
                .step(0.01)

            this.debugFolder
                .add(this.mesh.scale, 'x')
                .name('scale x')
                .min(0)
                .max(100)
                .step(0.01)
            this.debugFolder
                .add(this.mesh.scale, 'y')
                .name('scale y')
                .min(0)
                .max(100)
                .step(0.01)
            this.debugFolder
                .add(this.mesh.scale, 'z')
                .name('scale z')
                .min(0)
                .max(100)
                .step(0.01)

            this.debugFolder
                .add(this.mesh.rotation, 'x')
                .name('rotation x')
                .min(0)
                .max(7)
                .step(0.01)
            this.debugFolder
                .add(this.mesh.rotation, 'y')
                .name('rotation y')
                .min(0)
                .max(7)
                .step(0.01)
            this.debugFolder
                .add(this.mesh.rotation, 'z')
                .name('rotation z')
                .min(0)
                .max(7)
                .step(0.01)
            this.debugFolder
                .add(this, 'uniformColorChange')
                .name('Shader uniform')
                .min(-5)
                .max(100)
                .step(0.001)
        }
    }

    setGeometry()
    {
        this.geometry = new THREE.BoxGeometry( 10, 10, 4, 124, 124, 124);
    }

    setMaterial(i)
    {
        
        // this.material = new THREE.MeshStandardMaterial({
        //     map: this.resources.items.lakeIceTexture,
        //     //normalMap: new THREE.VideoTexture( this.videos[i]),
        //     transparent: true,
        //     opacity: 0.9,
        //     side: THREE.DoubleSide,
        //     blending: THREE.MultiplyBlending  
        // })
        
        
        this.material = new THREE.ShaderMaterial({
            depthWrite: true,
            // blending: THREE.AdditiveBlending,
            vertexColors: true,
            vertexShader: screenVertexShader,
            fragmentShader: screenFragmentShader,
            transparent: true,
            side: THREE.DoubleSide,
            opacity: 0.8,
            uniforms: {
                uTime: {value: 0},
                uFrequenceAverage: {value: 1},
                uFrequenceBassAverage: {value: 1},
                uFrequenceMidAverage: {value: 1},
                uFrequenceHightAverage: {value: 1},
                uColorChange: { value: 1}
            }
        })
        
    }
    
    setMesh(i)
    {
        this.mesh = new THREE.Mesh(this.geometry, this.material)
        this.mesh.position.x = 0
        this.mesh.position.y = -0
        this.mesh.position.z = 0

        this.mesh.scale.x = 1.6
        this.mesh.scale.y = 0.9
        this.mesh.scale.z = 0.1
        this.mesh.renderOrder = 0

        this.mesh.rotation.x = Math.PI


        // this.mesh.rotation.x = - Math.PI * 0.5

        this.mesh.receiveShadow = false
        this.scene.add(this.mesh)
    }
    setAnimations()
    {
        this.experience.animations.on('animation-step-one-begin', ()=>{
            gsap.to(
                this,
                {
                    duration: 0.5,
                    ease: 'power2.inOut',
                    rotationAmount: 0.0005,
                    uniformColorChange: 0,
                    delay: 0
                }
            )
        })
    }
    update()
    {
        // Uniforms
        this.material.uniforms.uTime.value = this.time.elapsed
        this.material.uniforms.uColorChange.value = this.uniformColorChange
        this.material.uniforms.uFrequenceAverage.value = this.experience.world.audio.frequenceAverage 
        this.material.uniforms.uFrequenceBassAverage.value = this.experience.world.audio.frequenceBassAverage 
        this.material.uniforms.uFrequenceMidAverage.value = this.experience.world.audio.frequenceMidAverage 
        this.material.uniforms.uFrequenceHightAverage.value = this.experience.world.audio.frequenceHightAverage
        
        // console.log(this.material.uniforms.uFrequenceBassAverage.value)
        
        // Box rotation
        this.mesh.rotation.y += this.rotationAmount
        // ANimation
        // this.mesh.lookAt(this.camera.controls.object.position)


        
    }
}