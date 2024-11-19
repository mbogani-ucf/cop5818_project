import axios from "axios";
import { redirect } from "react-router-dom";

const API_BASE_URL = "http://localhost:8000/api/"; // Replace with your backend base URL
const token = localStorage.getItem("token"); // Retrieve token from localStorage
// Axios instance for API calls
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Register a user
export const registerUser = async (userData) => {
  try {
    const response = await api.post("auth/register/", userData);
    console.log(response);
    return response.data.username;
  } catch (error) {
    console.log(error);
    throw new Error(error.response?.data?.username || "Registration failed");
  }
};

// Login a user
export const loginUser = async (loginData) => {
  try {
    const response = await api.post("auth/login/", loginData);
    // Save the JWT tokens to localStorage for future authenticated requests
    localStorage.setItem("token", response.data.access);
    localStorage.setItem("refresh_token", response.data.refresh);
    localStorage.setItem("isAuthenticated", true);
    return response.data;
  } catch (error) {
    console.log(error);
    throw new Error(error.response?.data?.detail || "Login failed");
  }
};

export const logoutUser = async () => {
  const token = localStorage.getItem("token");
  try {
    await api.post("auth/logout/", {
      headers: { Authorization: `Bearer ${token}` },
    });
    // Clear any client-side state and redirect to login
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("token");
    localStorage.setItem("isAuthenticated", false);
    redirect("/login");
  } catch (error) {
    console.error("Error logging out", error);
    return [];
  }
};

// API calls for posts, comments, votes, stock prices

// Get all posts
export const getPosts = async () => {
  const token = localStorage.getItem("token");
  try {
    const response = await api.get("posts/", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching posts", error);
    return [];
  }
};

// Get a post
export const getPostDetail = async (id) => {
  const token = localStorage.getItem("token");
  try {
    const response = await api.get(`posts/${id}/`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log(response);
    return response.data;
  } catch (error) {
    console.log("Error fetching post", error);
    return [];
  }
};

// Create a post
export const createPost = async (postData) => {
  const token = localStorage.getItem("token");
  try {
    const response = await api.post("posts/", postData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating post", error);
  }
};

// Delete a post
export const deletePost = async (postId, token) => {
  try {
    await api.delete(`posts/${postId}/`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (error) {
    console.error("Error deleting post", error);
  }
};

// Create a comment
export const createComment = async (commentData) => {
  try {
    const token = localStorage.getItem("token");
    const response = await api.post(`comments/`, commentData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating comment", error);
  }
};

// Upvote a post
export const upvotePost = async (postId, userId) => {
  try {
    const token = localStorage.getItem("token");
    const response = await api.post(
      `votes/`,
      { post: postId, user: userId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data; // Return the vote data
  } catch (error) {
    console.error("Error upvoting:", error.response?.data || error.message);
    throw error;
  }
};

// Downvote (remove upvote) a post
export const downvotePost = async (postId, userId) => {
  try {
    const token = localStorage.getItem("token");
    const response = await api.delete(
      `votes/`,
      { post: postId, user: userId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data; // Return the response message
  } catch (error) {
    console.error("Error downvoting:", error.response?.data || error.message);
    throw error;
  }
};
// Get stock prices
export const getStockPrices = async () => {
  try {
    const response = await api.get("stock-prices/");
    return response.data;
  } catch (error) {
    console.log("Error fetching stock prices", error);
    return [];
  }
};

// Fetch all discussion threads
export const getThreads = async () => {
  try {
    const response = await api.get("threads/", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching threads:", error);
    return [];
  }
};

// Fetch a single discussion thread
export const getThread = async (threadId) => {
  try {
    const response = await api.get(`threads/${threadId}/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching thread:", error);
    return null;
  }
};

// Create a new thread
export const createThread = async (data) => {
  try {
    const response = await api.post("threads/", data);
    return response.data;
  } catch (error) {
    console.error("Error creating thread:", error);
    return null;
  }
};
// Get comments for a specific post
export const getComments = async (postId) => {
  try {
    const token = localStorage.getItem("token");
    const response = await api.get(`comments/`, {
      params: { post_id: postId },
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log("The comments", response.data);
    return response.data;
  } catch (error) {
    console.log("Error fetching comments", error);
    return [];
  }
};
