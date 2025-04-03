// import { useState, useEffect } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import { logout } from "../redux/authSlice";
// import { useNavigate } from "react-router-dom";
// import { FaEdit } from "react-icons/fa";
// import { MdDelete } from "react-icons/md";

// const TodoApp = () => {
//   const user = useSelector((state) => state.auth.user);
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const token = localStorage.getItem("token"); // Retrieve token

//   // State for tasks
//   const [tasks, setTasks] = useState([]);
//   const [formValues, setFormValues] = useState({ title: "", description: "", status: "Uncomplete" });
//   const [isEditing, setIsEditing] = useState(false);
//   const [editId, setEditId] = useState(null);

//   // ✅ Fetch tasks when component loads
//   useEffect(() => {
//     fetchTasks();
//   }, []);

//   const fetchTasks = async () => {
//     try {
//       const response = await fetch("http://localhost:5000/tasks", {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       if (!response.ok) throw new Error("Failed to fetch tasks");
//       const data = await response.json();
//       setTasks(data);
//     } catch (error) {
//       console.error("Error fetching tasks:", error);
//     }
//   };

//   // ✅ Handle input changes
//   const handleInputChange = (e) => {
//     setFormValues({ ...formValues, [e.target.name]: e.target.value });
//   };

//   // ✅ Add or update task
//   const handleAddOrUpdateTask = async (e) => {
//     e.preventDefault();
//     const method = isEditing ? "PUT" : "POST";
//     const url = isEditing ? `http://localhost:5000/tasks/${editId}` : "http://localhost:5000/tasks";

//     try {
//       const response = await fetch(url, {
//         method,
//         headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
//         body: JSON.stringify(formValues),
//       });

//       if (!response.ok) throw new Error("Failed to save task");

//       setIsEditing(false);
//       setFormValues({ title: "", description: "", status: "Uncomplete" });
//       fetchTasks(); // ✅ Refresh task list after saving
//     } catch (error) {
//       console.error("Error saving task:", error);
//     }
//   };

//   // ✅ Edit task (fill form with task details)
//   const handleEdit = (task) => {
//     setFormValues(task);
//     setIsEditing(true);
//     setEditId(task._id);
//   };

//   // ✅ Delete task (remove from DB and UI)
//   const handleDelete = async (id) => {
//     try {
//       const response = await fetch(`http://localhost:5000/tasks/${id}`, {
//         method: "DELETE",
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       if (!response.ok) throw new Error("Failed to delete task");

//       setTasks(tasks.filter((task) => task._id !== id)); // ✅ Remove task from state
//     } catch (error) {
//       console.error("Error deleting task:", error);
//     }
//   };

//   // ✅ Update task status (only send status update request)
//   const updateStatus = async (id, newStatus) => {
//     try {
//       const response = await fetch(`http://localhost:5000/tasks/${id}`, {
//         method: "PUT",
//         headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
//         body: JSON.stringify({ status: newStatus }),
//       });

//       if (!response.ok) throw new Error("Failed to update status");

//       fetchTasks(); // ✅ Refresh task list after update
//     } catch (error) {
//       console.error("Error updating task status:", error);
//     }
//   };

//   // ✅ Logout function
//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     dispatch(logout());
//     navigate("/login");
//   };



import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../redux/authSlice";
import axios from "axios";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { useNavigate } from "react-router-dom";

export default function Todo() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [tasks, setTasks] = useState([]);
  const [formValues, setFormValues] = useState({ title: "", description: "", status: "Uncomplete" });
  const [isEditing, setIsEditing] = useState(false);
  const [editTaskId, setEditTaskId] = useState(null);

  useEffect(() => {
    axios.get("http://localhost:5000/tasks", { withCredentials: true })
      .then(res => setTasks(res.data))
      .catch(() => alert("Failed to fetch tasks"));
  }, [tasks]);

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/login");
  };

  const handleInputChange = (e) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value });
  };

  const handleAddOrUpdateTask = (e) => {
    e.preventDefault();
    if (isEditing) {
      axios.put(`http://localhost:5000/tasks/${editTaskId}`, formValues, { withCredentials: true })
        .then(() => {
          setTasks(prevTasks => prevTasks.map(task => task._id === editTaskId ? { ...task, ...formValues } : task));
          setIsEditing(false);
          setEditTaskId(null);
          setFormValues({ title: "", description: "", status: "Uncomplete" });
        })
        .catch(() => alert("Failed to update task"));
    } else {
      axios.post("http://localhost:5000/tasks", formValues, { withCredentials: true })
        .then(res => {
          setTasks(prevTasks => [...prevTasks, { ...formValues, _id: res.data._id }]);
          setFormValues({ title: "", description: "", status: "Uncomplete" });
        })
        .catch(() => alert("Failed to add task"));
    }
  };

  const handleEdit = (task) => {
    setFormValues({ title: task.title, description: task.description, status: task.status });
    setIsEditing(true);
    setEditTaskId(task._id);
  };

  const handleDelete = (id) => {
    axios.delete(`http://localhost:5000/tasks/${id}`, { withCredentials: true })
      .then(() => setTasks(prevTasks => prevTasks.filter(task => task._id !== id)))
      .catch(() => alert("Failed to delete task"));
  };

  const updateStatus = (id, status) => {
    axios.put(`http://localhost:5000/tasks/${id}`, { status }, { withCredentials: true })
      .then(() => setTasks(prevTasks => prevTasks.map(task => task._id === id ? { ...task, status } : task)))
      .catch(() => alert("Failed to update status"));
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-gray-100">
      <nav className="h-[10%] w-full flex items-center justify-between px-6 bg-blue-500 text-white shadow-md">
        <h1 className="text-2xl font-semibold">{user?.username}'s Todo App</h1>
        <button className="bg-red-500 px-4 py-2 rounded" onClick={handleLogout}>Logout</button>
      </nav>

      <div className="h-[90%] w-full flex">
        <div className="w-1/2 flex items-center justify-center">
          <div className="w-[60%] bg-white p-6 rounded-lg shadow-lg border-2 border-gray-300">
            <h2 className="text-xl font-bold text-center mb-4">{isEditing ? "Edit Task" : "Add Task"}</h2>
            <form onSubmit={handleAddOrUpdateTask}>
              <div className="mb-4">
                <label className="block font-medium">Title:</label>
                <input type="text" className="w-full p-2 border border-gray-300 rounded-lg" name="title" value={formValues.title} onChange={handleInputChange} required />
              </div>
              <div className="mb-4">
                <label className="block font-medium">Description:</label>
                <textarea className="w-full p-2 border border-gray-300 rounded-lg" name="description" value={formValues.description} onChange={handleInputChange} required></textarea>
              </div>
              <div className="mb-4">
                <label className="block font-medium">Status:</label>
                <select name="status" className="w-full p-2 border rounded-lg" value={formValues.status} onChange={handleInputChange}>
                  <option value="Uncomplete">Uncomplete</option>
                  <option value="Complete">Complete</option>
                  <option value="On Process">On Process</option>
                </select>
              </div>
              <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded-md">{isEditing ? "Update Task" : "Add Task"}</button>
            </form>
          </div>
        </div>

        <div className="w-1/2 h-full p-6 overflow-y-auto">
          <h2 className="text-2xl font-semibold mb-4">Your Tasks</h2>
          {tasks.length === 0 ? (
            <p className="text-gray-600">No tasks available. Add some tasks!</p>
          ) : (
            <div className="space-y-4">
              {tasks.map((task) => (
                <div key={task._id} className="p-4 bg-gray-200 rounded-lg border-2 border-gray-600">
                  <div className="flex justify-between">
                    <h4 className="text-lg font-semibold">{task.title}</h4>
                    <div className="flex gap-3">
                      <FaEdit onClick={() => handleEdit(task)} className="text-blue-700 text-xl cursor-pointer hover:text-gray-700" />
                      <MdDelete onClick={() => handleDelete(task._id)} className="text-red-600 text-xl cursor-pointer hover:text-gray-700" />
                    </div>
                  </div>
                  <p className="text-gray-700">{task.description}</p>
                  <select className="p-1 border rounded-lg" value={task.status} onChange={(e) => updateStatus(task._id, e.target.value)}>
                    <option value="Uncomplete">Uncomplete</option>
                    <option value="On Process">On Process</option>
                    <option value="Complete">Complete</option>
                  </select>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
