import React, { useEffect, useState } from "react";
import axios from "axios";

/**
 * Community forum: post stream with add-post, comment modal, and events.
 */
const CommunityPage = () => {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState("");
  const [status, setStatus] = useState("");
  const [commenting, setCommenting] = useState({ open: false, postId: null, comments: [], comment: "" });
  const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:3001";
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get(`${API_BASE}/community/posts`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        setPosts(res.data.posts || []);
      } catch {
        setPosts([]);
      }
    };
    fetchPosts();
  }, [status, commenting.open]);

  // PUBLIC_INTERFACE
  const handleAddPost = async (e) => {
    e.preventDefault();
    setStatus("");
    try {
      await axios.post(
        `${API_BASE}/community/posts`,
        { content: newPost },
        { headers: token ? { Authorization: `Bearer ${token}` } : {} }
      );
      setStatus("Posted!");
      setNewPost("");
    } catch {
      setStatus("Post failed");
    }
  };

  // PUBLIC_INTERFACE
  const openCommentModal = async (postId) => {
    try {
      const res = await axios.get(
        `${API_BASE}/community/posts/${postId}/comments`,
        { headers: token ? { Authorization: `Bearer ${token}` } : {} }
      );
      setCommenting({
        open: true, postId,
        comments: res.data.comments || [],
        comment: ""
      });
    } catch {
      setCommenting({ open: true, postId, comments: [], comment: "" });
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `${API_BASE}/community/posts/${commenting.postId}/comments`,
        { content: commenting.comment },
        { headers: token ? { Authorization: `Bearer ${token}` } : {} }
      );
      setCommenting(c => ({ ...c, comment: "" }));
      setStatus("Comment added!");
    } catch {
      setStatus("Comment failed");
    }
  };

  return (
    <div className="container" style={{ marginTop: 28 }}>
      <h2>Community Forum</h2>
      <form onSubmit={handleAddPost} style={{ margin: "10px 0", display: "flex", gap: 8 }}>
        <input
          value={newPost}
          onChange={e => setNewPost(e.target.value)}
          placeholder="Share your health tip, question, or event..."
          style={{ flex: 1, borderRadius: 6, padding: 7 }}
        />
        <button className="btn" style={{ flex: "0 0 19%" }} type="submit">Post</button>
      </form>
      <div style={{ maxWidth: 430, margin: "auto" }}>
        {posts.length === 0 ? <div className="card">No posts yet.</div> :
          posts.map(post => (
            <div key={post.id} className="card" style={{ margin: "8px 0", padding: "12px" }}>
              <div>
                <strong>{post.user?.name || "Anon"}</strong>: {post.content}
              </div>
              <button
                className="btn"
                style={{ marginTop: 3, fontSize: "90%" }}
                onClick={() => openCommentModal(post.id)}
              >
                View Comments ({post.comments_count || 0})
              </button>
            </div>
          ))
        }
      </div>
      {commenting.open && (
        <div className="modal" style={{
          position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
          background: "rgba(0,0,0,0.25)", display: "flex",
          alignItems: "center", justifyContent: "center"
        }}>
          <div className="card" style={{ padding: 22, maxWidth: 330, background: "#fff" }}>
            <h4>Comments</h4>
            <div style={{ maxHeight: 160, overflowY: "auto", marginBottom: 6 }}>
              {commenting.comments.length === 0 ? "None" :
                commenting.comments.map((c, i) => (
                  <div key={i} style={{ fontSize: 14, marginBottom: 3 }}>
                    <b>{c.user?.name || "Anon"}:</b> {c.content}
                  </div>
                ))
              }
            </div>
            <form onSubmit={handleAddComment}>
              <input
                value={commenting.comment}
                onChange={e => setCommenting(c => ({ ...c, comment: e.target.value }))}
                placeholder="Add a comment…"
                style={{ width: "100%", marginBottom: 5, borderRadius: 5 }}
              />
              <button className="btn" type="submit" style={{ width: "100%" }}>Comment</button>
            </form>
            <button className="btn" onClick={() => setCommenting({ open: false })} style={{ marginTop: 7, width: "100%" }}>
              Close
            </button>
          </div>
        </div>
      )}
      {status && <div style={{ color: "#3c83af", marginTop: 9 }}>{status}</div>}
    </div>
  );
};

export default CommunityPage;
