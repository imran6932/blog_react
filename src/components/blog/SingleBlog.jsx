import "./SingleBlog.css";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { userPostAPI } from "../../features/blogs/getUserPostSlice";

const SingleBlog = () => {
  const dispatch = useDispatch();
  // const isLoggedIn = JSON.parse(localStorage.getItem("isLoggedIn")) || false; // Parse localStorage as boolean
  const { blog, error, loading } = useSelector((state) => state.blog);
  const { blogTitle } = useParams();

  useEffect(() => {
    if (blog.length === 0) {
      // Extract the id from blog title using regex
      const blogId = blogTitle.match(/\d+/)?.[0];
      const isUser = false;
      dispatch(userPostAPI({ id: blogId, isUser: isUser }));
    }
  }, [dispatch]);

  if (blog.length === 0) {
    return;
  }

  return (
    <div className="col-sm-8 offset-sm-2 single-blog-container">
      {/* Blog Title */}
      <h4 className="single-blog-title">{blog.data.title}</h4>
      {/* Blog Image */}
      {blog.data.photo && (
        <img
          className="single-blog-image"
          src={blog.data.photo}
          alt={blog.data.title}
        />
      )}
      {/* Blog Description - Render HTML Safely */}
      <div
        className="single-blog-description"
        dangerouslySetInnerHTML={{ __html: blog.data.description }}
      ></div>

      {/* Blog Meta Info */}
      <h6 className="single-blog-meta">
        <span className="mx-2">Posted on:</span>
        {new Date(blog.data.created_at).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",

          hour: "2-digit",
          minute: "2-digit",
        })}
        <span className="mx-1">| Posted by: {blog.data.user}</span>
      </h6>
      {error && (
        <p style={{ color: "red", fontSize: "0.8em", marginTop: "10px" }}>
          Error: {error}
        </p>
      )}
      <p className="">{loading ? "Loading..." : ""}</p>
    </div>
  );
};

export default SingleBlog;
