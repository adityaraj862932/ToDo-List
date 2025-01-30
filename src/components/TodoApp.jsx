// import React from 'react'
// import './TodoApp.css'
// import { FaEdit } from 'react-icons/fa'
// import { MdDelete } from 'react-icons/md'
// function TodoApp() {
//   return (
//     <div className="container">
//       <div className="form_c">

//         <div className="form">

//           <div className="head">
//             <h1>Add Task</h1>
//           </div>
//           <form>
//             <div className="task">
//               <div><h2>Title :</h2></div>
//               <div><input type="text"
//                 className='box'
//                 placeholder='Title of Task...'
//               /></div>
//             </div>
//             <div className="desc">
//               <div><h2>Description :</h2></div>
//               <div>
//                 <textarea
//                   type="text"
//                   className='box-2'
//                   placeholder='Description..'
//                 ></textarea>
//               </div>
//             </div>
//             <div className="stat">
//               <div>
//                 <h2>Status:</h2>
//               </div>
//               <div>
//                 <select name="select" className='select'>
//                   <option value="Uncomplete">Uncomplete</option>
//                   <option value="Complete">Complete</option>
//                   <option value="On Process">On Process</option>
//                 </select>
//               </div>
//             </div>
//             <div className="add">
//               <button><strong>Add</strong></button>
//             </div>
//           </form>
//         </div>
//       </div>



//       <div className="list">
//         <div className="list_item">
//           <div className="heading">

//             <div className="title">

//               <h4>hello</h4>

//               </div>
//               <div className="rest">
//                 <div onClick={() => handleEdit(index)} className="edit">
//                   <FaEdit />
//                 </div>
//                 <div className="del" onClick={() => handleDelete(index)}>
//                   <MdDelete />
//                 </div>
//                 <div>
//                   <select

//                     onChange={(e) => updateStatus(index, e.target.value)}
//                     className='select'
//                   >
//                     <option value="uncomplete">Uncomplete</option>
//                     <option value="processing">Processing</option>
//                     <option value="complete">Complete</option>
//                   </select>
//                 </div>
//               </div>
            
//           </div>
//           <div className="des">aljdalk</div>

//         </div>
//       </div>



//     </div>
//   )
// }

// export default TodoApp







import React, { useState } from 'react';
import './TodoApp.css';
import { FaEdit } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';

function TodoApp() {
  const [tasks, setTasks] = useState([]);
  const [formValues, setFormValues] = useState({
    title: '',
    description: '',
    status: 'Uncomplete',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editIndex, setEditIndex] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleAddOrUpdateTask = (e) => {
    e.preventDefault();
    if (formValues.title.trim() && formValues.description.trim()) {
      if (isEditing) {
        // Update the task at the same index
        const updatedTasks = tasks.map((task, index) =>
          index === editIndex ? formValues : task
        );
        setTasks(updatedTasks);
        setIsEditing(false);
        setEditIndex(null);
      } else {
        // Add a new task
        //git
        setTasks([...tasks, formValues]);
      }

      // Reset the form
      setFormValues({
        title: '',
        description: '',
        status: 'Uncomplete',
      });
    }
  };

  const handleEdit = (index) => {
    setFormValues(tasks[index]);
    setIsEditing(true);
    setEditIndex(index);
  };

  const handleDelete = (index) => {
    const updatedTasks = tasks.filter((_, i) => i !== index);
    setTasks(updatedTasks);
  };

  const updateStatus = (index, newStatus) => {
    const updatedTasks = tasks.map((task, i) =>
      i === index ? { ...task, status: newStatus } : task
    );
    setTasks(updatedTasks);
  };

  return (
    <div className="container">
      {/* Form Section */}
      <div className="form_c">
        <div className="form">
          <div className="head">
            <h1>{isEditing ? 'Edit Task' : 'Add Task'}</h1>
          </div>
          <form onSubmit={handleAddOrUpdateTask}>
            <div className="task">
              <div><h2>Title :</h2></div>
              <div>
                <input
                  type="text"
                  className="box"
                  placeholder="Title of Task..."
                  name="title"
                  value={formValues.title}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="desc">
              <div><h2>Description :</h2></div>
              <div>
                <textarea
                  className="box-2"
                  placeholder="Description.."
                  name="description"
                  value={formValues.description}
                  onChange={handleInputChange}
                ></textarea>
              </div>
            </div>
            <div className="stat">
              <div>
                <h2>Status:</h2>
              </div>
              <div>
                <select
                  name="status"
                  className="select"
                  value={formValues.status}
                  onChange={handleInputChange}
                >
                  <option value="Uncomplete">Uncomplete</option>
                  <option value="Complete">Complete</option>
                  <option value="On Process">On Process</option>
                </select>
              </div>
            </div>
            <div className="add">
              <button type="submit">
                <strong>{isEditing ? 'Update' : 'Add'}</strong>
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* List Section */}
      <div className="list">
        {tasks.map((task, index) => (
          <div key={index} className="list_item">
            <div className="heading">
              <div className="title">
                <h4>{task.title}</h4>
              </div>
              <div className="rest">
                <div onClick={() => handleEdit(index)} className="edit">
                  <FaEdit />
                </div>
                <div className="del" onClick={() => handleDelete(index)}>
                  <MdDelete />
                </div>
                <div>
                  <select
                    className="select"
                    value={task.status}
                    onChange={(e) => updateStatus(index, e.target.value)}
                  >
                    <option value="Uncomplete">Uncomplete</option>
                    <option value="On Process">On Process</option>
                    <option value="Complete">Complete</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="des">{task.description}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TodoApp;
