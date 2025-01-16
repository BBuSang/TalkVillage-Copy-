import { useState } from 'react';
import React from 'react';
import './CreateUserPanel.css';

export default function CreateUserPanel() {
    const [retrievedUUID, setRetrievdUUID] = useState<string>("");
    const [usernameInput, setUsernameInput] = useState<string>("");

    const backendURL = process.env.REACT_APP_BACKEND_LOCAL_BASE_URL || ""

    async function addUsernameToDB (username: string) {
        var pathBeginning: string = "/add_entity?name=";
        var path: string = pathBeginning + username;
        try{
          let response = await fetch(backendURL + path).then(response => response.json());
          var uuid = response;
          console.log(uuid)
        }
        catch (error) {
          console.error('There is an error: ' + error);
        }
        return uuid;
      }
    
      const createUser = () => {
        if (usernameInput != "") {
          var uuid = addUsernameToDB(usernameInput);
          setUsernameInput("");
        }
      }
    
      const handleUsernameInput = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setUsernameInput(event.target.value);
      }

    return (<div className='createUserContainer'>
                Username:
                <textarea className='usernameTextarea' value={usernameInput} onChange={handleUsernameInput}/>
                <button className='submitUsernameButton' onClick={createUser}>Create User</button>
            </div>
      );
}