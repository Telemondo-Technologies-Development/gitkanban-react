import { useState } from "react";
import './App.css'

function App(){
    const [columns, setColumns] = useState({
        todo:{
            name: "To Do",
            items:[
                {id: 1, content: "task 1"},
                {id: 2, content: "task 2"},
            ]
        },
        inProgress:{
            name: "In Progress",
            items:[
                {id: 3, content: "task 3"},
            ]
        },
        done:{
            name: "Done",
            items:[
                {id: 4, content: "task 4"},
            ]
        }
    })

    const [newTask, setNewTask] = useState("");
    const [activeColumns, setActiveColumns] = useState("todo");
    const [draggedItem, setDraggedItem] = useState(null);

    const addNewTask = () => {
        if(newTask.trim === "") return;

        const updatedColumns = {...columns};

        updatedColumns[activeColumns].items.push({
            id: Date.now().toString(),
            content: newTask,
        });

        setColumns(updatedColumns);
        setNewTask("");
    }

    const removeTask = (columnId, taskId) => {
        const updatedColumns = {...columns};

        updatedColumns[columnId].items = updatedColumns[columnId].items.filter((item) => item.id !== taskId);

        setColumns(updatedColumns);
    }

    const handleDragStart = (columnId, item) => {
        setDraggedItem({columnId, item});
    }

    const handleDragOver = (e) => {
        e.preventDefault();
    }

    const handleDrop = (e, columnId) => {
        e.preventDefault();

        if(!draggedItem) return;

        const {columnId: sourceColumnId, item} = draggedItem;

        if(sourceColumnId === columnId) return;

        const updatedColumns = {...columns};

        updatedColumns[sourceColumnId].items = updatedColumns[sourceColumnId].items.filter((i) => i.id != item.id);

        updatedColumns[columnId].items.push(item);

        setColumns(updatedColumns);
        setDraggedItem(null);
    }

    const columnStyles = {
        todo: {
            header: "bg-gradient-to-r from-red-600 to-red-400",
            border: "border-red-400",
        },
        inProgress: {
            header: "bg-gradient-to-r from-yellow-600 to-yellow-400",
            border: "border-yellow-400",
        },
        done: {
            header: "bg-gradient-to-r from-green-600 to-green-400",
            border: "border-green-400",
        }
    }

    return (
        <>
            <div className="app-wrapper">
              <div className="app-container">
                <h1 className="app-title">Git Kanban Board</h1>

                <div className="task-input-wrapper">
                  <input
                    type="text"
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    placeholder="Add a new task..."
                    className="task-input"
                    onKeyDown={(e) => e.key === "Enter" && addNewTask()}
                  />

                  <select
                    value={activeColumns}
                    onChange={(e) => setActiveColumns(e.target.value)}
                    className="task-select"
                  >
                    {Object.keys(columns).map((columnId) => (
                      <option value={columnId} key={columnId}>
                        {columns[columnId].name}
                      </option>
                    ))}
                  </select>

                  <button onClick={addNewTask} className="task-button">
                    Add
                  </button>
                </div>

                <div className="columns-wrapper">
                  <div className="columns-wrapper">
                    {Object.keys(columns).map((columnId) => (
                      <div
                        key={columnId}
                        className={`column-card ${columnStyles[columnId].border}`}
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, columnId)}
                      >
                        <div className={`column-header ${columnStyles[columnId].header}`}>
                          {columns[columnId].name}
                          <span>{columns[columnId].items.length}</span>
                        </div>

                        <div className="column-body">
                          {columns[columnId].items.length === 0 ? (
                            <div className="empty-column">Drop tasks here</div>
                          ) : (
                            columns[columnId].items.map((item) => (
                              <div
                                key={item.id}
                                className="task-card"
                                draggable
                                onDragStart={() => handleDragStart(columnId, item)}
                              >
                                <span>{item.content}</span>

                                <button
                                  onClick={() => removeTask(columnId, item.id)}
                                  className="delete-btn"
                                >
                                  ×
                                </button>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
          </div>
        </>
    );
}

export default App;