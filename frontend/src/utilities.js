const backendUrl = import.meta.env.VITE_REACT_APP_BACKEND_URL || 'http://localhost';
const backendPort = import.meta.env.VITE_REACT_APP_BACKEND_PORT || '8000';
export const baseURL = `${backendUrl}:${backendPort}`;

export const handleApiCall = async (endpoint, requestType=`GET`,body=null) => {
    
    let request = {method: requestType, // or 'POST', 'PUT', 'DELETE',
                //    mode: 'cors',
                   headers: {
                    'Content-Type': 'application/json',
                    // Include other headers as required by your API
                    }
                    // If you're making a POST request, include the body like so:
                    // body: JSON.stringify({ key: 'value' })
                }
                if (body) {
                    request['body'] = JSON.stringify(body);
                  }
    try {
        const response = await fetch(endpoint,request);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json(); // or .text(), .blob(), etc., depending on the response format
        return data;
    } catch (error) {
      console.error('There was a problem with your fetch operation:', error);
      // window.alert('There was a problem with your fetch operation:', error);

    }
  };

export const trackActions = async (is_tracking) => {
  try{ 
  await handleApiCall(`${baseURL}/track_actions`, `PUT`, {is_tracking: is_tracking})
} 
  catch (error) {
    console.error('There was a problem in tracking actions:', error);
  }
}
