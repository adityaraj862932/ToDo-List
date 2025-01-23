// import React, { useState } from "react";
// import "./TodoApp.css";
// import { FaEdit } from "react-icons/fa";
// import { MdDelete } from "react-icons/md";

// const TodoApp = () => {
//   const [todos, setTodos] = useState([]);
//   const [newTodo, setNewTodo] = useState({ title: "", description: "", status: "uncomplete" });
//   const [editIndex, setEditIndex] = useState(null);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setNewTodo({ ...newTodo, [name]: value });
//   };

//   const addOrUpdateTodo = () => {
//     if (editIndex !== null) {
//       const updatedTodos = [...todos];
//       updatedTodos[editIndex] = newTodo;
//       setTodos(updatedTodos);
//       setEditIndex(null);
//     } else {
//       setTodos([...todos, newTodo]);
//     }
//     setNewTodo({ title: "", description: "", status: "uncomplete" });
//   };

//   const handleEdit = (index) => {
//     setNewTodo(todos[index]);
//     setEditIndex(index);
//   };

//   const handleDelete = (index) => {
//     const updatedTodos = todos.filter((_, i) => i !== index);
//     setTodos(updatedTodos);
//   };

//   const updateStatus = (index, status) => {
//     const updatedTodos = [...todos];
//     updatedTodos[index].status = status;
//     setTodos(updatedTodos);
//   };

//   return (
//     <div className="container">
//         <div className="header">
//                 <h2>Todo App</h2>
//               <div className="input-container">
//                 <input
//                   type="text"
//                   name="title"
//                   placeholder="Title"
//                   value={newTodo.title}
//                   onChange={handleInputChange}
//                   required
//                 />
//                 <input
//                   type="text"
//                   name="description"
//                   placeholder="Description"
//                   value={newTodo.description}
//                   onChange={handleInputChange}
//                   required
//                 />
//                 <select name="status" value={newTodo.status} onChange={handleInputChange}>
//                   <option value="uncomplete">Uncomplete</option>
//                   <option value="processing">Processing</option>
//                   <option value="complete">Complete</option>
//                 </select>
//                 <button onClick={addOrUpdateTodo}>
//                   {editIndex !== null ? "Update" : "Add"}
//                 </button>
//               </div>
//         </div>

//         <div className="list">
//             <div className="todo-list">
//             {todos.map((todo, index) => (
//               <div key={index} className="todo-item">
//                       <div className="title_edit">
//                         <div className="title">{todo.title}</div>
//                         <div onClick={() => handleEdit(index)} className='edit'><FaEdit/></div>
//                         <div className="select">
//                           <select
//                             value={todo.status}
//                             onChange={(e) => updateStatus(index, e.target.value)}
//                           >
//                             <option value="uncomplete">Uncomplete</option>
//                             <option value="processing">Processing</option>
//                             <option value="complete">Complete</option>
//                           </select>
//                         </div>
//                         <div className="del" onClick={() => handleDelete(index)}><MdDelete/></div>
//                       </div>

//                       <div className="des_stat">
                        
//                         <p>Status: <strong>{todo.status}</strong></p>

//                       </div>
//                       <p>{todo.description}</p>
                
//                 <div>
//                   {/* <button onClick={() => handleEdit(index)}><FaEdit/></button> */}
//                   {/* <button onClick={() => handleDelete(index)}><MdDelete/></button> */}
                 
//                 </div>
//               </div>
//             ))}
//       </div>
//         </div>
//     </div>
//   );
// };

// export default TodoApp;


import React, { useState } from "react";
import "./TodoApp.css";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

const TodoApp = () => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState({ title: "", description: "", status: "uncomplete" });
  const [editIndex, setEditIndex] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTodo({ ...newTodo, [name]: value });
  };

  const addOrUpdateTodo = () => {
    // Validate the title and description fields
    if (!newTodo.title.trim() || !newTodo.description.trim()) {
      alert("Please fill out both the title and description fields.");
      return;
    }

    if (editIndex !== null) {
      const updatedTodos = [...todos];
      updatedTodos[editIndex] = newTodo;
      setTodos(updatedTodos);
      setEditIndex(null);
    } else {
      setTodos([...todos, newTodo]);
    }
    setNewTodo({ title: "", description: "", status: "uncomplete" });
  };

  const handleEdit = (index) => {
    setNewTodo(todos[index]);
    setEditIndex(index);
  };

  const handleDelete = (index) => {
    const updatedTodos = todos.filter((_, i) => i !== index);
    setTodos(updatedTodos);
  };

  const updateStatus = (index, status) => {
    const updatedTodos = [...todos];
    updatedTodos[index].status = status;
    setTodos(updatedTodos);
  };

  return (
    <div className="container">
      <div className="header">
        <h2>Todo App</h2>
        <div className="input-container">
          <input
            type="text"
            name="title"
            placeholder="Title"
            value={newTodo.title}
            onChange={handleInputChange}
            required
          />
          <input
            type="text"
            name="description"
            placeholder="Description"
            value={newTodo.description}
            onChange={handleInputChange}
            required
          />
          <select name="status" value={newTodo.status} onChange={handleInputChange}>
            <option value="uncomplete">Uncomplete</option>
            <option value="processing">Processing</option>
            <option value="complete">Complete</option>
          </select>
          <button onClick={addOrUpdateTodo}>
            {editIndex !== null ? "Update" : "Add"}
          </button>
        </div>
      </div>

      <div className="list">
        <div className="todo-list">
          {todos.map((todo, index) => (
            <div key={index} className="todo-item">
              <div className="title_edit">
                <div className="title">
                   <div className="title">{todo.title}</div>
                </div>
                <div className="rest">
                      <div onClick={() => handleEdit(index)} className="edit">
                        <FaEdit />
                      </div>
                      <div className="del" onClick={() => handleDelete(index)}>
                        <MdDelete />
                      </div>
                      <div className="select">
                        <select
                          value={todo.status}
                          onChange={(e) => updateStatus(index, e.target.value)}
                          className={`select-${todo.status}`}
                        >
                          <option value="uncomplete">Uncomplete</option>
                          <option value="processing">Processing</option>
                          <option value="complete">Complete</option>
                        </select>
                      </div>
                </div>
                
               
              </div>

              <div className="des">
                <p>{todo.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TodoApp;
