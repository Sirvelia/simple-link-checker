import OutboundLinks from './OutboundLinks';
import InboundLinks from './InboundLinks';

export default function App({ postId }) {

    return (
        <div>
            <OutboundLinks postId={postId}/>
            <InboundLinks postId={postId}/>
        </div>
    );
    
}