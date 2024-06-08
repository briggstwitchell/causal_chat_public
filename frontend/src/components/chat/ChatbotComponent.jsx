/**
 * ChatbotComponent Component
 * 
 * This component encapsulates the Chatbot from 'react-chatbot-kit', providing a chat interface
 * based on specified settings. 
 * 
 * Props:
 * - display: boolean | Determines whether the chatbot is visible or hidden based on its value.
 * 
 * Usage:
 * <ChatbotComponent display={true} />
 * Where `display` is a boolean that controls the visibility of the chatbot interface.
 * 
 * Styles:
 * - Uses `chat-visible` and `chat-hidden` CSS classes to show or hide the chatbot based on the `display` state.
 * 
 * Components:
 * - Chatbot: The chatbot UI component from 'react-chatbot-kit' is configured with custom configurations, action providers,
 *   and message parsers that define the chatbot's behavior and interactions.
 */

import React, {useState, useEffect} from 'react';
import Chatbot from 'react-chatbot-kit';
import 'react-chatbot-kit/build/main.css';
import config  from './config';
import ActionProvider from './ActionProvider';
import MessageParser from './MessageParser';
import './chatStyle.css';

const ChatbotComponent = ({display}) => {
    const chatClass = display ? 'chat-visible' : 'chat-hidden';
    const [modifiedConfig, setModifiedConfig] = useState(config);

    return (
        <div className={chatClass}>
            <Chatbot 
                config={modifiedConfig}
                messageParser={MessageParser}
                actionProvider={ActionProvider}
                headerText="Chat"
            />
        </div>
    );
}

export default ChatbotComponent;
