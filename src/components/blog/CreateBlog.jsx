import "./CreateBlog.css";
import { useState, useEffect } from "react";
import {
  createPostAPI,
  clearError,
} from "../../features/blogs/createPostSlice";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Editor } from "@tinymce/tinymce-react"; // Import TinyMCE Editor

const CreateBlog = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { error, loading } = useSelector((state) => state.createPost);

  const [title, setTitle] = useState("");
  const [photo, setPhoto] = useState(null);
  const [description, setDescription] = useState(""); // State for TinyMCE content
  const [previewImage, setPreviewImage] = useState("");
  const [formError, setFormError] = useState("");
  const tinyMceApiKey = import.meta.env.VITE_TINYMCE_API_KEY;

  // Handle image change and preview
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Clear previous errors
    setFormError("");

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
      description, // Send TinyMCE HTML content
      photo,
    };

    try {
      const result = await dispatch(createPostAPI(formData)).unwrap();
      if (result.status === 201) {
        navigate("/dashboard");
      }
    } catch (err) {
      // console.error("Create blog error:", err);
    }
  };

  useEffect(() => {
    if (error || formError) {
      const timer = setTimeout(() => {
        if (error) dispatch(clearError());
        if (formError) setFormError("");
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [error, formError, dispatch]);

  return (
    <div className="col-sm-8 offset-sm-2 create-blog-container">
      <div
        className="card shadow-lg border-0"
        style={{ backgroundColor: "rgb(53, 43, 43)", color: "#fff" }}
      >
        <div className="card-body">
          <h2 className="text-center mb-4">Create a New Post</h2>
          <form
            onSubmit={handleSubmit}
            encType="multipart/form-data"
            noValidate
          >
            {/* Title Input */}
            <div className="mb-4 ">
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
                apiKey={tinyMceApiKey} //API key for TinyMCE
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
            <button
              type="submit"
              className="btn btn-primary w-100"
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateBlog;
