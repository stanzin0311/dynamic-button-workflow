// src/OutputPage.js
import React, { useState, useEffect } from 'react';

function OutputPage() {
  const [buttonLabel, setButtonLabel] = useState('Click Me!');
  const [workflow, setWorkflow] = useState([]);
  const [output, setOutput] = useState([]);
  const [buttonSize, setButtonSize] = useState(1);
  const [buttonColor, setButtonColor] = useState('#007bff');
  const [isDisabled, setIsDisabled] = useState(false);

  useEffect(() => {
    const savedConfig = localStorage.getItem('buttonWorkflowConfig');
    if (savedConfig) {
      const { label, workflow } = JSON.parse(savedConfig);
      setButtonLabel(label);
      setWorkflow(workflow);
    }
  }, []);

  const executeWorkflow = async () => {
    const newOutput = [];
    setOutput([]);
    
    for (const action of workflow) {
      try {
        switch (action.type) {
          case 'alert':
            alert(action.params.message);
            newOutput.push(`Alert shown: "${action.params.message}"`);
            break;
            
          case 'showText':
            newOutput.push(action.params.text);
            break;
            
          case 'showImage':
            newOutput.push(
              <img 
                key={`img-${Date.now()}`} 
                src={action.params.url} 
                alt="User provided" 
                style={{ maxWidth: '100%', marginTop: '10px' }} 
              />
            );
            break;
            
          case 'refreshPage':
            window.location.reload();
            break;
            
          case 'setLocalStorage':
            localStorage.setItem(action.params.key, action.params.value);
            newOutput.push(`Set localStorage: ${action.params.key}=${action.params.value}`);
            break;
            
          case 'getLocalStorage':
            const value = localStorage.getItem(action.params.key);
            newOutput.push(`Value from localStorage: ${value}`);
            break;
            
          case 'increaseButtonSize':
            setButtonSize(prev => prev * 1.2);
            newOutput.push('Button size increased');
            break;
            
          case 'closeWindow':
            window.close();
            newOutput.push('Attempted to close window');
            break;
            
          case 'promptAndShow':
            const response = prompt(action.params.prompt);
            newOutput.push(`You entered: ${response}`);
            break;
            
          case 'changeButtonColor':
            const color = action.params.color || 
              `#${Math.floor(Math.random()*16777215).toString(16)}`;
            setButtonColor(color);
            newOutput.push(`Button color changed to ${color}`);
            break;
            
          case 'disableButton':
            setIsDisabled(true);
            newOutput.push('Button disabled');
            break;
            
          default:
            newOutput.push(`Unknown action: ${action.type}`);
        }
      } catch (error) {
        newOutput.push(`Error executing ${action.type}: ${error.message}`);
      }
      
      setOutput([...newOutput]);
      await new Promise(resolve => setTimeout(resolve, 300)); // Small delay between actions
    }
  };

  return (
    <div className="output-page">
      <h1>Output Page</h1>
      
      <button
        onClick={executeWorkflow}
        disabled={isDisabled}
        style={{
          transform: `scale(${buttonSize})`,
          backgroundColor: buttonColor,
          color: 'white',
          padding: '10px 20px',
          border: 'none',
          borderRadius: '5px',
          cursor: isDisabled ? 'not-allowed' : 'pointer',
          fontSize: '16px',
          margin: '20px 0'
        }}
      >
        {buttonLabel}
      </button>
      
      <div className="output-area">
        {output.map((item, index) => (
          <div key={index} className="output-item">
            {typeof item === 'string' ? item : item}
          </div>
        ))}
      </div>
    </div>
  );
}

export default OutputPage;