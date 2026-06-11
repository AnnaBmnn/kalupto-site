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
            this.resources.items.paperTexture
        ]
        this.texturesAlpha = [
            this.resources.items.paperTexture
        ]
        this.meshes = []
        this.materials = []
        this.isAnim = 0

        this.setGeometry()


        for(let i = 0; i < this.textures.length; i++){
            this.setMaterial(i)
            this.setMesh(i)
        }
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

    setGeometry()
    {
        this.geometry = new THREE.PlaneGeometry( 5.5, 5.5, 768, 768);
    }

    setMaterial(i)
    {
        console.log(this.textures[i])
        this.material = new THREE.MeshStandardMaterial({
            map: this.textures[i],
            normalMap: this.textures[i],
            transparent: true,
            opacity: 0.8,
            side: THREE.DoubleSide,
            blending: THREE.SubtractiveBlending  
        })
        
        
        // this.materials[i] = new THREE.ShaderMaterial({
        //     depthWrite: true,
        //     // blending: THREE.AdditiveBlending,
        //     vertexColors: false,
        //     vertexShader: screenVertexShader,
        //     fragmentShader: screenFragmentShader,
        //     transparent: true,
        //     side: THREE.DoubleSide,
        //     // opacity: 0.8,
        //     uniforms: {
        //         uTime: {value: 0},
        //         uTexture: { type: "t", value: this.textures[i]},
        //         uTextureAlpha: { type: "t", value: this.texturesAlpha[i]},
        //         uFrequenceAverage: {value: 50},
        //         uStep: {value: 0},
        //         uOpacity: {value: 0},
        //         uShape: {value: 0}
        //     }
        // })
        
    }

    setMesh(i)
    {
        this.mesh = new THREE.Mesh(this.geometry, this.material)
        this.mesh.renderOrder = 1

        this.mesh.rotation.x = Math.PI * 0.5

        this.scene.add(this.mesh)
        this.meshes.push(this.mesh)

    }
    setAnimations(){
        
        this.experience.animations.on('animation-step-one-end-one', ()=>{
            // this.materials[i].uniforms.uStep.value = 1
            // this.materials[i].uniforms.uOpacity.value = 1
            for(let i = 0; i < this.meshes.length  ; i++ ){
                // this.meshes[i].position.z = -2.2
                // this.meshes[i].position.x = -i * 2
                // this.mesh.position.z = -2 - i * 2.7
                // this.mesh.position.y = 0 - i * 3.0
                // this.materials[i].uniforms.uFrequenceAverage.value = this.experience.world.audio.frequenceAverage 
                gsap.to(
                    this.meshes[i].position,
                    {
                        z: -2.2,
                        x: -i * 0.2,
                        duration: 6,
                        ease: 'power2.inOut',
                        delay: 2,
                        onComplete: ()=>{
                            this.isAnim = 1

                        }
                    }
                )
            }
        })
        this.experience.animations.on('animation-step-one-end-one', ()=>{
            for(let i = 0; i < this.materials.length; i++)
            {
                gsap.to(
                    this.materials[i].uniforms.uOpacity,
                    {
                        duration: 12,
                        ease: 'power2.inOut',
                        value: 1,
                        onComplete: ()=>{
                            this.materials[i].transparent = false

                        }
                    }
                )
            }
        })
        this.experience.animations.on('animation-step-one-respi', ()=>{
            this.isAnim = 2
            for(let i = 0; i < this.materials.length; i++)
            {
                this.meshes[i].rotation.z = 0
                this.materials[i].transparent = true

                gsap.to(
                    this.materials[i].uniforms.uOpacity,
                    {
                        duration: 2,
                        ease: 'power2.inOut',
                        value: 0,
                        onComplete: ()=>{

                        }
                    }
                )
                // gsap.to(
                //     this.meshes[i].position,
                //     {
                //         z: -2 - i * 2.5,
                //         duration: 2.3,
                //         ease: 'power2.out',
                //         delay: 0,
                //         onComplete: ()=>{
                //         }
                //     }
                // )
            }
        })
        this.experience.animations.on('animation-second-step', ()=>{
            for(let i = 0; i < this.meshes.length - 1 ; i++ ){
                // this.meshes[i].position.z = 0
                // this.materials[i].uniforms.uFrequenceAverage.value = this.experience.world.audio.frequenceAverage 
                gsap.to(
                    this.meshes[i].position,
                    {
                        z: -2 - i * 3,
                        duration: 2.3,
                        ease: 'power2.out',
                        delay: 0,
                        onComplete: ()=>{
                        }
                    }
                )
                gsap.to(
                    this.meshes[i].rotation,
                    {
                        z: 0,
                        duration: 2.3,
                        ease: 'power2.out',
                        delay: 0,
                        onComplete: ()=>{
                        }
                    }
                )
            }

            window.setTimeout(()=>{


                for(let i = 0; i < this.materials.length; i++)
                {
                    this.materials[i].uniforms.uStep.value = 1 + i * 0.2
                    // this.materials[i].uniforms.uOpacity.value = 1
                    // this.materials[i].uniforms.uStep.value = 1
                    // this.meshes[i].scale.x = 16
                    // this.meshes[i].scale.y = 16
                    // this.meshes[i].scale.z = 16
                    if(i === 3){
                        // this.meshes[i].rotation.y = Math.Pi * 0.5
                    }
                    for(let i = 0; i < this.meshes.length ; i++ ){
                        // this.meshes[i].position.z = 0
                        // this.materials[i].uniforms.uFrequenceAverage.value = this.experience.world.audio.frequenceAverage 
                        gsap.to(
                            this.meshes[i].position,
                            {
                                x: i > 1 ? 5 : -5,
                                y: i % 2 == 0 ? 5 : -5,
                                duration: 2.3,
                                ease: 'power2.out',
                                delay: 0,
                                onComplete: ()=>{
                                    this.isAnim = 3

                                }
                            }
                        )
                    }
                    /*
                    gsap.to(
                        this.meshes[i].scale,
                        {
                            x: 17,
                            y: 17,
                            z: 17,
                            duration: 16,
                            ease: 'power2.inOut',
                            delay: 0,
                            onComplete: ()=>{
                            }
                        }
                    )
                    */
                }
            }, 6800)
            // for(let i = 0; i < this.materials.length; i++)
            // {
            //     gsap.to(
            //         this.materials[i].uniforms.uOpacity,
            //         {
            //             duration: 12,
            //             ease: 'power2.inOut',
            //             value: 1,
            //             onComplete: ()=>{
            //                 this.materials[i].transparent = false

            //             }
            //         }
            //     )
            // }

        })
        this.experience.animations.on('animation-fourth-step', ()=>{
            for(let i = 0; i < this.meshes.length; i++ ){
                // this.materials[i].uniforms.uStep.value = 2.5
                // this.meshes[i].rotation.z = 0
                // this.meshes[i].position.x = -2
                // this.meshes[i].position.y = 0
                // this.meshes[i].position.z = 0
                gsap.to(
                    this.materials[i].uniforms.uStep,
                    {
                        duration: 12,
                        ease: 'power2.inOut',
                        value: 1.5,
                    }
                )
                this.isAnim = 4

                gsap.to(
                    this.meshes[i].position,
                    {
                        duration: 5,
                        ease: 'power2.inOut',
                        x: -2 - i * 0.2,
                        y: i * 0.3,
                        z: i * 0.3,
                        onComplete: ()=>{
                            this.isAnim = 5
                        }
                    }
                )
                gsap.to(
                    this.meshes[i].rotation,
                    {
                        duration: 18,
                        ease: 'power2.inOut',
                        y: 2 * Math.PI,
                        x: 1 * Math.PI,
                        delay: 2,
                        onComplete: ()=>{
                            // this.meshes[i].rotation.y = 3 * Math.PI
                        }
                    }
                )
                gsap.to(
                    this.materials[i].uniforms.uShape,
                    {
                        duration: 12,
                        ease: 'power2.inOut',
                        value: 1,
                    }
                )
            }
        })
    }
    update()
    {
        
    
    }
}
