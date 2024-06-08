import io from 'socket.io-client';
import React, { useEffect, useState } from 'react';
import { createCustomMessage } from 'react-chatbot-kit';

/**
 * ActionProvider Component
 * 
 * This component manages the interaction with a server through WebSocket using 'socket.io-client'.
 * It integrates socket communications within the chatbot environment provided by 'react-chatbot-kit'.
 * 
 * Props:
 * - createChatBotMessage: Function | Used to create chatbot messages.
 * - setState: Function | Function to update the state of the chat component.
 * - children: ReactNode | The children elements that may require access to the action methods.
 * - state: Object | Contains the state of the chat including user interactions.
 * 
 * Usage:
 * <ActionProvider createChatBotMessage={createChatBotMessage} setState={setState} children={children} state={state} />
 * Where each prop provides necessary configurations and state handling capabilities.
 * 
 * Features:
 * - Initializes a WebSocket connection on component mount.
 * - Listens for 'response_message' from the server and updates the chatbot state with received messages.
 * - Provides a function to handle user messages, which emits user messages to the server.
 * - Passes action methods to children elements, allowing child components to trigger actions.
 * 
 * Notes:
 * - Ensure WebSocket server address is correctly configured.
 * - Proper cleanup by disconnecting from WebSocket on component unmount.
 */
const ActionProvider = ({ createChatBotMessage, setState, children, state}) => {
  // State to store the socket instance
  const [socket, setSocket] = useState(null);
  const {sendUserActions} = state;
  const baseURLSocket = `${import.meta.env.VITE_REACT_APP_BACKEND_URL_SOCKET}:${import.meta.env.VITE_REACT_APP_BACKEND_PORT}`||"ws://127.0.0.1:8000";

  useEffect(() => {
    // Initialize socket connection
    const socketInstance = io(baseURLSocket); 

    socketInstance.on('connect', () => {
      // socketInstance.emit('simple_message', {text: 'Hello, server!'});
      console.log('Connected to server websocket');
    });

    socketInstance.on('response_message', (data) => {
      const botMessage = createCustomMessage(data.data, 'custom',{payload: { message: data.data }},{loading:true},{delay:10});
      // Update the chatbot state with the new message
      setState((prev) => ({
        ...prev,
        messages: [...prev.messages, botMessage],
        // sendUserActions: true,
      }));
    });

    // Store the socket instance in state
    setSocket(socketInstance);

    // Cleanup on component unmount
    return () => {
      socketInstance.disconnect();
    };
  }, [createChatBotMessage, createCustomMessage,setState]);

  const handleUserChatMessage = (message) => {
    // Check if socket is initialized before trying to emit
    if (socket) {
      socket.emit('user_message', {message: message, sendUserActions: sendUserActions});
    }
  };
  
  // Pass handleUserChatMessage to children
  return (
    <div>
      {React.Children.map(children, (child) => {
        return React.cloneElement(child, {
          actions: {
            handleUserChatMessage,
          },
        });
      })}
    </div>
  );
};

export default ActionProvider;
