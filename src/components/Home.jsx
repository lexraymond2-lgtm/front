import SideBar from "./Sidebarr.jsx";
import SideBart from "./Sidebarrite.jsx";
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import styles from "./home.module.css";
import { FaHeart, FaComment, FaEye, FaUser, FaCalendarAlt, FaTag, FaShare, FaCamera, FaFilter } from "react-icons/fa";
import linkFallback from '../assets/linkp.png';
import SinglePage from './SinglePage';
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

function Home() {
  const navigate = useNavigate();
  const location = useLocation();
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [selectedPostForShare, setSelectedPostForShare] = useState(null);
  const [shareMessage, setShareMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  // Function to truncate long text
  const truncateText = (text, maxWords = 12) => {
    if (!text) return '';
    const words = text.split(' ');
    if (words.length <= maxWords) return text;
    return words.slice(0, maxWords).join(' ') + '...';
  };

  // Fetch posts from database
  const fetchPosts = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get('http://localhost:3000/posts');
      const postsData = response.data.posts || response.data;
      setPosts(postsData);
      setFilteredPosts(postsData);
    } catch (err) {
      console.error('Error fetching posts:', err);
      setPosts([]);
      setFilteredPosts([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter posts based on search term and category
  useEffect(() => {
    let filtered = posts;

    // Filter by category first
    if (filterCategory !== 'all') {
      filtered = filtered.filter(post => post.category === filterCategory);
    }

    // Then filter by search term
    if (searchTerm.trim() !== '') {
      filtered = filtered.filter(post => {
        const title = (post.title || '').toLowerCase();
        const description = (post.description || '').toLowerCase();
        const search = searchTerm.toLowerCase();
        return title.includes(search) || description.includes(search);
      });
    }

    setFilteredPosts(filtered);
  }, [searchTerm, filterCategory, posts]);

  useEffect(() => {
    fetchPosts();
  }, []);

  const handlePostClick = (postId) => {
    setSelectedPostId(postId);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedPostId(null);
    // Refresh posts data to ensure we have the latest like and view counts
    fetchPosts();
  };

  const updatePostLikes = (postId, newLikeCount, isLiked) => {
    setPosts(prevPosts =>
      prevPosts.map(post =>
        post.postid === postId
          ? { ...post, likes: newLikeCount }
          : post
      )
    );
  };

  const updatePostViews = (postId, newViewCount) => {
    setPosts(prevPosts =>
      prevPosts.map(post =>
        post.postid === postId
          ? { ...post, shares: newViewCount }
          : post
      )
    );
  };

  const updatePostComments = (postId, newCommentCount) => {
    setPosts(prevPosts =>
      prevPosts.map(post =>
        post.postid === postId
          ? { ...post, comments_count: newCommentCount }
          : post
      )
    );
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle category filter change
  const handleFilterChange = (e) => {
    setFilterCategory(e.target.value);
  };

  const handleShare = async (post, e) => {
    e.stopPropagation(); // Prevent opening the post modal
    setSelectedPostForShare(post);
    setShowShareModal(true);
  };

  const handleShareAction = async (action) => {
    if (!selectedPostForShare) return;

    const shareUrl = `${window.location.origin}/post/${selectedPostForShare.postid}`;
    const shareText = `Check out this post: ${selectedPostForShare?.title || 'Untitled Post'}`;

    try {
      if (action === 'screenshot') {
        // Wait for the next render cycle
        setTimeout(async () => {
          const postElement = document.querySelector(`[data-post-id="${selectedPostForShare.postid}"]`);
          if (postElement) {
            await takeScreenshot(
              postElement,
              `post-${selectedPostForShare.postid}-${Date.now()}.png`
            );
            setShareMessage('Screenshot saved successfully!');
          }
        }, 100);
      } else if (action === 'copy') {
        await copyToClipboard(`${shareText}\n${shareUrl}`);
        setShareMessage('Post link copied to clipboard!');
      }
    } catch (err) {
      console.error('Error sharing:', err);
      const errorMessage = action === 'screenshot' ? 'Failed to take screenshot. Please try again.' : 'Failed to copy link to clipboard.';
      setShareMessage(errorMessage);
    }

    // Clear message after 3 seconds
    setTimeout(() => setShareMessage(''), 3000);
  };

  const handleCloseShareModal = () => {
    setShowShareModal(false);
    setSelectedPostForShare(null);
    setShareMessage('');
  };

  return (
    <div className={styles.homefp}>
      <div className={styles.homemaincointainer}>
        <div>
          <SideBar
            showSearch={true}
            searchTerm={searchTerm}
            onSearchChange={handleSearchChange}
            filterCategory={filterCategory}
            onFilterChange={handleFilterChange}
          />
        </div>
        <div className={styles.maincontent}>
          {/* Post Count Display */}
          <div className={styles.postCountDisplay}>
            <span>{filteredPosts.length} post{filteredPosts.length !== 1 ? 's' : ''} found</span>
          </div>

          {isLoading ? (
            <div className={styles.loadingState}>
              <div className={styles.loadingSpinner}></div>
              <p>Loading posts...</p>
            </div>
          ) : (
            <div className={styles.content1}>
              {filteredPosts.map((post) => (
                <div
                  key={post.postid}
                  className={styles.content2}
                  data-post-id={post.postid}
                  onClick={() => handlePostClick(post.postid)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className={styles.cnt2top}>
                    <div className={styles.imagediv}>
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
                    <div className={styles.shortdesc}>
                      <h5>{truncateText(post.title || 'Untitled Post', 5)}</h5>
                      <p>{truncateText(post.description, 10)}</p>
                      <div className={styles.postMeta}>
                        <span className={styles.postAuthor}>
                          <FaUser /> {post.username || 'Anonymous'}
                        </span>
                        <span className={styles.postCategory}>
                          <FaTag /> {post.category}
                        </span>
                        <span className={styles.postDate}>
                          <FaCalendarAlt />
                          {new Date(post.date_posted).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className={styles.cnt2mid}>
                    <div className={styles.mediacontainer}>
                      {post.media_url ? (
                        post.media_type === 'video' ? (
                          <video
                            src={`http://localhost:3000${post.media_url}`}

                            controls
                            style={{ pointerEvents: 'none' }}
                            className={styles.postMedia}
                          />
                        ) : (
                          <img
                            src={`http://localhost:3000${post.media_url}`}
                            alt={post.title}
                            className={styles.postMedia}
                            onError={(e) => {
                              e.target.src = linkFallback;
                            }}
                          />
                        )
                      ) : (
                        <img
                          src={linkFallback}
                          alt={post.title}
                          className={styles.postMedia}
                        />
                      )}
                    </div>
                  </div>

                  <div className={styles.cnt2botom}>
                    <div className={styles.reactions}>
                      <i><FaHeart /></i>{formatNumber(post.likes)}
                    </div>

                    <div className={styles.reactions}>
                      <i><FaComment /></i>{formatNumber(post.comments_count)}
                    </div>

                    <div className={styles.reactions}>
                      <i><FaEye /></i>{formatNumber(post.shares)}
                    </div>

                    <div className={styles.reactions} onClick={(e) => handleShare(post, e)}>
                    {post.media_url ? (
                        post.media_type === 'video' ? (
                          <i></i>
                        ) : (
                          <i><FaCamera style={{ marginLeft: '4px', fontSize: '0.8em' }} /> </i>
                        )
                      ) : (
                        <i></i>
                      )}
                      
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!isLoading && filteredPosts.length === 0 && (
            <div className={styles.emptyState}>
              {searchTerm || filterCategory !== 'all' ? (
                // No search/filter results
                <>
                  <div className={styles.emptyIcon}>🔍</div>
                  <h3>No posts found</h3>
                  <p>
                    {searchTerm && filterCategory !== 'all'
                      ? `No ${filterCategory} posts match your search for "${searchTerm}"`
                      : searchTerm
                        ? `No posts match your search for "${searchTerm}"`
                        : `No posts found in the ${filterCategory} category`
                    }
                  </p>
                  <div className={styles.emptyActions}>
                    {(searchTerm || filterCategory !== 'all') && (
                      <button
                        className={styles.clearSearchBtn}
                        onClick={() => {
                          setSearchTerm('');
                          setFilterCategory('all');
                        }}
                      >
                        Clear All Filters
                      </button>
                    )}
                  </div>
                </>
              ) : (
                // No posts at all
                <>
                  <div className={styles.emptyIcon}>📝</div>
                  <h3>No posts available</h3>
                  <div className={styles.emptyActions}>
                    
                    <p className={styles.emptySubtext}>
                      posts are on their way stay tuned 📺 
                    </p>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
        <SideBart />
      </div>

      {/* Modal Overlay */}
      {showModal && (
        <div className={styles.modalOverlay} onClick={handleCloseModal}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeButton} onClick={handleCloseModal}>
              ✕
            </button>
            <SinglePage postId={selectedPostId} onClose={handleCloseModal} onUpdateLikes={updatePostLikes} onUpdateViews={updatePostViews} onUpdateComments={updatePostComments} />
          </div>
        </div>
      )}

      {/* Share Modal Overlay */}
      {showShareModal && (
        <div className={styles.modalOverlay} onClick={handleCloseShareModal}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.shareModal}>
              <div className={styles.shareModalHeader}>
                <h3>Share Post</h3>
                <button className={styles.closeButton} onClick={handleCloseShareModal}>
                  ✕
                </button>
              </div>
              
              <div className={styles.shareModalContent}>
                {selectedPostForShare && (
                  <div className={styles.sharePostPreview}>
                    <h4>{selectedPostForShare.title || 'Untitled Post'}</h4>
                    <p>{selectedPostForShare.description}</p>
                    {selectedPostForShare.media_url && (
                      <div className={styles.shareMediaPreview}>
                        {selectedPostForShare.media_type === 'video' ? (
                          <video
                            src={`http://localhost:3000${selectedPostForShare.media_url}`}
                            controls
                            style={{ maxWidth: '200px', maxHeight: '150px' }}
                          />
                        ) : (
                          <img
                            src={`http://localhost:3000${selectedPostForShare.media_url}`}
                            alt={selectedPostForShare.title}
                            style={{ maxWidth: '200px', maxHeight: '150px' }}
                          />
                        )}
                      </div>
                    )}
                  </div>
                )}

                <div className={styles.shareOptions}>
                  <button
                    className={styles.shareOption}
                    onClick={() => handleShareAction('screenshot')}
                  >
                    <FaCamera />
                    <span>Take Screenshot</span>
                  </button>
                </div>

                {shareMessage && (
                  <div className={`${styles.shareMessage} ${shareMessage.includes('Failed') ? styles.error : ''}`}>
                    {shareMessage}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
