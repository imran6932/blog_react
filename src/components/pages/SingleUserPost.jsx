import "./SingleUserPost.css";
import SingleBlog from "../blog/SingleBlog";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { deletePostAPI } from "../../features/blogs/deletePostSlice";

const SingleUserPost = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { blog, isUser } = useSelector((state) => state.blog);
  const { error } = useSelector((state) => state.deletePost);

  // console.log('isUser:', isUser, 'Blog:', blog);

  const updateBlogHandle = (id) => {
    navigate(`/update-blog/${id}`);
  };

  const deleteBlogHandle = async (id) => {
    try {
      const result = await dispatch(deletePostAPI(id)).unwrap(); // Unwrap the returned value
      // console.log("result", result)
      if (result.status === 204) {
        // console.log("Post deleted successfully");
        navigate("/dashboard"); // Redirect after successful deletion
      }
    } catch (error) {
      // console.error("Error deleting blog:", error);
    }
  };

  return (
    <>
      <div className="single-post-container">
        {!isUser ? (
          <div></div>
        ) : (
          <div className="col-sm-8 offset-2 action-container">
            <button
              className="btn btn-primary"
              onClick={(e) => {
                e.preventDefault();
                updateBlogHandle(blog.data.id);
              }}
            >
              Edit Post
            </button>
            <button
              className="btn btn-danger mx-2"
              onClick={(e) => {
                e.preventDefault();
                deleteBlogHandle(blog.data.id);
              }}
            >
              Delete Post
            </button>
          </div>
        )}
        {error && (
          <p style={{ color: "red", fontSize: "0.8em", marginTop: "10px" }}>
            Error: {error}
          </p>
        )}

        <SingleBlog />
      </div>
    </>
  );
};

export default SingleUserPost;
