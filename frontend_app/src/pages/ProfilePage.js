import React, { useEffect, useState, useRef } from "react";
import { api } from "../api";

/**
 * User profile, settings, avatar upload.
 */
const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState({});
  const [avatar, setAvatar] = useState(null);
  const [status, setStatus] = useState("");
  const fileRef = useRef();
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/profile");
        setProfile(res.data);
        setForm({ name: res.data.name, email: res.data.email, phone: res.data.phone });
      } catch {
        setProfile(null);
      }
    };
    fetchProfile();
  }, []);

  // PUBLIC_INTERFACE
  const handleSave = async (e) => {
    e.preventDefault();
    setStatus("");
    try {
      await api.put("/profile", form);
      setStatus("Profile updated!");
      setEdit(false);
    } catch {
      setStatus("Update failed.");
    }
  };

  // PUBLIC_INTERFACE
  const handleAvatarUpload = async (e) => {
    e.preventDefault();
    if (!avatar) return;
    try {
      const formData = new FormData();
      formData.append("avatar", avatar);
      await api.post("/profile/avatar", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      setStatus("Avatar uploaded!");
      fileRef.current.value = "";
      setAvatar(null);
    } catch {
      setStatus("Avatar upload failed.");
    }
  };

  return (
    <div className="container" style={{ marginTop: 28, maxWidth: 430 }}>
      <h2>User Profile</h2>
      <div className="card" style={{ padding: 14, margin: "1em auto" }}>
        <div style={{ display: "flex", alignItems: "center", marginBottom: 10 }}>
          <img
            src={profile?.avatar_url || "https://ui-avatars.com/api/?name=User"}
            alt="Avatar"
            style={{ width: 60, height: 60, borderRadius: "50%", marginRight: 15 }}
          />
          <form onSubmit={handleAvatarUpload} style={{ marginLeft: 8 }}>
            <input type="file" ref={fileRef} onChange={e => setAvatar(e.target.files[0])} />
            <button className="btn" type="submit" style={{ marginLeft: 4, fontSize: "90%" }}>Upload Avatar</button>
          </form>
        </div>
        {edit ? (
          <form onSubmit={handleSave}>
            <input
              type="text"
              placeholder="Name"
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              style={{ margin: "7px 0", width: "100%" }}
            />
            <input
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              style={{ margin: "7px 0", width: "100%" }}
            />
            <input
              type="tel"
              placeholder="Phone"
              value={form.phone}
              onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
              style={{ margin: "7px 0", width: "100%" }}
            />
            <button className="btn" type="submit" style={{ width: "100%" }}>Save</button>
          </form>
        ) : (
          <div>
            <p><b>Name:</b> {profile?.name}</p>
            <p><b>Email:</b> {profile?.email}</p>
            <p><b>Phone:</b> {profile?.phone}</p>
            <button className="btn" onClick={() => setEdit(true)} style={{ width: "100%" }}>Edit Profile</button>
          </div>
        )}
      </div>
      {status && <div style={{ marginTop: 8, color: "#3c83af" }}>{status}</div>}
    </div>
  );
};

export default ProfilePage;
