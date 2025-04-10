export default class Tooltip
{
    constructor()
    {
        // Elements HTML
        this.screen = document.querySelector('.js-tooltip')
        this.button = document.querySelector('.js-tooltip-button')

        // States
        this.isOpen = false

        this.toggle = this.toggle.bind(this)
        

        this.button.addEventListener('click', this.toggle, {once : true})
        this.screen.addEventListener('click', ()=>{
            this.screen.classList.remove('show')
        })


    }
    toggle()
    {
        window.setTimeout(() => {
            this.screen.classList.add('show')
            window.setTimeout(() => {
                this.screen.classList.remove('show')

            }, 12000);
            
        }, 12000);
    }
}