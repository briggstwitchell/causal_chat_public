/**
 * BayesianNetwork Component
 * 
 * This component renders an interactive Bayesian network graph using Cytoscape.js. It supports 
 * adding nodes, connecting them with edges, and toggling edit mode for node and edge manipulation.
 * 
 * Props:
 * - elements: Array | The array of elements that comprises the nodes and edges of the graph.
 * - setElements: Function | A callback to update the elements array when nodes or edges are added or modified.
 * - userUpdates: Object | Object holding user changes to track modifications during edit mode.
 * - setUserUpdates: Function | A callback to update user modifications.
 * - onUpdateNetwork: Function | unused component
 * - keyContents: Function | State variable that sets what the Key contains 
 * 
 */

import CytoscapeComponent from 'react-cytoscapejs';
import { useState, useEffect } from 'react'
import Cytoscape from 'cytoscape';
import Dagre from 'cytoscape-dagre';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil } from '@fortawesome/free-solid-svg-icons';
// import UpdateNetworkButton from './tools/UpdateNetworkButton'
import ToolKey from './tools/ToolKey'

// Register the Dagre layout with Cytoscape
Cytoscape.use(Dagre);

const BayesianNetwork = ({ elements, setElements, userUpdates, setUserUpdates,elementStyle,onUpdateNetwork,keyContents}) => {

  const [editMode, setEditMode] = useState(false);
  const [selectedNode, setSelectedNode] = useState(null);

  // const addNode = () => {
  //   setElements([...elements, { data: { id: `node${elements.length + 1}`, label: `Node ${elements.length + 1}` } }]);
  // };
  
  const toggleEditMode = () => {
    setEditMode(prevMode => !prevMode);
  };

  
  const handleNodeClick = (nodeId) => {
    if (!editMode) {
      return;
    };

    if (selectedNode === null) {
      setSelectedNode(nodeId);
      
    } else if (selectedNode !== nodeId) {
      const newEdgeId = `${selectedNode}->${nodeId}`
      const newEdge = { data: {id:newEdgeId, source: selectedNode, target: nodeId } };
      
      // check if new edge already exists and deletes it if so
      const newEdgeIndex = elements.findIndex(element =>element.data.id === newEdgeId)

      if(newEdgeIndex === -1){
          setUserUpdates((prevUpdates) => 
            ([...prevUpdates, {"addition": newEdge}]
          ));
          setElements((els) => [...els, newEdge]);
        }
        else{
          setElements((els) => els.toSpliced(newEdgeIndex,1));
        setUserUpdates((prevUpdates) => 
          ([...prevUpdates, {"deletion": newEdge}]
        ));
      } 
      setSelectedNode(null);// Reset selection
    }
  };

  useEffect(() => {
    const setupListeners = (cy) => {
      cy.on('click', 'node', (event) => {
        const nodeId = event.target.id();
        handleNodeClick(nodeId);
      });
    };
    
    const cy = window.cy;
    if (cy) {
      setupListeners(cy);
    }

    // Cleanup function to remove event listener
    return () => {
      if (cy) {
        cy.removeListener('click', 'node');
      }
    };
  });

  const networkBackgroundColor = editMode ? 'bg-red-100' : 'bg-white'
  return (
    <div className={`${networkBackgroundColor} p-2 rounded-md border-2 border-blue-200`}>
      <div onClick={toggleEditMode}>
      {editMode ? 
      <button 
      className="text-white bg-red-400 hover:bg-red-300 focus:outline-none px-3 focus:ring-4 focus:ring-yellow-300 hover:text-dark font-medium rounded-full text-sm  mx-1 py-1 text-center me-2 mb-2 dark:focus:ring-yellow-900"
      onClick={onUpdateNetwork}
      >Stop Editing</button>
       :
        <button 
          className="text-white bg-blue-600 hover:bg-red-300 focus:outline-none focus:ring-4 focus:ring-yellow-300 hover:text-dark font-medium rounded-full text-sm  mx-1 py-1 text-center me-2 mb-2 dark:focus:ring-yellow-900"
          onClick={onUpdateNetwork}
        >
          <FontAwesomeIcon icon={faPencil} className='px-1 mx-1' />
        </button>
      }
    </div>
    {/* <UpdateNetworkButton onUpdateNetwork={onUpdateNetwork}></UpdateNetworkButton> */}
    {/* <button onClick={addNode}>Add Node</button> */}
      {(!elements || elements.length <=0)?
      (<h1 className="text-center">No Nodes</h1>):(
        
    <CytoscapeComponent
      id="cytoscape-basic-example"
      elements={elements}
      layout={{ name: 'dagre', padding: 10 }}
      style={ { width: '100%',
      height: '600px'}
      // border:'solid'}
    }
      stylesheet={elementStyle}
      minZoom={0.5}
      maxZoom={1.6}
      cy={(cy) => {
        window.cy = cy;
        
      }}
    />
    )}
    <ToolKey keyContents={keyContents}>
    </ToolKey>
    </div>
  );
};
export default BayesianNetwork;
