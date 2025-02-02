import "./ProfileView.css";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { userProfileAPI } from "../../features/users/getProfileSlice"; // Adjust API call accordingly

const MyAccount = () => {
  const { user } = useSelector((state) => state.getProfile); // Assuming user data is stored in Redux state
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(userProfileAPI());
  }, [dispatch]);

  return (
    <>
      <div className="profile-container">
        <h2 className="mb-4">Profile</h2>
        <div className="profile-photo mb-3">
          <img
            src={user.data?.photo} // Placeholder if no photo
            alt="Profile"
            className="img-thumbnail rounded-circle"
            style={{ width: "200px", height: "200px", objectFit: "cover" }}
          />
        </div>
        <h4>{user.data?.name}</h4>
        <h4>{user.data?.email}</h4>
      </div>
    </>
  );
};

export default MyAccount;
