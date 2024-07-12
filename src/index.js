const { render } = wp.element;
import App from './components/App'

window.addEventListener( 'load', function () {
    console.log(document.getElementById('simple-link-checker-app'))
    render(<App/>, document.getElementById('simple-link-checker-app'));
}, false );