/**
 * AppContainer Component
 * 
 * This component serves as the primary container for the application. It manages the state related
 * to the network elements and their interactions, including updates and data retrieval. The component
 * uses React hooks for state management and side effects.
 * 
 * State:
 * - elements: array | Holds the current state of network elements
 * - nodeValuePairs: array | Stores pairs of node identifiers and their possible values
 * - userUpdates: object | Tracks user-initiated additions and deletions within the network
 * - keyContents: object | Tracks the key for visualizations generated via the tools component
 * 
 * Effects:
 * - An effect to fetch initial network data and node-value pairs from the backend
 * - An effect to re-fetch network data when user updates occur
 * 
 * Functions:
 * - onUpdateNetwork: function | Invokes backend update calls for the network and refreshes local state
 * 
 * Usage:
 * <AppContainer />
 * The component integrates various subcomponents like NetworkChatContainer and ToolsContainer,
 * and facilitates communication and data flow between them.
 */

import React, { useState, useEffect} from 'react';
import Row from 'react-bootstrap/Row';

import ToolsContainer from './ToolsContainer';
import NetworkChatContainer from './NetworkChatContainer';
import {handleApiCall,baseURL} from "../utilities";

const AppContainer = () => {
    
    const [elements, setElements] = useState([]);
    const [nodeValuePairs, setNodeValuePairs] = useState([]);
    const [userUpdates, setUserUpdates] = useState([]);
    const [keyContents,setKeyContents] = useState([]);
    

    const [elementStyle, setElementStyle] = useState(
        [
        {
          selector: 'node',
          style: {
            width: 50,
            height: 50,
                'text-valign': 'center',
                'label': 'data(label)',
                'text-halign': 'center',
                'font-family': 'Tahoma',
                'text-background-color': 'rgb(219, 234, 254)',
                'text-background-padding':'3px',
                'text-background-shape': 'round-rectangle',
                'text-outline-color': 'red',
                'overlay-color': 'red',
                'text-background-opacity': 1,
                'background-color': 'gray' 
            }
        },
        {
          selector: 'edge',
          style: {
            'width': 3,
            'line-color': '#ccc',
            'target-arrow-color': '#616161',
            'target-arrow-shape': 'triangle',
            'curve-style': 'bezier'
          }
        },
      ]);
    
    useEffect(() => {
    }, [userUpdates]);

    //setting the initial state of app
    const networkEndpoint = `${baseURL}/network`;
    useEffect(() => {
    handleApiCall(networkEndpoint, `GET`)
      .then((networkElements) => {
        setElements(networkElements);
      })
      .catch((error) => {
        console.error('Error in fetching network:', error);
      });

      //fetch the nodes with their respective potential values
      handleApiCall(`${baseURL}/network/data?unique_values=True`, `GET`)
        .then((nodeValuePairs) => {
            setNodeValuePairs(nodeValuePairs);
        })
        .catch((error) => {
            console.error('Error in fetching node value pairs:', error);
        });
    
        // Empty dependency array means this effect runs only once after initial render
    }, []);
    
    //updating network state
    const onUpdateNetwork = async () => {
        // send changes to backend
        handleApiCall(networkEndpoint, `PUT`,{'changes':userUpdates})
        .then(() => {
            setUserUpdates([]);
            return handleApiCall(networkEndpoint, `GET`)
        })
        .then((networkElements) => {
            setElements(networkElements);
        })
        .catch((error) => {
            console.error('Error in fetching network:', error);
        });
    };


    const colorNodes = (nodeIdArrays, colors, reset = false) => {
        /**
         * Updates the style of nodes by applying specific background colors based on provided node IDs.
         * This function allows for dynamic styling changes across multiple groups of nodes, each with its specific color.
         *
         * @param {Array<Array<string>>} nodeIdArrays - An array of arrays, each containing the IDs of nodes to be styled.
         * @param {Array<string>} colors - An array of strings where each string represents a color to apply to the corresponding array of node IDs.
         * @param {boolean} [reset=false] - A boolean flag that, when true, resets all node styles to the default color before applying new styles.
         *
         * Functionality:
         * - Resets node styles to a default color if 'reset' is true.
         * - Iteratively checks each node's current style against the desired style. If it differs, the new style is applied.
         * - Ensures that nodes without predefined styles in the style list get the appropriate styles based on their IDs and the specified colors.
         * - This approach supports multiple groups of nodes, allowing flexible and varied styling applicable in dynamic UI contexts, such as interactive visualizations or reactive interfaces.
         *
         * Example Usage:
         * colorNodes([['node1', 'node2'], ['node3']], ['red', 'blue'], false);
         */
        const defaultColor = 'gray'; // Define your default color here
    
        if (reset) {
            setElementStyle(prevElementStyles => {
                return prevElementStyles.map(style => ({
                    ...style,
                    style: { ...style.style, 'background-color': defaultColor }
                }));
            });
        }
    
        setElementStyle(prevElementStyles => {
            const updatedStyles = prevElementStyles.map(style => {
                const nodeId = style.selector.substring(1); // Extract node ID from selector
                let styleUpdated = false;
    
                nodeIdArrays.forEach((nodeArray, index) => {
                    if (nodeArray.includes(nodeId)) {
                        const color = colors[index];
                        const currentColor = style.style['background-color'];
                        if (currentColor !== color) {
                            style.style['background-color'] = color;
                            styleUpdated = true;
                        }
                    }
                });
    
                return styleUpdated ? {...style} : style;
            });
    
            // Add new styles for any unstyled nodes in each nodeIdArray
            nodeIdArrays.forEach((nodeArray, index) => {
                const color = colors[index];
                nodeArray.forEach(nodeId => {
                    if (!updatedStyles.some(style => style.selector === `#${nodeId}`)) {
                        updatedStyles.push({
                            selector: `#${nodeId}`,
                            style: {'background-color': color}
                        });
                    }
                });
            });
    
            return updatedStyles;
        });
    };

    return (
        <div className='bg-blue-100 grid grid-cols-1'>
            <Row>
                {/* <TrackActionsButton/> */}
            </Row>
            <Row>
            <NetworkChatContainer
                elements={elements} setElements={setElements}
                userUpdates={userUpdates} setUserUpdates={setUserUpdates}
                elementStyle={elementStyle}
                onUpdateNetwork={onUpdateNetwork}
                keyContents={keyContents}
                />  
            </Row>
            {/* <Row> */}
            <ToolsContainer
                nodeValuePairs={nodeValuePairs}
                onUpdateNetwork={onUpdateNetwork}
                baseURL={baseURL}
                elements={elements}
                setElements={setElements}
                elementStyle={elementStyle}
                setElementStyle={setElementStyle}
                colorNodes={colorNodes}
                keyContents={keyContents}
                setKeyContents={setKeyContents}
                /> 
            {/* </Row> */}
        </div>
    );
};

export default AppContainer;