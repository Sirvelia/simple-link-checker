import Alpine from 'alpinejs'
import outboundLinks from './data/outboundLinks'

window.addEventListener('DOMContentLoaded', () => {
    outboundLinks()
    Alpine.start()
});