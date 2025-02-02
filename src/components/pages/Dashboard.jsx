import "./Dashboard.css";
import { useEffect } from "react";
import BlogView from "../blog/BlogView";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { userProfileAPI } from "../../features/users/getProfileSlice"; // Adjust API call accordingly

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(userProfileAPI());
  }, [dispatch]);

  const onClickCreateHandle = (e) => {
    e.preventDefault();
    navigate("/create-blog");
  };
  return (
    <>
      <div className="create-blog">
        <div className="col-sm-8 offset-2">
          <button className="btn btn-success" onClick={onClickCreateHandle}>
            Create a post
          </button>
        </div>
      </div>
      <div className="dashboard-container">
        <BlogView></BlogView>
      </div>
    </>
  );
};

export default Dashboard;
