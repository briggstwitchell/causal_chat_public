/**
 * SendUserActionsButton Component
 * 
 * This component renders a checkbox input that allows users to toggle the inclusion of interaction context
 * in user actions within the chatbot. It modifies the `sendUserActions` state in its parent context to reflect
 * user preferences for including or excluding context in their interactions.
 * 
 * Props:
 * - state: object | Contains the current state of the `sendUserActions` boolean.
 * - setState: function | A callback to modify the parent component's state based on the checkbox's toggle.
 * 
 * Usage:
 * <SendUserActionsButton state={state} setState={setState} />
 * Where `state` is an object that includes `sendUserActions`, and `setState` is the function from the parent component
 * or context that manages state updates.
 * 
 * Styles:
 * - The button is positioned absolutely at the top-right of its container, with specific margin and padding
 *   to align it within the UI context.
 */

import React, {useEffect} from 'react';

const SendUserActionsButton = (props) => {
  const {sendUserActions} = props.state;

  const toggleSendActions = () => {
    props.setState((prev) => ({
      ...prev,
      sendUserActions: !sendUserActions,
    }));
  };

  return (
    <div className={`absolute top-0 right-6 mt-1 mr-1 px-2 py-2 sendUserActionsButton`}>
            <label className='text-gray-400'>
        <span className="mr-2">Include interaction context</span>
                <input
                type="checkbox"
                checked={sendUserActions}
                onChange={toggleSendActions}
                />
        </label>
    </div>
  );
};

export default SendUserActionsButton;
