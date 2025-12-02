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

        this.uniformColorChange = 0
        this.uniformCurrentStep = 0
        this.uniformShot = 0

        this.debug = this.experience.debug


        this.setGeometries()
        this.setMaterial(0)
        this.setMesh(0)
        this.setAnimations()
        // this.setAnimationsRotation()

        // Debug
        if(this.debug.active)
        {
            this.debugFolder = this.debug.ui.addFolder('Plan')

            this.debugFolder
                .add(this.lyricMesh.position, 'x')
                .name('position x')
                .min(-4)
                .max(4)
                .step(0.01)
            this.debugFolder
                .add(this.lyricMesh.position, 'y')
                .name('position y')
                .min(-4)
                .max(100)
                .step(0.00001)
            this.debugFolder
                .add(this.lyricMesh.position, 'z')
                .name('position z')
                .min(-4)
                .max(4)
                .step(0.01)

            this.debugFolder
                .add(this.lyricMesh.scale, 'x')
                .name('scale x')
                .min(0)
                .max(2)
                .step(0.00001)
            this.debugFolder
                .add(this.lyricMesh.scale, 'y')
                .name('scale y')
                .min(0)
                .max(1200)
                .step(0.01)
            this.debugFolder
                .add(this.lyricMesh.scale, 'z')
                .name('scale z')
                .min(0)
                .max(2)
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
        this.boxGeometry = new THREE.BoxGeometry( 4.975, 2.81, 0.3, 124, 124, 124);
        // this.boxGeometry = new THREE.BoxGeometry( 5, 3, 0.3, 124, 124, 124);
        // this.planeGeometry = new THREE.PlaneGeometry( 5, 10, 62, 62);
        this.planeGeometry = new THREE.PlaneGeometry( 4.975, 9.95, 62, 62);
    }

    setMaterial(i)
    {
        console.log(this.resources.items.lyricTexture)
        this.resources.items.lyricTexture.minFilter = THREE.LinearFilter
        
        this.lyricMaterial = new THREE.MeshBasicMaterial({
            map: this.resources.items.lyricTexture,
            // alphaMap: this.resources.items.lyricTexture,
            // color: new THREE.Color(1.0, 0 ,0),
            //normalMap: new THREE.VideoTexture( this.videos[i]),
            transparent: true,
            opacity: 1.0,
            // side: THREE.DoubleSide,
            // blending: THREE.MultiplyBlending  
        })
        console.log(this.lyricMaterial)
        
        
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
                uShot: { value: this.uniformShot},
            }
        })
        
    }
    
    setMesh()
    {
        this.group = new THREE.Group()

        this.mesh = new THREE.Mesh(this.boxGeometry, this.material)
        this.lyricMesh = new THREE.Mesh(this.planeGeometry, this.lyricMaterial)


        this.lyricMesh.position.x = 0.06
        this.lyricMesh.position.y = -3.670
        this.lyricMesh.position.z += 0.0

        this.lyricMesh.scale.x = 1.017
        this.lyricMesh.scale.y = 1.02


        this.mesh.position.x = 0
        this.mesh.position.y = -0
        this.mesh.position.z = -0.16

        this.group.scale.x = 0.928
        this.group.scale.y = 0.928
        this.group.scale.z = 0.928

        this.group.position.y = 0.17



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
        this.experience.animations.on('animation-start', ()=>{
            this.setAnimationsRotation()
        })
        this.experience.animations.on('animation-rott-and-wander', ()=>{
            this.uniformCurrentStep = 1
            this.material.uniforms.uColorChange.value = 1
            
            this.material.uniforms.uCurrentStep.value = this.uniformCurrentStep
            window.setTimeout(()=>{
                this.material.uniforms.uColorChange.value = 0

            }, 900)
            gsap.to(
                this,
                {
                    duration: 9.0,
                    ease: 'power4.out',
                    uniformColorChange: 1,    
                    delay: 6,
                    yoyo: true,
                    yoyoEase: 'power4.out',
                    onUpdate : (e)=>{
                        this.material.uniforms.uColorChange.value = this.uniformColorChange
                    }
                }
            )
        })
        // this.experience.animations.on('animation-rott-and-wander-guit', this.animationRottAndWanderShot )
        // this.experience.animations.on('animation-rott-and-wander-gun', this.animationRottAndWanderShot )
        // this.experience.animations.on('animation-rott-and-wander-doing', this.animationRottAndWanderShot )
        this.experience.animations.on('animation-rott-and-wander-doing', ()=>{
            this.uniformCurrentStep = 1.5
            this.material.uniforms.uCurrentStep.value = this.uniformCurrentStep


        })
        this.experience.animations.on('animation-explosion', ()=>{
            gsap.to(
                this,
                {
                    duration: 8,
                    ease: 'power4.inOut',
                    uniformCurrentStep: 2,    
                    delay: 0,
                    onUpdate : (e)=>{
                        this.material.uniforms.uCurrentStep.value = this.uniformCurrentStep
                    }
                }
            )
        })
        this.experience.animations.on('animation-under-water-bliss', ()=>{
            this.uniformCurrentStep = 3
            this.material.uniforms.uCurrentStep.value = this.uniformCurrentStep

            // animate the current step to do a mix between old and new and smoothen the transition
            gsap.to(
                this,
                {
                    duration: 1.4,
                    ease: 'power2.inOut',
                    uniformCurrentStep: 3,
                    delay: 0,
                    onUpdate: () => {
                        this.camera.instance.updateProjectionMatrix()
                        this.material.uniforms.uCurrentStep.value = this.uniformCurrentStep
                    }
                }
            )

            // Zoom out to better see the water smooth
            gsap.to(
                this.camera.instance,
                {
                    duration: 3.5,
                    ease: 'power2.inOut',
                    zoom: 2,
                    delay: 0,
                    onUpdate: () => this.camera.instance.updateProjectionMatrix()
                }
            )
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
    setAnimationsRotation()
    {

        gsap.to(
            this.group.rotation,
            {
                duration: 35,
                ease: 'linear',
                y: Math.PI * -0.5,
                delay: 19
            }
        )
        gsap.to(
            this.group.rotation,
            {
                duration: 20,
                ease: 'linear',
                y: Math.PI * -1.0,
                delay: 56.3
            }
        )
        gsap.to(
            this.camera.instance,
            {
                duration: 32,
                // ease: 'elastic.out',
                ease: 'linear',
                zoom: 3,
                delay: 70,
                onUpdate: () => this.camera.instance.updateProjectionMatrix()
            }
        )
        gsap.to(
            this.camera.instance,
            {
                duration: 26,
                ease: 'linear',
                zoom: 1,
                delay: 107,
                onUpdate: () => this.camera.instance.updateProjectionMatrix()
            }
        )
        // gsap.to(
        //     this.group.rotation,
        //     {
        //         duration: 43,
        //         ease: 'power3.inOut',
        //         x: Math.PI * -2,
        //         delay: 136
        //     }
        // )

        // gsap.to(
        //     this.group.rotation,
        //     {
        //         duration: 10,
        //         ease: 'linear',
        //         z: 0,
        //         delay: 169
        //     }
        // )
        gsap.to(
            this.group.rotation,
            {
                duration: 80,
                ease: 'linear',
                y: -Math.PI * 4,
                delay: 137
            }
        )
        gsap.to(
            this.group.rotation,
            {
                duration: 30,
                ease: 'linear',
                z: Math.PI * -0.3,
                delay: 137
            }
        )
        gsap.to(
            this.group.rotation,
            {
                duration: 30,
                ease: 'linear',
                z: 0,
                delay: 220
            }
        )
    }
    animationRottAndWanderShot()
    {
        console.log('ROT AND WANDER')
        gsap.to(
            this,
            {
                duration: 0.5,
                ease: 'power4.inOut',
                uniformShot: 1,    
                delay: 0,
                onUpdate : (e)=>{
                    this.material.uniforms.uShot.value = this.uniformShot
                },
                onComplete: ()=>{
                    gsap.to(
                        this,
                        {
                            duration: 0.5,
                            ease: 'power4.inOut',
                            uniformShot: 0,    
                            delay: 0,
                            onUpdate : (e)=>{
                                this.material.uniforms.uShot.value = this.uniformShot
                            },
                        }
                    )
                }
            }
        )
    }
    update()
    {
        // Uniforms
        this.material.uniforms.uTime.value = this.time.elapsed
        // this.material.uniforms.uColorChange.value = this.uniformColorChange
        this.material.uniforms.uFrequenceAverage.value = this.experience.world.audio.frequenceAverage 
        this.material.uniforms.uFrequenceBassAverage.value = this.experience.world.audio.frequenceBassAverage 
        this.material.uniforms.uFrequenceMidAverage.value = this.experience.world.audio.frequenceMidAverage 
        this.material.uniforms.uFrequenceHightAverage.value = this.experience.world.audio.frequenceHightAverage
        
        // console.log(this.material.uniforms.uFrequenceBassAverage.value)
        
        // Box rotation
        // this.group.rotation.y += this.rotationAmount
        // ANimation
        // this.mesh.lookAt(this.camera.controls.object.position)


        
    }
}