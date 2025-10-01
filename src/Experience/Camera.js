import * as THREE from 'three'
import Experience from './Experience.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

export default class Camera
{
    constructor()
    {
        this.experience = new Experience()
        this.sizes = this.experience.sizes
        this.scene = this.experience.scene
        this.canvas = this.experience.canvas

        this.setInstance()
        this.setControls()
        // this.setButtonDebug()

        // on end audio 
    }
    setInstance()
    {
        this.instance = new THREE.PerspectiveCamera(80, this.sizes.width / this.sizes.height, 0.01, 300)
        this.instance.position.set(
            0,
            0,
            10
        )
        this.instance.rotation.set(
            0,
            0,
            0
        )
        this.scene.add(this.instance)
    }

    setControls()
    {
        this.controls = new OrbitControls(this.instance, this.canvas)
        this.controls.enableDamping = true
        this.controls.maxDistance = 160

    }
    
    setButtonDebug()
    {
        this.buttonShowCamera = document.querySelector('.js-debug-camera')

        this.buttonShowCamera.addEventListener('click', ()=>{
            console.log(this.instance.position)
            console.log(this.instance.rotation)
        })
    }

    resize()
    {
        this.instance.aspect = this.sizes.width / this.sizes.height
        this.instance.updateProjectionMatrix()
    }

    update()
    {
        this.controls.update()
    }
}