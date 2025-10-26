# 📋 Hierarchical Todo List

Una aplicación web de lista de tareas jerárquica construida con React, que permite organizar tareas con subtareas anidadas y trackear el progreso en tiempo real.

🔗 **[Ver Demo](https://lisandrad.github.io/dev-progress-tracker/)**

## ✨ Características

- ✅ **Tareas Jerárquicas**: Crea tareas padre con subtareas anidadas
- ✅ **Progreso Inteligente**: Calcula automáticamente el progreso total incluyendo subtareas
- ✅ **Expandir/Colapsar**: Organiza visualmente tus tareas
- ✅ **Persistencia Local**: Tus tareas se guardan automáticamente en localStorage
- ✅ **Interfaz Intuitiva**: Diseño limpio con paleta de colores cohesiva
- ✅ **Responsive**: Funciona perfectamente en desktop y móvil
- ✅ **Completado en Cascada**: Al completar todas las subtareas, la tarea padre se marca automáticamente

## Funcionalidades Principales:

1. **Agregar Tarea Principal**
   - Input principal para crear tareas de nivel superior

2. **Agregar Subtareas**
   - Botón "+" en cada tarea para agregar subtareas
   - Anidación ilimitada de niveles

3. **Marcar como Completada**
   - Checkbox para cada tarea
   - Lógica inteligente: desmarca todas las hijas si desmarcas el padre
   - Marca el padre automáticamente si todas las hijas están completas

4. **Eliminar Tareas**
   - Botón "✕" elimina la tarea y todas sus subtareas

5. **Barra de Progreso**
   - Muestra progreso visual y porcentaje
   - Cuenta todas las tareas (incluyendo subtareas)\
  
## 🛠️ Tecnologías Utilizadas

- **React 18** - Librería de UI
- **Vite** - Build tool y dev server
- **CSS3** - Estilos personalizados
- **localStorage API** - Persistencia de datos
- **GitHub Pages** - Hosting

## 📦 Instalación y Uso Local

### Prerrequisitos

- Node.js (v16 o superior)
- npm o yarn

### Pasos

1. **Clonar el repositorio**
```bash
   git clone https://github.com/Lisandrad/dev-progress-tracker.git
   cd dev-progress-tracker
```

2. **Instalar dependencias**
```bash
   npm install
```

3. **Ejecutar en modo desarrollo**
```bash
   npm run dev
```

4. **Abrir en el navegador**
```
   http://localhost:5173
```

### Build para producción
```bash
npm run build
```

Los archivos optimizados estarán en la carpeta `dist/`.

---

## 📂 Estructura del Proyecto
```
dev-progress-tracker/
├── src/
│   ├── App.jsx              # Componente principal
│   ├── App.css              # Estilos globales
│   ├── TaskItem.jsx         # Componente recursivo de tarea
│   ├── data.js              # Estructura de datos inicial
│   └── main.jsx             # Entry point
├── public/
├── index.html
├── vite.config.js
└── package.json
```
## 🧠 Conceptos Aprendidos

Este proyecto fue desarrollado como parte de mi aprendizaje de desarrollo web. Durante su construcción aprendí:

- ✅ **Componentes Recursivos**: TaskItem se llama a sí mismo para renderizar subtareas
- ✅ **Estado Complejo**: Manejo de objetos anidados con useState
- ✅ **Refactorización**: Transformé un proyecto lineal en uno jerárquico
- ✅ **Git Workflow**: Uso de branches, backups y buenas prácticas
- ✅ **Deploy**: Configuración de GitHub Pages con Vite
- ✅ **Lógica Condicional**: Cascada de completados padre-hijo
- ✅ **localStorage**: Persistencia de datos sin backend

## Próximas Mejoras

- [ ] Drag & drop para reordenar tareas
- [ ] Filtros (completadas, pendientes, todas)
- [ ] Búsqueda de tareas
- [ ] Categorías con colores
- [ ] Fechas de vencimiento
- [ ] Dark/Light mode toggle
- [ ] Exportar a JSON/CSV
- [ ] Backend con autenticación (multi-usuario)
