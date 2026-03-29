import { useState } from 'react';
import type { ConfessionFormData } from '@/types';
import { CATEGORIES, MOODS, generateNickname } from '@/types';
import { useConfessionStore } from '@/store/confessionStore';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { X, Plus, Sparkles, Lock, Clock, BarChart3 } from 'lucide-react';
import { toast } from 'sonner';

interface PostFormProps {
  onClose: () => void;
}

const MAX_CHARS = 500;
const EXPIRY_OPTIONS = [
  { value: null, label: 'Never' },
  { value: 24, label: '24 hours' },
  { value: 48, label: '48 hours' },
  { value: 72, label: '72 hours' },
];

export function PostForm({ onClose }: PostFormProps) {
  const [formData, setFormData] = useState<ConfessionFormData>({
    content: '',
    nickname: '',
    category: 'Mental Health',
    mood: '😌 Peaceful',
    isPrivate: false,
    expiresIn: null,
    includePoll: false,
    pollQuestion: '',
    pollOptions: ['', ''],
  });
  
  const addConfession = useConfessionStore(state => state.addConfession);
  
  const charCount = formData.content.length;
  const charPercentage = (charCount / MAX_CHARS) * 100;
  
  const getCharCounterClass = () => {
    if (charPercentage < 70) return 'safe';
    if (charPercentage < 90) return 'warning';
    return 'danger';
  };
  
  const handleSubmit = () => {
    if (!formData.content.trim()) {
      toast.error('Please write something before posting');
      return;
    }
    
    if (charCount > MAX_CHARS) {
      toast.error(`Confession must be under ${MAX_CHARS} characters`);
      return;
    }
    
    addConfession({
      ...formData,
      nickname: formData.nickname || generateNickname(),
      pollOptions: formData.includePoll 
        ? (formData.pollOptions || []).filter(o => o.trim())
        : undefined,
    });
    
    toast.success('Your confession has been posted anonymously');
    onClose();
  };
  
  const addPollOption = () => {
    if ((formData.pollOptions || []).length < 4) {
      setFormData(prev => ({
        ...prev,
        pollOptions: [...(prev.pollOptions || []), '']
      }));
    }
  };
  
  const removePollOption = (index: number) => {
    setFormData(prev => ({
      ...prev,
      pollOptions: (prev.pollOptions || []).filter((_, i) => i !== index)
    }));
  };
  
  const updatePollOption = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      pollOptions: (prev.pollOptions || []).map((o, i) => i === index ? value : o)
    }));
  };

  return (
    <div className="glass-card p-6 sm:p-8 max-w-2xl w-full mx-auto max-h-[90vh] overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold mb-1">What's on your mind?</h2>
          <p className="text-sm text-muted-foreground">
            Write freely. No names attached.
          </p>
        </div>
        <button 
          onClick={onClose}
          className="p-2 rounded-xl hover:bg-secondary transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
      
      {/* Mood Selection */}
      <div className="mb-6">
        <label className="text-sm font-medium mb-3 block">How are you feeling?</label>
        <div className="flex flex-wrap gap-2">
          {MOODS.map((mood) => (
            <button
              key={mood}
              onClick={() => setFormData(prev => ({ ...prev, mood }))}
              className={`mood-btn ${formData.mood === mood ? 'selected' : ''}`}
              title={mood}
            >
              {mood.split(' ')[0]}
            </button>
          ))}
        </div>
        <p className="text-sm mt-2 text-muted-foreground">
          {formData.mood}
        </p>
      </div>
      
      {/* Content */}
      <div className="mb-6">
        <Textarea
          value={formData.content}
          onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
          placeholder="Share your thoughts, feelings, or secrets..."
          className="min-h-[150px] resize-none rounded-xl text-base"
        />
        <div className="flex justify-end mt-2">
          <span className={`char-counter ${getCharCounterClass()}`}>
            {charCount}/{MAX_CHARS}
          </span>
        </div>
      </div>
      
      {/* Category */}
      <div className="mb-6">
        <label className="text-sm font-medium mb-3 block">Category</label>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => setFormData(prev => ({ ...prev, category }))}
              className={`category-chip ${formData.category === category ? 'active' : ''}`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
      
      {/* Nickname */}
      <div className="mb-6">
        <label className="text-sm font-medium mb-2 block">Nickname (optional)</label>
        <div className="flex gap-2">
          <Input
            value={formData.nickname}
            onChange={(e) => setFormData(prev => ({ ...prev, nickname: e.target.value }))}
            placeholder="Leave blank for a random name"
            className="rounded-xl"
          />
          <Button
            variant="outline"
            onClick={() => setFormData(prev => ({ ...prev, nickname: generateNickname() }))}
            className="shrink-0 rounded-xl"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Random
          </Button>
        </div>
      </div>
      
      {/* Options */}
      <div className="space-y-4 mb-6">
        {/* Private Toggle */}
        <div className="flex items-center justify-between p-4 rounded-xl bg-secondary/50">
          <div className="flex items-center gap-3">
            <Lock className="w-5 h-5 text-muted-foreground" />
            <div>
              <p className="font-medium text-sm">Private Confession</p>
              <p className="text-xs text-muted-foreground">
                Only accessible via unique link
              </p>
            </div>
          </div>
          <Switch
            checked={formData.isPrivate}
            onCheckedChange={(checked) => 
              setFormData(prev => ({ ...prev, isPrivate: checked }))
            }
          />
        </div>
        
        {/* Expiry Selection */}
        <div className="flex items-center justify-between p-4 rounded-xl bg-secondary/50">
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-muted-foreground" />
            <div>
              <p className="font-medium text-sm">Auto-Expire</p>
              <p className="text-xs text-muted-foreground">
                Confession will disappear after
              </p>
            </div>
          </div>
          <select
            value={formData.expiresIn ?? ''}
            onChange={(e) => setFormData(prev => ({ 
              ...prev, 
              expiresIn: e.target.value ? Number(e.target.value) : null 
            }))}
            className="px-3 py-2 rounded-lg bg-background border border-border text-sm"
          >
            {EXPIRY_OPTIONS.map((opt) => (
              <option key={opt.label} value={opt.value ?? ''}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
        
        {/* Poll Toggle */}
        <div className="flex items-center justify-between p-4 rounded-xl bg-secondary/50">
          <div className="flex items-center gap-3">
            <BarChart3 className="w-5 h-5 text-muted-foreground" />
            <div>
              <p className="font-medium text-sm">Add a Poll</p>
              <p className="text-xs text-muted-foreground">
                Let others vote on something
              </p>
            </div>
          </div>
          <Switch
            checked={formData.includePoll}
            onCheckedChange={(checked) => 
              setFormData(prev => ({ ...prev, includePoll: checked }))
            }
          />
        </div>
      </div>
      
      {/* Poll Options */}
      {formData.includePoll && (
        <div className="mb-6 p-4 rounded-xl bg-secondary/30 space-y-3">
          <Input
            value={formData.pollQuestion}
            onChange={(e) => setFormData(prev => ({ ...prev, pollQuestion: e.target.value }))}
            placeholder="Ask a question..."
            className="rounded-xl"
          />
          {(formData.pollOptions || []).map((option, index) => (
            <div key={index} className="flex gap-2">
              <Input
                value={option}
                onChange={(e) => updatePollOption(index, e.target.value)}
                placeholder={`Option ${index + 1}`}
                className="rounded-xl"
              />
              {(formData.pollOptions || []).length > 2 && (
                <button
                  onClick={() => removePollOption(index)}
                  className="p-2 rounded-xl hover:bg-destructive/20 text-destructive transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
          {(formData.pollOptions || []).length < 4 && (
            <Button
              variant="outline"
              onClick={addPollOption}
              className="w-full rounded-xl"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Option
            </Button>
          )}
        </div>
      )}
      
      {/* Submit */}
      <Button 
        onClick={handleSubmit}
        disabled={!formData.content.trim() || charCount > MAX_CHARS}
        className="w-full rounded-full py-6 text-base font-semibold"
      >
        Post Anonymously
      </Button>
      
      {/* Comforting Message */}
      <p className="text-center text-sm text-muted-foreground mt-4">
        You're not alone. Someone out there understands.
      </p>
    </div>
  );
}
