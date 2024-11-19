import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { FaThumbsUp, FaThumbsDown } from "react-icons/fa"; // Importing React Icons
import { getComments, createComment, upvotePost, downvotePost } from "../services/api"; // Import API functions

const PostDetail = () => {
  const location = useLocation();
  const { id, content, title } = location.state || {}; // Get post data passed from previous component
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [upvotes, setUpvotes] = useState(0);
  const [downvotes, setDownvotes] = useState(0);
  const [userUpvoted, setUserUpvoted] = useState(false); // Track if user upvoted
  const [userDownvoted, setUserDownvoted] = useState(false); // Track if user downvoted

  const getUserIdFromToken = (token) => {
    if (token) {
      const decodedToken = JSON.parse(atob(token.split(".")[1])); // Decoding JWT token to get user data
      return decodedToken.user_id; // Assuming user_id is inside the decoded token
    }
    return null;
  };

  const token = localStorage.getItem("token"); // Retrieve token from localStorage
  const userId = getUserIdFromToken(token); // Extract user_id from the token

  useEffect(() => {
    if (!id) return;

    // Fetch comments for the specific post
    getComments(id)
      .then((data) => setComments(data))
      .catch((error) => console.error("Error fetching comments", error));
  }, [id]);

  const handleUpvote = () => {
    if (userDownvoted) {
      setUserDownvoted(false); // Remove downvote if user had downvoted
      setDownvotes(downvotes - 1);
    }
    upvotePost(id, userId)
      .then(() => {
        setUpvotes(upvotes + 1);
        setUserUpvoted(true);
      })
      .catch((error) => console.error("Error upvoting post", error));
  };

  const handleDownvote = () => {
    if (userUpvoted) {
      setUserUpvoted(false); // Remove upvote if user had upvoted
      setUpvotes(upvotes - 1);
    }
    downvotePost(id, userId)
      .then(() => {
        setDownvotes(downvotes + 1);
        setUserDownvoted(true);
      })
      .catch((error) => console.error("Error downvoting post", error));
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    const commentData = {
      post: id,
      content: newComment,
      author_id: userId, // Add the user_id as the author
    };
    if (newComment.trim()) {
      // Submit new comment
      createComment(commentData)
        .then((comment) => {
          setComments((prevComments) => [...prevComments, comment]);
          setNewComment(""); // Clear the input field
        })
        .catch((error) => console.error("Error creating comment", error));
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="bg-white p-6 rounded-xl shadow-lg mb-8 border border-gray-200">
        <h1 className="text-4xl font-bold text-gray-800">{title}</h1>
        <p className="mt-4 text-lg text-gray-600">{content}</p>

        {/* Upvote and Downvote Buttons */}
        <div className="flex items-center mt-6 space-x-6">
          <button
            onClick={handleUpvote}
            className="flex items-center text-xl text-gray-500 hover:text-blue-600 transition duration-300"
          >
            <FaThumbsUp
              size={24}
              className={userUpvoted ? "text-blue-600" : "text-gray-500"} // Change color if upvoted
            />
            <span className="ml-2">{upvotes}</span>
          </button>
          <button
            onClick={handleDownvote}
            className="flex items-center text-xl text-gray-200 hover:text-red-600 transition duration-300"
          >
            <FaThumbsDown
              size={24}
              className={userDownvoted ? "text-red-600" : "text-gray-500"} // Change color if downvoted
            />
            <span className="ml-2">{downvotes}</span>
          </button>
        </div>

        {/* Comment Section */}
        <div className="mt-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Comments</h3>

          {/* Comment Form */}
          <form onSubmit={handleCommentSubmit} className="flex flex-col mb-6">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              className="w-full p-4 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              rows="4"
            />
            <button
              type="submit"
              className="self-start bg-green-600 text-white px-6 py-2 rounded-full shadow-lg hover:bg-green-700 transition duration-300"
            >
              Post Comment
            </button>
          </form>

          {/* Display Comments */}
          <ul className="space-y-6">
            {comments.length > 0 ? (
              comments.map((comment) => (
                <li
                  key={comment.id}
                  className="bg-gray-50 p-4 rounded-lg shadow-lg hover:bg-gray-100 transition duration-300"
                >
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <i className="fas fa-user-circle text-gray-600 text-xl"></i>
                    </div>
                    <div>
                      <p className="text-gray-800 font-semibold">{comment.author_username}</p>
                      <p className="text-gray-600 text-sm">{comment.content}</p>
                    </div>
                  </div>
                </li>
              ))
            ) : (
              <p className="text-gray-500">No Comments Available</p>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PostDetail;
