/**
 * ChatBotConfiguration Component
 * 
 * This component configures the chatbot using react-chatbot-kit, defining the initial messages, custom widgets,
 * and the overall behavior of the chatbot. It uses a predefined bot name and custom messages tailored for
 * interpreting statistical results in a causal network context.
 * 
 * Usage:
 * Import this configuration into your chatbot component setup, typically where the Chatbot component is initialized.
 * 
 * Details:
 * - initialMessages: Array of messages pre-defined to be shown when the chatbot starts.
 * - botName: String representing the name given to the chatbot.
 * - state: Object to hold any required state-specific data for the chatbot.
 * - widgets: Array of widgets for interaction, configured with names, functionality, and necessary state mapping.
 * - customMessages: Object mapping type identifiers to custom message components, allowing for tailored responses.
 */

import React from 'react';
import { createCustomMessage } from 'react-chatbot-kit';
import CustomChatbotMessage from './CustomChatbotMessage';
import SendUserActionsButton from './SendUserActionsButton';

const botName = 'a configuration of chatGPT-4';
const intialMessage = `Hello, I am ${botName}. I am here to help translate and interpret some of the statistical results generated from the causal network.`;

const config = {
  initialMessages: [
    createCustomMessage("", "custom",{payload: { message: intialMessage }},
    {widget: "SendUserActionButton",
     })
  ],
  botName: "Chat",
    state:{
      sendUserActions: true,
    },
    widgets:[
      {
       widgetName: "SendUserActionButton",
       widgetFunc: (props) => <SendUserActionsButton {...props} />,
       mapStateToProps: ['sendUserActions'], 
      }
    ],
    customMessages: {
      custom: (props) => <CustomChatbotMessage {...props} messages={props.state.messages}/>,
    },
};

export default config;