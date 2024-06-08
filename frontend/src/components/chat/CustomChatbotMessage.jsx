/**
 * CustomChatbotMessage Component
 * 
 * This component renders the most recent message from the chatbot using Markdown formatting. It is designed
 * to display chatbot messages in a styled format, enhancing the visual presentation of chatbot interactions.
 * The message content is dynamically retrieved from the state, ensuring that the latest message is always displayed.
 * 
 * Props:
 * - state: object | Contains the chatbot's message history and other relevant state data.
 * - setState: function | A callback to update the state, though it is not directly used in this component.
 * 
 * Usage:
 * <CustomChatbotMessage state={state} setState={setState} />
 * Where `state` is an object that includes the chatbot's messages array and `setState` is the function to manage state updates.
 * 
 * Styles:
 * - The component utilizes a CSS class `CustomChatbotMessageHeader` for styling the header and `CustomChatbotMessage` for the message body.
 * - `Markdown` from `react-markdown` is used to render the message content, allowing for rich text formatting and customization.
 */

import React from 'react';
import Markdown from 'react-markdown';
import './CustomChatbotMessageStyle.css';

const CustomChatbotMessage = (props,{messages}) => {
  let m = null;
  if (props.payload){
    m = props.payload.message;
  }

  return (
    <>
      <div>
        <h3 className='CustomChatbotMessageHeader'> assistant:</h3>
      </div>
      <Markdown className="CustomChatbotMessage">
        {m}
        </Markdown>
    </>
  );
};

export default CustomChatbotMessage;