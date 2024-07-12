const { render } = wp.element;
import App from './components/App'

window.addEventListener( 'load', function () {
    render(<App/>, document.getElementById('simple-link-checker-app'));
}, false );