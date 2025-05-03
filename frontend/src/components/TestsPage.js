import React, { useState, useEffect } from 'react';
import '../App.css';

const TestsPage = () => {
  const [testResults, setTestResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const endpoints = [
    { id: 'tournaments', name: 'GET Tournaments' },
    { id: 'users', name: 'GET Users' },
    { 
      id: 'tournaments-create-delete', 
      name: 'Tournament Lifecycle',
      testFn: testTournamentLifecycle 
    },
    { 
      id: 'users-create-delete', 
      name: 'User Lifecycle',
      testFn: testUserLifecycle 
    },
  ];

  useEffect(() => {
    runAllTests();
  }, []);

  // Test tournament create + delete
  async function testTournamentLifecycle() {
    const testData = {
      name: `Test Tournament ${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      location: '1'
    };

    // Create tournament
    const postStart = performance.now();
    try {
      const postResponse = await fetch(`${process.env.REACT_APP_API_URL}/tournaments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testData)
      });

      if (!postResponse.ok) {
        throw new Error(`POST failed: ${postResponse.status}`);
      }

      const created = await postResponse.json();
      const postTime = Math.round(performance.now() - postStart);

      // Delete tournament
      const deleteStart = performance.now();
      const deleteResponse = await fetch(
        `${process.env.REACT_APP_API_URL}/tournaments?id=${created.data.id}`, 
        { method: 'DELETE' }
      );

      const deleteTime = Math.round(performance.now() - deleteStart);
      
      if (!deleteResponse.ok) {
        throw new Error(`DELETE failed: ${deleteResponse.status}`);
      }

      return {
        status: 'success',
        message: `Created & deleted (${postTime}ms + ${deleteTime}ms)`
      };
    } catch (error) {
      return {
        status: 'error',
        message: error.message.includes('POST') ? 
          `Create failed: ${error.message}` : 
          `Created but delete failed: ${error.message}`
      };
    }
  }

  // Test user create + delete
  async function testUserLifecycle() {
    const testData = {
      username: `testuser_${Math.random().toString(36).substring(2, 8)}`,
      email: `test_${Date.now()}@example.com`,
      role: 'user'
    };

    // Create user
    const postStart = performance.now();
    try {
      const postResponse = await fetch(`${process.env.REACT_APP_API_URL}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testData)
      });

      if (!postResponse.ok) {
        throw new Error(`POST failed: ${postResponse.status}`);
      }

      const created = await postResponse.json();
      const postTime = Math.round(performance.now() - postStart);

      // Delete user
      const deleteStart = performance.now();
      const deleteResponse = await fetch(
        `${process.env.REACT_APP_API_URL}/users?id=${created.data.id}`, 
        { method: 'DELETE' }
      );

      const deleteTime = Math.round(performance.now() - deleteStart);
      
      if (!deleteResponse.ok) {
        throw new Error(`DELETE failed: ${deleteResponse.status}`);
      }

      return {
        status: 'success',
        message: `Created & deleted (${postTime}ms + ${deleteTime}ms)`
      };
    } catch (error) {
      return {
        status: 'error',
        message: error.message.includes('POST') ? 
          `Create failed: ${error.message}` : 
          `Created but delete failed: ${error.message}`
      };
    }
  }

  const runAllTests = async () => {
    setIsLoading(true);
    const results = [];
    
    for (const endpoint of endpoints) {
      const startTime = performance.now();
      
      try {
        let result = endpoint.testFn ? 
          await endpoint.testFn() : 
          await testGetEndpoint(endpoint.id, startTime);

        results.push({
          ...endpoint,
          ...result
        });
      } catch (error) {
        results.push({
          ...endpoint,
          status: 'error',
          message: `Failed: ${error.message}`
        });
      }
    }
    
    setTestResults(results);
    setIsLoading(false);
  };

  // Helper for testing GET endpoints
  async function testGetEndpoint(endpoint, startTime) {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/${endpoint}`);
    const endTime = performance.now();
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    return {
      status: 'success',
      message: `OK (${Math.round(endTime - startTime)}ms)`
    };
  }

  return (
    <div className="general-page">
      <h1>API Tests</h1>
      
      <div className="test-controls">
        <button onClick={runAllTests} disabled={isLoading}>
          {isLoading ? 'Running Tests...' : 'Run All Tests'}
        </button>
      </div>

      <div className="test-results">
        {isLoading ? (
          <p>Running tests...</p>
        ) : (
          <ul className="test-list">
            {testResults.map((test) => (
              <li key={test.id} className={`test-item ${test.status}`}>
                <span className="test-name">{test.name}</span>
                <span className="test-status">
                  {test.status === 'success' ? '✓' : '✗'} {test.message}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default TestsPage;