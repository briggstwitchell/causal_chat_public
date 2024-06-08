/**
 * TrackActionsButton Component
 * 
 * This component renders a toggle button to start or stop tracking user actions.
 * The button's appearance and label change based on whether tracking is currently active.
 * 
 * State:
 * - tracking: boolean | Tracks the current tracking status, toggled by the button.
 * 
 * Effects:
 * - trackActions: function | An effect that runs when the tracking state changes, calling
 *   the `trackActions` function which handles the tracking logic based on the current state.
 * 
 * Functions:
 * - onTrackActions: function | Toggles the `tracking` state between true and false.
*/

import { useState, useEffect } from "react";
import { trackActions } from "../utilities";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const TrackActionsButton = () => {
    const [tracking, setTracking] = useState(true);

    useEffect(() => {
        async ()=>{
            await trackActions(tracking);
        }
        trackActions(tracking);
    }
    , [tracking]);

    const onTrackActions = () => {
        setTracking((prev)=>!prev);
    }

    return (
<div>
    <button 
        className={!(tracking)
        ?"text-white bg-yellow-400 m-1 hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-300 font-medium rounded-full text-xxs px-2 h-8 text-center me-1 mb-1 dark:focus:ring-yellow-900"
        :"text-white bg-red-700 m-1 hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-red-300 font-medium rounded-full text-xxs px-2 h-8 text-center me-1 mb-1 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"}
    onClick={onTrackActions}>
        {!(tracking)
            ? <><span>Click to track actions </span><FontAwesomeIcon icon={faEye} /></>
            : 
            <>
                <span>Tracking actions </span><FontAwesomeIcon icon={faEyeSlash} />
                <p className="text-xxs text-gray-400 p1" >click to stop</p>
            </>}
    </button>
</div>
    );
}

export default TrackActionsButton;
