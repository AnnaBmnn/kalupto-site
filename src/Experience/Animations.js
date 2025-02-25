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
        //     7.6,
            17.5,
            // 28,
            36,
            47,
        //     65,
            108.5
        ]
        this.allTimingAnimation = [
            {
                timing: 8.6,
                eventName: 'animation-step-one-end-one'
            },
            {
                timing: 8.6,
                eventName: 'animation-step-one-end-two'
            },
            {
                timing: 36,
                eventName: 'animation-step-one-respi'
            },
            {
                timing: 47,
                eventName: 'animation-second-step'
            },
        ]
        this.animationsCamera = [
            // {
            //     // 7.8
            //     x: 0.3808333260338206,
            //     y: -4.116371661838657,
            //     z: -5.635623280722066,
            //     xRotation: 2.51074099480408,
            //     yRotation: 0.05451533552399793,
            //     zRotation: -3.10181427932108,
            //     duration: 3
            // },
            {
                // 17.5
                x: -0.23106710191415267,
                y: -4.568926426545236,
                z: -2.37870515178001,
                xRotation: 2.050808812413357,
                yRotation: -0.04482819088302481,
                zRotation: 3.055728841713903,
                duration: 3.5
            },
            // {
            //     // 29
            //     x: -0.0016189926816755022,
            //     y: -6.298464155607868,
            //     z: -0.19042595527136175,
            //     xRotation: 1.6010208110599313,
            //     yRotation: -0.0002569277740684537,
            //     zRotation: 3.133094796509806,
            //     duration: 2.5
            // },
            {
                // 36
                x: -0.25176999999999816,
                y: -26.168514,
                z: -16.49030599999999,
                xRotation: 2.2807461744793236,
                yRotation: -0.007296463658920518,
                zRotation: 3.133103159041517,
                duration: 8
            },
            {
                // 47
                x: 0.5885196280063759,
                y: -7.459538307170829,
                z: 4.840980315830795,
                xRotation: 0.9951489446651853,
                yRotation: 0.06608384757973242,
                zRotation: -0.10140644768587119,
                duration: 7
            },
            // {
            //     // 70
            //     x: 0.4037481071254601,
            //     y: -43.31506512193883,
            //     z: -48.101844332011645,
            //     xRotation: 2.4085087900846265,
            //     yRotation: 0.0062373307374652956,
            //     zRotation: -3.1359761164660243,
            //     duration: 15
            // },
            {
                // 108
                x: -0.8475996027827574,
                y: 3.8449413740002845,
                z: -70.8831670680309,
                xRotation: 3.0909667227169484,
                yRotation: -0.011155023740283846,
                zRotation: -0.1410274489483117,
                duration: 12
            }
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
        if(this.animationCameraIndex < this.animationsCamera.length && this.audio.currentTime >= this.currentTimingAnimation )
        {
            console.log(this.animationCameraIndex)

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

                this.checkIfCurrentAnimation()
            // }
        }

    }
}