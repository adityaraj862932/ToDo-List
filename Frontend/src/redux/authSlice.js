import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const authSlice = createSlice({
  name: "auth",
  initialState: { user: null },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    logout: (state) => {
      state.user = null;
    },
  },
});

export const { setUser, logout } = authSlice.actions;

export const loginUser = (userData, navigate) => async (dispatch) => {
  try {
    await axios.post("http://localhost:5000/login", userData, { withCredentials: true });
    dispatch(setUser(userData.username));
    navigate("/todo");
  } catch {
    alert("Invalid credentials");
  }
};

export const registerUser = (userData, navigate) => async (dispatch) => {
  try {
    await axios.post("http://localhost:5000/signup", userData);
    dispatch(setUser(userData.username));
    navigate("/todo");
  } catch {
    alert("Signup failed");
  }
};

export const logoutUser = () => async (dispatch) => {
  await axios.post("http://localhost:5000/logout", {}, { withCredentials: true });
  dispatch(logout());
};

export default authSlice.reducer;
