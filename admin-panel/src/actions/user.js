/**
 * Here are the action that are called through the app and redux
 * about the user  and their functionalities.
 * First every action performs a request and then
 * depending on the response there is an event dispatch
 */

/**
 * IMPORTS
 */

import axios from "axios";
import jwt from "jwt-decode";
import {
  EMPTY_CART,
  GET_USER,
  LOGIN_FAIL,
  LOGIN_SUCCESS,
  LOGOUT_SUCCESS,
  REGISTER_FAIL,
  REGISTER_SUCCESS,
  SNACKBAR_ERROR,
  SNACKBAR_SUCCESS,
  SUBSCRIBE_USER,
  UNSUBSCRIBE_USER,
  UPDATE_USER,
  USER_LOADING,
} from "./actions";
import { returnErrors } from "./messages";

// LOGIN USER
export const login = (email, password) => (dispatch) => {
  dispatch({
    type: USER_LOADING,
  });
  // Headers
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  // Request Body
  const data = {
    email: email,
    password: password,
  };

  axios
    .post("http://localhost:8080/user/login", data, config)
    .then((res) => {
      // Decode token
      const token = jwt(res.data.access_token);
      const refreshToken = jwt(res.data.refresh_token);
      const data = {
        id: token.user_id,
        user: token.user,
      };
      console.log(res);
      dispatch({
        type: LOGIN_SUCCESS,
        token: res.data.access_token,
        refresh_token: refreshToken,
        user: data.user,
      });
    })
    .then((res) => {
      dispatch({
        type: SNACKBAR_SUCCESS,
        message: "Login successful",
      });
    })
    .catch((err) => {
      console.log(err);
      // dispatch(returnErrors(err, err.status));
      dispatch({
        type: LOGIN_FAIL,
        error: err.response.data.message,
      });
      dispatch({
        type: SNACKBAR_ERROR,
        message: "Invalid credits",
      });
    });
};

// Update User
export const updateUser = (data) => (dispatch) => {
  // Headers
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  // Request Body
  // const body = JSON.stringify({ username, email, password1, password2 });
  const body = data;
  axios
    .put("http://localhost:8080/user/update", body, config)
    .then((res) => {
      // console.log(res);
      dispatch({
        type: UPDATE_USER,
        payload: res.data,
      });
      dispatch({
        type: SNACKBAR_SUCCESS,
        message: "User updated successfully",
      });
    })
    .catch((err) => {
      console.log(err.response);
      dispatch(returnErrors(err, err.status));
      dispatch({
        type: SNACKBAR_ERROR,
        message: err.response.data.message,
      });
    });
};

// Get User by id
export const getUser = (id) => (dispatch) => {
  // Headers
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  axios
    .get(`http://localhost:8080/user/${id}`, config)
    .then((res) => {
      // console.log(res);
      dispatch({
        type: GET_USER,
        payload: res.data,
      });
    })
    .catch((err) => {
      console.log(err.response);
      dispatch(returnErrors(err, err.status));
    });
};

// REGISTER USER
export const register = (data) => (dispatch) => {
  // Headers
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  // Request Body
  // const body = JSON.stringify({ username, email, password1, password2 });
  const body = data;
  axios
    .post("http://localhost:8080/user/register", body, config)
    .then((res) => {
      console.log(res);
      dispatch({
        type: REGISTER_SUCCESS,
        payload: res.data,
      });
      dispatch({
        type: SNACKBAR_SUCCESS,
        message: res.message,
      });
    })
    .catch((err) => {
      console.log(err.response);
      dispatch(returnErrors(err, err.status));
      dispatch({
        type: REGISTER_FAIL,
      });
      dispatch({
        type: SNACKBAR_ERROR,
        message: err.response.data.message,
      });
    });
};

// LOGOUT USER
export const logout = () => (dispatch, getState) => {
  const token = localStorage.getItem("token");

  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };
  axios
    .post("http://localhost:8080/user/logout", null, config)
    .then((res) => {
      dispatch({
        type: EMPTY_CART,
      });
      dispatch({
        type: LOGOUT_SUCCESS,
      });
    })
    .catch((err) => {
      console.log(err);
      dispatch(returnErrors(err, err.status));
    });
};

// SUBSCRIBE USER
export const subscribe = (data) => (dispatch) => {
  // Headers
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  // Request Body
  const body = data;
  axios
    .post("http://localhost:8080/user/subscribe", body, config)
    .then((res) => {
      console.log(res);
      dispatch({
        type: SUBSCRIBE_USER,
        payload: res.data,
      });
      dispatch({
        type: SNACKBAR_SUCCESS,
        message: "Subscribed successfully!",
      });
    })
    .catch((err) => {
      console.log(err.response);
      dispatch(returnErrors(err, err.status));
      dispatch({
        type: SNACKBAR_ERROR,
        message: err.response.data.message,
      });
    });
};

// UNSUBSCRIBE USER
export const unsubscribe = (id) => (dispatch) => {
  // Headers
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  axios
    .put(`http://localhost:8080/user/subscribe/${id}`, config)
    .then((res) => {
      console.log(res);
      dispatch({
        type: UNSUBSCRIBE_USER,
        payload: res.data,
      });
      dispatch({
        type: SNACKBAR_SUCCESS,
        message: "Unsubscribed  successfully",
      });
    })
    .catch((err) => {
      console.log(err.response);
      dispatch(returnErrors(err, err.status));
      dispatch({
        type: SNACKBAR_ERROR,
        message: err.response.data.message,
      });
    });
};

// Setup config with token - helper function
export const tokenConfig = (getState) => {
  // get token from localstorage
  const token = localStorage.getItem("token");
  // Get token from state
  console.log(token);
  // Headers
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  // If token, add to headers config
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
};
