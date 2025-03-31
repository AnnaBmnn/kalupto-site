export default class Credits
{
    constructor()
    {
        // Elements HTML
        this.screen = document.querySelector('.js-about')
        this.button = document.querySelector('.js-about-button')

        // States
        this.isOpen = false

        // Binding
        this.toggleCredits = this.toggleCredits.bind(this)

        this.button.addEventListener('click', this.toggleCredits)

    }
    toggleCredits()
    {
        this.isOpen = !this.isOpen
        if(this.isOpen){
            this.screen.classList.add('show')
        }else {
            this.screen.classList.remove('show')

        }
    }
}