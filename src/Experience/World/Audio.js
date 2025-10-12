import * as THREE from 'three'
import Experience from '../Experience.js'
import EventEmitter from '../Utils/EventEmitter.js'


export default class Audio extends EventEmitter
{
    constructor()
    {
        super()

        this.experience = new Experience()

        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.debug = this.experience.debug
        this.domAudio = document.querySelector('.js-audio')
        this.domButtons = document.querySelectorAll('.js-play-audio')

        this.state = 'playing'
        this.frequenceAverage = 0


        this.onTimeUpdate = this.onTimeUpdate.bind(this)
        // Debug
        if(this.debug.active)
        {
            this.debugFolder = this.debug.ui.addFolder('Audio')
        }

        // Resource
        for(let i = 0; i < this.domButtons.length; i++ )
        {
            this.domButtons[i].addEventListener('click', ()=>{
                console.log('click')

                if(!this.audioCtx){
                    this.setAnalyzer()
                } 
                if(this.domAudio.paused){

                    this.domAudio.play()
                } else {  
                    this.domAudio.pause()

                }
            })
        }

        this.domAudio.addEventListener('timeupdate', this.onTimeUpdate)
        this.domAudio.addEventListener('ended', ()=>{
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
    getAverage(array, indexStart, indexEnd) 
    {
        // const longueur = array.length;
        let value = 0;
        for ( let i = indexStart; i < indexEnd; i ++) {
            value += array[i];
        }
        return value / (indexEnd - indexStart)
    }
    update()
    {
        if(this.analyser){
            this.analyser.getByteFrequencyData(this.dataArray)
            this.frequenceAverage = this.state === 'resting' ? 20 + 1.8 * this.getAverage(this.dataArray, 0, this.dataArray.length) : this.getAverage(this.dataArray, 0, this.dataArray.length)
            this.frequenceBassAverage = this.getAverage(this.dataArray, 0, 20) * 2
            this.frequenceMidAverage = this.getAverage(this.dataArray,  20, 40) * 2
            this.frequenceHightAverage = this.getAverage(this.dataArray, 40, 60) * 2

            console.log(this.frequenceHightAverage)
            // this.frequenceAverage = this.dataArray[100]
        }

    }
}