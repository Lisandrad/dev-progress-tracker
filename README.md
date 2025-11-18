# Hierarchical Todo List

A web app for organizing tasks with nested subtasks. Built with React to help you break down complex projects into manageable pieces.

🔗 **[Ver Demo](https://lisandrad.github.io/dev-progress-tracker/)**

## What it does
This can create parent tasks and nest subtasks inside them—as many levels deep as you need. Perfect for breaking down big projects into smaller steps.
The progress bar automatically tracks everything, including nested tasks. When you check off all subtasks, the parent task marks itself complete. Uncheck a parent, and all its subtasks uncheck too.
Everything saves to your browser automatically, so your tasks stick around even after closing the tab.

## Key Features

- Create main tasks and add subtasks underneath them
- Unlimited nesting levels—organize however you want
- Smart checkboxes that handle parent-child relationships
- Expand/collapse tasks to keep things tidy
- Visual progress bar that counts everything
- Works on desktop and mobile
- No signup needed—runs entirely in your browser

##  Tech Stack

- React 18
- Vite
- CSS3
- localStorage API
- GitHub Pages
- 
##  Running Locally

### You'll need:

- Node.js (v16 o superior)
- npm o yarn



## Estructura del Proyecto
```
dev-progress-tracker/
├── src/
│   ├── App.jsx              
│   ├── App.css              
│   ├── TaskItem.jsx         
│   ├── data.js              
│   └── main.jsx             
├── public/
├── index.html
├── vite.config.js
└── package.json
```

