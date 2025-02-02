import "./BlogView.css";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { userAllPostsAPI } from "../../features/blogs/getUserAllPostSlice";
import { userPostAPI } from "../../features/blogs/getUserPostSlice";

const BlogView = () => {
  const { postsData, error, loading } = useSelector((state) => state.userPosts);
  const { blog } = useSelector((state) => state.blog);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(userAllPostsAPI());
  }, [dispatch]);

  const handleLinkClick = async (id, user, title) => {
    const isUser = true;
    //console.log("calling single user post API");
    dispatch(userPostAPI({ id, isUser }));

    try {
      // After API call, navigate to the blog page
      if (blog) {
        navigate(`/${user}/posts/${title}-${id}`);
      }
    } catch (error) {
      //console.error("Error fetching blog details:", error);
    }
  };

  return (
    <>
      {Array.isArray(postsData.data) && postsData.data.length > 0 ? (
        postsData.data.map((item, index) => {
          // Sanitize the description HTML
          // const sanitizedDescription = DOMPurify.sanitize(item.description);
          const sanitizedDescription = item.description;

          // Truncate the sanitized description to 300 characters and append "..."
          const truncatedDescription =
            sanitizedDescription.length > 300
              ? sanitizedDescription.slice(0, 300) + "  ....."
              : sanitizedDescription;

          return (
            <div className="row" key={index}>
              <div className="col-sm-8 offset-sm-2 blog-container">
                <a
                  href="/"
                  onClick={(e) => {
                    e.preventDefault(); // Prevent default link behavior
                    handleLinkClick(item.id, item.user, item.title);
                  }}
                >
                  <h4>{item.title}</h4>
                  <img className="blog-image" src={item.photo} alt="" />
                  <div
                    dangerouslySetInnerHTML={{
                      __html: truncatedDescription,
                    }}
                  ></div>
                  <h6>
                    <span className="mx-2">Posted on:</span>
                    {new Date(item.created_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                    <span className="mx-1">| Posted By: {item.user}</span>
                  </h6>
                </a>
              </div>
              {error && (
                <p
                  style={{ color: "red", fontSize: "0.8em", marginTop: "10px" }}
                >
                  Error: {error}
                </p>
              )}
            </div>
          );
        })
      ) : (
        <div className="col-sm-6 offset-3 message">
          <p className="">{loading ? "Loading..." : ""}</p>
        </div>
      )}
    </>
  );
};

export default BlogView;
