import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPost } from "../services/api"; // Import the createPost function from api.js

const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Function to get the user ID from the token (Assuming the token has a 'user_id' in it)
  const getUserIdFromToken = (token) => {
    if (token) {
      const decodedToken = JSON.parse(atob(token.split(".")[1])); // Decoding JWT token to get user data
      console.log(decodedToken.user_id)
      return decodedToken.user_id; // Assuming user_id is inside the decoded token
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const token = localStorage.getItem("token"); // Retrieve token from localStorage
    const userId = getUserIdFromToken(token); // Extract user_id from the token

    if (!userId) {
      alert("User not authenticated");
      setLoading(false);
      return;
    }

    const postData = {
      title,
      content,
      author: userId, // Add the user_id as the author
    };

    try {
      // Call the createPost function from api.js
      const response = await createPost(
        postData,
        localStorage.getItem("token")
      ); // Pass token from localStorage

      if (response) {
        navigate("/posts"); // Redirect to posts page after successful creation
      } else {
        alert("Error creating post!");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while creating the post.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold text-gray-800 mb-4">
        Create a New Post
      </h2>
      <form onSubmit={handleSubmit}>
        {/* Title Input */}
        <div className="mb-4">
          <label
            htmlFor="title"
            className="block text-gray-700 text-sm font-semibold mb-2"
          >
            Post Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Content Textarea */}
        <div className="mb-6">
          <label
            htmlFor="content"
            className="block text-gray-700 text-sm font-semibold mb-2"
          >
            Post Content
          </label>
          <textarea
            id="content"
            name="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            rows="6"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className={`px-6 py-2 text-white font-semibold rounded-lg ${
              loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
            } transition duration-300`}
          >
            {loading ? "Submitting..." : "Create Post"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePost;
