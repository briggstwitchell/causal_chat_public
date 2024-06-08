/**
 * TestIndependenciesButton Component
 * 
 * This component provides a button to test for independencies in the network.
 * Upon clicking, it fetches the independence test data and displays the results in a table.
 * 
 * Props:
 * - elements: array | The elements of the network to be tested
 * - setElements: function | Function to update the elements of the network
 * - elementStyle: object | The style settings for the network elements
 * - setElementStyle: function | Function to update the style settings for the network elements
 * - colorNodes: function | Function to color the nodes in the network visualization
 * - setKeyContents: function | Function to update the key contents for the node colors
 * - baseURL: string | The base URL for the API used to fetch the independence test data
 * 
 * State:
 * - plotData: object | Stores the data for independence tests to be displayed in the table
 * 
 * The component includes a button styled with Tailwind CSS classes.
 * On clicking the button, it fetches the independence test data from the API and displays it using the TestIndependenceTable component.
 */

import React, { useState, useEffect} from 'react';
import {handleApiCall} from "../../utilities";
import TestIndependenceTable from './TestIndependenceTable';

const TestIndependenciesButton = ({ elements, setElements, elementStyle,setElementStyle,colorNodes,setKeyContents,baseURL}) => {

    const [plotData, setPlotData] = useState();
    const independenceTestEndpoint = `${baseURL}/network/test_independence`;

    const onClick = async () => {            
            try {
                const independenceData = await handleApiCall(independenceTestEndpoint, 'GET');
                setPlotData(independenceData);
            } catch (error) {
                console.error('Error in fetching network:', error);
            }
        };

    return (
        <>
        <button 
        className="text-blue-700 bg-white border-2 border-blue-700 hover:bg-red-300 focus:outline-none focus:ring-4 focus:ring-yellow-300 hover:text-dark font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:focus:ring-yellow-900"
        onClick={onClick}
        style={{width: "180px",textOverflow: "ellipsis"}}
        >Test Independencies</button>

        {plotData? <TestIndependenceTable elements={elements} setElements={setElements} plotData={plotData}
        elementStyle={elementStyle} setElementStyle={setElementStyle} colorNodes={colorNodes}
        setKeyContents={setKeyContents} baseURL={baseURL}
        />
        :<div></div>}
        </>
    );
}

export default TestIndependenciesButton;
