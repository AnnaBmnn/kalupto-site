export default class Splash
{
    constructor()
    {
        // Elements HTML
        this.screen = document.querySelector('.js-splash')
        this.button = document.querySelector('.js-remove-splash')

        // Binding
        this.onRemoveSplash = this.onRemoveSplash.bind(this)

        this.button.addEventListener('click', this.onRemoveSplash)

    }
    onRemoveSplash()
    {
        this.screen.classList.add('is-hidden')
    }
}