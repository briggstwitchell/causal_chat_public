/**
 * MessageParser Component
 * 
 * This component is designed to provide parsing functionality to its child components, allowing them to handle
 * user chat messages effectively. It accepts a message and uses an action handler to process the message.
 * The component uses React's context feature to pass down the `parse` function and `actions` object to its children.
 * 
 * Props:
 * - state: object | The current state of the chatbot, though it is not directly used in this component.
 * - children: ReactNode | Child components that can receive the parsing functionality.
 * - actions: object | Contains methods such as `handleUserChatMessage` that perform actions based on parsed messages.
 * 
 * Usage:
 * <MessageParser state={state} actions={actions}>
 *   <YourChildComponent />
 * </MessageParser>
 * Where `YourChildComponent` is a component that requires message parsing functionality.
 * 
 * Functions:
 * - parse: A method provided to children that triggers `handleUserChatMessage` from `actions` based on the given message.
 */

import React from 'react';

const MessageParser = ({ state,children, actions }) => {

  const parse = (message, sendUserActions) => {
    actions.handleUserChatMessage(message);
  };

  return (
    <div>
      {React.Children.map(children, (child) => {
        return React.cloneElement(child, {
          parse: parse,
          actions,
        });
      })}
    </div>
  );
};

export default MessageParser;

