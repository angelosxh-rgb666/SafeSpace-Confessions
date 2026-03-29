import { useState } from 'react';
import { useConfessionStore } from '@/store/confessionStore';
import { ConfessionCard } from '@/components/ConfessionCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart, Flag, Users, MessageSquare, Heart, Ban, CheckCircle, X } from 'lucide-react';
import { toast } from 'sonner';

export function AdminDashboard() {
  const [isOpen, setIsOpen] = useState(false);
  
  const stats = useConfessionStore(state => state.getStats());
  const flaggedConfessions = useConfessionStore(state => state.getFlaggedConfessions());
  const allConfessions = useConfessionStore(state => state.confessions);
  const bannedIps = useConfessionStore(state => state.bannedIps);
  const unbanIp = useConfessionStore(state => state.unbanIp);
  
  // Get peak hour
  const peakHour = Object.entries(stats.peakHours)
    .sort((a, b) => b[1] - a[1])[0];
  
  const formatHour = (hour: number) => {
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const h = hour % 12 || 12;
    return `${h} ${ampm}`;
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-primary text-white shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 flex items-center justify-center"
      >
        <BarChart className="w-6 h-6" />
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-xl overflow-auto">
      <div className="min-h-screen p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <BarChart className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Admin Dashboard</h2>
              <p className="text-sm text-muted-foreground">Monitor and moderate content</p>
            </div>
          </div>
          <Button
            variant="outline"
            onClick={() => setIsOpen(false)}
            className="rounded-full"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Confessions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-primary" />
                <span className="text-3xl font-bold">{stats.totalConfessions}</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Comments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                <span className="text-3xl font-bold">{stats.totalComments}</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Likes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-primary" />
                <span className="text-3xl font-bold">{stats.totalLikes}</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Flagged Content
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Flag className="w-5 h-5 text-destructive" />
                <span className="text-3xl font-bold text-destructive">{stats.flaggedContent}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Peak Activity */}
        {peakHour && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-lg">Peak Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-primary">
                {formatHour(Number(peakHour[0]))}
              </p>
              <p className="text-sm text-muted-foreground">
                Most active time with {peakHour[1]} posts
              </p>
            </CardContent>
          </Card>
        )}

        {/* Tabs */}
        <Tabs defaultValue="flagged" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="flagged" className="gap-2">
              <Flag className="w-4 h-4" />
              Flagged ({flaggedConfessions.length})
            </TabsTrigger>
            <TabsTrigger value="all" className="gap-2">
              <MessageSquare className="w-4 h-4" />
              All Confessions
            </TabsTrigger>
            <TabsTrigger value="banned" className="gap-2">
              <Ban className="w-4 h-4" />
              Banned IPs ({bannedIps.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="flagged" className="space-y-4">
            {flaggedConfessions.length === 0 ? (
              <div className="text-center py-12">
                <CheckCircle className="w-16 h-16 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold">No flagged content</h3>
                <p className="text-muted-foreground">Everything looks good!</p>
              </div>
            ) : (
              flaggedConfessions.map((confession) => (
                <div key={confession.id} className="relative">
                  <div className="absolute -top-2 -right-2 z-10 px-3 py-1 rounded-full bg-destructive text-white text-xs font-medium">
                    Flagged: {confession.flagReason}
                  </div>
                  <ConfessionCard confession={confession} />
                </div>
              ))
            )}
          </TabsContent>

          <TabsContent value="all" className="space-y-4">
            {allConfessions.filter(c => !c.isDeleted).length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No confessions yet</p>
              </div>
            ) : (
              allConfessions
                .filter(c => !c.isDeleted)
                .slice(0, 20)
                .map((confession) => (
                  <ConfessionCard key={confession.id} confession={confession} />
                ))
            )}
          </TabsContent>

          <TabsContent value="banned" className="space-y-4">
            {bannedIps.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No banned IPs</p>
              </div>
            ) : (
              <div className="space-y-2">
                {bannedIps.map((ip) => (
                  <div 
                    key={ip}
                    className="flex items-center justify-between p-4 rounded-xl bg-secondary"
                  >
                    <div className="flex items-center gap-3">
                      <Ban className="w-5 h-5 text-destructive" />
                      <span className="font-mono">{ip}</span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        unbanIp(ip);
                        toast.success('IP unbanned');
                      }}
                    >
                      Unban
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
