import * as THREE from 'three'
import Experience from '../Experience.js'

export default class Audio 
{
    constructor()
    {
        // super()

        this.experience = new Experience()

        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.debug = this.experience.debug
        this.domAudio = document.querySelector('.js-audio')
        this.domButton = document.querySelector('.js-play-audio')

        this.onTimeUpdate = this.onTimeUpdate.bind(this)

        // Debug
        if(this.debug.active)
        {
            this.debugFolder = this.debug.ui.addFolder('Audio')
        }

        // Resource
        this.domButton.addEventListener('click', ()=>{

            if(!this.audioCtx){
                this.setAnalyzer()
            } 
            if(this.domAudio.paused){
                // this.domAudio.currentTime = 40
                this.domAudio.play()
                this.domButton.innerHTML = 'pause'
            }else {
                this.domAudio.pause()
                this.domButton.innerHTML = 'play'

            }
            


        })
        this.domAudio.addEventListener('timeupdate', this.onTimeUpdate)
        this.domAudio.addEventListener('ended', ()=>{
            console.log('ended')
            this.domAudio.play()
        })

    }

    setAnalyzer(){
        if(!this.audioCtx){
            this.audioCtx = new (window.AudioContext || window.webkitAudioContext)()
            this.source = this.audioCtx.createMediaElementSource(this.domAudio)
    
            // Create an analyser
            this.analyser = this.audioCtx.createAnalyser()
            this.analyser.fftSize = 256
            this.bufferLength = this.analyser.frequencyBinCount
            this.dataArray = new Uint8Array(this.bufferLength)
        
            // Connect part
            this.source.connect(this.analyser);
            this.analyser.connect(this.audioCtx.destination);
        }
    }
    onTimeUpdate()
    {
        if(this.domAudio)
        {
            // console.log(this.domAudio.currentTime)
        }
        // const _index = Math.floor(Math.random() * this.audiosSrc.length);
        // this.setAudio(_index)
    }
    getAverage(array) 
    {
        let i = 0;
        const longueur = array.length;
        let value = 0;
        while (i < longueur) {
            value += array[i];
            i++
        }
        return value / longueur
    }
    update()
    {
        if(this.analyser){
            this.analyser.getByteFrequencyData(this.dataArray)
            // console.log(this.dataArray[100])
            this.frequenceAverage = this.getAverage(this.dataArray)
            // this.frequenceAverage = this.dataArray[100]
        }

    }
}