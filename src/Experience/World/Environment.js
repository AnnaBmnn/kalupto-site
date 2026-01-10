import * as THREE from 'three'
import Experience from '../Experience.js'
import { Sky } from 'three/addons/objects/Sky.js';
import gsap from 'gsap'


export default class Environment
{
    constructor()
    {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.debug = this.experience.debug
        this.debugObject = {color: '#202125'}
        
        // Debug
        if(this.debug.active)
        {
            this.debugFolder = this.debug.ui.addFolder('environment')
        }

        // this.setSunLight()
        this.setBackground()
        
        window.setTimeout(()=>{
            this.setAnimations()
        }, 200)    

        // this.setSky()
    }

    setSunLight()
    {
        this.sunLight = new THREE.DirectionalLight('#6772AB', 4)
        this.sunLight.castShadow = true
        this.sunLight.shadow.camera.far = 15
        this.sunLight.shadow.mapSize.set(1024, 1024)
        this.sunLight.shadow.normalBias = 0.05
        this.sunLight.position.set(-3.728, 3, - 1.0)
        this.scene.add(this.sunLight)

        // Debug
        if(this.debug.active)
        {
            this.debugFolder
                .add(this.sunLight, 'intensity')
                .name('sunLightIntensity')
                .min(0)
                .max(10)
                .step(0.001)
            
            this.debugFolder
                .add(this.sunLight.position, 'x')
                .name('sunLightX')
                .min(- 5)
                .max(5)
                .step(0.001)
            
            this.debugFolder
                .add(this.sunLight.position, 'y')
                .name('sunLightY')
                .min(- 5)
                .max(5)
                .step(0.001)
            
            this.debugFolder
                .add(this.sunLight.position, 'z')
                .name('sunLightZ')
                .min(- 5)
                .max(5)
                .step(0.001)


        }
    }
    setBackground()
    {

        this.scene.background =  new THREE.Color('rgba(32, 33, 37, 1)')



        // Debug
        if(this.debug.active)
        {
            this.debugFolder
                .addColor(this.debugObject , 'color')
                .name('background color')
                .onChange((value) =>
                {
                    console.log(value)
                    this.debugObject.color = value
                    this.scene.background =  new THREE.Color(this.debugObject.color)
                })
        }
    }
    setEnvironmentMap()
    {
        this.environmentMap = {}
        this.environmentMap.intensity = 2
        this.environmentMap.texture = this.resources.items.environmentMapTexture
        this.environmentMap.texture.colorSpace = THREE.SRGBColorSpace
        
        this.scene.environment = this.environmentMap.texture

        this.environmentMap.updateMaterials = () =>
        {
            this.scene.traverse((child) =>
            {
                if(child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial)
                {
                    child.material.envMap = this.environmentMap.texture
                    child.material.envMapIntensity = this.environmentMap.intensity
                    child.material.needsUpdate = true
                }
            })
        }
        // this.scene.backgroundBlurriness = 0.9
        // this.scene.fog = new THREE.Fog( 0xcccccc, 10, 300);

    }
    setAnimations()
    {
        this.experience.animations.on('animation-rott-and-wander', ()=>{
            gsap.to(
                this.scene.background,
                {
                    duration: 6,
                    ease: 'linear',
                    r: 0,
                    g: 0,
                    b: 0,
                    delay: 5,
                }
            )
        })
        this.experience.animations.on('animation-under-water-bliss', ()=>{
            gsap.to(
                this.scene.background,
                {
                    duration: 80,
                    ease: 'power2.inOut',
                    r: 0,
                    g: 0,
                    b: 0,
                    delay: 20
                }
            )
        })

    }
    setSky()
    {
        // Skybox

        this.sky = new Sky()
        this.sky.scale.setScalar( 45000000 )
        this.scene.add( this.sky )

        const skyUniforms = this.sky.material.uniforms

        skyUniforms[ 'turbidity' ].value = 10
        skyUniforms[ 'rayleigh' ].value = 2
        skyUniforms[ 'mieCoefficient' ].value = 0.005
        skyUniforms[ 'mieDirectionalG' ].value = 0.8
    }
}