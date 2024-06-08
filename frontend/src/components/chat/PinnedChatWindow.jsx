/**
 * PinnedChatWindow Component
 * 
 * This component renders a chat window that can be toggled open or closed, and integrates a chatbot component.
 * It provides controls to open or close the chat window and to toggle sending user actions. The state of the
 * chat window (open or closed) and the option to send user actions are managed with local state hooks.
 * 
 * Props:
 * - ChatbotComponent: React component | The chatbot component to be displayed within the chat window.
 * 
 * Usage:
 * <PinnedChatWindow ChatbotComponent={YourChatbotComponent} />
 * Where `YourChatbotComponent` is a React component designed to handle chat interactions.
 * 
 * Styles:
 * - The chat window is fixed at the bottom-right of the viewport, with CSS classes for shadows and transitions applied.
 * - Includes buttons to toggle the chat window and user action sending, styled with FontAwesome icons.
 */

import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment, faX } from '@fortawesome/free-solid-svg-icons';
import './chatToolsStyle.css';

const PinnedChatWindow = ({ChatbotComponent}) => {

const [isOpen, setIsOpen] = useState(true);
const toggleChatOpenClose = () => { 
    setIsOpen((prev)=>!prev);
};

const [sendActions, setSendActions] = useState(false);
const toggleSendActions = () => { 
    setSendActions((prev)=>!prev);
};

const chatVisibleCssClass = isOpen ? 'chat-visible' : 'chat-hidden';
const chatVisibleCssClassInverse = isOpen ?  'chat-hidden': 'chat-visible';

return (
    <div style={{ position: 'fixed', bottom: '20px', right: '20px', }}>
        <div className="shadow-2xl">
            <ChatbotComponent display={isOpen} sendUserActions={sendActions} />
            <button
                onClick={toggleChatOpenClose}
                className={`absolute top-0 right-0 mt-1 mr-1 px-2 py-2 bg-transparent hover:bg-gray-400 text-gray-800 hover:text-white font-semibold rounded transition duration-150 ease-in-out text-xs ${chatVisibleCssClass}`}
                style={{ width: '30px', height: '30px' }}
            >
                <FontAwesomeIcon icon={faX} />
            </button>
            
            <button
                onClick={toggleChatOpenClose}
                className={`px-4 py-2 bg-blue-500 hover:bg-blue-700 text-white font-bold rounded-full shadow-md hover:shadow-lg transition duration-150 ease-in-out ${chatVisibleCssClassInverse}`}
            >
            <FontAwesomeIcon icon={faComment} />    
            </button>

        </div>
    </div>
);
}

export default PinnedChatWindow;