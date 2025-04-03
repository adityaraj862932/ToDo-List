import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "./redux/authSlice";
import Signup from "./components/Signup";
import Login from "./components/Login";
import Todo from "./components/TodoApp";

export default function App() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  return (
    <Router>
      <Routes>
        <Route path="/" element={user ? <Navigate to="/todo" /> : <Signup />} />
        <Route path="/login" element={user ? <Navigate to="/todo" /> : <Login />} />
        <Route path="/todo" element={user ? <Todo onLogout={() => dispatch(logout())} /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}
