import { useState, useEffect } from "react";
import Blog from "./components/Blog";
import Notification from "./components/Notification";
import AddBlogNotif from "./components/LoginNotif";
import loginService from "./services/login";
import blogService from "./services/blogs";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [url, setUrl] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const [addBlogMessage, setAddBlogMessage] = useState(null);

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs));
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedInUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };
  const handleAuthorChange = (event) => {
    setAuthor(event.target.value);
  };
  const handleUrlChange = (event) => {
    setUrl(event.target.value);
  };

  const addBlog = async (event) => {
    event.preventDefault();
    const blog = {
      title: title,
      author: author,
      url: url,
    };
    try {
      const returnedBlog = await blogService.create(blog);
      setBlogs(blogs.concat(returnedBlog));
      setTitle("");
      setAuthor("");
      setUrl("");
      giveAddNotif(blog);
    } catch (exception) {
      setErrorMessage("invalid Blog");
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
    }
  };
  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const user = await loginService.login({
        username,
        password,
      });

      window.localStorage.setItem("loggedInUser", JSON.stringify(user));

      blogService.setToken(user.token);
      setUser(user);
      setBlogs(blogs.filter((blog) => blog.user.username === user.username));
      setUsername("");
      setPassword("");
    } catch (exception) {
      setErrorMessage("Wrong credentials");
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
    }
  };
  const giveAddNotif = (blog) => {
    setAddBlogMessage(`a new blog ${blog.title} by ${blog.author} added`);
    setTimeout(() => {
      setAddBlogMessage(null);
    }, 5000);
  };
  const handleLogout = (event) => {
    event.preventDefault();
    window.localStorage.clear();
    window.location.reload(false);
  };

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        Username:
        <input
          type='text'
          name='username'
          value={username}
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        Password:
        <input
          type='text'
          name='password'
          value={password}
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type='submit'>Login</button>
    </form>
  );

  const blogForm = () => (
    <form onSubmit={addBlog}>
      <div>
        Title:
        <input value={title} onChange={handleTitleChange} />
      </div>
      <div>
        Author:
        <input value={author} onChange={handleAuthorChange} />
      </div>
      <div>
        URL:
        <input value={url} onChange={handleUrlChange} />
      </div>
      <button type='submit'>Save</button>
    </form>
  );

  return (
    <div>
      <Notification message={errorMessage} />
      <AddBlogNotif message={addBlogMessage} />
      {user === null ? (
        loginForm()
      ) : (
        <div>
          <p>
            {user.name} logged-in <button onClick={handleLogout}>Logout</button>
          </p>

          {blogForm()}
        </div>
      )}
      <h2>blogs</h2>
      {user === null
        ? "sign in first"
        : blogs.map((blog) => <Blog key={blog.id} blog={blog} />)}
    </div>
  );
};

export default App;
