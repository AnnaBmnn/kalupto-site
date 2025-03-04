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
            7.0,
            15.5,
            27,
            36,
            47,
            63,
            76,
            98,
            // 109
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
                x: 0.8039905763962557,
                y: 0.9723316816118244,
                z: -7.709605957679526,
                xRotation: -3.016135530204601,
                yRotation: 0.10309780774103418,
                zRotation: 3.1286137602939648,
                duration: 4.5
            },
            {
                // 17.5
                x: -0.1688190001454601,
                y: -4.376023982912357,
                z: -7.702506009704813,
                xRotation: 2.6249367621353117,
                yRotation: -0.01905435645126834,
                zRotation: 3.1307683817368614,
                duration: 4.5
            },
            {
                // 29
                x: -0.06305390318082914,
                y: -8.068487017624127,
                z: -3.968364918038606,
                xRotation: 2.027890686644305,
                yRotation: -0.007012439610756865,
                zRotation: 3.127336031002351,
                duration: 4.5
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
            {
                // 63
                x: -0.8137422881169089,
                y: -8.64166483187242,
                z: 8.321897465339713,
                xRotation:  0.8042461797805195,
                yRotation: -0.0677240618273677,
                zRotation: 0.07015726672096667,
                duration: 7
            },
            {
                // 75
                x: 0.6684152643195791,
                y: -23.125865002474615,
                z: 10.924142688771918,
                xRotation: 1.1294897333672764,
                yRotation: 0.02612831013687288,
                zRotation: -0.055249749575135926,
                duration: 8
            },
            {
                // 92
                x: -5.819030870459607,
                y: -134.07636028093694,
                z: 45.00404908280245,
                xRotation: 1.2469533835764062,
                yRotation:-0.04112168008428243,
                zRotation: 0.1218685228114564,
                duration: 18
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
            console.log(this.animationCameraIndex)

            this.animateCamera()
            this.setNextAnimation()
        }

        if(this.animationIndex < this.allTimingAnimation.length){

            if(this.audio.currentTime >= this.allTimingAnimation[this.animationIndex].timing)
            {
                console.log('HERE ?')
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