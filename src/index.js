import { createRoot } from 'react-dom';
import App from './components/App'

window.addEventListener( 'load', function () {
    const root = createRoot(document.getElementById('simple-link-checker-app'));

    root.render(<App />);
}, false );