// components/BlogForm.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import './blogForm.css';
import Header from "../Pages/users/Header";

const BlogForm = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [authorid, setAuthorID] = useState(''); // Dynamic user ID
  const [author, setAuthor] = useState('');
  const [loading, setLoading] = useState(true);
  // Fetch user profile on component mount
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('User not logged in in!');
        return;
      }
      try {
        const response = await axios.get(`${import.meta.env.VITE_URL}/vuprofile`, {
          headers: { Authorization: token },
        });
        setAuthorID(response.data.id); // Assuming the response contains _id for user
        setAuthor(response.data.name);
        await console.log("Authur "+author);
      } catch (error) {
        console.error('Error fetching user:', error);
        alert('Failed to fetch user. Please log in again.');
      } finally {
        setLoading(false);
      }
    };
    // const fetchAuthur = async () =>{
    //     const token = localStorage.getItem('token');
    //     if (!token) {
    //         alert('User not logged in!');
    //         return;
    //       }
    //       try {
    //         const response = await axios.get('http://localhost:8080/vuprofile', {
    //           headers: { Authorization: token },
    //         });
    //         setAuthor(response.data._id); // Assuming the response contains _id for user
    //       } catch (error) {
    //         console.error('Error fetching user:', error);
    //         alert('Failed to fetch user. Please log in again.');
    //       } finally {
    //         setLoading(false);
    //       }
    // }
    fetchUser();
  }, []);
  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Is author"+author);
    if (!author) {
      alert('User not found. Please log in.');
      return;
    }
    
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Authentication token not found. Please log in again.');
      return;
    }
    
    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    formData.append('image', image);
    formData.append('author', authorid);
    
    try {
      await axios.post(`${import.meta.env.VITE_URL}/blog/add`, formData, {
        headers: { 
          'Content-Type': 'multipart/form-data',
          'Authorization': token 
        },
      });
      alert('Blog added successfully!');
      setTitle('');
      setContent('');
      setImage(null);
    } catch (error) {
      console.error('Error adding blog:', error);
      alert('Failed to add blog. Please try again.');
    }
  };
  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <>
      <Header />
      <form onSubmit={handleSubmit} className="blog-form">
        <input
          id='text'
          type="text"
          placeholder="Blog Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          id='content'
          placeholder="Blog Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
        <input type="file" onChange={handleImageChange} />
        <button type="submit" id='submit'>Add Blog</button>
      </form>
    </>
  );
};
export default BlogForm;