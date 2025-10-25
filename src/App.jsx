import { useState, useEffect } from 'react';
import './App.css'
import { phases } from './data.js'

function App() {
  const firstPhase = phases[0];
  const [completedTasks, setCompletedTasks] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('completedTasks');
    if (saved) {
      setCompletedTasks(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('completedTasks', JSON.stringify(completedTasks));
  }, [completedTasks]);

  const totalTasks = firstPhase.tasks.length;
  const completedCount = completedTasks.length;
  const progressPercentage = Math.round((completedCount / totalTasks) * 100);

  const handleTaskToggle = (taskId) => {
    if (completedTasks.includes(taskId)) {
      setCompletedTasks(completedTasks.filter(id => id !== taskId));
    } else {
      setCompletedTasks([...completedTasks, taskId]);
    }
  };

  return (
    <div className="app-container">
      <h1>75 Hard Dev Progress Tracker</h1>
      
      <div className='progress-container'>
        <div className='progress-info'>
          <span>Progreso: {completedCount}/{totalTasks} tareas</span>
          <span>{progressPercentage}%</span>
        </div>
        <div className='progress-bar'>
          <div 
            className='progress-fill' 
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>

      <div>
        <h2>{firstPhase.title}</h2>
        <p>{firstPhase.days}</p>
        
        <div>
          {firstPhase.tasks.map((task) => (
            <div key={task.id}>
              <input 
                type="checkbox" 
                id={task.id}
                checked={completedTasks.includes(task.id)}
                onChange={() => handleTaskToggle(task.id)}
              />
              <label htmlFor={task.id}>{task.text}</label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;