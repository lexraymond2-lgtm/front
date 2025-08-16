import { useEffect,useState } from "react";
import styles from "./Profile.module.css";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import SideBar from "./Sidebarr";
import SideBart from "./Sidebarrite";
import { FaCamera } from "react-icons/fa";
import html2canvas from "html2canvas";

function Profile() {

  const navigate = useNavigate();
  const location = useLocation();
  const [userData, setUserData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Screenshot functionality
  const takeScreenshot = () => {
    const element = document.body;

    const images = Array.from(element.querySelectorAll("img"));
    const promises = images.map((img) => {
      if (img.complete) return Promise.resolve();
      return new Promise((resolve) => {
        img.onload = img.onerror = resolve;
      });
    });

    Promise.all(promises).then(() => {
      html2canvas(element, {
        useCORS: true,
        allowTaint: false,
      }).then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.href = imgData;
        link.download = "screenshot.png";
        link.click();
      });
    });
  };

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      if (!storedUser) {
        navigate("/login");
        return;
      }

      const userr = JSON.parse(storedUser);
      if (!userr || typeof userr !== "object") {
        navigate("/login");
        return;
      }

      const email =
        !userr.email || userr.email === "" ? "example@gmail.com" : userr.email;

      const profilepic =
        !userr.avatar || userr.avatar === "" ? "/vite.svg" : userr.avatar;

      const isAdmin = userr.isAdmin === 1 ? true : false;

      const datee = new Date(userr.registeredDate || Date.now());
      const formattedDate = datee.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });

      const userDataObj = {
        username: userr.username || "Unknown",
        email,
        avatar: profilepic,
        createdAt: formattedDate,
        isAdmin: isAdmin,
      };

      setUserData(userDataObj);
      setEditData(userDataObj);
    } catch (err) {
      console.error("Failed to parse user data:", err);
      setError("Failed to load user data");
    }
  }, [navigate]);

  const handleEdit = () => {
    setIsEditing(true);
    setEditData({ ...userData });
    setError(null);
  };

  const handleSave = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = new FormData();
      data.append("username", editData.username);
      data.append("email", editData.email);
      
      // Only append avatar if it's a File object
      if (editData.avatar instanceof File) {
        data.append("avatar", editData.avatar);
      }

      const token = localStorage.getItem("token");
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      };

<<<<<<< HEAD
      const res = await axios.post("http://localhost:3000/profile", data, config);
=======
      const res = await axios.post("https://a5d791040f4b.ngrok-free.app/profile", data, config);
>>>>>>> cf2feed7177c475224bb144dbcd6cf73d903b589

      if (res.status === 200) {
        console.log("Profile updated successfully:", res.data);
        
        // Update local storage with new user data
        let user = JSON.parse(localStorage.getItem("user"));
        user.username = res.data.user.username;
        user.email = res.data.user.email;
        if (res.data.user.avatar) {
          user.avatar = res.data.user.avatar;
        }
        localStorage.setItem("user", JSON.stringify(user));
        
        // Update state with new data
        setUserData(prev => ({
          ...prev,
          username: res.data.user.username,
          email: res.data.user.email,
          avatar: res.data.user.avatar || prev.avatar
        }));
        
        setIsEditing(false);
      }
    } catch (err) {
      console.error("Error saving profile:", err);
      setError(err.response?.data?.message || "Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setEditData({ ...userData });
    setIsEditing(false);
    setError(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditData(prev => ({
        ...prev,
        avatar: file
      }));
    }
  };

  const handleAddPost = () => {
    console.log("Add post clicked");
  };

  // Create menu items with active state based on current location
  const createMenuItems = () => {
    return [
      { label: "Home", icon: "FaHome", href: "/", active: location.pathname === "/" },
      { label: "Profile", icon: "FaUser", href: "/profile", active: location.pathname === "/profile" },
      { label: "About AMG Retro", icon: "FaChartBar", href: "/about", active: location.pathname === "/about" },
      // { label: "Messages", icon: "FaEnvelope", href: "/messages", active: location.pathname === "/messages" },
      // { label: "Resources", icon: "FaFlask", href: "/settings", active: location.pathname === "/settings" },
    ];
  };

  // Don't render until userData is loaded
  if (!userData) {
    return (
      <div className={styles.profileContainer}>
        <SideBar menuItems={createMenuItems()} />
        <div className={styles.container}>
          <div className={styles.profileCard}>
            <p>Loading...</p>
          </div>
        </div>
        <SideBart />
      </div>
    );
  }

  return (
    <div className={styles.profileContainer}>
      <SideBar menuItems={createMenuItems()} />
      <div className={styles.container}>
        <div className={styles.profileCard}>
          {error && (
            <div className={styles.errorMessage}>
              {error}
            </div>
          )}
          
          <div className={styles.header}>
            <div className={styles.avatarSection}>
              <img
                src={
                  editData.avatar instanceof File 
                    ? URL.createObjectURL(editData.avatar)
                    : editData.avatar.startsWith('http') 
                      ? editData.avatar 
<<<<<<< HEAD
                      : `http://localhost:3000/uploads/${editData.avatar}`
=======
                      : `https://a5d791040f4b.ngrok-free.app/uploads/${editData.avatar}`
>>>>>>> cf2feed7177c475224bb144dbcd6cf73d903b589
                }
                alt={`${editData.username}'s profile`}
                className={styles.avatar}
                onError={(e) => {
                  e.target.src = "/vite.svg";
                }}
              />
              <div className={styles.avatarOverlay}>
                {isEditing ? (
                  <input
                    type="file"
                    className={styles.customFileInputt}
                    onChange={handleFileChange}
                    name="avatar"
                    id="image"
                    accept="image/*"
                  />
                ) : (
                  <span className={styles.cameraIcon}>📷</span>
                )}
              </div>
            </div>

            <div className={styles.headerActions}>
              {!isEditing ? (
                <button className={styles.editButton} onClick={handleEdit}>
                  ✏️ Edit
                </button>
              ) : (
                <div className={styles.editActions}>
                  <button 
                    className={styles.saveButton} 
                    onClick={handleSave}
                    disabled={isLoading}
                  >
                    {isLoading ? "Saving..." : "✓ Save"}
                  </button>
                  <button
                    className={styles.cancelButton}
                    onClick={handleCancel}
                    disabled={isLoading}
                  >
                    ✕ Cancel
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className={styles.userInfo}>
            <div className={styles.field}>
              <label className={styles.fieldLabel}>Username</label>
              {isEditing ? (
                <input
                  type="text"
                  value={editData.username}
                  name="username"
                  className={styles.input}
                  onChange={handleInputChange}
                />
              ) : (
                <h1 className={styles.username}>{editData.username}</h1>
              )}
            </div>

            <div className={styles.field}>
              <label className={styles.fieldLabel}>Email</label>
              {isEditing ? (
                <input
                  type="email"
                  value={editData.email}
                  name="email"
                  className={styles.input}
                  onChange={handleInputChange}
                />
              ) : (
                <p className={styles.email}>{editData.email}</p>
              )}
            </div>

            <div className={styles.field}>
              <label className={styles.fieldLabel}>Member Since</label>
              <p className={styles.createdDate}>{editData.createdAt}</p>
            </div>
          </div>

          <div className={styles.actionsb}>
            {userData.isAdmin && (
              <button className={styles.addPostButton} onClick={()=>{navigate("/post")}}>
                <span className={styles.buttonIcon}>+</span>
                Add New Post
              </button>
            )}

            <button className={styles.addP} onClick={takeScreenshot}>
              <FaCamera className={styles.ss} />
              Screenshot
            </button>
          </div>
        </div>
      </div>
      <SideBart />
    </div>
  );
}

export default Profile;
