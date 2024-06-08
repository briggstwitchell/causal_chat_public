/**
 * NetworkChatContainer Component
 * 
 * This component serves as a container that integrates the network visualization and chat functionalities. 
 * It displays the BayesianNetwork component for rendering the causal model and a chat interface through the PinnedChatWindow.
 * 
 * Props:
 * - elements: Array | The array of elements (nodes and edges) used in the BayesianNetwork.
 * - setElements: Function | A callback function to update the elements in the BayesianNetwork.
 * - userUpdates: Object | An object containing user-specific updates or metadata.
 * - setUserUpdates: Function | A function to update the user-specific updates or metadata.
 * 
 * Usage:
 * <NetworkChatContainer 
 *     elements={networkElements}
 *     setElements={handleSetElements}
 *     userUpdates={userSpecificUpdates}
 *     setUserUpdates={handleUserUpdates}
 * />
 * Where `networkElements` is the initial array of elements for the network,
 * `handleSetElements` updates the network elements,
 * `userSpecificUpdates` contains any user-specific data or actions, and
 * `handleUserUpdates` manages updates to this user data.
 */

import PinnedChatWindow from './chat/PinnedChatWindow';
import BayesianNetwork from './BayesianNetwork';
import ChatbotComponent from './chat/ChatbotComponent';
import TrackActionsButton from './TrackActionsButton';

const NetworkChatContainer = ({ elements, setElements, userUpdates, setUserUpdates,elementStyle, onUpdateNetwork ,keyContents}) => {

    return (
        <div className="mx-auto w-4/5">
            <TrackActionsButton/>
            <BayesianNetwork
                elements={elements} setElements={setElements}
                userUpdates={userUpdates} setUserUpdates={setUserUpdates}  
                elementStyle={elementStyle}
                onUpdateNetwork={onUpdateNetwork}
                keyContents={keyContents}
            />
            <PinnedChatWindow ChatbotComponent={ChatbotComponent}/>
        </div>
    );
}

export default NetworkChatContainer;
