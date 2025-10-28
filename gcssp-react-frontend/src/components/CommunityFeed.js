import React, { useState, useEffect } from "react";
import axios from "axios";
import "./LoginPage.css";

function CommunityFeed() {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({ content: "", imageUrl: "" });
  const [comments, setComments] = useState({});
  const [newComment, setNewComment] = useState({});
  const [loading, setLoading] = useState(true);
  const [editingPost, setEditingPost] = useState(null);
  const [editedContent, setEditedContent] = useState("");

  const [user, setUser] = useState({ email: "", name: "" });

  useEffect(() => {
    const email = localStorage.getItem("email");
    const name = localStorage.getItem("name");
    if (email && name) setUser({ email, name });
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/posts");
      setPosts(Array.isArray(res.data) ? res.data : []);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching posts:", err);
      alert("⚠️ Could not connect to backend. Please ensure Spring Boot is running.");
      setLoading(false);
    }
  };

  const handleAddPost = async () => {
    if (!user.email) {
      alert("⚠️ You must be logged in to post!");
      return;
    }
    if (!newPost.content.trim()) {
      alert("⚠️ Please enter some content!");
      return;
    }
    try {
      const res = await axios.post("http://localhost:8080/api/posts", {
        email: user.email,
        content: newPost.content,
        imageUrl: newPost.imageUrl,
      });
      if (res.data.error) {
        alert(res.data.error);
        return;
      }
      if (res.data.post) {
        setPosts((prev) => [res.data.post, ...prev]);
        setNewPost({ content: "", imageUrl: "" });
      }
    } catch (err) {
      console.error("Failed to add post:", err);
      alert("⚠️ Failed to add post. Please check backend connection.");
    }
  };

  const handleEditPost = (post) => {
    setEditingPost(post.id);
    setEditedContent(post.content);
  };

  const handleSaveEdit = async (postId) => {
    try {
      const res = await axios.put(`http://localhost:8080/api/posts/${postId}`, {
        content: editedContent,
      });
      if (res.data.error) alert(res.data.error);
      else {
        setEditingPost(null);
        fetchPosts();
      }
    } catch (err) {
      console.error("Error updating post:", err);
    }
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm("🗑️ Are you sure you want to delete this post?")) return;
    try {
      const res = await axios.delete(`http://localhost:8080/api/posts/${postId}`);
      if (res.data.error) alert(res.data.error);
      else fetchPosts();
    } catch (err) {
      console.error("Error deleting post:", err);
    }
  };

  const fetchComments = async (postId) => {
    try {
      const res = await axios.get(`http://localhost:8080/api/comments/${postId}`);
      setComments((prev) => ({ ...prev, [postId]: res.data }));
    } catch (err) {
      console.error("Error fetching comments:", err);
    }
  };

  const handleAddComment = async (postId) => {
    const text = newComment[postId];
    if (!text?.trim()) return;
    try {
      await axios.post("http://localhost:8080/api/comments", {
        postId,
        text,
        userEmail: user.email,
      });
      setNewComment((prev) => ({ ...prev, [postId]: "" }));
      fetchComments(postId);
    } catch (err) {
      console.error("Error adding comment:", err);
    }
  };

  const handleDeleteComment = async (commentId, postId, commentEmail) => {
    if (commentEmail !== user.email) {
      alert("⚠️ You can only delete your own comments!");
      return;
    }
    if (!window.confirm("🗑️ Delete this comment?")) return;
    try {
      await axios.delete(`http://localhost:8080/api/comments/${commentId}`, {
        params: { userEmail: user.email },
      });
      fetchComments(postId);
    } catch (err) {
      console.error("Error deleting comment:", err);
    }
  };

  const handleEditComment = (postId, commentId) => {
    setComments((prev) => ({
      ...prev,
      [postId]: prev[postId].map((c) =>
        c.id === commentId ? { ...c, editing: true, editText: c.text } : c
      ),
    }));
  };

  const handleSaveCommentEdit = async (postId, comment) => {
    if (!comment.editText.trim()) return;
    try {
      const res = await axios.put(`http://localhost:8080/api/comments/${comment.id}`, {
        text: comment.editText,
        userEmail: user.email,
      });
      if (res.data.error) alert(res.data.error);
      fetchComments(postId);
    } catch (err) {
      console.error("Error editing comment:", err);
    }
  };

  return (
    <div className="feed-container">
      <h1 className="feed-title">🌐 NovaPortal Community</h1>

      <div className="add-post-box">
        <textarea
          placeholder="Share your thoughts..."
          value={newPost.content}
          onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
        />
        <input
          type="text"
          placeholder="Optional image URL"
          value={newPost.imageUrl}
          onChange={(e) => setNewPost({ ...newPost, imageUrl: e.target.value })}
        />
        <button className="post-btn" onClick={handleAddPost}>
          🚀 Post
        </button>
      </div>

      {loading ? (
        <p style={{ textAlign: "center" }}>Loading posts...</p>
      ) : posts.length === 0 ? (
        <p className="no-posts">No posts yet. Be the first to share!</p>
      ) : (
        posts.map((post) => (
          <div key={post.id} className="post-card">
            <div className="post-header">
              <h3>{post.customer?.name || "Anonymous"}</h3>
              <p className="email">{post.customer?.email}</p>
            </div>

            {editingPost === post.id ? (
              <div>
                <textarea
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                />
                <button onClick={() => handleSaveEdit(post.id)}>💾 Save</button>
                <button onClick={() => setEditingPost(null)}>❌ Cancel</button>
              </div>
            ) : (
              <p className="post-content">{post.content}</p>
            )}

            {post.imageUrl && <img src={post.imageUrl} alt="Post" className="post-image" />}

            {user.email === post.customer?.email && (
              <div className="post-actions">
                <button onClick={() => handleEditPost(post)}>✏️ Edit</button>
                <button onClick={() => handleDeletePost(post.id)}>🗑️ Delete</button>
              </div>
            )}

            <button className="comment-toggle-btn" onClick={() => fetchComments(post.id)}>
              💬 View Comments
            </button>

            <div className="comments-section">
              {(comments[post.id] || []).map((c) => (
                <div key={c.id} className="comment-card">
                  {c.editing ? (
                    <div className="edit-comment">
                      <input
                        type="text"
                        value={c.editText}
                        onChange={(e) =>
                          setComments((prev) => ({
                            ...prev,
                            [post.id]: prev[post.id].map((com) =>
                              com.id === c.id ? { ...com, editText: e.target.value } : com
                            ),
                          }))
                        }
                      />
                      <button onClick={() => handleSaveCommentEdit(post.id, c)}>💾 Save</button>
                      <button
                        onClick={() =>
                          setComments((prev) => ({
                            ...prev,
                            [post.id]: prev[post.id].map((com) =>
                              com.id === c.id ? { ...com, editing: false } : com
                            ),
                          }))
                        }
                      >
                        ❌ Cancel
                      </button>
                    </div>
                  ) : (
                    <>
                      <p>
                        <strong>{c.userEmail}</strong>: {c.text}
                      </p>
                      {c.userEmail === user.email && (
                        <div className="comment-actions">
                          <button onClick={() => handleEditComment(post.id, c.id)}>✏️</button>
                          <button onClick={() => handleDeleteComment(c.id, post.id, c.userEmail)}>
                            🗑️
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              ))}

              <div className="add-comment-box">
                <input
                  type="text"
                  placeholder="Add a comment..."
                  value={newComment[post.id] || ""}
                  onChange={(e) =>
                    setNewComment({ ...newComment, [post.id]: e.target.value })
                  }
                />
                <button onClick={() => handleAddComment(post.id)}>Send</button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default CommunityFeed;
