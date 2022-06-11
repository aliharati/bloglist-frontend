const Blog = ({ blog }) => (
  <div>
    <ul>
      <li>
        Title: <a href={blog.url}>{blog.title}</a>
      </li>
      <li>Author: {blog.author}</li>
    </ul>
  </div>
);

export default Blog;
