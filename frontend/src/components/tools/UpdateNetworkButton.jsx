/**
 * UpdateNetworkButton Component
 * 
 * This component renders a button which may trigger an update for network graph visualization.
 * 
 * Props:
 * - onUpdateNetwork: function | A callback to update network when clicked
 */

const UpdateNetworkButton = ({ onUpdateNetwork }) => {
    return (
        <button 
        className="text-white bg-blue-600 hover:bg-red-300 focus:outline-none focus:ring-4 focus:ring-yellow-300 hover:text-dark font-medium rounded-full text-sm px-3 mx-1 py-1 text-center me-2 mb-2 dark:focus:ring-yellow-900"
        onClick={onUpdateNetwork}
        >Update assumptions</button>
    );
}

export default UpdateNetworkButton;
