import MarkdownIt from 'markdown-it';
import { useContext, useEffect, useRef, useState } from 'react';
import { AiOutlineClose } from 'react-icons/ai';
import {
  FaBookmark,
  FaComment,
  FaHeart,
  FaShare,
  FaUserCircle,
} from 'react-icons/fa';
import { MdDeleteOutline, MdOutlineModeEdit } from 'react-icons/md';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { AuthContext } from '../context/AuthContext';
import { showToast } from '../utils/toast';

const StoryDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);
  if (!authContext?.token) {
    console.log('lol');
    return <Navigate to='/login' />;
  }
  const { username, role, token, id, name } = authContext;

  const story = location.state || {};
  const mdParser = new MarkdownIt();

  const parsedDescription = mdParser.render(story.description);

  useEffect(() => {
    if (!story) {
      navigate('/');
    }
  }, [story, navigate]);

  if (!story) {
    return null;
  }

  const { authorUsername, title, tags } = story;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleDeleteClick = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const confirmDelete = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/stories/${story.id}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to delete the story');
      }
      showToast('Successfully deleted story.', 'success');
      navigate('/');
    } catch (error) {
      console.error('Error deleting the story:', error);
      alert('There was an error deleting the story. Please try again.');
    }
  };

  const commentInputRef = useRef<HTMLTextAreaElement>(null);
  const handleCommentButtonClick = () => {
    if (commentInputRef.current) {
      //commentInputRef.current.focus();
      commentInputRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  };

  // const dummyComments = [
  //   {
  //     author: 'JohnDoe',
  //     createdAt: 'March 15, 2025',
  //     text: 'This is a great story! I really enjoyed reading it.',
  //     authorImage: 'https://via.placeholder.com/40', // Example user image
  //   },
  //   {
  //     author: 'JaneSmith',
  //     createdAt: 'March 14, 2025',
  //     text: 'I agree, this story was very insightful. Thanks for sharing!',
  //     authorImage: 'https://via.placeholder.com/40', // Example user image
  //   },
  //   {
  //     author: 'AlexJ',
  //     createdAt: 'March 13, 2025',
  //     text: 'Amazing work, would love to read more from you!',
  //     authorImage: 'https://via.placeholder.com/40', // Example user image
  //   },
  // ];

  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [totalLike, setTotalLike] = useState<number>(0);
  const [isLiking, setIsLiking] = useState<boolean>(false);

  useEffect(() => {
    const fetchLikeData = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/stories/${story.id}/likeStatus`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();
        setTotalLike(data.data.likeCount);
        setIsLiked(data.data.likedByUser);
      } catch (error) {
        console.error('Error fetching like data:', error);
      }
    };

    fetchLikeData();
  }, [story.id]);

  const handleLikeClick = async () => {
    if (isLiking) return;

    setIsLiking(true);

    // setTotalLike(prevCount => (isLiked ? prevCount - 1 : prevCount + 1));
    setIsLiked(prevStatus => !prevStatus);

    try {
      const response = await fetch(
        `http://localhost:3000/api/stories/${story.id}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to toggle like');
        // setTotalLike(prevCount => (isLiked ? prevCount + 1 : prevCount - 1));
        // setIsLiked(prevStatus => !prevStatus);
      }
      const data = await response.json();
      setTotalLike(data.data.likeCount);
      // setIsLiked(data.data.likedByUser);
    } catch (error) {
      console.error('Error toggling like:', error);
      // setTotalLike(prevCount => (isLiked ? prevCount + 1 : prevCount - 1));
      setIsLiked(prevStatus => !prevStatus);
    } finally {
      setIsLiking(false); // Reset the like/unlike in progress state
    }
  };

  interface CommentDTO {
    id: string;
    userId: string;
    comment: string;
    createdAt: Date;
    updatedAt: Date;
    author: string;
  }

  const [comments, setComments] = useState<CommentDTO[]>([]);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/stories/${story.id}/comments`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error('Failed to fetch comments');
        }
        const data = await response.json();
        setComments(data.data);
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    };
    fetchComments();
  }, [story.Id, token]);

  const [comment, setComment] = useState('');

  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editedCommentText, setEditedCommentText] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const handleEditComment = (commentId: string, commentText: string) => {
    setEditingCommentId(commentId);
    setEditedCommentText(commentText);
  };

  const handleSaveComment = async (commentId: string) => {
    if (!editedCommentText.trim() || loading) return;
    const prevComments = [...comments];
    
    setComments(prevComments =>
      prevComments.map(comment =>
        comment.id === commentId
          ? { ...comment, comment: editedCommentText, updatedAt: new Date() }
          : comment
      )
    );
  
    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:3000/api/comments/${commentId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ comment: editedCommentText }),
        }
      );
  
      if (!response.ok) throw new Error('Failed to update comment');
  
      const data = await response.json();
  
      setComments(prevComments =>
        prevComments.map(comment =>
          comment.id === commentId
            ? { ...comment, comment: data.data.comment, updatedAt: data.data.updatedAt }
            : comment
        )
      );
  
      setEditingCommentId(null);
      setEditedCommentText('');
    } catch (error) {
      console.error('Error saving comment:', error);
      setComments(prevComments);
      showToast('Failed to update comment.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingCommentId(null);
    setEditedCommentText('');
  };

  // const [loading, setLoading] = useState(false);
  // const [editId, setEditId] = useState<string | null>(null);
  // const [editText, setEditText] = useState('');

  const handleDeleteComment = async (commentId: string) => {
    const previousComments = [...comments];
    setComments(prev => prev.filter(c => c.id !== commentId));

    try {
      const response = await fetch(
        `http://localhost:3000/api/comments/${commentId}`,
        {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.ok) throw new Error('Failed to delete comment');
    } catch (error) {
      console.error('Error deleting comment:', error);
      setComments(previousComments); // Revert on failure
    }
  };

  // const handleEditComment = async (commentId: string) => {
  //   if (!editText.trim() || loading) return;
  //   setLoading(true);

  //   const previousComments = [...comments];

  //   setComments(prev =>
  //     prev.map(c =>
  //       c.id === commentId
  //         ? { ...c, comment: editText, updatedAt: new Date() }
  //         : c
  //     )
  //   );

  //   try {
  //     const response = await fetch(
  //       `http://localhost:3000/api/comments/${commentId}`,
  //       {
  //         method: 'PUT',
  //         headers: {
  //           'Content-Type': 'application/json',
  //           Authorization: `Bearer ${token}`,
  //         },
  //         body: JSON.stringify({ comment: editText }),
  //       }
  //     );

  //     if (!response.ok) throw new Error('Failed to update comment');
  //     setEditId(null);
  //     setEditText('');
  //   } catch (error) {
  //     console.error('Error editing comment:', error);
  //     setComments(previousComments); // Roll back UI on failure
  //     showToast('Failed to update comment.', 'error');
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleCreateComment = async () => {
    if (!comment.trim() || loading) return;
    setLoading(true);

    const tempComment = {
      id: Date.now().toString(),
      userId: id as string,
      comment,
      createdAt: new Date(),
      updatedAt: new Date(),
      author: name as string,
    };

    setComments(prev => [tempComment, ...prev]);
    setComment('');

    try {
      const response = await fetch(
        `http://localhost:3000/api/stories/${story.id}/comments`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ comment }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to post comment');
      }
      const data = await response.json();

      setComments(prev =>
        prev.map(c => (c.id === tempComment.id ? { ...c, ...data.data } : c))
      );
    } catch (error) {
      console.error('Error posting comment:', error);
      setComments(prev => prev.filter(c => c.id !== tempComment.id));
    } finally {
      setLoading(false);
    }
  };
  const [showConfirm, setShowConfirm] = useState<string | null>(null);

  return (
    <div className='min-h-screen bg-gray-100 dark:bg-gray-600'>
      <div className='sticky top-0 left-0 z-50 w-full'>
        <Navbar />
      </div>

      <div className='max-w-3xl p-4 mx-auto'>
        {/* Banner */}
        <div className='w-full h-48 mb-6 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 dark:from-blue-700 dark:to-purple-800'></div>

        {/* Author Info */}
        <div className='flex items-center gap-4 p-4 pl-0 mb-4 rounded-lg '>
          <FaUserCircle className='text-4xl text-gray-500 dark:text-gray-400' />
          <div>
            <p className='text-lg font-semibold text-gray-800 dark:text-gray-200'>
              {authorUsername}
            </p>
            <p className='text-sm text-gray-500 dark:text-gray-400'>
              {new Date(story.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}
            </p>
          </div>
        </div>

        {/* Interaction Buttons */}
        <div className='flex items-center justify-between px-0 mb-6 text-gray-600 dark:text-gray-300'>
          <div className='flex gap-4'>
            <button
              onClick={handleLikeClick}
              disabled={isLiking}
              className='relative flex items-center gap-1 group hover:text-red-500'
            >
              <FaHeart size='23' color={isLiked ? 'red' : 'gray'} /> {totalLike}
              <span className='absolute invisible px-2 py-1 text-sm text-white -translate-x-1/2 bg-black rounded-md opacity-0 dark:text-black dark:bg-white group-hover:visible group-hover:opacity-100 -top-8 left-1/2'>
                {isLiked ? 'Unlike' : 'Like'}
              </span>
            </button>

            {/* Comment Button */}
            <button
              onClick={handleCommentButtonClick}
              className='relative flex items-center gap-1 group hover:text-blue-500'
            >
              <FaComment size='23' /> {comments.length}
              <span className='absolute invisible px-2 py-1 text-sm text-white -translate-x-1/2 bg-black rounded-md opacity-0 dark:text-black dark:bg-white group-hover:visible group-hover:opacity-100 -top-8 left-1/2'>
                Comment
              </span>
            </button>
          </div>

          <div className='flex gap-8'>
            {/* Share Button */}
            <button className='relative flex items-center gap-1 group hover:text-green-500'>
              <FaShare size='23' />
              <span className='absolute invisible px-2 py-1 text-sm text-white -translate-x-1/2 bg-black rounded-md opacity-0 dark:text-black dark:bg-white group-hover:visible group-hover:opacity-100 -top-8 left-1/2'>
                Share
              </span>
            </button>

            {/* Bookmark Button */}
            <button className='relative flex items-center gap-1 group hover:text-yellow-500'>
              <FaBookmark size='23' />
              <span className='absolute invisible px-2 py-1 text-sm text-white -translate-x-1/2 bg-black rounded-md opacity-0 dark:text-black dark:bg-white group-hover:visible group-hover:opacity-100 -top-8 left-1/2'>
                Bookmark
              </span>
            </button>

            {/* Tooltip with More Options */}
            {(authorUsername == username || role == 1) && (
              <>
                <button
                  onClick={() =>
                    navigate(`/story/${story.id}/edit`, { state: story })
                  }
                  className='relative flex items-center gap-1 group hover:scale-105'
                >
                  <MdOutlineModeEdit size='23' />
                  <span className='absolute invisible px-2 py-1 text-sm text-white -translate-x-1/2 bg-black rounded-md opacity-0 group-active:opacity-0 dark:text-black dark:bg-white group-hover:visible group-hover:opacity-100 -top-8 left-1/2'>
                    Edit
                  </span>
                </button>

                <button
                  onClick={handleDeleteClick}
                  className='relative flex items-center gap-1 group hover:scale-105'
                >
                  <MdDeleteOutline size='23' />
                  <span className='absolute invisible px-2 py-1 text-sm text-white -translate-x-1/2 bg-black rounded-md opacity-0 group-active:opacity-0 dark:text-black dark:bg-white group-hover:visible group-hover:opacity-100 -top-8 left-1/2'>
                    Delete
                  </span>
                </button>
              </>
            )}

            {isModalOpen && (
              <div className='fixed inset-0 flex items-center justify-center bg-gray-700 bg-opacity-50'>
                <div className='relative p-6 bg-white rounded-lg dark:bg-gray-700'>
                  <AiOutlineClose
                    onClick={closeModal}
                    size='24'
                    className='absolute text-gray-600 cursor-pointer dark:text-gray-300 top-2 right-2 hover:scale-110'
                  />
                  <h2 className='mb-4 text-2xl font-bold dark:text-gray-100'>
                    Delete Story
                  </h2>
                  <p className='mb-4 text-lg dark:text-gray-200'>
                    Are you sure you want to delete the story?
                  </p>
                  <div className='flex justify-between'>
                    <button
                      onClick={closeModal}
                      className='px-4 py-2 text-black bg-gray-300 rounded-md dark:text-white dark:bg-gray-500 font-lg hover:bg-gray-500 hover:scale-105'
                    >
                      Cancel
                    </button>
                    <button
                      onClick={confirmDelete}
                      className='px-4 py-2 text-black bg-red-500 rounded-md dark:text-white font-lg hover:bg-red-600 hover:scale-105'
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <h1 className='mb-4 text-3xl font-bold text-gray-900 dark:text-gray-100'>
          {title}
        </h1>
        <p
          className='text-lg leading-relaxed text-gray-700 dark:text-gray-300'
          dangerouslySetInnerHTML={{ __html: parsedDescription }}
        />

        {/* Tags Display */}
        {tags.length > 0 && (
          <div className='mt-6'>
            <div className='flex flex-wrap gap-2 mt-2'>
              {tags.map((tag: string, index: number) => (
                <span
                  key={index}
                  className='px-4 py-2 text-sm font-semibold text-white bg-blue-500 rounded-full hover:bg-blue-600'
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className='mt-6'>
          {/* Comments Header */}
          <h2 className='mb-4 text-2xl font-bold text-gray-900 dark:text-gray-100'>
            Comments ({comments?.length || 0})
          </h2>

          {/* Comment Input Form */}
          <div className='mt-6'>
            <textarea
              ref={commentInputRef}
              className='w-full p-3 border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 focus:outline-none'
              placeholder='Write a comment...'
              value={comment}
              onChange={e => setComment(e.target.value)}
            ></textarea>
            <div className='flex justify-end gap-4 mt-2 mb-6'>
              <button
                className='px-2 py-1 text-gray-700 bg-gray-200 rounded-md dark:text-gray-200 dark:bg-gray-600 hover:bg-gray-300'
                onClick={() => setComment('')}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                className={`px-2 py-1 text-white bg-blue-600 rounded-md hover:bg-blue-700 ${
                  (!comment.trim() || loading) &&
                  'opacity-50 cursor-not-allowed'
                }`}
                onClick={handleCreateComment}
                disabled={!comment.trim() || loading}
              >
                {loading ? 'Posting...' : 'Comment'}
              </button>
            </div>
          </div>

          {/* Comments List */}
          <div className='space-y-4'>
            {comments.length > 0 &&
              comments.map(comment => (
                <div
                  key={comment.id}
                  className='p-4 border-b border-gray-400 dark:border-gray-600'
                >
                  {/* First row: Profile Image + Name, Date, Edit/Delete Buttons */}
                  <div className='flex items-start justify-between'>
                    {/* Profile Image and Name + Date */}
                    <div className='flex items-start'>
                      <img
                        src={'https://via.placeholder.com/40'}
                        alt='random'
                        className='w-12 h-12 mr-4 rounded-full'
                      />
                      <div className='flex flex-col'>
                        <p className='text-sm font-semibold text-gray-600 dark:text-gray-300'>
                          {comment.author}
                        </p>
                        <p className='text-xs text-gray-500 dark:text-gray-400'>
                          {new Date(comment.createdAt).toLocaleDateString(
                            'en-US',
                            {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            }
                          )}
                        </p>
                      </div>
                    </div>

                    {/* Edit/Delete Buttons */}
                    {(role === 1 || comment.userId === id) && (
                      <div className='flex gap-4'>
                        <button
                          onClick={() =>
                            handleEditComment(comment.id, comment.comment)
                          }
                          className='px-2 py-1 text-white bg-blue-500 rounded-md hover:bg-blue-600'
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => setShowConfirm(comment.id)}
                          className='px-2 py-1 text-white bg-red-500 rounded-md hover:bg-red-600'
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>

                  {editingCommentId === comment.id ? (
                    <div className='mt-2'>
                      <textarea
                        className='w-full p-3 border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 focus:outline-none'
                        value={editedCommentText}
                        onChange={e => setEditedCommentText(e.target.value)}
                      />
                      <div className='flex justify-end gap-4 mt-2'>
                        <button
                          onClick={handleCancelEdit}
                          className='px-2 py-1 text-gray-700 bg-gray-200 rounded-md dark:text-gray-200 dark:bg-gray-600 hover:bg-gray-300'
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleSaveComment(comment.id)}
                          className={`px-2 py-1 text-white bg-blue-600 rounded-md hover:bg-blue-700 ${
                            !editedCommentText.trim() ||
                            loading ||
                            editedCommentText.trim() == comment.comment.trim()
                              ? 'opacity-50 cursor-not-allowed'
                              : ''
                          }`}
                          disabled={
                            !editedCommentText.trim() ||
                            loading ||
                            editedCommentText.trim() == comment.comment.trim()
                          }
                        >
                          {loading ? 'Saving...' : 'Save'}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className='mt-2 font-medium text-gray-700 dark:text-gray-300'>
                      {comment.comment}
                    </p>
                  )}

                  {/* Second row: Comment Text */}
                  {/* <p className='mt-2 font-medium text-gray-700 dark:text-gray-300'>
                    {comment.comment}
                  </p> */}

                  {/* Centered Delete Confirmation Popup */}
                  {showConfirm === comment.id && (
                    <div className='fixed inset-0 z-50 flex items-center justify-center bg-gray-700 bg-opacity-50'>
                      <div className='w-full max-w-sm p-6 bg-white rounded-lg shadow-lg dark:bg-gray-800'>
                        <p className='mb-6 text-center text-gray-800 dark:text-gray-300'>
                          Are you sure you want to delete this comment?
                        </p>
                        <div className='flex justify-center gap-6'>
                          <button
                            onClick={() => setShowConfirm(null)}
                            className='px-4 py-2 text-gray-700 bg-gray-300 rounded-md hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-700'
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => {
                              handleDeleteComment(comment.id);
                              setShowConfirm(null);
                            }}
                            className='px-4 py-2 text-white bg-red-500 rounded-md hover:bg-red-600'
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoryDetails;
