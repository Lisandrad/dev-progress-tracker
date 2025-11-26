import { useState, useEffect } from 'react';
import './App.css'
import { initialTasks } from './data.js'
import TaskItem from './TaskItem.jsx' 
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTaskText, setNewTaskText] = useState('');
  const [addingSubtaskTo, setAddingSubtaskTo] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [selectedDate, setSelectedDate] = useState(null)
  const [searchText, setSearchText] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');


 useEffect(() => {
  const savedTasks = localStorage.getItem('tasks');
  
  if (savedTasks) {
    setTasks(JSON.parse(savedTasks));
  }
  else {
    setTasks(initialTasks);
  }
}, []);

 
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks))
  }, [tasks]);

  useEffect (() => {
    if (Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  useEffect (() => {
    const checkUrgentTasks = () => {
      tasks.forEach(task => {
        if (task.dueDate && !task.completed) {
          const timeRemaining = getTimeRemaining(task.dueDate);
          if (timeRemaining && (timeRemaining.status === 'urgent' || timeRemaining.status === 'overdue')) {
            if (Notification.permission === 'granted') {
              try {
                new Notification('Task nearing due date', {
                body: task.text,
                tag: task.id // esto de aqui es para evitar que se dupliquen los avisos
              })
                console.log('Notificación enviada para:', task.text);              
              } catch (error) {
                console.error('Error enviando notificación:', error);
              }
              
            }
          }
        }
      })
    }
    checkUrgentTasks();

    const interval = setInterval(checkUrgentTasks,60000);
    return () => clearInterval(interval);

  }, [tasks]);

  useEffect(() => {
    const updateInterval = setInterval(() => {
      setTasks([...tasks])
    }, 60000);
    return () => clearInterval(updateInterval);
  })




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
//calculo del tiempo  de la tarea
const getTimeRemaining = ( dueDateString) => {
  if (!dueDateString) return null;

  const now = new Date();
  const dueDate = new Date(dueDateString);
  const diffMs = dueDate - now;

  if (diffMs < 0) {
    return { status: 'overdue', text: 'Late!'};
  }

  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds/60);
  const diffHours = Math.floor(diffMinutes /60);
  const diffDays = Math.floor(diffHours / 24);

  if(diffHours < 1) {
    return { status: 'urgent', text: `Expires in ${diffMinutes} min`}
  }
  if (diffHours < 24) {
    return { status: 'urgent', text: `Expires in ${diffHours}`}
  }
  return { status: 'normal', text: ` Expires in ${diffDays} days `}


}

//para agregar tarea "padre" "maintask"

const addMainTask = (e) => {
  e.preventDefault();
  if (newTaskText.trim() ==='') return;

  const newTask = {
    id: `task-${Date.now()}`,
    text: newTaskText,
    completed: false,
    expanded: true,
    dueDate: selectedDate ? selectedDate.toISOString() : null,
    subtasks: []
  };  

  setTasks([...tasks, newTask]);
  setNewTaskText ('');
  setSelectedDate(null);
  setShowDatePicker(false);
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

//logica de los filtros:

const getFilteredTask = (taskList) => {
  return taskList.filter(task => {
    const matchesSearch = task.text.toLowerCase().includes(searchText.toLocaleLowerCase())
    const matchesStatus =
    filterStatus === 'all' ||
    (filterStatus === 'completed' && task.completed) ||
    (filterStatus === 'pending' && !task.completed);

    return matchesSearch && matchesStatus
  })
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

{/*para buscar las tareas (todas) */}
  <div className='search-container'>
  <input
  type='text'
  value={searchText}
  onChange={(e) => setSearchText(e.target.value)}
  placeholder='Search task'
  className='search-input'
  />
</div>

{/*botones de filtro */}
<div className='filter-buttons'>
  <button
    className={`filter-btn ${filterStatus === 'all' ? 'active' : ''}`}
    onClick={() => setFilterStatus('all')}
  >
    All
  </button>
  <button
  className={`filter-btn ${filterStatus === 'completed' ? 'active' : ''}`}
  onClick={() => setFilterStatus('completed')}
  >
    Completed
  </button>
  <button
  className={`filter-btn ${filterStatus === 'pending' ? 'active' : ''}`}
  onClick={() => setFilterStatus('pending')}
  >
    Pending
  </button>
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
      checked={showDatePicker}
      onChange={(e) => setShowDatePicker(e.target.checked)}
    /> Add due date
  </label>

  {/*  Solo se muestra si checkbox está marcado */}
  {showDatePicker && (
    <DatePicker
      selected={selectedDate}
      onChange={(date) => setSelectedDate(date)}
      showTimeSelect
      timeIntervals={1}
      dateFormat= "Pp"
      placeholder="Select date and time"
      minDate={new Date()}
      className="date-picker-input"
      popperPlacement="bottom"
      autoFocus
     
    ></DatePicker>
  )

  }
</div>


    <button type='submit' className='add-button'>
      + Add Task
    </button>
  </form>

  <div className="tasks-container">
      {tasks.length === 0 ? (
        <p className="empty-state">No hay tareas. ¡Agrega una para empezar!</p>
      ) : (
        getFilteredTask(tasks).map(task => (
          <TaskItem 
            key={task.id}
            task={task}
            level={0}
            getTimeRemaining={getTimeRemaining}
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