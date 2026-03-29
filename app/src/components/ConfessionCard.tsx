import { useState } from 'react';
import type { Confession, Comment } from '@/types';
import { formatTimeAgo, formatNumber, REACTIONS } from '@/types';
import { useConfessionStore } from '@/store/confessionStore';
import { Heart, MessageCircle, Share2, Flag, MoreHorizontal, Send, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';

interface ConfessionCardProps {
  confession: Confession;
  featured?: boolean;
}

export function ConfessionCard({ confession, featured = false }: ConfessionCardProps) {
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [showReportDialog, setShowReportDialog] = useState(false);
  const [reportReason, setReportReason] = useState('');
  
  const likedConfessions = useConfessionStore(state => state.likedConfessions);
  const votedPolls = useConfessionStore(state => state.votedPolls);
  const likeConfession = useConfessionStore(state => state.likeConfession);
  const addComment = useConfessionStore(state => state.addComment);
  const votePoll = useConfessionStore(state => state.votePoll);
  const flagConfession = useConfessionStore(state => state.flagConfession);
  const adminMode = useConfessionStore(state => state.adminMode);
  const unflagConfession = useConfessionStore(state => state.unflagConfession);
  const deleteConfession = useConfessionStore(state => state.deleteConfession);
  
  const isLiked = likedConfessions.includes(confession.id);
  const hasVoted = votedPolls[confession.id];
  
  const sentimentColors: Record<string, string> = {
    happy: 'sentiment-happy',
    sad: 'sentiment-sad',
    angry: 'sentiment-angry',
    anxious: 'sentiment-anxious',
    loving: 'sentiment-loving',
    neutral: 'sentiment-neutral'
  };
  
  const handleLike = () => {
    likeConfession(confession.id);
  };
  
  const handleAddComment = () => {
    if (!commentText.trim()) return;
    addComment(confession.id, commentText);
    setCommentText('');
    toast.success('Comment added anonymously');
  };
  
  const handleShare = () => {
    const url = confession.isPrivate 
      ? `${window.location.origin}/confession/${confession.shareToken}`
      : `${window.location.origin}/confession/${confession.id}`;
    navigator.clipboard.writeText(url);
    toast.success('Link copied to clipboard');
    setShowShareDialog(false);
  };
  
  const handleReport = () => {
    if (!reportReason.trim()) return;
    flagConfession(confession.id, reportReason);
    toast.success('Thank you for reporting. We\'ll review this content.');
    setShowReportDialog(false);
    setReportReason('');
  };
  
  const handleVote = (optionId: string) => {
    votePoll(confession.id, optionId);
  };

  return (
    <>
      <div className={`glass-card p-5 sm:p-6 safe-transition hover:shadow-lg ${featured ? 'scale-105' : ''}`}>
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-lg">
              {confession.mood.split(' ')[0]}
            </div>
            <div>
              <p className="font-medium text-sm">{confession.nickname}</p>
              <p className="text-xs text-muted-foreground">
                {formatTimeAgo(confession.createdAt)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-xs font-medium px-2 py-1 rounded-full bg-secondary ${sentimentColors[confession.sentiment]}`}>
              {confession.sentiment}
            </span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="p-1.5 rounded-lg hover:bg-secondary transition-colors">
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setShowShareDialog(true)}>
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </DropdownMenuItem>
                {!adminMode && (
                  <DropdownMenuItem onClick={() => setShowReportDialog(true)}>
                    <Flag className="w-4 h-4 mr-2" />
                    Report
                  </DropdownMenuItem>
                )}
                {adminMode && confession.isFlagged && (
                  <DropdownMenuItem onClick={() => unflagConfession(confession.id)}>
                    Unflag
                  </DropdownMenuItem>
                )}
                {adminMode && (
                  <DropdownMenuItem onClick={() => deleteConfession(confession.id)} className="text-destructive">
                    Delete
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        
        {/* Category */}
        <div className="mb-3">
          <span className="text-xs font-medium px-3 py-1 rounded-full bg-primary/10 text-primary">
            {confession.category}
          </span>
        </div>
        
        {/* Content */}
        <p className="text-sm sm:text-base leading-relaxed mb-4 whitespace-pre-wrap">
          {confession.content}
        </p>
        
        {/* Poll */}
        {confession.poll && (
          <div className="mb-4 p-4 rounded-xl bg-secondary/50">
            <p className="font-medium text-sm mb-3">{confession.poll.question}</p>
            <div className="space-y-2">
              {confession.poll.options.map((option) => {
                const percentage = confession.poll!.totalVotes > 0
                  ? Math.round((option.votes / confession.poll!.totalVotes) * 100)
                  : 0;
                
                return (
                  <button
                    key={option.id}
                    onClick={() => handleVote(option.id)}
                    disabled={!!hasVoted}
                    className="w-full relative"
                  >
                    <div 
                      className="absolute inset-0 rounded-lg bg-primary/20 transition-all duration-300"
                      style={{ width: `${percentage}%` }}
                    />
                    <div className="relative flex items-center justify-between p-2.5 rounded-lg border border-border hover:border-primary/50 transition-colors">
                      <span className="text-sm">{option.text}</span>
                      <span className="text-xs font-medium">{percentage}%</span>
                    </div>
                  </button>
                );
              })}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {confession.poll.totalVotes} votes
            </p>
          </div>
        )}
        
        {/* Stats */}
        <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
          <span className="flex items-center gap-1">
            <Eye className="w-3.5 h-3.5" />
            {formatNumber(confession.views)} views
          </span>
          {confession.isPrivate && (
            <span className="px-2 py-0.5 rounded-full bg-secondary text-xs">
              Private
            </span>
          )}
          {confession.isFlagged && (
            <span className="px-2 py-0.5 rounded-full bg-destructive/20 text-destructive text-xs">
              Flagged
            </span>
          )}
        </div>
        
        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div className="flex items-center gap-2">
            <button
              onClick={handleLike}
              className={`reaction-btn ${isLiked ? 'active' : ''}`}
            >
              <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
              <span>{formatNumber(confession.likes)}</span>
            </button>
            <button
              onClick={() => setShowComments(!showComments)}
              className="reaction-btn"
            >
              <MessageCircle className="w-4 h-4" />
              <span>{confession.comments.filter(c => !c.isDeleted).length}</span>
            </button>
          </div>
          <div className="flex items-center gap-1">
            {REACTIONS.slice(0, 3).map((reaction) => (
              <button
                key={reaction}
                className="w-8 h-8 rounded-full hover:bg-secondary flex items-center justify-center text-lg transition-transform hover:scale-110"
              >
                {reaction}
              </button>
            ))}
          </div>
        </div>
        
        {/* Comments Section */}
        {showComments && (
          <div className="mt-4 pt-4 border-t border-border space-y-4">
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {confession.comments.filter(c => !c.isDeleted).length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No comments yet. Be the first to respond.
                </p>
              ) : (
                confession.comments.filter(c => !c.isDeleted).map((comment) => (
                  <CommentItem key={comment.id} comment={comment} />
                ))
              )}
            </div>
            <div className="flex gap-2">
              <Textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Write an anonymous response..."
                className="min-h-[60px] resize-none rounded-xl"
              />
              <Button 
                onClick={handleAddComment}
                disabled={!commentText.trim()}
                className="shrink-0 rounded-xl"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
      
      {/* Share Dialog */}
      <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Share Confession</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Copy this link to share the confession:
            </p>
            <div className="flex gap-2">
              <input
                type="text"
                readOnly
                value={confession.isPrivate 
                  ? `${window.location.origin}/confession/${confession.shareToken}`
                  : `${window.location.origin}/confession/${confession.id}`
                }
                className="flex-1 px-3 py-2 rounded-lg bg-secondary text-sm"
              />
              <Button onClick={handleShare}>Copy</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Report Dialog */}
      <Dialog open={showReportDialog} onOpenChange={setShowReportDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Report Confession</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Please tell us why you're reporting this content:
            </p>
            <Textarea
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
              placeholder="Enter your reason..."
              className="min-h-[100px]"
            />
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowReportDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleReport} disabled={!reportReason.trim()}>
                Report
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

function CommentItem({ comment }: { comment: Comment }) {
  return (
    <div className="flex gap-3">
      <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-sm shrink-0">
        👤
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-medium text-sm">{comment.nickname}</span>
          <span className="text-xs text-muted-foreground">
            {formatTimeAgo(comment.createdAt)}
          </span>
        </div>
        <p className="text-sm">{comment.content}</p>
      </div>
    </div>
  );
}
