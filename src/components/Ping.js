import React, { useState } from 'react';
import axios from 'axios';

const PingTest = () => {
  const [response, setResponse] = useState('');

  const handlePing = async () => {
    try {
      const res = await axios.get('/ping/');
      setResponse(res.data.message);
    } catch (err) {
      console.error('Ping failed:', err);
      setResponse('Error: Could not reach backend');
    }
  };

  return (
    <div>
      <h3>Ping Django Backend</h3>
      <button onClick={handlePing}>Ping</button>
      <p>Response: {response}</p>
    </div>
  );
};

export default PingTest;
