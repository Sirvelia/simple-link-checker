const { render } = wp.element;
import App from './components/App'

window.addEventListener( 'load', function () {
    const container = document.getElementById('simple-link-checker-app');
    
    if (container) {
        const postId = container.getAttribute('data-post-id');
        render(<App postId={postId}/>, container);
    }
}, false );