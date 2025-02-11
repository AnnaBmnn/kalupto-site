import * as THREE from 'three'
import Experience from '../Experience.js'
import gsap from 'gsap'
import screenVertexShader from '../../shaders/vertex.glsl'
import screenFragmentShader from '../../shaders/fragment.glsl'

export default class Videos
{
    constructor()
    {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.time = this.experience.time
        this.audio = this.experience.world.audio
        this.videos = document.querySelectorAll('.js-video-texture')
        this.numberSlide = 50
        this.frame = 0

        this.texturesFixed = [
            this.resources.items.picture1Texture,
            this.resources.items.picture2Texture,
            this.resources.items.picture3Texture,
        ]

        this.textures = []
        this.meshes = []
        this.materials = []
        this.cloneMeshes = [[],[],[]]


        this.loadTextures()
        this.setGeometry()
        /*
        for(let i = 0; i < this.textures.length; i++){
            this.setMaterial(i)
            this.setMesh(i)
        }
        */
        window.setTimeout(()=>{
            this.setAnimations()
        }, 200)    

    }
    loadTextures()
    {
        for(let i = 0; i < this.videos.length; i++)
        {
            //console.log('ici')
            //this.videos[i].play()
            this.videos[i].load()
            this.videos[i].addEventListener('canplaythrough', ()=> {
                console.log('load')
                this.textures[i] = new THREE.VideoTexture( this.videos[i]);
                this.setMaterial(i)
                this.setMesh(i)

                
            }, {once: true})
        }
    }
    setGeometry()
    {
        this.geometry = new THREE.PlaneGeometry( 10, 10, 124, 124);
    }

    setMaterial(i)
    {

        this.materials[i] = new THREE.MeshStandardMaterial({
            map: this.textures[i],
            normalMap: this.texturesFixed[0],
            transparent: true,
            opacity: 0.0,
            side: THREE.DoubleSide,
            // blending: THREE.MultiplyBlending  
        })
        
        /*
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
                uTexture: { type: "t", value: this.textures[i]}
            }
        })
        */
    }

    setMesh(i)
    {
        this.mesh = new THREE.Mesh(this.geometry, this.materials[i])
        this.mesh.position.z = -3 + i * 0.1
        this.mesh.visible = false
        // this.mesh.rotation.x = - Math.PI * 0.5

        this.mesh.receiveShadow = true
        this.scene.add(this.mesh)
        this.meshes.push(this.mesh)

        for(let j = 0; j < this.numberSlide; j++)
        {
            const _clone = this.mesh = new THREE.Mesh(this.geometry, this.materials[i])
            // _clone.position.x = j * 0.2
            this.cloneMeshes[i][j] = _clone
            this.scene.add(_clone)
        }
    }
    setAnimations()
    {
        this.experience.animations.on('animation-second-step', ()=>{
            for(let i = 0; i < this.materials.length; i++)
            {
                window.setTimeout(()=>{
                    this.isAnim = true
                    this.meshes[i].visible = true
                    gsap.to(
                        this.materials[i],
                        {
                            duration: 12,
                            ease: 'power2.out',
                            opacity: 0.85,
                        }
                    )
                }, 10000)

            }

        })
    }
    update()
    {
        if(this.meshes && this.meshes.length > 0 && this.isAnim)
        {
            //this.material.uniforms.uTime.value = this.time.elapsed
            
            for(let i = 0; i < this.meshes.length; i++ ){
                this.meshes[i].position.x = Math.cos(this.time.elapsed * 0.0001 + i + 3) * 10
                this.meshes[i].position.z = -3 + i * 0.1 + Math.sin(this.time.elapsed * 0.0001 + i + 2) * 10
                this.meshes[i].position.y = Math.sin(this.time.elapsed * 0.0001 + i + 3) * 10
                // let _scale = 1 + this.experience.world.audio.frequenceAverage * 0.001
                // this.meshes[i].scale.set(_scale, _scale, _scale)
                this.meshes[i].material.opacity = 0.0 + this.experience.world.audio.frequenceAverage * 0.01
            }

        }
        if(this.isAnim && this.meshes[0] && this.meshes[1] && this.meshes[2] && this.cloneMeshes){
            this.cloneMeshes[0][this.frame].position.x = this.meshes[0].position.x
            this.cloneMeshes[0][this.frame].position.y = this.meshes[0].position.y
            this.cloneMeshes[0][this.frame].position.z = this.meshes[0].position.z
            this.cloneMeshes[1][this.frame].position.x = this.meshes[1].position.x
            this.cloneMeshes[1][this.frame].position.y = this.meshes[1].position.y
            this.cloneMeshes[1][this.frame].position.z = this.meshes[1].position.z
            this.cloneMeshes[2][this.frame].position.x = this.meshes[2].position.x
            this.cloneMeshes[2][this.frame].position.y = this.meshes[2].position.y
            this.cloneMeshes[2][this.frame].position.z = this.meshes[2].position.z


            // const _clone = this.meshes[0].clone()
            // const _clone1 = this.meshes[1].clone()
            // const _clone2 = this.meshes[2].clone()
            // _clone.material.opacity = 0.2
            // _clone1.material.opacity = 0.2
            // _clone2.material.opacity = 0.2
            // this.scene.add(_clone)
            // this.scene.add(_clone1)
            // this.scene.add(_clone2)
            this.frame = (this.frame + 1) % this.numberSlide
        }
    }
}