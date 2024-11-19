// src/components/CreateThread.jsx

import { useState } from 'react';
import { createThread } from '../services/api';
import { useNavigate } from 'react-router-dom';

const CreateThread = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = { title, content };
    const result = await createThread(data);
    if (result) {
      navigate('/dashboard'); // Redirect after creating a thread
    }
  };

  return (
    <div className="container mx-auto p-5">
      <h1 className="text-2xl font-bold mb-5">Create a New Thread</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Thread Title"
          className="w-full p-2 border rounded"
          required
        />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Thread Content"
          className="w-full p-2 border rounded"
          required
        ></textarea>
        <button type="submit" className="p-2 bg-blue-500 text-white rounded">Create Thread</button>
      </form>
    </div>
  );
};

export default CreateThread;
