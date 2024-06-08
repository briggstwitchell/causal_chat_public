/**
 * TestIndependenceTable Component
 * 
 * This component displays the results of independence tests in a table format.
 * It highlights selected rows and updates node colors in the network visualization based on the selected independence assumption.
 * 
 * Props:
 * - plotData: object | Contains the data for independence tests, including assumptions and p-values
 * - colorNodes: function | Function to color the nodes in the network visualization
 * - setKeyContents: function | Function to update the key contents for the node colors
 * - baseURL: string | The base URL for the API used to log the selected independence test
 * 
 * State:
 * - rowData: array | Stores the data rows to be displayed in the table, including independence assumptions, conditional variables, and p-values
 * - selectedRow: number | Tracks the ID of the currently selected row
 * 
 * The component uses the DataGrid from MUI for displaying the data and colors the cells and nodes based on the selected row.
 * It also logs the selected independence test to an API endpoint.
 */

import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import {handleApiCall} from "../../utilities";

const TestIndependenceTable = ({ plotData, colorNodes,setKeyContents,baseURL }) => {
    const [rowData, setRowData] = useState([]);
    const [selectedRow, setSelectedRow] = useState(null); // Now tracks only the selected row ID

    useEffect(() => {
        if (!plotData) return;
        const { independence_test_dict } = plotData;

        setRowData(independence_test_dict.map((testItem, index) => ({
            id: index, // Ensure each row has a unique ID
            independenceAssumption: testItem.independence_assumption,
            // independenceAssumption: testItem.independence_assumption.join(" ⊥ "),
            conditionalVariables: testItem.conditioning_set,
            pValue: Math.round(testItem.value * 100) / 100  // Round to 2 decimal places
        })));
    }, [plotData]);

    const columns = [
        { field: 'independenceAssumption', headerName: 'Independence Assumption', headerClassName: 'column-name', width: 200 },
        { field: 'conditionalVariables', headerName: 'Conditional Variables', headerClassName: 'column-name', width: 225 },
        { field: 'pValue', headerName: 'P-value', headerClassName: 'column-name', width: 150 },
    ];

    const logIndependenceTest = `${baseURL}/network/test_independence/log`;

    const handleRowClick = (params) => {
        colorNodes([], [], [], true); // Reset colors
        const colors = ["blue", "orange"];
        setKeyContents(()=>{
            if(plotData){
                setKeyContents(()=>{
                    return [[colors[0],"Independent variables"], [colors[1],"Conditional variable(s)"]];
                })
            }
        })

        colorNodes([params.row.independenceAssumption, params.row.conditionalVariables], colors);
        setSelectedRow(params.id);
        
        handleApiCall(logIndependenceTest,`PUT`,{'target':
                                                    {"independenceAssumption":params.row.independenceAssumption,
                                                       "conditionalVariables":params.row.conditionalVariables,
                                                       "pValue":params.row.pValue 
                                                    }});
    };

    
    const getCellClassName = (params) => {
        if (params.id !== selectedRow) return '';
        if (params.field === 'independenceAssumption') return 'colored-cell-1';
        if (params.field === 'conditionalVariables') return 'colored-cell-2';
        return '';
    };

    return (
        <Box sx={{
            height: 300, width: '50%',
            '& .column-name': { backgroundColor: 'gray', color: 'white' },
            '& .colored-cell-1': { backgroundColor: 'blue', color: 'white' },
            '& .colored-cell-2': { backgroundColor: 'orange', color: 'white' },
        }}>
            <DataGrid
                rows={rowData}
                columns={columns}
                pageSize={5}
                onRowClick={handleRowClick}
                getCellClassName={getCellClassName}
            />
        </Box>
    );
}

export default TestIndependenceTable;
