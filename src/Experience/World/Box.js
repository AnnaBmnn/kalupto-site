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
        this.uniformCurrentStep = 0

        this.debug = this.experience.debug


        this.setGeometries()
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

    setGeometries()
    {
        this.boxGeometry = new THREE.BoxGeometry( 5, 3, 0.1, 124, 124, 124);
        this.planeGeometry = new THREE.PlaneGeometry( 5, 10, 62, 62);
    }

    setMaterial(i)
    {
        
        this.resources.items.lyricTexture.minFilter = THREE.LinearFilter
        
        this.lyricMaterial = new THREE.MeshBasicMaterial({
            map: this.resources.items.lyricTexture,
            alphaMap: this.resources.items.lyricTexture,
            // color: new THREE.Color(1.0, 0 ,0),
            //normalMap: new THREE.VideoTexture( this.videos[i]),
            transparent: true,
            opacity: 1.0,
            // side: THREE.DoubleSide,
            // blending: THREE.MultiplyBlending  
        })
        
        
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
                uColorChange: { value: 1},
                uCurrentStep: { value: this.uniformCurrentStep},
            }
        })
        
    }
    
    setMesh()
    {
        this.group = new THREE.Group()

        this.mesh = new THREE.Mesh(this.boxGeometry, this.material)
        this.lyricMesh = new THREE.Mesh(this.planeGeometry, this.lyricMaterial)


        this.lyricMesh.position.y = -3.5
        this.lyricMesh.position.z += 0.1

        this.mesh.position.x = 0
        this.mesh.position.y = -0
        this.mesh.position.z = 0

        // this.group.scale.x = 0.1
        // this.group.scale.y = 0.1
        // this.group.scale.z = 0.1


        this.mesh.renderOrder = 0
        this.lyricMesh.renderOrder = 1

        // this.group.rotation.x = Math.PI


        // this.mesh.rotation.x = - Math.PI * 0.5

        this.mesh.receiveShadow = false
        
        this.group.add(this.mesh)
        this.group.add(this.lyricMesh)
        this.scene.add(this.group)
    }
    setAnimations()
    {
        this.experience.animations.on('animation-rott-and-wander', ()=>{
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
            this.uniformCurrentStep = 1
            this.material.uniforms.uCurrentStep.value = this.uniformCurrentStep
        })
        this.experience.animations.on('animation-explosion', ()=>{
            gsap.to(
                this,
                {
                    duration: 1,
                    ease: 'power2.inOut',
                    uniformCurrentStep: 2,    
                    delay: 0,
                    onUpdate : (e)=>{
                        this.material.uniforms.uCurrentStep.value = this.uniformCurrentStep

                        console.log(this.uniformCurrentStep)
                    }
                }
            )
        })
        this.experience.animations.on('animation-explosion-bigger', ()=>{
            // gsap.to(
            //     this.mesh.scale,
            //     {
            //         duration: 0.5,
            //         ease: 'power2.inOut',
            //         x: 100,
            //         y: 100,
            //         z: 100,    
            //         delay: 0
            //     }
            // )
        })
        this.experience.animations.on('animation-under-water-bliss', ()=>{
            this.uniformCurrentStep = 3
            this.material.uniforms.uCurrentStep.value = this.uniformCurrentStep
            this.isBigger = false
            // gsap.to(
            //     this.mesh.scale,
            //     {
            //         duration: 0.5,
            //         ease: 'power2.inOut',
            //         x: 1,
            //         y: 1,
            //         z: 1,    
            //         delay: 0
            //     }
            // )
        })
        this.experience.animations.on('animation-80-band', ()=>{
            this.uniformCurrentStep = 4
            this.material.uniforms.uCurrentStep.value = this.uniformCurrentStep
        })
        this.experience.animations.on('animation-outro', ()=>{
            this.uniformCurrentStep = 5
            this.material.uniforms.uCurrentStep.value = this.uniformCurrentStep
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
        this.group.rotation.y += this.rotationAmount
        // ANimation
        // this.mesh.lookAt(this.camera.controls.object.position)


        
    }
}