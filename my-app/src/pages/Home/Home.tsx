import { useState } from 'react';
import React from 'react';
import styles from './Home.module.css';
import CreateUserPanel from '../../components/CreateUserPanel/CreateUserPanel';
import FindUUIDPanel from '../../components/FindUUIDPanel/FindUUIDPanel';

export default function Home() {
  

  return (
    <div className='homeContainer'>
      <div className='panelsContainer'>
        <CreateUserPanel />
        <FindUUIDPanel />
      </div>
    </div>
  );
}