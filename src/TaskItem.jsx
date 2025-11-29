import { background } from "@chakra-ui/react";
import { useState } from "react";

function TaskItem({
    task,
    level,
    getTimeRemaining,
    onToggle,
    onDelete,
    onToggleExpand,
    onAddSubtask,
    addingSubtaskTo,
    setAddingSubtaskTo,
    CATEGORIES
    
}) {
    const [subtaskText, setSubtaskText] = useState('');
    const hasSubtasks = task.subtasks && task.subtasks.length > 0;
    const isExpanded = task.expanded;
    const isAddingSubtask = addingSubtaskTo === task.id;
    const timeRemaining = task.dueDate ? getTimeRemaining(task.dueDate) : null;

    const handleAddSubtask = (e) => {
      e.preventDefault();
      onAddSubtask(task.id, subtaskText);
      setSubtaskText('');
    };

    return (
      <div className="task-item-wrapper" style={{marginLeft: `${level * 30}px`}}>
        <div className={`task-item ${timeRemaining?.status || ''}`}>
          <div className="task-content">
            {hasSubtasks && (
              <button
                onClick={() => onToggleExpand(task.id)}
                className="expand-button">
                {isExpanded ? '▼' : '▶'}
              </button>
            )}
            
            <input
              type="checkbox"
              id={task.id}
              checked={task.completed}
              onChange={() => onToggle(task.id)}
              className="task-checkbox"
            />
            
            <label 
              htmlFor={task.id}
              className={task.completed ? 'completed' : ''}>
              {task.text}
            </label>


            {hasSubtasks && (
              <span className="subtask-count">
                ({task.subtasks.filter(s => s.completed).length}/{task.subtasks.length})
              </span>
            )}

           {/*Fecha de vencimiento*/}

           {task.dueDate && (
            <div className={ `task-due-date ${timeRemaining?.status || ''}`}>
              <span className="due-date-text"> 
                {getTimeRemaining(task.dueDate)?.text}
              </span>
            </div>
           )}

           {task.category && CATEGORIES[task.category] && (
            <div 
              className='task-category-badge'
              style={{ backgroundColor: CATEGORIES[task.category].color }}
            >
              {CATEGORIES[task.category].label}
            </div>
          )}
          </div> 

          <div className="task-actions">
            <button
              onClick={() => setAddingSubtaskTo(task.id)}
              className="action-button add-sub"
              title="Add Subtask">
              +
            </button>
            <button
              onClick={() => onDelete(task.id)}
              className="action-button delete"
              title="Delete task">
              ✕
            </button>
          </div>
        </div>

        {isAddingSubtask && (
          <form onSubmit={handleAddSubtask} className="add-subtask-form">
            <input
              type="text"
              value={subtaskText}
              onChange={(e) => setSubtaskText(e.target.value)}
              placeholder="Subtask's Name"
              className="subtask-input"
              autoFocus
            />
            <button type="submit" className="subtask-add-btn">✓</button>
            <button
              type="button"
              onClick={() => setAddingSubtaskTo(null)}
              className="subtask-cancel-btn">
              ✕
            </button>
          </form>
        )}

        {hasSubtasks && isExpanded && (
          <div className="subtasks-container">
            {task.subtasks.map(subtask => (
              <TaskItem
                key={subtask.id}
                task={subtask}
                level={level + 1}
                /*getTimeRemaining = {}*/
                onToggle={onToggle}
                onDelete={onDelete}
                onToggleExpand={onToggleExpand}
                onAddSubtask={onAddSubtask}
                addingSubtaskTo={addingSubtaskTo}
                setAddingSubtaskTo={setAddingSubtaskTo}
              />
            ))}
          </div>
        )}
      </div>
    );
}

export default TaskItem;