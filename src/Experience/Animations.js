import * as THREE from 'three'
import Experience from './Experience.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import gsap from 'gsap'
import EventEmitter from './Utils/EventEmitter.js'


export default class Animations  extends EventEmitter
{
    constructor()
    {
        super()

        this.experience = new Experience()
        this.camera = this.experience.camera
        this.scene = this.experience.scene
        this.world = this.experience.world
        this.resources = this.experience.resources

        // Wait for resources
        this.resources.on('ready', () =>
        {
            this.audio = this.world.audio.domAudio
            this.world.audio.domAudio.addEventListener('ended', () =>{
                this.resetAnim()
            })

        })




        this.animationCameraIndex = 0
        this.animationIndex = 0
        // s
        this.allTimingCameraAnimation = [
            0,
            // 109
        ]
        this.allTimingAnimation = [

            {
                // 1
                // timing: 3.0,
                timing: 18.5,
                eventName: 'animation-rott-and-wander'
            },
            {
                // 2
                timing: 88.0,
                // timing: 92.5,
                eventName: 'animation-explosion'
            },
            // {
            //     // 2
            //     // timing: 10.0,
            //     timing: 93.0,
            //     eventName: 'animation-explosion-bigger'
            // },
            {
                // 3
                // timing: 12.0,
                timing: 112.0,
                eventName: 'animation-under-water-bliss'
            },
            {
                // 4
                // timing: 20.0,
                timing: 160.0,
                eventName: 'animation-80-band'
            },
            {
                // 5
                // timing: 22.0,
                timing: 204.0,
                eventName: 'animation-outro'
            },
        ]
        this.animationsCamera = [
            {
                // 0
                x: 0.0,
                y: 0.0,
                z: 100,
                xRotation: 0,
                yRotation: 0,
                zRotation: 0,
                duration: 0.1
            }
        ]
        this.currentTimingAnimation = this.allTimingCameraAnimation[this.animationCameraIndex]
    }

    animateCamera()
    {
        gsap.to(
            this.camera.instance.position,
            {
                duration: this.animationsCamera[this.animationCameraIndex].duration,
                ease: 'power4.inOut',
                x: this.animationsCamera[this.animationCameraIndex].x,
                y: this.animationsCamera[this.animationCameraIndex].y,
                z: this.animationsCamera[this.animationCameraIndex].z,
            }
        )
        gsap.to(
            this.camera.instance.rotation,
            {
                duration: this.animationsCamera[this.animationCameraIndex].duration,
                ease: 'power4.inOut',
                x: this.animationsCamera[this.animationCameraIndex].xRotation,
                y: this.animationsCamera[this.animationCameraIndex].yRotation,
                z: this.animationsCamera[this.animationCameraIndex].zRotation,
            }
        )
    }

    setNextAnimation()
    {
        this.animationCameraIndex += 1
        if(this.allTimingCameraAnimation[this.animationCameraIndex])
        {
            this.currentTimingAnimation = this.allTimingCameraAnimation[this.animationCameraIndex]
        } else 
        {
            this.currentTimingAnimation = null 
        }
    }
    resetAnim()
    {

        this.animationCameraIndex = 0
        this.animationIndex = 0
        this.currentTimingAnimation = this.allTimingCameraAnimation[this.animationCameraIndex]
        // this.camera.instance.position.set(
        //     -0.03488971620850754,
        //     -3.3098271974449474,
        //     -3.95354847278136
        // )
        // this.camera.instance.rotation.set(
        //     2.5305714981683534,
        //     -0.006047485185266618,
        //     3.1373568046700346
        // )
    }
    checkIfCurrentAnimation()
    {
        if(this.animationCameraIndex < this.animationsCamera.length && this.audio.currentTime >= this.currentTimingAnimation )
        {

            this.animateCamera()
            this.setNextAnimation()
        }

        if(this.animationIndex < this.allTimingAnimation.length){

            if(this.audio.currentTime >= this.allTimingAnimation[this.animationIndex].timing)
            {
                this.trigger(this.allTimingAnimation[this.animationIndex].eventName)
                this.animationIndex += 1
            }
        }

    }

    update()
    {
        if(this.audio)
        {
            // if(this.currentTimingAnimation)
            // {
            if(this.world.audio.state === 'playing'){

                this.checkIfCurrentAnimation()
            }
            // }
        }

    }
}