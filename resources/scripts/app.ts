import Alpine from 'alpinejs'
import outboundLinks from './data/outboundLinks'
import inboundLinks from './data/inboundLinks'

window.addEventListener('DOMContentLoaded', () => {
    outboundLinks()
    inboundLinks()
    Alpine.start()
});