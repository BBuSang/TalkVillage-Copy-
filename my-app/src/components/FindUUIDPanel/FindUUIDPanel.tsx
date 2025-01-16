import { useState } from 'react';
import React from 'react';
import './FindUUIDPanel.css';

export default function FindUUIDPanel() {
    const [retrievedUUID, setRetrievdUUID] = useState<string>("");
    const [usernameInput, setUsernameInput] = useState<string>("");

    const backendURL = process.env.REACT_APP_BACKEND_LOCAL_BASE_URL as string

    async function retrieveUUIDFromDB (username: string) {
        var pathBeginning: string = "/get_entity_by_name?name=";
        var path: string = pathBeginning + username;
        try {
            var response = await fetch(backendURL + path).then(response => response.json());
            var uuid = response['id'];
            console.log(uuid)
            setRetrievdUUID(uuid);
        }
        catch (error) {
            console.error('There is an error: ' + error);
            setRetrievdUUID("")
        }
        return uuid;
    }

    const getUUID = () => {
        if (usernameInput != ""){
            var uuid = retrieveUUIDFromDB(usernameInput);
            setUsernameInput("");
        }
        else {
            setRetrievdUUID("")
        }
    }

    const handleUsernameInput = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setUsernameInput(event.target.value);
      }
    
    return (
        <div className='searchUpContainer'>
          <div className='searchUserContainer'>
            Username:
            <textarea className='searchUserTextarea' value={usernameInput} onChange={handleUsernameInput}/>
            <button className='submitUsernameButton' onClick={getUUID}>
                Find UUID
            </button>
          </div>
          <div className='getUUIDContainer'>
            UUID Found:
            <div className='UUIDValue'>
                {retrievedUUID}
            </div>
          </div>
        </div>
      );
}