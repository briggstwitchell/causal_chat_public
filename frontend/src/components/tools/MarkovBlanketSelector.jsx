/**
 * MarkovBlanketSelector Component
 * 
 * This component allows the user to select a target node and visualize its Markov blanket in the network.
 * It uses a nested dropdown for node selection and highlights the target node and its Markov blanket with colors.
 * 
 * Props:
 * - nodeValuePairs: array | Contains node-value pairs to populate the dropdown for node selection
 * - baseURL: string | The base URL for the API used to fetch the Markov blanket
 * - colorNodes: function | Function to color the nodes in the network visualization
 * - setKeyContents: function | Function to update the key contents for the node colors
 * 
 * State:
 * - targetNode: string | The currently selected target node
 * - selectionItems: array | Items for the dropdown menu, representing the available nodes
 * - markovBlanket: array | The Markov blanket of the selected target node
 * 
 * The component uses the `react-nested-dropdown` library for the dropdown menu and fetches the Markov blanket of the selected node using an API call.
 * It updates the node colors and key contents based on the selected target node and its Markov blanket.
 */

//https://github.com/g-makarov/react-nested-dropdown
import { Dropdown } from 'react-nested-dropdown';
import 'react-nested-dropdown/dist/styles.css';
import { useState,useEffect } from 'react'
import {handleApiCall} from "../../utilities";
// import "./DoCalcSelectorStyle.css";

const MarkovBlanketSelector = ({nodeValuePairs, baseURL,colorNodes,setKeyContents}) => {
    
    const [targetNode, setTargetNode] = useState();
    const [selectionItems, setSelectionItems] = useState([]);
    const [markovBlanket,setMarkovBlanket] = useState([]);
    
    useEffect(()=>{
        if(nodeValuePairs){
        setSelectionItems(nodeValuePairs.map(obj => ({
            label:Object.keys(obj)[0], 
            value:Object.keys(obj)[0],
            onSelect:()=>{
                setTargetNode(()=>Object.keys(obj)[0])
                }
        })));
    }
    }, [nodeValuePairs]);

    const getMarkovBlanketEndPoint = `${baseURL}/network/markov_blanket`;
    
    useEffect(()=>{
        colorNodes([],[],true);

        if (targetNode){
        const queryParam = `?target=${targetNode}`
        handleApiCall(getMarkovBlanketEndPoint+queryParam,`GET`).then((mb) => {
            setMarkovBlanket(()=>mb.markovBlanket[targetNode]);
        })
    }
    },[targetNode])

    useEffect(()=>{
        const colors = ["red","blue"];
        colorNodes([[targetNode],markovBlanket],colors);
        if(!(markovBlanket.length === 0)){
            setKeyContents(()=>{
                setKeyContents(()=>{
                    return [[colors[0],"Target variable"], [colors[1],"Markov blanket"]];
                })              
            })
        }
    },[markovBlanket])

    let buttonLabel = targetNode? `${targetNode} ▾`:"Markov Blanket ▾";
    return (

        <>
        <Dropdown items={selectionItems} containerWidth="300px" closeOnScroll={false}
        type="button"  style={{marginRight:"5px",width: "180px",textOverflow: "ellipsis"}}
        >
            {({ isOpen, onClick }) => (
                <button 
                className="text-white bg-blue-700 hover:bg-red-300 focus:outline-none focus:ring-4 focus:ring-yellow-300 hover:text-dark font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:focus:ring-yellow-900"
                type="button" onClick={onClick} style={{marginRight:"5px"}}>
                {buttonLabel}
                </button>
            )}
      </Dropdown>
        </>
    );
};

export default MarkovBlanketSelector;
