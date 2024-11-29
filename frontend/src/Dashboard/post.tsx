import axios from "axios";
import "../styles/post.css";
import { ChangeEvent, useEffect, useState } from "react";
import { useAuth } from "../contexts/auth.context";

export default function Post() {
  const { isAuthenticated } = useAuth();
  console.log("Authenticated", isAuthenticated);
  const [content, setContent] = useState("");
  const [productImage, setProductImage] = useState<File | null>(null);
  const [postData, setPostData] = useState<any[]>([]);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setProductImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("content", content);
    if (productImage) {
      formData.append("media", productImage);
    }

    try {
      const response = await axios.post(
        "http://localhost:5001/api/post/add-Post",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            "Authorization": `Bearer ${isAuthenticated}`
          },
        }
      );
      console.log("Data uploaded is :- ", response);
      alert("Post Uploaded");
      setContent("");
      setProductImage(null);
      showPost(); // Refresh posts after uploading
    } catch (error) {
      console.error("Error", error);
    }
  };

  const showPost = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5001/api/post/fetch-all-Post",
        {
          headers: {
            Authorization: `Bearer ${isAuthenticated}`,
          },
        }
      );
      console.log("Response Data", response.data.postData);
      setPostData(response.data.postData || []);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    showPost();
  }, []);

  return (
    <div className="main_container">
      <div className="form_sidebar">
        <form onSubmit={handleSubmit}>
          <h1 className="Upload-image">Upload</h1>
          <input
            type="file"
            id="file-upload"
            onChange={handleImageChange}
          />
          <button type="submit" className="font-serif">Upload Post</button>
        </form>
      </div>
      <div className="main_post_container">
        {postData.map((post, index) => (
          <div key={index} className="post_container">
            <div className="post_navbar">
              <span id="image-span"><img src={post.user.userProfilePic} alt="" /></span>
              <span id="username">{post.user.username || "Unknown User"}</span>
            </div>
            <div className="middle-post">
              <p>{post.content}</p>
              {post && (
                <img
                  src={post.url}
                  alt="Uploaded content"
                  className="post_image"
                />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
