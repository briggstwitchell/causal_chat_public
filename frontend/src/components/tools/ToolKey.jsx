/**
 * ToolKey Component
 * 
 * This component displays a key for the network visualization, showing the meaning of different node colors.
 * It renders colored dots with accompanying text to explain what each color represents.
 * 
 * Props:
 * - keyContents: array | Contains pairs of colors and their corresponding descriptions
 * 
 * The component uses inline styles to create colored dots and displays them next to their descriptions.
 * If no key contents are provided, the component renders nothing.
 * 
 * Usage Example:
    [
        ['color1','text'],
        ['color2','text'],
        etc...
    ]
*/
const ToolKey = ({ keyContents }) => {
    const dotStyle = {
        width: '20px',
        height: '20px',
        backgroundColor: 'blue',
        borderRadius: '50%',
      };
    if(!keyContents || keyContents<=0){
        return (<></>)}
    else{
        return(
            <div className="grid grid-cols-1 border-2 border-gray-300m-2 p-1 w-1/6 rounded-md bg-gray-100">
            {keyContents.map((keyElement, index) => {
                const dotStyle = {
                    width: '20px',
                    height: '20px',
                    backgroundColor: keyElement[0], // use the color from the array
                    borderRadius: '50%',
                    display: 'inline-block',
                    marginRight: '10px',
                };
                return (
                    <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                        <div style={dotStyle}></div>
                        <span>{keyElement[1]}</span> 
                    </div>
                );
            })}
        </div>
        )
    }
}

export default ToolKey;
