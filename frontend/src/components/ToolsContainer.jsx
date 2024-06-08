/**
 * ToolsContainer Component
 * 
 * This component serves as a container for various tool components used in the application.
 * It provides a structured layout for tools related to causal analysis and network visualization.
 * 
 * Props:
 * - nodeValuePairs: array | Contains node-value pairs to populate dropdowns and selectors in the tools
 * - baseURL: string | The base URL for the API used by the tools
 * - elements: array | The elements of the network to be managed and visualized
 * - setElements: function | Function to update the network elements
 * - elementStyle: object | The style settings for the network elements
 * - setElementStyle: function | Function to update the style settings for the network elements
 * - colorNodes: function | Function to color the nodes in the network visualization
 * - setKeyContents: function | Function to update the key contents for the node colors
 * 
 * The component uses various tool components to provide functionalities like causal effect estimation, Markov blanket selection,
 * independence testing, and chat history download. It arranges these tools in a responsive container with appropriate styling.
 * 
 * Child Components:
 * - DoCalcSelector: Component for selecting treatments and outcomes for causal effect estimation
 * - MarkovBlanketSelector: Component for selecting a target node and visualizing its Markov blanket
 * - TestIndependenciesButton: Component for testing independencies in the network
 * - DownloadChatHistoryButton: Component for downloading chat history
 */

import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import LearnAlgorithmButton from './LearnAlgorithmButton';
import DoCalcSelector from './tools/DoCalcSelector';
import MarkovBlanketSelector from './tools/MarkovBlanketSelector';
// import UpdateNetworkButton from './tools/UpdateNetworkButton';
import TestIndependenciesButton from './tools/TestIndependenciesButton';
import DownloadChatHistoryButton from './tools/DownloadChatHistoryButton';

const ToolsContainer = ({nodeValuePairs, baseURL, elements, setElements,elementStyle,setElementStyle,colorNodes,setKeyContents}) => {

    return (
        <div className='bg-white container px-20 py-8 w-4/5 mx-auto rounded-md border-2 border-blue-200 my-3'>
            
            <h3 className="text-gray-400 text-xl pb-4">Tools:</h3>
            <DoCalcSelector nodeValuePairs={nodeValuePairs} baseURL={baseURL} colorNodes={colorNodes} setKeyContents={setKeyContents}/>
            <MarkovBlanketSelector nodeValuePairs={nodeValuePairs} baseURL={baseURL} colorNodes={colorNodes} setKeyContents={setKeyContents}/>
            <TestIndependenciesButton elements={elements} setElements={setElements}
                elementStyle={elementStyle} setElementStyle={setElementStyle} colorNodes={colorNodes}
                setKeyContents={setKeyContents} baseURL={baseURL}
            />
            <DownloadChatHistoryButton url={`${baseURL}/chat_history`}></DownloadChatHistoryButton>
        </div>
    );
};

export default ToolsContainer;