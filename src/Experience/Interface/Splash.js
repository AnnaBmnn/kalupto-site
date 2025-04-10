export default class Splash
{
    constructor()
    {
        // Elements HTML
        this.screen = document.querySelector('.js-splash')
        this.button = document.querySelector('.js-remove-splash')
        this.restart = document.querySelector('.js-splash-restart')

        // Binding
        this.onRemoveSplash = this.onRemoveSplash.bind(this)

        this.button.addEventListener('click', this.onRemoveSplash)
        this.restart.addEventListener('click', ()=>{
            location.reload();
        })

    }
    onRemoveSplash()
    {
        this.restart.classList.add('show')
        this.screen.classList.add('is-hidden')
        document.body.classList.add('play')
    }
}