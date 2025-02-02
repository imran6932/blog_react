import "./UpdateBlog.css";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Editor } from "@tinymce/tinymce-react"; // Import TinyMCE Editor
import {
  updatePostAPI,
  clearError,
} from "../../features/blogs/updatePostSlice";
import { userPostAPI } from "../../features/blogs/getUserPostSlice";

const UpdateBlog = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const isLoggedIn = JSON.parse(localStorage.getItem("isLoggedIn")) || false; // Parse localStorage as boolean
  const { blog } = useSelector((state) => state.blog);
  const { loading, error } = useSelector((state) => state.updatePost);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState(""); // State for TinyMCE content
  const [photo, setPhoto] = useState(null);
  const [previewImage, setPreviewImage] = useState("");
  const [formError, setFormError] = useState("");
  const { id } = useParams();
  const tinyMceApiKey = import.meta.env.VITE_TINYMCE_API_KEY;

  useEffect(() => {
    if (blog.length === 0) {
      // Extract the id from blog title using regex
      const blogId = id.match(/\d+/)?.[0];
      dispatch(userPostAPI({ id: blogId, isUser: isLoggedIn }));
    } else {
      setTitle(blog.data.title);
      setPreviewImage(blog.data.photo);
      setDescription(blog.data.description); // Initialize description content
    }
  }, [dispatch, blog]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Clear previous errors
    setFormError("");

    const id = blog.data.id;

    if (!title.trim()) {
      setFormError("Title is required.");
      return;
    }

    if (!description.trim()) {
      setFormError("Description cannot be empty.");
      return;
    }

    const formData = {
      title,
      description,
      photo,
    };

    try {
      const result = await dispatch(updatePostAPI({ id, formData })).unwrap();
      if (result.status === 200) {
        navigate(`/dashboard`);
      }
    } catch (err) {
      // console.error("Update blog error:", err);
    }
  };

  useEffect(() => {
    // Only run when there's an error
    if (error || formError) {
      const timer = setTimeout(() => {
        if (error) dispatch(clearError()); // Clear Redux error
        if (formError) setFormError(""); // Clear local form error
      }, 5000);

      // Cleanup the timer if the component unmounts or error/formError changes
      return () => clearTimeout(timer);
    }
  }, [error, formError, dispatch]);

  if (blog.length === 0) {
    return;
  }

  return (
    <div className="col-sm-8 offset-sm-2 update-blog-container">
      <div
        className="card shadow-lg border-0"
        style={{ backgroundColor: "rgb(53, 43, 43)", color: "#fff" }}
      >
        <div className="card-body">
          <h2 className="text-center mb-4">Update Post</h2>
          <form
            onSubmit={handleSubmit}
            encType="multipart/form-data"
            noValidate
          >
            {/* Title Input */}
            <div className="mb-4">
              <label htmlFor="title" className="form-label">
                Title
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="form-control"
                placeholder="Enter the post title"
                required
              />
            </div>

            {/* TinyMCE Description */}
            <div className="mb-4">
              <label htmlFor="description" className="form-label">
                Description
              </label>
              <Editor
                apiKey={tinyMceApiKey} //  TinyMCE API key
                value={description}
                init={{
                  skin: "oxide-dark",
                  content_css: "dark",
                  height: 300,
                  menubar: false,
                  placeholder: "Write description of a post...",
                  plugins: "lists advlist",
                  toolbar:
                    "fontsize | checklist numlist bullist | backcolor forecolor | styles | bold italic underline | link | alignleft aligncenter alignright | removeformat",
                }}
                onEditorChange={(content) => setDescription(content)}
              />
            </div>

            {/* Image Upload */}
            <div className="mb-4">
              <label htmlFor="photo" className="form-label">
                Upload Image
              </label>
              <input
                type="file"
                id="photo"
                accept="image/*"
                onChange={handleImageChange}
                className="form-control"
              />
              {previewImage && (
                <div className="mt-3 text-center">
                  <img
                    src={previewImage}
                    alt="Preview"
                    className="img-fluid rounded shadow"
                  />
                </div>
              )}
            </div>

            {/* Error Message */}
            {formError && (
              <p className="text-danger">Form error: {formError}</p>
            )}
            {error && <p className="text-danger">Error: {error}</p>}

            {/* Submit Button */}
            <button type="submit" className="btn btn-primary w-100">
              {loading ? "Updating..." : "Update Post"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateBlog;
