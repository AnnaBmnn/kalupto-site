import * as THREE from 'three'
import Experience from '../Experience.js'

export default class Lyrics
{
    constructor()
    {
        this.experience = new Experience()

        // Elements HTML
        this.lyric = document.querySelector('.lyrics-container')
        this.paths = document.querySelectorAll('.lyrics')

        this.hideLyrics = this.hideLyrics.bind(this)
        this.hideLyrics2 = this.hideLyrics2.bind(this)

        this.setAnimations()

        this.experience.animations.on('animation-lyrics-start', ()=>{
            this.lyric.classList.add('show')
        })

        this.experience.animations.on('animation-lyrics-start-2', ()=>{
            this.lyric.classList.add('show')
        })
        this.experience.animations.on('animation-second-step', this.hideLyrics)
        this.experience.animations.on('animation-lyrics-end', this.hideLyrics2)
    }
    setAnimations()
    {
        for (let i = 0; i < this.paths.length; i++) {
            // this.paths[i].style.setProperty("--delay",   i* .06 + "s");
          }
    }
    hideLyrics()
    {

        window.setTimeout(() => {
            this.lyric.classList.remove('show')
            
        }, 10600);
    }
    
    hideLyrics2()
    {
        this.lyric.classList.remove('show')
            
    }
}