// src/ConfigPage.js
import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const actionTypes = [
  { id: 'alert', name: 'Alert', fields: [{ name: 'message', type: 'text' }] },
  { id: 'showText', name: 'Show Text', fields: [{ name: 'text', type: 'text' }] },
  { id: 'showImage', name: 'Show Image', fields: [{ name: 'url', type: 'text' }] },
  { id: 'refreshPage', name: 'Refresh Page', fields: [] },
  { id: 'setLocalStorage', name: 'Set LocalStorage', fields: [{ name: 'key', type: 'text' }, { name: 'value', type: 'text' }] },
  { id: 'getLocalStorage', name: 'Get LocalStorage', fields: [{ name: 'key', type: 'text' }] },
  { id: 'increaseButtonSize', name: 'Increase Button Size', fields: [] },
  { id: 'closeWindow', name: 'Close Window', fields: [] },
  { id: 'promptAndShow', name: 'Prompt and Show', fields: [{ name: 'prompt', type: 'text' }] },
  { id: 'changeButtonColor', name: 'Change Button Color', fields: [{ name: 'color', type: 'color', optional: true }] },
  { id: 'disableButton', name: 'Disable Button', fields: [] },
];

function ConfigPage() {
  const [buttonLabel, setButtonLabel] = useState('Click Me!');
  const [workflow, setWorkflow] = useState([]);
  const [selectedAction, setSelectedAction] = useState(actionTypes[0].id);
  const [actionParams, setActionParams] = useState({});

  useEffect(() => {
    const savedConfig = localStorage.getItem('buttonWorkflowConfig');
    if (savedConfig) {
      const { label, workflow } = JSON.parse(savedConfig);
      setButtonLabel(label);
      setWorkflow(workflow);
    }
  }, []);

  const saveConfig = () => {
    const config = { label: buttonLabel, workflow };
    localStorage.setItem('buttonWorkflowConfig', JSON.stringify(config));
    alert('Configuration saved!');
  };

  const addAction = () => {
    const actionType = actionTypes.find(a => a.id === selectedAction);
    const newAction = {
      id: uuidv4(),
      type: selectedAction,
      params: { ...actionParams }
    };
    setWorkflow([...workflow, newAction]);
    setActionParams({});
  };

  const removeAction = (id) => {
    setWorkflow(workflow.filter(action => action.id !== id));
  };

  const updateActionParams = (actionId, newParams) => {
    setWorkflow(workflow.map(action => 
      action.id === actionId ? { ...action, params: newParams } : action
    ));
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(workflow);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setWorkflow(items);
  };

  return (
    <div className="config-page">
      <h1>Button Workflow Config</h1>
      
      <div className="form-group">
        <label>Button Label:</label>
        <input 
          type="text" 
          value={buttonLabel} 
          onChange={(e) => setButtonLabel(e.target.value)} 
        />
      </div>
      
      <h2>Workflow Actions</h2>
      
      <div className="add-action">
        <select 
          value={selectedAction} 
          onChange={(e) => setSelectedAction(e.target.value)}
        >
          {actionTypes.map(action => (
            <option key={action.id} value={action.id}>{action.name}</option>
          ))}
        </select>
        
        {actionTypes.find(a => a.id === selectedAction).fields.map(field => (
          <div key={field.name} className="param-field">
            <label>{field.name}:</label>
            {field.type === 'color' ? (
              <input 
                type="color" 
                value={actionParams[field.name] || '#000000'}
                onChange={(e) => setActionParams({...actionParams, [field.name]: e.target.value})}
              />
            ) : (
              <input 
                type="text" 
                value={actionParams[field.name] || ''}
                onChange={(e) => setActionParams({...actionParams, [field.name]: e.target.value})}
                placeholder={field.name}
              />
            )}
          </div>
        ))}
        
        <button onClick={addAction}>Add Action</button>
      </div>
      
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="workflow">
          {(provided) => (
            <div 
              className="workflow-list" 
              {...provided.droppableProps} 
              ref={provided.innerRef}
            >
              {workflow.map((action, index) => {
                const actionType = actionTypes.find(a => a.id === action.type);
                return (
                  <Draggable key={action.id} draggableId={action.id} index={index}>
                    {(provided) => (
                      <div 
                        className="workflow-item" 
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                      >
                        <div className="action-header" {...provided.dragHandleProps}>
                          <span>{actionType.name}</span>
                          <button onClick={() => removeAction(action.id)}>×</button>
                        </div>
                        
                        {actionType.fields.map(field => (
                          <div key={field.name} className="param-field">
                            <label>{field.name}:</label>
                            <input 
                              type="text" 
                              value={action.params[field.name] || ''}
                              onChange={(e) => updateActionParams(
                                action.id, 
                                {...action.params, [field.name]: e.target.value}
                              )}
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </Draggable>
                );
              })}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      
      <button className="save-btn" onClick={saveConfig}>Save Configuration</button>
      
      <div className="workflow-preview">
        <h3>Workflow Preview</h3>
        <ol>
          {workflow.map((action, index) => (
            <li key={action.id}>
              {actionTypes.find(a => a.id === action.type).name}
              {action.type === 'alert' && `: "${action.params.message}"`}
              {action.type === 'showText' && `: "${action.params.text}"`}
              {action.type === 'showImage' && `: ${action.params.url}`}
              {action.type === 'setLocalStorage' && `: ${action.params.key}=${action.params.value}`}
              {action.type === 'getLocalStorage' && `: ${action.params.key}`}
              {action.type === 'promptAndShow' && `: "${action.params.prompt}"`}
              {action.type === 'changeButtonColor' && action.params.color && `: ${action.params.color}`}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

export default ConfigPage;