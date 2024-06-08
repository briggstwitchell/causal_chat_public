/**
 * unused component
 */
import { useState } from "react";
import {handleApiCall} from "../utilities";

const LearnAlgorithmButton = ({ onLearnNetwork }) => {

    return (
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={onLearnNetwork}
        >Learn Algorithm</button>
    );
}

export default LearnAlgorithmButton;
