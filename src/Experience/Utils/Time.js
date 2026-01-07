import EventEmitter from './EventEmitter.js'
import Experience from '../Experience.js'

export default class Time extends EventEmitter
{
    constructor()
    {
        super()

        // Setup
        this.start = Date.now()
        this.current = this.start
        this.elapsed = 0
        this.delta = 16
        this.hasStart = true

        this.tick()

        window.requestAnimationFrame(() =>
        {
            this.tick()
        })
    }

    tick()
    {
        if(this.hasStart){
            const currentTime = Date.now()
            this.delta = currentTime - this.current
            this.current = currentTime
            this.elapsed = this.current - this.start
        }
        this.trigger('tick')

        window.requestAnimationFrame(() =>
        {
            this.tick()
        })
        
    }
}