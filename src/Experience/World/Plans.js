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
        this.isAnim = 0

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
        this.geometry = new THREE.PlaneGeometry( 5.5, 5.5, 768, 768);
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
            blending: THREE.SubtractiveBlending  
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
                uOpacity: {value: 0},
            }
        })
        
    }

    setMesh(i)
    {
        this.mesh = new THREE.Mesh(this.geometry, this.materials[i])
        this.mesh.position.z = -2 - i * 2.5
        this.mesh.position.y = 0 - i * 0.0

        // this.mesh.rotation.x = - Math.PI * 0.5

        this.mesh.receiveShadow = true
        this.scene.add(this.mesh)
        this.meshes.push(this.mesh)

    }
    setAnimations(){
        
        this.experience.animations.on('animation-step-one-end-two', ()=>{
            // this.materials[i].uniforms.uStep.value = 1
            // this.materials[i].uniforms.uOpacity.value = 1
            this.isAnim += 1
            for(let i = 0; i < this.meshes.length - 1 ; i++ ){
                // this.meshes[i].position.z = 0
                // this.materials[i].uniforms.uFrequenceAverage.value = this.experience.world.audio.frequenceAverage 
                gsap.to(
                    this.meshes[i].position,
                    {
                        z: -0.010,
                        duration: 2.3,
                        ease: 'power2.out',
                        delay: 0,
                        onComplete: ()=>{
                        }
                    }
                )
            }
        })
        this.experience.animations.on('animation-step-one-end-two', ()=>{
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
            for(let i = 0; i < this.materials.length; i++)
            {
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
                        z: -2 - i * 2.5,
                        duration: 2.3,
                        ease: 'power2.out',
                        delay: 0,
                        onComplete: ()=>{
                        }
                    }
                )
            }
            window.setTimeout(()=>{
                this.isAnim += 1


                for(let i = 0; i < this.materials.length; i++)
                {
                    this.materials[i].uniforms.uStep.value = 0 + i * 0.1
                    // this.materials[i].uniforms.uOpacity.value = 1
                    // this.materials[i].uniforms.uStep.value = 1
                    // this.meshes[i].scale.x = 16
                    // this.meshes[i].scale.y = 16
                    // this.meshes[i].scale.z = 16
                    if(i === 3){
                        this.meshes[i].rotation.y = Math.Pi * 0.5
                    }
                    for(let i = 0; i < this.meshes.length ; i++ ){
                        // this.meshes[i].position.z = 0
                        // this.materials[i].uniforms.uFrequenceAverage.value = this.experience.world.audio.frequenceAverage 
                        gsap.to(
                            this.meshes[i].position,
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
            }, 6000)
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
        this.experience.animations.on('animation-third-step', ()=>{
            for(let i = 0; i < this.meshes.length; i++ ){
                this.meshes[i].rotation.z = 0

            }
        })
        this.experience.animations.on('animation-four-step', ()=>{
            for(let i = 0; i < this.meshes.length; i++ ){
                this.materials[i].uniforms.uStep.value = 5

            }
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
                    this.meshes[i].scale.x += 0.0012
                    this.meshes[i].scale.y += 0.0005

                    // this.meshes[i].position.z -= 0.5 
                    // this.meshes[i].position.z = -3 + i * 0.1 + Math.sin(this.time.elapsed * 0.00001 + i + 3) * 10
                    // this.meshes[i].position.y = Math.cos(this.time.elapsed * 0.0001 + i + 0) * 10
                    // this.meshes[i].position.x = Math.cos(this.time.elapsed * 0.0001 + i + 0) * 10

                } 
                if(this.isAnim  == 1){
                    const sens = i % 2 == 0 ? -1 : 1
                    this.meshes[i].rotation.z += 0.00013 * sens * i
                }
                if(this.isAnim  >= 2){
                    // this.meshes[i].scale.x = 2.5
                    // this.meshes[i].scale.y = 2.5
                    // this.meshes[i].scale.z = 2.5
                    // this.meshes[i].position.x += Math.cos(this.time.elapsed * 0.0004 + i * 2 ) * 0.05
                    // this.meshes[i].position.z =  i * 0.5 + this.experience.world.audio.frequenceAverage * 0.002
                    // this.meshes[i].position.y += Math.sin(this.time.elapsed * 0.0001 + i + 3) * 0.03 * Math.sin(this.time.elapsed * 0.0001 + i + 3) * 0.03
                }
            }
            
        }
    }
}