import { useEffect, useState } from "react";
import { getPosts, getStockPrices } from "../services/api";
import { Link, useNavigate } from "react-router-dom";
import { AiOutlineLoading3Quarters } from "react-icons/ai"; // Import an icon for loading spinner

const Dashboard = () => {
  const [stockPrices, setStockPrices] = useState({});
  const [loading, setLoading] = useState(true);
  const [rateLimitMessage, setRateLimitMessage] = useState(null);
  const [posts, setPosts] = useState([]);

  const navigate = useNavigate();

  // Fetch user's posts
  useEffect(() => {
    const fetchPosts = async () => {
      const postsData = await getPosts();
      setPosts(postsData);
    };

    fetchPosts();
  }, []);

  // Fetch stock prices with error handling
  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const stockData = await getStockPrices();

        if (stockData.message) {
          setRateLimitMessage(stockData.message);
        } else {
          setStockPrices(stockData);
        }
      } catch (error) {
        console.error("Error fetching stock prices:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPrices();
  }, []);

  // Handle navigation to a specific post
  const handleViewPost = (post) => {
    navigate("/posts/detail/", {
      state: {
        id: post.id,
        title: post.title,
        content: post.content,
      },
    });
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Stock Prices Section */}
      <div className="bg-white border p-6 rounded-lg shadow-lg mb-8">
        <h2 className="text-2xl font-bold mb-4 text-blue-600">Stock Prices</h2>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <AiOutlineLoading3Quarters className="animate-spin text-3xl text-blue-500" />
            <p className="ml-3 text-gray-600">Loading stock prices...</p>
          </div>
        ) : rateLimitMessage ? (
          <div className="text-red-500 text-center">{rateLimitMessage}</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.keys(stockPrices).map((symbol) => (
              <div
                key={symbol}
                className="bg-gray-50 p-4 rounded-lg shadow-md border hover:bg-gray-100 transition duration-150"
              >
                <p className="font-semibold text-gray-800">{symbol}</p>
                <p className="text-green-600 font-bold">
                  ${stockPrices[symbol].price}
                </p>
                <p className="text-gray-500 text-sm">
                  Last updated: {stockPrices[symbol].updated_at}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Posts and Discussion Section */}
      <div className="bg-white border p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4 text-blue-600">
          Posts and Discussion Threads
        </h2>

        <Link
          to="/create-post"
          className="inline-block mb-6 bg-blue-500 text-white px-5 py-2 rounded-lg font-semibold hover:bg-blue-600 transition duration-150"
        >
          Create a Post
        </Link>

        <div>
          {posts.length > 0 ? (
            posts.map((post) => (
              <div
                key={post.id}
                onClick={() => handleViewPost(post)}
                className="cursor-pointer p-5 border rounded-lg shadow-sm mb-4 hover:bg-gray-50 transition duration-150"
              >
                <h3 className="text-xl font-semibold text-gray-800">
                  {post.title}
                </h3>
                <p className="text-gray-600 mt-2 line-clamp-2">
                  {post.content}
                </p>
                <p className="text-blue-500 mt-2 font-medium">Read More</p>
              </div>
            ))
          ) : (
            <p className="text-gray-600 text-center">No posts available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
