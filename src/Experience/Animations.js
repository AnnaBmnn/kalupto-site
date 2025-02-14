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
            console.log('ready')
            this.audio = this.world.audio.domAudio
            this.world.audio.domAudio.addEventListener('ended', () =>{
                this.resetAnim()
            })
        })


        this.animationCameraIndex = 0
        this.animationIndex = 0
        // s
        this.allTimingCameraAnimation = [
            7.6,
            17.5,
            28,
            36,
            47,
        ]
        this.allTimingAnimation = [
            {
                timing: 47,
                eventName: 'animation-second-step'
            },
        ]
        this.animationsCamera = [
            {
                // 7.8
                x: 0.3808333260338206,
                y: -4.116371661838657,
                z: -5.635623280722066,
                xRotation: 2.51074099480408,
                yRotation: 0.05451533552399793,
                zRotation: -3.10181427932108,
                duration: 3
            },
            {
                // 17.5
                x: 0.5568795805606047,
                y: -7.476699297650231,
                z: -8.24078460917381,
                xRotation: -0.0256513528116189,
                yRotation: -0.03554797026364589,
                zRotation: -0.0009118612491070096,
                duration: 2.5
            },
            {
                // 29
                x: -0.157865549100623,
                y: -16.408313895182953,
                z: -14.101989538962583,
                xRotation: 2.4047700057437735,
                yRotation: 0.05000557347834436,
                zRotation: -3.0962735560522296,
                duration: 2.5
            },
            {
                // 40
                x: -0.25176999999999816,
                y: -26.168514,
                z: -22.49030599999999,
                xRotation: 2.2807461744793236,
                yRotation: -0.007296463658920518,
                zRotation: 3.133103159041517,
                duration: 8
            },
            {
                // 45
                x: -1.5188378497841581,
                y: 1.0954093163298464,
                z: 42.694385332373145,
                xRotation: -0.025651340118769773,
                yRotation: -0.035547961670017905,
                zRotation: -0.0009118605773534697,
                duration: 7
            },

        ]
        this.currentTimingAnimation = this.allTimingCameraAnimation[this.animationCameraIndex]
    }

    animateCamera()
    {
        console.log('animate camera')
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
        this.camera.instance.position.set(
            -0.03488971620850754,
            -3.3098271974449474,
            -3.95354847278136
        )
        this.camera.instance.rotation.set(
            2.5305714981683534,
            -0.006047485185266618,
            3.1373568046700346
        )
    }
    checkIfCurrentAnimation()
    {

        if(this.audio.currentTime >= this.currentTimingAnimation )
        {
            this.animateCamera()
            this.setNextAnimation()
        }

        if(this.animationIndex < this.allTimingAnimation.length){
            if(this.audio.currentTime >= this.allTimingAnimation[this.animationIndex].timing)
            {
                this.trigger(this.allTimingAnimation[this.animationIndex].eventName)
                this.animationIndex += 1
                console.log('ICI')
            }
        }

    }

    update()
    {
        if(this.audio)
        {

            if(this.currentTimingAnimation)
            {

                this.checkIfCurrentAnimation()
            }
        }

    }
}