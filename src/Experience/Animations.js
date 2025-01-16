import * as THREE from 'three'
import Experience from './Experience.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import gsap from 'gsap'

export default class Animations
{
    constructor()
    {
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
            console.log(this.world.audio.domAudio)
            this.world.audio.domAudio.addEventListener('ended', () =>{
                console.log('ici')
                this.resetAnim()
            })
        })


        this.animationIndex = 0
        // s
        this.allTimingAnimation = [
            7.6,
            17.5,
            28,
            45,
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
                // 45
                x: -1.5188378497841581,
                y: 1.0954093163298464,
                z: 42.694385332373145,
                xRotation: -0.025651340118769773,
                yRotation: -0.035547961670017905,
                zRotation: -0.0009118605773534697,
                duration: 8
            },

        ]
        this.currentTimingAnimation = this.allTimingAnimation[this.animationIndex]
    }

    animateCamera()
    {
        gsap.to(
            this.camera.instance.position,
            {
                duration: this.animationsCamera[this.animationIndex].duration,
                ease: 'power4.inOut',
                x: this.animationsCamera[this.animationIndex].x,
                y: this.animationsCamera[this.animationIndex].y,
                z: this.animationsCamera[this.animationIndex].z,
            }
        )
        gsap.to(
            this.camera.instance.rotation,
            {
                duration: this.animationsCamera[this.animationIndex].duration,
                ease: 'power4.inOut',
                x: this.animationsCamera[this.animationIndex].xRotation,
                y: this.animationsCamera[this.animationIndex].yRotation,
                z: this.animationsCamera[this.animationIndex].zRotation,
            }
        )
    }

    setNextAnimation()
    {
        this.animationIndex += 1
        if(this.allTimingAnimation[this.animationIndex])
        {
            this.currentTimingAnimation = this.allTimingAnimation[this.animationIndex]
        } else 
        {
            this.currentTimingAnimation = null 
        }
    }
    resetAnim()
    {

        this.animationIndex = 0
        this.currentTimingAnimation = this.allTimingAnimation[this.animationIndex]
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