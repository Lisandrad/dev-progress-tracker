import { useState, useEffect } from 'react';
import './App.css'
import { initialTasks } from './data.js'
import TaskItem from './TaskItem.jsx' 

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTaskText, setNewTaskText] = useState('');
  const [addingSubtaskTo, setAddingSubtaskTo] = useState(null);

  //useEffect 1-------------
 useEffect(() => {
  const savedTasks = localStorage.getItem('tasks');
  
  if (savedTasks) {
    setTasks(JSON.parse(savedTasks));
  }
  else {
    setTasks(initialTasks);
  }
}, []);

//useEffect 2-------------
 
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks))
  }, [tasks]);

  const calculateProgress = () => {
    let total = 0;
    let completed = 0;

    const countTasks = (taskList) => {
      taskList.forEach(task => {
        total++;
        if (task.completed) completed++
        if (task.subtasks && task.subtasks.length > 0) {
          countTasks(task.subtasks);
        }
      });
    }

    countTasks(tasks);
    const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);
    return { total, completed, percentage };
  };

  const progress = calculateProgress();

  const toggleTask = (taskId, parentId = null) => {
  const updateTasks = (taskList) => {
    return taskList.map(task => {
      if (task.id === taskId) {
        const newCompleted = !task.completed;
          if (task.subtasks && !newCompleted) {
            return{
              ...task,
              completed: newCompleted,
              subtasks: task.subtasks.map(sub => ({ ...sub, completed: false}))
            };
          }
          return {...task, completed: newCompleted};
        }

        if (task.subtasks && task.subtasks.length > 0 ) {
          const updatedSubtasks = updateTasks(task.subtasks);
          const allSubtasksCompleted = updatedSubtasks.every(sub => sub.completed)
          return {
            ...task,
            subtasks: updatedSubtasks,
            completed: allSubtasksCompleted && updatedSubtasks.length > 0}
        }
        return task;
      })
    };
    setTasks(updateTasks(tasks));
  };


const toggleExpand = (taskId) => {
  const updateTasks = (taskList) => {
    return taskList.map(task => {
      if (task.id === taskId) {
        return { ...task, expanded: !task.expanded};
      }
      if (task.subtasks) {
        return {...task, subtasks:updateTasks(task.subtasks)}
      }
      return task
    })
  }
  setTasks(updateTasks(tasks));
}

//para agregar tarea "padre"

const addMainTask = (e) => {
  e.preventDefault();
  if (newTaskText.trim() ==='') return;

  const newTask = {
    id: `task-${Date.now()}`,
    text: newTaskText,
    completed: false,
    expanded: true,
    subtasks: []
  };

  setTasks([...tasks, newTask]);
  setNewTaskText ('')
};

//para agregar tarea hija:

const addSubtask = (parentId, subtaskText) => {
  if (subtaskText.trim() === '') return;

  const newSubtask = {
    id: `task-${Date.now()}`,
    text: subtaskText,
    completed: false,
    subtasks: []
  };

  const updateTasks = (taskList) => {
    return taskList.map(task => {
      if (task.id === parentId) {
        return {
          ...task,
          subtasks: [...(task.subtasks || [] ), newSubtask],
          expanded:true
        }

      }
      if (task.subtasks) {
        return {...task, subtasks:updateTasks(task.subtasks)}
      }
      return task;
    })
  }
  setTasks(updateTasks(tasks));
  setAddingSubtaskTo(null);

};
//Para borrar la tarea:

const deleteTask = (taskId) => {
  const removeTasks = (taskList) => {
    return taskList
    .filter(task => task.id !== taskId)
    .map(task => ({...task, subtasks: task.subtasks ? removeTasks(task.subtasks) : []}))
  }
  setTasks(removeTasks(tasks));
}

return (
  <div className='app-container'>
    <h1>ToDo List</h1>

    <div className='progress-container'>
      <div className='progress-info'>
        <span>Progress: {progress.completed}/{progress.total} tareas</span>
        <span>{progress.percentage}%</span>
      </div>
      <div className='progress-bar'>
        <div className='progress-fill' style={{width: `${progress.percentage}%`}}>
        </div>
      </div>
    </div>



  <form onSubmit={addMainTask} className='add-task-form'>
    <input
    type= 'text'
    value={newTaskText}
    onChange={(e) => setNewTaskText(e.target.value)}
    placeholder='Add new Task...'
    className='task-input'
    >
    </input>
{/*Para agregar fecha a las tareas con Datepicker*/}
<div className='date-checkboc-container'>
  <label>
    <input
      type='checkbox'
      checked={showDataPicker}
      onChange={(e) => setShowDataPicker(e.target.checked)}
    /> Add due date for the task
  </label>

</div>


    <button type='submit' className='add-button'>
      + Add Task
    </button>
  </form>

  <div className="tasks-container">
      {tasks.length === 0 ? (
        <p className="empty-state">No hay tareas. ¡Agrega una para empezar!</p>
      ) : (
        tasks.map(task => (
          <TaskItem 
            key={task.id}
            task={task}
            level={0}
            onToggle={toggleTask}
            onDelete={deleteTask}
            onToggleExpand={toggleExpand}
            onAddSubtask={addSubtask}
            addingSubtaskTo={addingSubtaskTo}
            setAddingSubtaskTo={setAddingSubtaskTo}
          />
        ))
      )}
    </div>

      <footer className="footer">
  <p>Made by <strong>Lisandra</strong></p>
  <p className="footer-links">
    <a href="https://github.com/Lisandrad" target="_blank" rel="noopener noreferrer">
      GitHub
    </a>
    {' • '}
    <a href="https://github.com/Lisandrad/dev-progress-tracker" target="_blank" rel="noopener noreferrer">
      View Source
    </a>
  </p>
</footer>


  </div>
)
}

export default App;