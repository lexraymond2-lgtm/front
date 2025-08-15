import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './post.module.css';
import linkFallback from '../assets/linkp.png';
import {
    FaPlus,
    FaSearch,
    FaFilter,
    FaEdit,
    FaTrash,
    FaEye,
    FaThumbsUp,
    FaComment,
    FaShare,
    FaCalendarAlt,
    FaUser,
    FaTag,
    FaEllipsisH,
    FaTimes,
    FaUpload,
    FaLink,
    FaArrowLeft,
} from 'react-icons/fa';

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

function Post() {
    const location = useLocation();
    const navigate = useNavigate();
    const [posts, setPosts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('all');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [selectedPost, setSelectedPost] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [deletingPostId, setDeletingPostId] = useState(null);

    // Form state for creating posts
    const [formData, setFormData] = useState({
        title: '',
        category: 'games',
        description: '',
        mediaUrl: '',
        mediaType: 'link',
        mediaFile: null,
        existingMediaUrl: null,
        existingMediaType: null
    });

    // Fetch posts from database
    const fetchPosts = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get('http://localhost:3000/posts');
            // Handle both response formats: { posts: [...] } or [...]
            const postsData = response.data.posts || response.data;
            setPosts(postsData);
        } catch (err) {
            console.error('Error fetching posts:', err);
            setPosts([]); // Set empty array on error
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);





    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleFilterChange = (e) => {
        setFilterCategory(e.target.value);
    };

    const handleCreatePost = () => {
        setShowCreateModal(true);
        setSelectedPost(null);
        setFormData({
            title: '',
            category: 'games',
            description: '',
            mediaUrl: '',
            mediaType: 'link',
            mediaFile: null,
            existingMediaUrl: null,
            existingMediaType: null
        });
    };

    const handleEditPost = (post) => {
        setSelectedPost(post);
        // Explicitly reset form data to ensure clean state
        const newFormData = {
            title: post.title || '',
            category: post.category || 'games',
            description: post.description || post.content || '',
            mediaUrl: '', // Explicitly clear mediaUrl - never set from existing media
            mediaType: 'keep', // Default to keeping existing media
            mediaFile: null,
            existingMediaUrl: post.media_url || null,
            existingMediaType: post.media_type || null
        };

        setFormData(newFormData);
        setShowCreateModal(true);
    };

    const handleDeletePost = async (postId) => {
        if (window.confirm('Are you sure you want to delete this post?')) {
            const token = localStorage.getItem('token');
            if (!token) {
                alert('Please log in to delete posts.');
                return;
            }

            try {
                setDeletingPostId(postId);
                
                // Call backend API to delete the post
                await axios.delete(`http://localhost:3000/posts/${postId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                // Remove from local state only after successful deletion
                setPosts(posts.filter(post => (post.postid ?? post.id) !== postId));
                alert('Post deleted successfully!');
            } catch (err) {
                console.error('Error deleting post:', err);
                alert(err.response?.data?.message || 'Failed to delete post. Please try again.');
            } finally {
                setDeletingPostId(null);
            }
        }
    };

    const handleBookmark = (postId) => {
        setPosts(posts.map(post => {
            const currentId = post.postid ?? post.id;
            return currentId === postId ? { ...post, isBookmarked: !post.isBookmarked } : post;
        }));
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({
                ...prev,
                mediaFile: file,
                mediaType: 'upload'
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        if (!token) {
            alert('Please log in to create a post.');
            return;
        }

        try {
            const fd = new FormData();
            fd.append('title', formData.title);
            fd.append('category', formData.category);
            fd.append('description', formData.description);
            
            // Handle media for edit vs create
            if (selectedPost) {
                // For editing: handle different media options
                if (formData.mediaType === 'upload' && formData.mediaFile) {
                    fd.append('media', formData.mediaFile);
                } else if (formData.mediaType === 'link' && formData.mediaUrl) {
                    fd.append('mediaUrl', formData.mediaUrl);
                    fd.append('mediaType', 'link');
                } else if (formData.mediaType === 'none') {
                    // Remove media entirely
                    fd.append('removeMedia', 'true');
                } else if (formData.existingMediaUrl && formData.mediaType === 'keep') {
                    // Keep existing media
                    fd.append('keepExistingMedia', 'true');
                }
            } else {
                // For creating: send new media if provided
                if (formData.mediaType === 'upload' && formData.mediaFile) {
                    fd.append('media', formData.mediaFile);
                }
                if (formData.mediaType === 'link' && formData.mediaUrl) {
                    fd.append('mediaUrl', formData.mediaUrl);
                    fd.append('mediaType', 'link');
                }
            }

            if (selectedPost) {
                // Edit existing post
                const res = await axios.put(`http://localhost:3000/posts/${selectedPost.postid}`, fd, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data',
                    },
                });

                // Backend returns only a message; refetch to get the updated post
                await fetchPosts();
            } else {
                // Create new post
                const res = await axios.post('http://localhost:3000/posts', fd, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data',
                    },
                });

                const created = res.data?.post || res.data;
                setPosts(prev => [created, ...prev]);
            }

            setShowCreateModal(false);
            setSelectedPost(null);
            setFormData({
                title: '',
                category: 'games',
                description: '',
                mediaUrl: '',
                mediaType: 'link',
                mediaFile: null,
                existingMediaUrl: null,
                existingMediaType: null
            });
        } catch (err) {
            console.error('Post operation failed:', err);
            alert(err.response?.data?.message || 'Failed to save post');
        }
    };

    const handleCloseModal = () => {
        setShowCreateModal(false);
        setSelectedPost(null);
        setFormData({
            title: '',
            category: 'games',
            description: '',
            mediaUrl: '',
            mediaType: 'link',
            mediaFile: null,
            existingMediaUrl: null,
            existingMediaType: null
        });
    };

    const handleBackToHome = () => {
        navigate('/');
    };

    const filteredPosts = posts.filter(post => {
        const matchesSearch = (post.title && post.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (post.description && post.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (post.content && post.content.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesFilter = filterCategory === 'all' || post.category === filterCategory;
        return matchesSearch && matchesFilter;
    });

    return (
        <div className={styles.postContainer}>
            <div className={styles.mainContent}>
                {/* Header */}
                <div className={styles.header}>
                    <div className={styles.headerLeft}>
                        <button className={styles.backButton} onClick={handleBackToHome}>
                            <FaArrowLeft />
                            Back to Home
                        </button>
                        <h1 className={styles.title}>Posts Dashboard</h1>
                        <p className={styles.subtitle}>Manage and create your posts</p>
                    </div>
                    <div className={styles.headerRight}>
                        <button className={styles.createButton} onClick={handleCreatePost}>
                            <FaPlus />
                            Create Post
                        </button>
                    </div>
                </div>

                {/* Search and Filter */}
                <div className={styles.controls}>
                    <div className={styles.searchContainer}>
                        <FaSearch className={styles.searchIcon} />
                        <input
                            type="text"
                            placeholder="Search posts..."
                            value={searchTerm}
                            onChange={handleSearch}
                            className={styles.searchInput}
                        />
                    </div>

                    <div className={styles.filterContainer}>
                        <FaFilter className={styles.filterIcon} />
                        <select
                            value={filterCategory}
                            onChange={handleFilterChange}
                            className={styles.filterSelect}
                        >
                            <option value="all">All Categories</option>
                            <option value="games">Games</option>
                            <option value="movies">Movies</option>
                            <option value="anime">Anime</option>
                        </select>
                    </div>
                </div>

                {/* Loading State */}
                {isLoading && (
                    <div className={styles.loadingState}>
                        <div className={styles.loadingSpinner}></div>
                        <p>Loading posts...</p>
                    </div>
                )}

                {/* Stats */}
                {!isLoading && (
                    <div className={styles.stats}>
                        <div className={styles.statCard}>
                            <div className={styles.statNumber}>{posts.length}</div>
                            <div className={styles.statLabel}>Total Posts</div>
                        </div>
                        <div className={styles.statCard}>
                            <div className={styles.statNumber}>
                                {formatNumber(posts.reduce((sum, post) => sum + (post.likes || 0), 0))}
                            </div>
                            <div className={styles.statLabel}>Total Likes</div>
                        </div>
                        <div className={styles.statCard}>
                            <div className={styles.statNumber}>
                                {formatNumber(posts.reduce((sum, post) => sum + (post.comments_count || 0), 0))}
                            </div>
                            <div className={styles.statLabel}>Total Comments</div>
                        </div>
                        <div className={styles.statCard}>
                            <div className={styles.statNumber}>
                                {posts.filter(post => post.isBookmarked).length}
                            </div>
                            <div className={styles.statLabel}>Bookmarked</div>
                        </div>
                    </div>
                )}

                {/* Posts Grid */}
                {!isLoading && (
                    <div className={styles.postsGrid}>
                        {filteredPosts.map((postItem) => (
                            <div key={postItem.postid || postItem.id} className={styles.postCard}>
                                <div className={styles.postImage}>
                                    {postItem.media_url ? (
                                        postItem.media_type === 'video' ? (
                                            <video 
                                                src={`http://localhost:3000${postItem.media_url}`} 
                                                
                                                controls
                                                className={styles.postMedia}
                                            />
                                        ) : (
                                            <img 
                                                src={`http://localhost:3000${postItem.media_url}`} 
                                                alt={postItem.title}
                                                className={styles.postMedia}
                                                onError={(e) => {
                                                    e.currentTarget.src = linkFallback;
                                                }}
                                            />
                                        )
                                    ) : (
                                        <img 
                                            src={linkFallback} 
                                            alt={postItem.title}
                                            className={styles.postMedia}
                                        />
                                    )}
                                    <div className={styles.postOverlay}>
                                        <button
                                            className={styles.bookmarkButton}
                                            onClick={() => handleBookmark(postItem.postid || postItem.id)}
                                        >
                                            {postItem.isBookmarked ? <FaCalendarAlt /> : <FaCalendarAlt />}
                                        </button>
                                    </div>
                                </div>

                                <div className={styles.postContent}>
                                    <div className={styles.postHeader}>
                                        <div className={styles.postMeta}>
                                            <span className={styles.postCategory}>{postItem.category}</span>
                                            <span className={styles.postDate}>
                                                <FaCalendarAlt />
                                                {new Date(postItem.date_posted || postItem.date).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <div className={styles.postActions}>
                                            <button
                                                className={styles.actionButton}
                                                onClick={() => handleEditPost(postItem)}
                                            >
                                                <FaEdit />
                                            </button>
                                            <button
                                                className={styles.actionButton}
                                                onClick={() => handleDeletePost(postItem.postid || postItem.id)}
                                                disabled={deletingPostId === (postItem.postid || postItem.id)}
                                                title={deletingPostId === (postItem.postid || postItem.id) ? 'Deleting...' : 'Delete post'}
                                            >
                                                {deletingPostId === (postItem.postid || postItem.id) ? (
                                                    <div className={styles.loadingSpinner}></div>
                                                ) : (
                                                    <FaTrash />
                                                )}
                                            </button>
                                            <button className={styles.actionButton}>
                                                <FaEllipsisH />
                                            </button>
                                        </div>
                                    </div>

                                    <h3 className={styles.postTitle}>{postItem.title}</h3>
                                    <p className={styles.postExcerpt}>{(postItem.description || postItem.content || '').substring(0, 120)}...</p>

                                    <div className={styles.postAuthor}>
                                        <FaUser />
                                        <span>{postItem.author || 'Anonymous'}</span>
                                    </div>

                                    {postItem.tags && (
                                        <div className={styles.postTags}>
                                            {postItem.tags.map((tag, index) => (
                                                <span key={index} className={styles.tag}>
                                                    <FaTag />
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    )}

                                    <div className={styles.postStats}>
                                        <div className={styles.stat}>
                                            <FaThumbsUp />
                                            <span>{formatNumber(postItem.likes)}</span>
                                        </div>
                                        <div className={styles.stat}>
                                            <FaComment />
                                            <span>{formatNumber(postItem.comments_count)}</span>
                                        </div>
                                        <div className={styles.stat}>
                                            <FaEye />
                                            <span>{formatNumber(postItem.shares)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {!isLoading && filteredPosts.length === 0 && (
                    <div className={styles.emptyState}>
                        <div className={styles.emptyIcon}>📝</div>
                        <h3>No posts found</h3>
                        <p>Try adjusting your search or filter criteria</p>
                        <button className={styles.createButton} onClick={handleCreatePost}>
                            <FaPlus />
                            Create Your First Post
                        </button>
                    </div>
                )}
            </div>

            {/* Create Post Modal */}
            {showCreateModal && (
                <div className={styles.modalOverlay} onClick={handleCloseModal}>
                    <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h2>{selectedPost ? 'Edit Post' : 'Create New Post'}</h2>
                            <button className={styles.closeButton} onClick={handleCloseModal}>
                                <FaTimes />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className={styles.modalForm}>
                            <div className={styles.formGroup}>
                                <label htmlFor="title">Title (Optional)</label>
                                <input
                                    type="text"
                                    id="title"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    placeholder="Enter post title..."
                                    className={styles.formInput}
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label htmlFor="category">Category *</label>
                                <select
                                    id="category"
                                    name="category"
                                    value={formData.category}
                                    onChange={handleInputChange}
                                    className={styles.formSelect}
                                    required
                                >
                                    <option value="games">Games</option>
                                    <option value="movies">Movies</option>
                                    <option value="anime">Anime</option>
                                </select>
                            </div>

                            <div className={styles.formGroup}>
                                <label htmlFor="description">Description *</label>
                                <textarea
                                    id="description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    placeholder="Write your post description..."
                                    className={styles.formTextarea}
                                    rows="4"
                                    required
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label>Media {selectedPost ? '(Optional)' : ''}</label>
                                
                                {/* Show existing media if editing */}
                                {selectedPost && formData.existingMediaUrl && (
                                    <div className={styles.existingMedia}>
                                        <h4>Current Media:</h4>
                                        {formData.existingMediaType === 'video' ? (
                                            <video 
                                                src={`http://localhost:3000${formData.existingMediaUrl}`}
                                                controls
                                                style={{ maxWidth: '200px', maxHeight: '150px' }}
                                            />
                                        ) : (
                                            <img 
                                                src={`http://localhost:3000${formData.existingMediaUrl}`}
                                                alt="Current media"
                                                style={{ maxWidth: '200px', maxHeight: '150px' }}
                                            />
                                        )}
                                        <p className={styles.mediaNote}>
                                            Choose an option below to update media, or keep current media.
                                        </p>
                                    </div>
                                )}
                                
                                <div className={styles.mediaOptions}>
                                    <div className={styles.mediaOption}>
                                        <input
                                            type="radio"
                                            id="upload"
                                            name="mediaType"
                                            value="upload"
                                            checked={formData.mediaType === 'upload'}
                                            onChange={() => setFormData(prev => ({ 
                                                ...prev, 
                                                mediaType: 'upload', 
                                                mediaFile: null, 
                                                mediaUrl: '' 
                                            }))}
                                        />
                                        <label htmlFor="upload">
                                            <FaUpload />
                                            Upload New File
                                        </label>
                                        {formData.mediaType === 'upload' && (
                                            <input
                                                type="file"
                                                accept="image/*,video/*"
                                                onChange={handleFileChange}
                                                className={styles.fileInput}
                                            />
                                        )}
                                    </div>

                                    <div className={styles.mediaOption}>
                                        <input
                                            type="radio"
                                            id="link"
                                            name="mediaType"
                                            value="link"
                                            checked={formData.mediaType === 'link'}
                                            onChange={() => setFormData(prev => ({ 
                                                ...prev, 
                                                mediaType: 'link', 
                                                mediaFile: null,
                                                mediaUrl: '' // Clear any existing URL when switching to link mode
                                            }))}
                                        />
                                        <label htmlFor="link">
                                            <FaLink />
                                            External Link
                                        </label>
                                        {formData.mediaType === 'link' && (
                                            <input
                                                type="url"
                                                name="mediaUrl"
                                                value={selectedPost ? '' : (formData.mediaUrl || '')}
                                                onChange={handleInputChange}
                                                placeholder="https://example.com/media"
                                                className={styles.formInput}
                                                key={`mediaUrl-${selectedPost ? selectedPost.postid || selectedPost.id : 'create'}`}
                                            />
                                        )}
                                    </div>
                                    
                                    {selectedPost && formData.existingMediaUrl && (
                                        <div className={styles.mediaOption}>
                                            <input
                                                type="radio"
                                                id="keep"
                                                name="mediaType"
                                                value="keep"
                                                checked={formData.mediaType === 'keep'}
                                                onChange={() => setFormData(prev => ({ 
                                                    ...prev, 
                                                    mediaType: 'keep', 
                                                    mediaFile: null, 
                                                    mediaUrl: '' 
                                                }))}
                                            />
                                            <label htmlFor="keep">
                                                📎 Keep Current Media
                                            </label>
                                        </div>
                                    )}
                                    
                                    {selectedPost && (
                                        <div className={styles.mediaOption}>
                                            <input
                                                type="radio"
                                                id="none"
                                                name="mediaType"
                                                value="none"
                                                checked={formData.mediaType === 'none'}
                                                onChange={() => setFormData(prev => ({ 
                                                    ...prev, 
                                                    mediaType: 'none', 
                                                    mediaFile: null, 
                                                    mediaUrl: '' 
                                                }))}
                                            />
                                            <label htmlFor="none">
                                                ❌ Remove Media
                                            </label>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className={styles.modalActions}>
                                <button
                                    type="button"
                                    className={styles.cancelButton}
                                    onClick={handleCloseModal}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className={styles.submitButton}
                                >
                                    {selectedPost ? 'Update Post' : 'Create Post'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            
        </div>
    );
}

export default Post;