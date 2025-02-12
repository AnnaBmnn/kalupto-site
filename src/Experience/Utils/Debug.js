import GUI from 'lil-gui'
import Stats from 'stats.js'


export default class Debug
{
    constructor()
    {
        this.active = window.location.hash === '#debug'

        if(this.active)
        {
            // GUI
            this.ui = new GUI()

            // Stat fps
            this.stats = new Stats()
            this.stats.showPanel(0) // 0: fps, 1: ms, 2: mb, 3+: custom
            document.body.appendChild(this.stats.dom)
        }

    }
}