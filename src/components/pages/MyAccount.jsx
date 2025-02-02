import "./MyAccount.css";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { userProfileAPI } from "../../features/users/getProfileSlice"; // Adjust API call accordingly
import ProfileView from "../user/ProfileView";

const MyAccount = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(userProfileAPI());
  }, [dispatch]);

  const clickEditHandle = (e) => {
    e.preventDefault();
    navigate("/update-profile");
  };

  return (
    <>
      <div className="myaccount-container">
        <div className="">
          <div className="col-sm-6 offset-3">
            <div className="edit-button">
              <button className="btn btn-primary" onClick={clickEditHandle}>
                Edit Profile
              </button>
            </div>
            <ProfileView></ProfileView>
          </div>
        </div>
      </div>
    </>
  );
};

export default MyAccount;
