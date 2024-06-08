/**
 * DownloadChatHistoryButton Component
 * 
 * This component provides a button to download chat history as a text file.
 * It formats the file name with the current date and time to ensure uniqueness.
 * 
 * Props:
 * - url: string | The URL from which to fetch the chat history data
 * - fileName: string | The base name for the downloaded file (not used in this component but can be useful for future enhancements)
 * 
 * Functions:
 * - getFormattedDateTime: Returns the current date and time formatted as 'dd-mm-yyyy-hh.mm.ss'
 * - handleDownload: Async function that fetches the chat history from the provided URL and triggers a file download
 * 
 * The component uses FontAwesomeIcon for the download button icon and file-saver to save the fetched chat history as a file.
 */

import React from 'react';
import { saveAs } from 'file-saver';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload } from '@fortawesome/free-solid-svg-icons';

const DownloadChatHistoryButton = ({ url, fileName }) => {
  function getFormattedDateTime() {
    const now = new Date();
    
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    
    return `${day}-${month}-${year}-${hours}.${minutes}.${seconds}`;
}

console.log(getFormattedDateTime());
  console.log("url [DownloadChatHistoryButton.jsx]",url)
  
  const handleDownload = async () => {
      try {
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'text/plain',
          },
        });
  
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
  
        const blob = await response.blob();
        const time = getFormattedDateTime();
        saveAs(blob, `chat_history_${time}.txt`);
      } catch (error) {
        console.error('Error while downloading the file:', error);
      }
  }

  return (
      <button onClick={handleDownload} className='text-gray-500'>
        <FontAwesomeIcon icon={faDownload} className='px-1 mx-1' />
        Chat History
      </button>
  );
};

export default DownloadChatHistoryButton;