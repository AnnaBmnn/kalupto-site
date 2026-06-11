import Experience from '../Experience.js'
import Environment from './Environment.js'
// import Floor from './Floor.js'
// import Fox from './Fox.js'
import Ear from './Ear.js'
import Rocks from './Rocks.js'
import Snow from './Snow.js'

import Plans from './Plans.js'
import Paper from './Paper.js'
// import Plan from './Plan.js'
import Videos from './Videos.js'
import Audio from './Audio.js'
import Lyrics from './Lyrics.js'



export default class World
{
    constructor()
    {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources

        // Wait for resources
        this.resources.on('ready', () =>
        {
            // Setup
            // this.floor = new Floor()
            // this.fox = new Fox()
            // this.mask = new Mask()
            // this.mountain = new Mountain()
            // this.snow = new Snow()
            this.environment = new Environment()


            // this.paper = new Paper()
            // this.plans = new Plans()
            // this.plan = new Plan()
            // this.lyrics = new Lyrics()
            // this.videos = new Videos()

            this.ear = new Ear()

            // this.audio = new Audio()

        })
    }

    update()
    {
        if(this.paper)
            this.paper.update()
        if(this.plans)
            this.plans.update()
        if(this.plan)
            this.plan.update()
        if(this.videos)
            this.videos.update()
        if(this.snow)
            this.snow.update()
        if(this.audio)
            this.audio.update()
    }
}