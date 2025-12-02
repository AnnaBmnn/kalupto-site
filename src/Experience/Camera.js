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

        this.frustumSize = 5

        this.setInstance()
        this.setControls()
        // this.setButtonDebug()

        // on end audio 
    }
    setInstance()
    {
        const aspect = this.sizes.width / this.sizes.height;

        this.instance = new THREE.OrthographicCamera(
            -this.frustumSize * aspect / 2,
            this.frustumSize * aspect / 2,
            this.frustumSize / 2,
            -this.frustumSize / 2,
            1,
            1000
        )

        this.instance.position.set(
            0,
            0,
            6
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
        const aspect = this.sizes.width / this.sizes.height;

        this.instance.left   = -this.frustumSize * aspect / 2;
        this.instance.right  =  this.frustumSize * aspect / 2;
        this.instance.top    =  this.frustumSize / 2;
        this.instance.bottom = -this.frustumSize / 2;

        this.instance.updateProjectionMatrix();

    }

    update()
    {
        if(this.controls)
            this.controls.update()
    }
}