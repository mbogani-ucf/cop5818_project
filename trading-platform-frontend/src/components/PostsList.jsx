import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for programmatic navigation
import { getPosts } from "../services/api"; // Import the getPosts function

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate(); // Initialize navigate

  useEffect(() => {
    // Fetch all posts from the API
    getPosts()
      .then((data) => setPosts(data))
      .catch((error) => console.error("Error fetching posts", error));
  }, []);

  const handlePostClick = (post) => {
    // Navigate to the post detail page and pass post data as state
    navigate("/posts/detail/", {
      state: {
        id: post.id,
        title: post.title,
        content: post.content,
      },
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">All Posts</h1>
      <ul className="space-y-6">
        {posts.map((post) => (
          <li
            key={post.id}
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
            onClick={() => handlePostClick(post)} // Handle the post click
          >
            <h3 className="truncate text-xl font-semibold text-blue-600 hover:text-blue-800">
              {post.title}
            </h3>
            <p className="text-gray-600 mt-2">{post.content}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Posts;
