import { useState } from 'react';
import useDeleteComment from '../../hooks/comment/useDeleteComment';
import useGetComments from '../../hooks/comment/useGetComments';
import usePostComment from '../../hooks/comment/usePostComment';
import useUpdateComment from '../../hooks/comment/useUpdateComment';
import { Comment } from '../../types/comment';
import CommentCard from './CommentCard';
import CommentForm from './CommentForm';

interface CommentSectionProp {
  storyId: string;
  onCommentCountChange: (count: number) => void;
  commentInputRef: React.RefObject<HTMLTextAreaElement | null>;
}

const CommentSection = ({
  storyId,
  onCommentCountChange,
  commentInputRef,
}: CommentSectionProp) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const { loading } = useGetComments(storyId, setComments);
  const postComment = usePostComment(storyId, setComments);
  const updateComment = useUpdateComment(setComments);
  const deleteComment = useDeleteComment(setComments);

  onCommentCountChange(comments.length);

  const discardFailedComment = (commentId: string) => {
    setComments(prev => prev.filter(c => c.id !== commentId));
  };

  const loadingSkeleton = (
    <div className='flex flex-col gap-6 mb-4 h-72 animate-pulse'>
      <div className='w-3/5 rounded-md bg-stone-300 h-1/3'></div>
      <div className='w-2/5 rounded-md bg-stone-300 h-1/3'></div>
      <div className='w-4/5 rounded-md bg-stone-300 h-1/3'></div>
    </div>
  );

  return (
    <div>
      <CommentForm
        commentCount={comments?.length}
        onCreate={postComment}
        commentInputRef={commentInputRef}
      />
      <hr className='my-6 border-t-2 border-stone-300' />
      {loading ? (
        loadingSkeleton
      ) : (
        <div>
          {comments?.map(comment => (
            <CommentCard
              key={comment.id}
              comment={comment}
              onDelete={deleteComment}
              retry={postComment}
              discardComment={discardFailedComment}
              onUpdate={updateComment}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentSection;
