import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import styles from './singlepage.module.css';
import { FaHeart, FaComment, FaEye, FaUser, FaCalendarAlt, FaTag, FaArrowLeft, FaShare, FaCamera } from 'react-icons/fa';
import linkFallback from '../assets/linkp.png';
import SideBar from './Sidebarr';
import SideBart from './Sidebarrite';
import { useNavigate } from 'react-router-dom';
import { takeScreenshot, showShareOptions, copyToClipboard } from '../utils/screenshot';

// Utility function to format numbers with K, M, B abbreviations
const formatNumber = (num) => {
  if (num === null || num === undefined) return '0';
  
  const number = parseInt(num);
  if (isNaN(number)) return '0';
  
  if (number >= 1000000000) {
    return (number / 1000000000).toFixed(1).replace(/\.0$/, '') + 'B';
  } else if (number >= 1000000) {
    return (number / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
  } else if (number >= 1000) {
    return (number / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
  } else {
    return number.toString();
  }
};

function SinglePage({ postId, onClose, onUpdateLikes, onUpdateViews, onUpdateComments }) {
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [viewCount, setViewCount] = useState(0);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [isCommenting, setIsCommenting] = useState(false);
  const [loginAction, setLoginAction] = useState(''); // 'like' or 'comment'
  const commentsSectionRef = useRef(null);
  const postContainerRef = useRef(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`http://localhost:3000/posts/${postId}`);
        setPost(response.data.post);
        setLikeCount(response.data.post.likes || 0);
        setViewCount(response.data.post.shares || 0); // Use shares field for views
        
        // Track the view
        trackView();
        
        // Fetch comments
        fetchComments();
        
        // Fetch like status for current user
        const token = localStorage.getItem('token');
        if (token) {
          try {
            const likeStatusResponse = await axios.get(`http://localhost:3000/posts/${postId}/like-status`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
            setIsLiked(likeStatusResponse.data.liked);
          } catch (err) {
            console.error('Error fetching like status:', err);
            setIsLiked(false);
          }
        }
      } catch (err) {
        console.error('Error fetching post:', err);
        setError('Post not found or failed to load');
      } finally {
        setIsLoading(false);
      }
    };

    if (postId) {
      fetchPost();
    }
  }, [postId]);

  const fetchComments = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/posts/${postId}/comments`);
      const commentsData = response.data.comments || [];
      setComments(commentsData);
      // Update the parent component with the current comment count
      if (onUpdateComments) {
        onUpdateComments(postId, commentsData.length);
      }
    } catch (err) {
      console.error('Error fetching comments:', err);
      setComments([]);
      if (onUpdateComments) {
        onUpdateComments(postId, 0);
      }
    }
  };

  const trackView = async () => {
    try {
      await axios.post(`http://localhost:3000/posts/${postId}/view`);
      // Update the view count locally
      setViewCount(prev => prev + 1);
      // Update the parent component
      if (onUpdateViews) {
        onUpdateViews(postId, viewCount + 1);
      }
    } catch (err) {
      console.error('Error tracking view:', err);
    }
  };

  const handleLike = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setShowLoginModal(true);
      setLoginAction('like');
      return;
    }

    try {
      const response = await axios.post(`http://localhost:3000/posts/${postId}/like`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setIsLiked(response.data.liked);
      if (response.data.liked) {
        setLikeCount(prev => prev + 1);
        // Update the parent component
        if (onUpdateLikes) {
          onUpdateLikes(postId, likeCount + 1, true);
        }
      } else {
        setLikeCount(prev => Math.max(0, prev - 1));
        // Update the parent component
        if (onUpdateLikes) {
          onUpdateLikes(postId, Math.max(0, likeCount - 1), false);
        }
      }
    } catch (err) {
      console.error('Error liking/unliking post:', err);
      alert(err.response?.data?.message || 'Failed to like/unlike post');
    }
  };

  const handleLoginClick = () => {
    setShowLoginModal(false);
    onClose(); // Close the post modal
    navigate('/Login'); // Navigate to login page
  };

  const handleContinueWithoutLike = () => {
    setShowLoginModal(false);
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      setShowLoginModal(true);
      setLoginAction('comment');
      return;
    }

    if (!newComment.trim()) {
      return;
    }

    try {
      setIsCommenting(true);
      const response = await axios.post(`http://localhost:3000/posts/${postId}/comments`, 
        { comment_text: newComment.trim() },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setComments(prev => {
        const newComments = [response.data.comment, ...prev];
        if (onUpdateComments) {
          onUpdateComments(postId, newComments.length);
        }
        return newComments;
      });
      setNewComment('');
    } catch (err) {
      console.error('Error adding comment:', err);
      alert(err.response?.data?.message || 'Failed to add comment');
    } finally {
      setIsCommenting(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('You need to be logged in to delete comments.');
      return;
    }

    if (!window.confirm('Are you sure you want to delete this comment?')) {
      return;
    }

    try {
      await axios.delete(`http://localhost:3000/comments/${commentId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setComments(prev => {
        const newComments = prev.filter(comment => comment.commentid !== commentId);
        if (onUpdateComments) {
          onUpdateComments(postId, newComments.length);
        }
        return newComments;
      });
    } catch (err) {
      console.error('Error deleting comment:', err);
      alert(err.response?.data?.message || 'Failed to delete comment');
    }
  };

  const scrollToComments = () => {
    if (commentsSectionRef.current) {
      commentsSectionRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/post/${postId}`;
    const shareText = `Check out this post: ${post?.title || 'Untitled Post'}`;
    
    // Show options for sharing
    const { shouldTakeScreenshot, shouldCopyLink } = showShareOptions();
    
    // Take screenshot if requested
    if (shouldTakeScreenshot && postContainerRef.current) {
      try {
        await takeScreenshot(
          postContainerRef.current, 
          `post-${postId}-${Date.now()}.png`
        );
        alert('Screenshot saved!');
      } catch (err) {
        console.error('Error taking screenshot:', err);
        alert('Failed to take screenshot. Please try again.');
      }
    }
    
    // Copy link if requested
    if (shouldCopyLink) {
      // Try to use native sharing if available
      if (navigator.share) {
        try {
          await navigator.share({
            title: post?.title || 'Untitled Post',
            text: post?.description ? `${post.description.substring(0, 100)}...` : 'Check out this post!',
            url: shareUrl,
          });
        } catch (err) {
          console.log('Share cancelled or failed:', err);
        }
      } else {
        // Fallback: copy to clipboard
        try {
          await copyToClipboard(`${shareText}\n${shareUrl}`);
          alert('Post link copied to clipboard!');
        } catch (err) {
          alert('Failed to copy link to clipboard.');
        }
      }
    }
  };

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingState}>
          <div className={styles.loadingSpinner}></div>
          <p>Loading post...</p>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className={styles.container}>
        <div className={styles.errorState}>
          <div className={styles.errorIcon}>❌</div>
          <h3>Post Not Found</h3>
          <p>{error || 'The post you are looking for does not exist.'}</p>
          <button className={styles.backButton} onClick={onClose}>
            <FaArrowLeft /> Close
          </button>
        </div>
      </div>
    );
  }

  return (
   <div className={styles.containert}>
    <SideBar/>
     <div className={styles.container}>
      <div className={styles.header}>
        <button className={styles.backButton} onClick={onClose}>
          <FaArrowLeft /> Close
        </button>
        <h1 className={styles.pageTitle}>Post Details</h1>
      </div>

      <div className={styles.postContainer} ref={postContainerRef}>
        <div className={styles.postHeader}>
          <div className={styles.authorInfo}>
            <div className={styles.authorImage}>
              {post.userimage ? (
                <img 
                  src={`http://localhost:3000/profileimages/${post.userimage}`} 
                  alt={post.username || 'User'}
                  className={styles.userProfileImage}
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
              ) : null}
              <div className={styles.userIcon}>
                <FaUser />
              </div>
            </div>
            <div className={styles.authorDetails}>
              <h3 className={styles.authorName}>{post.username || 'Anonymous'}</h3>
              <span className={styles.postDate}>
                <FaCalendarAlt />
                {new Date(post.date_posted).toLocaleDateString()}
              </span>
            </div>
          </div>
          <div className={styles.postCategory}>
            <FaTag /> {post.category}
          </div>
        </div>

        <div className={styles.postTitle}>
          <h2>{post.title || 'Untitled Post'}</h2>
        </div>

        <div className={styles.postMedia}>
          {post.media_url ? (
            post.media_type === 'video' ? (
              <video 
                src={`http://localhost:3000${post.media_url}`} 
                controls
                className={styles.mediaContent}
              />
            ) : (
              <img 
                src={`http://localhost:3000${post.media_url}`} 
                alt={post.title}
                className={styles.mediaContent}
                onError={(e) => {
                  e.target.src = linkFallback;
                }}
              />
            )
          ) : (
            <img 
              src={linkFallback} 
              alt={post.title}
              className={styles.mediaContent}
            />
          )}
        </div>

        <div className={styles.postContent}>
          <p className={styles.postDescription}>{post.description}</p>
        </div>

        <div className={styles.postStats}>
          <div 
            className={`${styles.reactions} ${isLiked ? styles.liked : ''}`} 
            onClick={handleLike} 
            style={{ cursor: 'pointer' }}
          >
            <i><FaHeart/></i>{formatNumber(likeCount)}
          </div>

          <div className={styles.reactions} onClick={scrollToComments} style={{ cursor: 'pointer' }}>
            <i><FaComment/></i>{formatNumber(comments.length)}
          </div>

          <div className={styles.reactions}>
            <i><FaEye/></i>{formatNumber(viewCount)}
          </div>

          {/* <div className={styles.reactions} onClick={handleShare} style={{ cursor: 'pointer' }}>
            <i><FaShare/></i><FaCamera style={{ marginLeft: '4px', fontSize: '0.8em' }}/>Share
          </div> */}
        </div>

        {/* Comments Section */}
        <div className={styles.commentsSection} ref={commentsSectionRef}>
          <h3 className={styles.commentsTitle}>Comments ({comments.length})</h3>
          
          {/* Add Comment Form */}
          <form onSubmit={handleAddComment} className={styles.commentForm}>
            <div className={styles.commentInputContainer}>
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a comment..."
                className={styles.commentInput}
                rows="3"
                maxLength="500"
              />
              <button 
                type="submit" 
                className={styles.commentSubmit}
                disabled={isCommenting || !newComment.trim()}
              >
                {isCommenting ? 'Posting...' : 'Post Comment'}
              </button>
            </div>
          </form>

          {/* Comments List */}
          <div className={styles.commentsList}>
            {comments.length === 0 ? (
              <p className={styles.noComments}>No comments yet. Be the first to comment!</p>
            ) : (
              comments.map((comment) => (
                <div key={comment.commentid} className={styles.commentItem}>
                  <div className={styles.commentHeader}>
                    <div className={styles.commentAuthor}>
                      <div className={styles.commentAuthorImage}>
                        {comment.userimage ? (
                          <img 
                            src={`http://localhost:3000/profileimages/${comment.userimage}`} 
                            alt={comment.username || 'User'}
                            className={styles.commentUserImage}
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'flex';
                            }}
                          />
                        ) : null}
                        <div className={styles.commentUserIcon}>
                          <FaUser />
                        </div>
                      </div>
                      <div className={styles.commentAuthorInfo}>
                        <span className={styles.commentAuthorName}>{comment.username || 'Anonymous'}</span>
                        <span className={styles.commentDate}>
                          {new Date(comment.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    {comment.user_id === parseInt(localStorage.getItem('userId') || '0') && (
                      <button 
                        onClick={() => handleDeleteComment(comment.commentid)}
                        className={styles.deleteCommentBtn}
                      >
                        ✕
                      </button>
                    )}
                  </div>
                  <p className={styles.commentText}>{comment.comment_text}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
    <SideBart/>
    
    {/* Login Modal */}
    {showLoginModal && (
      <div className={styles.loginModalOverlay} onClick={handleContinueWithoutLike}>
        <div className={styles.loginModalContent} onClick={(e) => e.stopPropagation()}>
          <div className={styles.loginModalHeader}>
            <h3>{loginAction === 'like' ? 'Login to Like' : 'Login to Comment'}</h3>
            <button 
              className={styles.loginModalClose} 
              onClick={handleContinueWithoutLike}
            >
              ✕
            </button>
          </div>
          <div className={styles.loginModalBody}>
            <p>{loginAction === 'like' ? 'You need to be logged in to like posts.' : 'You need to be logged in to add comments.'}</p>
            <div className={styles.loginModalButtons}>
              <button 
                className={styles.loginButton} 
                onClick={handleLoginClick}
              >
                Login
              </button>
              <button 
                className={styles.continueButton} 
                onClick={handleContinueWithoutLike}
              >
                Continue without {loginAction === 'like' ? 'liking' : 'commenting'}
              </button>
            </div>
          </div>
        </div>
      </div>
    )}
   </div>
   );
}

export default SinglePage;
