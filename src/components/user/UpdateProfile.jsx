import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateProfileAPI } from "../../features/users/updateProfileSlice";
import { userProfileAPI } from "../../features/users/getProfileSlice";
import "./UpdateProfile.css"; // Add any custom styles if needed
import { useNavigate } from "react-router-dom";

const UpdateProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.getProfile); // Assuming user data is in Redux state

  const [name, setName] = useState("");
  // const [email, setEmail] = useState("");
  const [photo, setPhoto] = useState("");
  const [previewImage, setPreviewImage] = useState("");
  const [error, setError] = useState("");

  // Load existing user data
  useEffect(() => {
    if (user) {
      setName(user.data?.name);
      // setEmail(user.data?.email);
      setPreviewImage(user.data?.photo);
    }
  }, [user]);

  // Handle image selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    // console.log("file", file)
    if (file) {
      setPhoto(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Name is required");
      return;
    }
    // if (!email.trim()) {
    //   setError("Email is required");
    //   return;
    // }

    const formData = new FormData();
    formData.append("name", name);
    // formData.append("email", email);
    if (photo) formData.append("photo", photo);
    // console.log("formdata", formData)

    try {
      const result = await dispatch(updateProfileAPI(formData)).unwrap(); // Update profile API call
      if (result.status === 200) {
        const getProfileResult = await dispatch(userProfileAPI()).unwrap();
        if (getProfileResult.status === 200) {
          navigate("/profile");
        } else {
          navigate("/dashboard");
        }
      }
    } catch (err) {
      setError("Failed to update profile. Please try again.");
    }
  };

  if (!user) {
    return;
  }

  return (
    <div className="col-md-6 offset-3">
      <div className="profile-update-container">
        <h2 className="text-center m-4">Update Profile</h2>
        {error && <p className="text-danger text-center">{error}</p>}

        <form onSubmit={handleSubmit} encType="multipart/form-data" noValidate>
          {/* Name Field */}
          <div className="mb-3">
            <label className="form-label">Name</label>
            <input
              type="text"
              className="form-control"
              value={name || ""}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          {/* Email Field
              <div className="mb-3">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  value={email || ""}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div> */}

          {/* Image Upload */}
          <div className="mb-3">
            <label className="form-label">Upload Photo</label>
            <input
              type="file"
              className="form-control"
              accept="image/*"
              onChange={handleImageChange}
            />
            {previewImage && (
              <div className="mt-3 text-center">
                <img
                  src={previewImage || ""}
                  alt="Preview"
                  className="img-thumbnail"
                  style={{
                    width: "150px",
                    height: "150px",
                    objectFit: "cover",
                  }}
                />
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button type="submit" className="btn btn-primary w-100">
            Update Profile
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateProfile;
