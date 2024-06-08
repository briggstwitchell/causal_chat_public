/**
 * DoCalcSelector Component
 * 
 * This component enables the selection of treatments and outcomes for causal effect estimation.
 * It consists of two dropdowns for selecting a treatment and an outcome respectively. 
 * Upon selection, it estimates the causal effect by making an API call.
 * 
 * Props:
 * - nodeValuePairs: array | Contains node-value pairs to populate the dropdowns for treatments and outcomes
 * - baseURL: string | The base URL for the API used to fetch the estimated effect
 * - setKeyContents: function | permits updating of the key
 * 
 * State:
 * - treatmentAndOutcomeSelected: object | Holds the selected treatment and outcome
 * - treatmentDropDownItems: array | Items for the treatment dropdown
 * - outcomeDropDownItems: array | Items for the outcome dropdown
 * - estimatedEffect: string | Stores the result of the causal effect estimation
 */

//https://github.com/g-makarov/react-nested-dropdown
import { Dropdown } from 'react-nested-dropdown';
import 'react-nested-dropdown/dist/styles.css';
import Row from 'react-bootstrap/Row';
// import Col from 'react-bootstrap/Col';
import { useState,useEffect } from 'react'
import {handleApiCall} from "../../utilities";
import "./DoCalcSelectorStyle.css";
import DoCalcEffectTable from './DoCalcEffectTable';

const DoCalcSelector = ({nodeValuePairs, baseURL,colorNodes,setKeyContents}) => {
    const [treatmentAndOutcomeSelected, setTreatmentAndOutcomeSelected] = useState(
        {
            "treatment": null,
            "outcome": null
        }
    );
    const [treatmentDropDownItems, setTreatmentDropDownItems] = useState([]);
    const [outcomeDropDownItems, setOutcomeDropDownItems] = useState([]);
    const [estimatedCausalEffect, setEstimatedCausalEffect] = useState();
    const [estimationExplanation, setEstimationExplanation] = useState();
    const [estimationFormula, setEstimationFormula] = useState();
    const [estimationDiv, setEstimationDiv] = useState();

    const resetTreatmentDropDownItems = ()=>{
        setTreatmentDropDownItems(formatSelection(nodeValuePairs, selectTreatment));
    }
    const resetOutcomeDropDownItems = ()=>{
        //pass in just the node names and drop the values for the outcomes
        setOutcomeDropDownItems(formatSelection(nodeValuePairs.map(obj => Object.keys(obj)[0]), selectOutcome));
    }

    useEffect(() => {
        // setTreatmentDropDownItems(formatSelection(nodeValuePairs, selectTreatment));
        resetTreatmentDropDownItems();
        resetOutcomeDropDownItems();
        //pass in just the node names and drop the values for the outcomes
        // setOutcomeDropDownItems(formatSelection(nodeValuePairs.map(obj => Object.keys(obj)[0]), selectOutcome));
    }, [nodeValuePairs]);

    const treatmentColor = "blue";
    const outcomeColor = "orange";

    useEffect(() => {
        colorNodes([],[],true);
        const colors = [treatmentColor,outcomeColor];
        if (treatmentAndOutcomeSelected.treatment){
            let treatmentVariable = treatmentAndOutcomeSelected.treatment.split('~')[0];
            colorNodes([[treatmentVariable],[treatmentAndOutcomeSelected.outcome]],colors);
            
                setKeyContents(()=>{
                    setKeyContents(()=>{
                        return [[colors[0],"Treatment (doing)"], [colors[1],"Effect variable"]];
                    })              
                })
        }
    }, [treatmentAndOutcomeSelected]);

    const selectTreatment = (treatment) => {
        resetTreatmentDropDownItems();
        resetOutcomeDropDownItems();
        setTreatmentAndOutcomeSelected((prev) => ({
            ...prev,
            treatment: treatment
        }));
        //removes the selected treatment from the outcome dropdown
        setOutcomeDropDownItems((prev)=>{
            let filtered = prev.filter(item => item.label !== treatment.split("~")[0]);
            return filtered;
        })   
    }

    const selectOutcome = (outcome) => {
        resetOutcomeDropDownItems();
        resetTreatmentDropDownItems();
        setTreatmentAndOutcomeSelected((prev) => ({
            ...prev,
            outcome: outcome
        }));
        //removes the selected outcome from the treatment dropdown
        setTreatmentDropDownItems((prev)=>{
            let filtered = prev.filter(item => item.label !== outcome.split("~")[0]);
            return filtered;
        })
    }
    console.log("estimatedCausalEffect [DoCalcSelector.jsx]",estimatedCausalEffect)

    function formatSelection(data,onSelect) {
        if (!Array.isArray(data)) {
            console.error('Expected an array for formatSelection, received:', data);
            return [];
        }
        return data.map(obj => {
            if (typeof obj === 'string') {
                return {
                    label: obj,
                    onSelect: () => onSelect(`${obj}`),
                };
            }
            const key = Object.keys(obj)[0];
            const values = obj[key];
            return {
                label: key,
                onSelect: () => console.log(`${key} selected`),
                items: values.map(value => ({
                    label: value,
                    onSelect: ()=>onSelect(`${key}~${value}`)
                }))
            };
        }).filter(item => item !== null); // filter out any incorrect entries
    }
    
    const handleClickEstimateEffect = () => {
        if(!(treatmentAndOutcomeSelected.treatment) || !(treatmentAndOutcomeSelected.outcome)){
            window.alert("Must select both a treatment and an outcome to estimate effect.");
            return;
        }
        
        handleApiCall(`${baseURL}/network/estimate_effect?treatment=${treatmentAndOutcomeSelected.treatment}&outcome=${treatmentAndOutcomeSelected.outcome}`,`GET`)
            .then((response)=>{
                console.log(response)
                setEstimatedCausalEffect(()=>response.causal_estimate);
                setEstimationExplanation(()=>response.explanation);
                setEstimationFormula(()=>response.formula);
                setEstimationDiv(()=>response.html);
                return;
            })
            .catch((error)=>{
                console.error("Error in fetching estimate:",error);
                setEstimatedCausalEffect(()=>error)
            })
    }
    
    return (
        <div className="flex flex-col w-1/2 border-2 border-gray-300 px-5 py-5 mb-5 rounded-md bg-gray-100">
        <h3 className="text-gray-400 text-l pb-4" style={{ position: 'relative', zIndex: 1 }}>Estimate causal effect:</h3>
        <div className='flex flex-wrap justify-between'>
            <Dropdown closeOnScroll={false} items={treatmentDropDownItems}>
            {({ isOpen, onClick }) => (
                <button
                className={`text-white bg-${treatmentColor}-700 hover:bg-${treatmentColor}-800 focus:outline-none my-1 focus:ring-4 focus:ring-${treatmentColor}-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center`}
                type="button" onClick={onClick} style={{width: "170px", marginRight: "5px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis"}}>
                {isOpen ? 'Close dropdown' : !(treatmentAndOutcomeSelected.treatment) ? 'Treatment ▾': treatmentAndOutcomeSelected.treatment.replace("~"," = ")}
                </button>
            )}
            </Dropdown>
            
            <Dropdown closeOnScroll={false} items={outcomeDropDownItems} containerWidth="300px">
            {({ isOpen, onClick }) => (
                <button 
                className={`text-white bg-orange-400 hover:bg-${outcomeColor}-800 my-1 focus:outline-none focus:ring-4 focus:ring-${outcomeColor}-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center`}
                type="button" onClick={onClick} style={{width: "170px", marginRight: "5px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",zIndex:"1"}}>
                {isOpen ? 'Close dropdown' : !(treatmentAndOutcomeSelected.outcome) ? 'Outcome ▾': treatmentAndOutcomeSelected.outcome}
                </button>
            )}
            </Dropdown>
            
            <button 
            className="text-blue-700 bg-white border-2 my-1 border-blue-700 hover:bg-red-300 focus:outline-none focus:ring-4 focus:ring-yellow-300 hover:text-dark font-medium rounded-lg text-sm py-2.5 text-center me-2 dark:focus:ring-yellow-900"
            type="button" style={{width: "170px", marginRight: "5px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis"}} onClick={handleClickEstimateEffect}>
            Estimate effect
            </button>
        </div>
        <Row className="flex flex-wrap">
            {estimatedCausalEffect ? 
            <DoCalcEffectTable 
                estimatedCausalEffect={estimatedCausalEffect} 
                estimationExplanation={estimationExplanation} 
                estimationFormula={estimationFormula} 
                treatment={treatmentAndOutcomeSelected.treatment} 
                outcome={treatmentAndOutcomeSelected.outcome}
            /> : 
            <div></div>
            }
        </Row>
        </div>
    );
};

export default DoCalcSelector;
