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
            15.5,
            27,
            36,
            47,
        //     65,
            92
            // 112
        ]
        this.allTimingAnimation = [
            {
                timing: 1.5,
                eventName: 'animation-step-one-begin'
            },
            {
                timing: 8.6,
                eventName: 'animation-step-one-end-one'
            },
            {
                timing: 16.5,
                eventName: 'animation-step-one-end-two'
            },
            {
                timing: 38.7,
                eventName: 'animation-step-one-respi'
            },
            {
                timing: 47,
                eventName: 'animation-second-step'
            },
            {
                timing: 92,
                eventName: 'animation-third-step'
            },
            {
                timing: 98,
                eventName: 'animation-fourth-step'
            },
        ]
        this.animationsCamera = [
            {
                // 7.8
                x: 0.5631214601611035,
                y: -2.617606050283056,
                z: -6.456069361541089,
                xRotation: 2.7563978153521416,
                yRotation: 0.08065692809882678,
                zRotation: -3.108937451437602,
                duration: 3.5
            },
            {
                // 17.5
                x: 0.12903942593486345,
                y: -6.681174205531279,
                z: -8.816836018887912,
                xRotation: 2.493134353996446,
                yRotation: 0.011664252979445778,
                zRotation: -3.1327542097765217,
                duration: 3.5
            },
            {
                // 29
                x: 0.09139700000052704,
                y: -14.07673100000121,
                z: -13.534689999998736,
                xRotation: 2.3365659681435043,
                yRotation: 0.004680274679780486,
                zRotation: -3.1367249981945,
                duration: 8
            },
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
            // {
            //     // 45
            //     x: -1.5188378497841581,
            //     y: 1.0954093163298464,
            //     z: 42.694385332373145,
            //     xRotation: -0.025651340118769773,
            //     yRotation: -0.035547961670017905,
            //     zRotation: -0.0009118605773534697,
            //     duration: 8
            // },
            {
                // 47
                x: 2.148939808200018,
                y: -1.039870085182439,
                z: 25.47331996205237,
                xRotation: 0.0408037304345009,
                yRotation: 0.08409138336362511,
                zRotation: -0.0034290895023416233,
                duration: 8
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
                // 92
                x: 2.9493436304834812,
                y: -100.2798654676241,
                z: 33.797661201595208,
                xRotation: 1.2427260269878113,
                yRotation: 0.028045322575490406,
                zRotation: -0.0822000892839695,
                duration: 15
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