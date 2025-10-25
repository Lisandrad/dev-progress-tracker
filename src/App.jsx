import { useState, useEffect } from 'react';
import './App.css'
import { phases } from './data.js'

function App() {
  const firstPhase = phases[0];
  const [completedTasks, setCompletedTasks] = useState([]);
  const [customTasks, setCustomTasks] = useState([]);
  const [newTaskText, setNewTaskText] = useState('');

 useEffect(() => {
  const savedCompleted = localStorage.getItem('completedTasks');
  const savedCustom = localStorage.getItem('customTasks');
  
  if (savedCompleted) {
    setCompletedTasks(JSON.parse(savedCompleted));
  }
  if (savedCustom) {
    setCustomTasks(JSON.parse(savedCustom));
  }
}, []);

  useEffect(() => {
    localStorage.setItem('customTasks', JSON.stringify(customTasks))
  }, [customTasks])

  useEffect(() => {
    localStorage.setItem('completedTasks', JSON.stringify(completedTasks));
  }, [completedTasks]);

  const allTask = [...firstPhase.tasks, ...customTasks]
  const totalTasks = allTask.length;  
  const completedCount = completedTasks.length;
  const progressPercentage = Math.round((completedCount / totalTasks) * 100);

  const handleTaskToggle = (taskId) => {
    if (completedTasks.includes(taskId)) {
      setCompletedTasks(completedTasks.filter(id => id !== taskId));
    } else {
      setCompletedTasks([...completedTasks, taskId]);
    }
  };

  const handleAddTask = (e) => {
    e.preventDefault();

    if (newTaskText.trim() === '') return;

    const newTask = {
      id: `custom-${Date.now()}`,
      text: newTaskText
    };
    setCustomTasks([...customTasks, newTask]);
    setNewTaskText('');
  }

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
        
        <form onSubmit={handleAddTask} className="add-task-form">
          <input
            type="text"
            value={newTaskText}
            onChange={(e) => setNewTaskText(e.target.value)}
            placeholder="Agregar nueva tarea..."
            className="task-input"
          />
          <button type="submit" className="add-button">
            + Add 
          </button>
        </form>

<div></div>

        <div>
          {allTask.map((task) =>   (
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