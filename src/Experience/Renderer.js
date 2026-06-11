import * as THREE from 'three'
import Experience from './Experience.js'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'
import gsap from 'gsap'


export default class Renderer
{
    constructor()
    {
        this.experience = new Experience()
        this.canvas = this.experience.canvas
        this.sizes = this.experience.sizes
        this.scene = this.experience.scene
        this.camera = this.experience.camera
        this.debug = this.experience.debug
        this.debugParams = {
            color: '#152e42'
        }

        // Debug
        if(this.debug.active)
        {
            this.debugFolder = this.debug.ui.addFolder('Renderer')
        }
        this.setInstance()

        // Add Passes
        this.setPostProcessing()
        this.setBloomPass()

        // Add Animations
        window.setTimeout(() => {
            this.setAnimations()
          
        }, 1000);
    }

    setInstance()
    {
        this.instance = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: true
        })
        this.instance.toneMapping = THREE.CineonToneMapping
        this.instance.toneMappingExposure = 1.5
        this.instance.shadowMap.enabled = true
        this.instance.shadowMap.type = THREE.PCFSoftShadowMap
        this.instance.setClearColor('#FFFFFF')
        this.instance.setSize(this.sizes.width, this.sizes.height)
        this.instance.setPixelRatio(this.sizes.pixelRatio)
    }

    setPostProcessing()
    {
        const renderTarget = new THREE.WebGLRenderTarget(
            this.sizes.width,
            this.sizes.height,
            {
                samples: this.instance.getPixelRatio() === 1 ? 2 : 0,
            }
        )
        this.effectComposer = new EffectComposer(this.instance, renderTarget)
        this.effectComposer.setPixelRatio(this.sizes.pixelRatio)
        this.effectComposer.setSize(this.sizes.width, this.sizes.height)
        
        const renderPass = new RenderPass(this.scene, this.camera.instance)
        this.effectComposer.addPass(renderPass)

    }
    setBloomPass()
    {
        this.unrealBloomPass = new UnrealBloomPass()
        this.unrealBloomPass.strength = 3.0
        this.unrealBloomPass.radius = 0.4
        this.unrealBloomPass.threshold = 0.28 
        this.unrealBloomPass.enabled = true
        this.effectComposer.addPass(this.unrealBloomPass)

        if(this.debug.active)
        {
            this.debugFolder.add(this.unrealBloomPass, 'enabled')
            this.debugFolder.add(this.unrealBloomPass, 'strength').min(0).max(30).step(0.001)
            this.debugFolder.add(this.unrealBloomPass, 'radius').min(0).max(2).step(0.001)
            this.debugFolder.add(this.unrealBloomPass, 'threshold').min(0).max(1).step(0.001)
        }
    }
    setAnimations()
    {
        
        this.experience.animations.on('animation-step-one-begin', ()=>{
            this.unrealBloomPass.enabled = false
            this.unrealBloomPass.strength = 0.0
            this.unrealBloomPass.radius = 0.0

        })
        
        this.experience.animations.on('animation-step-one-respi', ()=>{
            this.unrealBloomPass.enabled = true
            this.unrealBloomPass.strength = 1
            this.unrealBloomPass.radius = 1
            
            window.setTimeout(() => {
                // gsap.to(
                //     this.unrealBloomPass,
                //     {
                //         duration: 1,
                //         ease: 'power4.inOut',
                //         strength: 1,
                //         radius: 1.0,
                //     }
                // )
            }, 2000);

        })
        this.experience.animations.on('animation-second-step', ()=>{
            window.setTimeout(() => {
                this.unrealBloomPass.strength = 1
                this.unrealBloomPass.radius = 1
            }, 6000);
        })
    }
    resize()
    {
        this.instance.setSize(this.sizes.width, this.sizes.height)
        this.instance.setPixelRatio(this.sizes.pixelRatio)
    }

    update()
    {
        this.effectComposer.render(this.scene, this.camera.instance)

        //this.instance.render(this.scene, this.camera.instance)
    }
}