import { useState } from 'react';
import './App.css'
import { phases } from './data.js'

function App() {
  const firstPhase = phases[0];
  const [completedTasks, setCompletedTasks] = useState([]);
  return (
    <div className="app-container">
      <h1>75 Hard Dev Progress Tracker</h1>
      
      <div>
        <h2>{firstPhase.title}</h2>
        <p>{firstPhase.days}</p>
        
        <div>
          {firstPhase.tasks.map((task) => (
            <div key={task.id}>
              <input type="checkbox" id= {task.id} />
              <label htmlFor= {task.id}>{task.text}</label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;