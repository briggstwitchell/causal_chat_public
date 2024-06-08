/**
 * DoCalcEffectTable Component
 * 
 * This component displays the estimated causal effect in a table format.
 * It highlights values using colors to enhance visibility and provides an explanation for the estimation.
 * 
 * Props:
 * - estimatedCausalEffect: object | Contains the estimated causal effects for various outcomes
 * - treatment: string | The selected treatment for which the causal effect is estimated
 * - outcome: string | The selected outcome for which the causal effect is estimated
 * - estimationExplanation: string | Explanation for the causal effect estimation
 * - estimationFormula: string | Formula used for the causal effect estimation (not used in this component but can be useful for future enhancements)
 * 
 * State:
 * - rows: array | Stores the data rows to be displayed in the table, including metric names, values, and their respective colors
 * 
 * The component uses a DataGrid from MUI for displaying the data and colors the cell values based on their magnitude to improve visibility.
 */

import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Box from '@mui/material/Box';

const DoCalcEffectTable = ({ estimatedCausalEffect, treatment, outcome,estimationExplanation,estimationFormula }) => {
    const [rows, setRows] = useState([]);
    
    useEffect(() => {
        if (!estimatedCausalEffect) return;
        const outcomeHeaders = Object.keys(estimatedCausalEffect[outcome]);
        const outcomeValues = Object.values(estimatedCausalEffect[outcome]);

        const targetGreen = 128; //shade of green
        const colors = outcomeValues.map(value => {
            // Adjust the scaling factor for red and blue to enhance visibility for small values
            const scale = Math.max(0.25, value); // Ensuring minimum visibility threshold
            const red = Math.floor(255 * (1 - scale));
            const green = Math.floor(255 + scale * (targetGreen - 255));
            const blue = Math.floor(255 * (1 - scale));
            return `rgb(${red},${green},${blue})`;
        });

        const rowData = outcomeHeaders.map((header, index) => ({
            id: index,
            metric: header,
            value: outcomeValues[index],
            color: colors[index]
        }));

        setRows(rowData);
    // }, [estimatedCausalEffect, outcome]);
    }, [estimatedCausalEffect]);

    const columns = [
        { field: 'metric', headerName: 'Metric', width: 200 },
        { 
            field: 'value', 
            headerName: 'Value', 
            width: 200,
            renderCell: (params) => (
                <strong style={{ color: params.row.color }}>
                    {params.value}
                </strong>
            )
        }
    ];

    return (
        <>
        {estimatedCausalEffect?
        <div>
        <Box sx={{width: '300px',marginBottom: '10px', '& .MuiDataGrid-virtualScrollerContent': { overflow: 'scroll' } }}>
            <DataGrid
                rows={rows}
                columns={columns}
                pageSize={rows.length} 
                hideFooter 
                disableColumnMenu 
                autoHeight 
                density="comfortable"
                sx={{
                    '& .MuiDataGrid-row': {
                        backgroundColor: 'white',
                    }
                }}
            />
        </Box>
        <p>Explanation: {estimationExplanation}</p>
        </div>
        : <div></div>}
        </>
    );
}

export default DoCalcEffectTable;
