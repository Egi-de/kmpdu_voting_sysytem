import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { CandidateCard } from '@/components/shared/CandidateCard';
import { mockPositions, mockBranches } from '@/data/mockData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Download, 
  Trophy, 
  Megaphone, 
  BarChart3, 
  PieChart,
  TrendingUp,
  Share2,
  AlertTriangle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { AnnounceWinnerDialog } from '@/components/admin/AnnounceWinnerDialog';

export default function AdminResults() {
  const [selectedPosition, setSelectedPosition] = useState(mockPositions[0]?.id);
  const [showAnnounceDialog, setShowAnnounceDialog] = useState(false);

  const positions = mockPositions;
  const currentPosition = positions.find(p => p.id === selectedPosition);
  const sortedCandidates = currentPosition?.candidates.slice().sort((a, b) => b.percentage - a.percentage) || [];
  const leader = sortedCandidates[0];

  return (
    <DashboardLayout title="Live Results & Analytics">
      {/* Controls Bar */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-success opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-success"></span>
            </span>
            <span className="text-sm font-medium text-success">Live</span>
          </div>
          <Select value={selectedPosition} onValueChange={setSelectedPosition}>
            <SelectTrigger className="w-[250px]">
              <SelectValue placeholder="Select position" />
            </SelectTrigger>
            <SelectContent>
              {positions.map(p => (
                <SelectItem key={p.id} value={p.id}>{p.title}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export PDF
          </Button>
          <Button variant="outline" className="gap-2">
            <Share2 className="h-4 w-4" />
            Share
          </Button>
          <Button className="gap-2" onClick={() => setShowAnnounceDialog(true)}>
            <Megaphone className="h-4 w-4" />
            Announce Winner
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        {/* Main Results */}
        <div className="lg:col-span-3 space-y-6">
          {/* Position Stats */}
          <div className="grid grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="text-sm text-muted-foreground">Total Votes</div>
                <div className="text-2xl font-bold">{currentPosition?.totalVotes.toLocaleString()}</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-sm text-muted-foreground">Turnout</div>
                <div className="text-2xl font-bold text-accent">
                  {((currentPosition?.totalVotes || 0) / (currentPosition?.eligibleVoters || 1) * 100).toFixed(1)}%
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-sm text-muted-foreground">Leading By</div>
                <div className="text-2xl font-bold text-success">
                  {(sortedCandidates[0]?.percentage - (sortedCandidates[1]?.percentage || 0)).toFixed(1)}%
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-sm text-muted-foreground">Candidates</div>
                <div className="text-2xl font-bold">{currentPosition?.candidates.length}</div>
              </CardContent>
            </Card>
          </div>

          {/* Results Visualization */}
          <Tabs defaultValue="bar" className="space-y-4">
            <div className="flex items-center justify-between">
              <TabsList>
                <TabsTrigger value="bar" className="gap-2">
                  <BarChart3 className="h-4 w-4" />
                  Bar Chart
                </TabsTrigger>
                <TabsTrigger value="cards" className="gap-2">
                  <PieChart className="h-4 w-4" />
                  Card View
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="bar">
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-6">
                    {sortedCandidates.map((candidate, index) => (
                      <div key={candidate.id} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className={cn(
                              'flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold',
                              index === 0 ? 'bg-accent text-accent-foreground' : 'bg-secondary'
                            )}>
                              {index + 1}
                            </span>
                            <div>
                              <span className="font-medium">{candidate.name}</span>
                              {index === 0 && (
                                <Badge className="ml-2 bg-accent text-accent-foreground">
                                  <Trophy className="h-3 w-3 mr-1" />
                                  Leading
                                </Badge>
                              )}
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="text-2xl font-bold">{candidate.percentage.toFixed(1)}%</span>
                            <span className="text-muted-foreground text-sm ml-2">
                              ({candidate.voteCount.toLocaleString()})
                            </span>
                          </div>
                        </div>
                        <Progress 
                          value={candidate.percentage} 
                          className="h-4"
                          indicatorClassName={cn(
                            'transition-all duration-1000 progress-animate',
                            index === 0 ? 'bg-accent' : 'bg-primary/70'
                          )}
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="cards" className="space-y-4">
              {sortedCandidates.map((candidate, index) => (
                <CandidateCard
                  key={candidate.id}
                  candidate={candidate}
                  isLeading={index === 0}
                  showAdminControls
                />
              ))}
            </TabsContent>
          </Tabs>

          {/* Branch Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-accent" />
                Branch-by-Branch Results
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockBranches.map((branch) => {
                  // Simulate different branch results
                  const branchLeader = sortedCandidates[Math.floor(Math.random() * 2)];
                  return (
                    <div key={branch.id} className="flex items-center gap-4 p-3 rounded-lg bg-muted/30">
                      <div className="w-40">
                        <p className="font-medium text-sm">{branch.name}</p>
                        <p className="text-xs text-muted-foreground">{branch.votedCount.toLocaleString()} votes</p>
                      </div>
                      <div className="flex-1">
                        <Progress value={branch.turnoutPercentage} className="h-2" indicatorClassName="bg-accent" />
                      </div>
                      <div className="w-32 text-right">
                        <p className="text-sm font-medium">{branchLeader?.name.split(' ').slice(-1)[0]}</p>
                        <p className="text-xs text-muted-foreground">Leading here</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Winner Preview */}
          <Card className="border-accent bg-accent/5">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Trophy className="h-4 w-4 text-accent" />
                Projected Winner
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-accent/20 text-xl font-bold text-accent">
                  {leader?.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
                <h3 className="font-semibold text-lg">{leader?.name}</h3>
                <p className="text-sm text-muted-foreground mb-3">{currentPosition?.title}</p>
                <div className="flex justify-center gap-4 text-sm">
                  <div>
                    <p className="font-bold text-accent">{leader?.percentage.toFixed(1)}%</p>
                    <p className="text-muted-foreground">Vote share</p>
                  </div>
                  <div>
                    <p className="font-bold">{leader?.voteCount.toLocaleString()}</p>
                    <p className="text-muted-foreground">Total votes</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Position List */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">All Positions</CardTitle>
            </CardHeader>
            <CardContent className="p-2">
              {positions.map((position) => {
                const posLeader = position.candidates.reduce((a, b) => 
                  a.percentage > b.percentage ? a : b
                );
                return (
                  <button
                    key={position.id}
                    onClick={() => setSelectedPosition(position.id)}
                    className={cn(
                      'w-full text-left p-3 rounded-lg transition-colors',
                      selectedPosition === position.id
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-muted'
                    )}
                  >
                    <p className="font-medium text-sm">{position.title}</p>
                    <p className={cn(
                      'text-xs mt-0.5',
                      selectedPosition === position.id ? 'text-primary-foreground/70' : 'text-muted-foreground'
                    )}>
                      {posLeader.name} • {posLeader.percentage.toFixed(1)}%
                    </p>
                  </button>
                );
              })}
            </CardContent>
          </Card>

          {/* Demo Mode Override */}
          <Card className="border-warning/50 bg-warning/5">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2 text-warning">
                <AlertTriangle className="h-4 w-4" />
                Demo Mode
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Override vote margins for demonstration purposes
              </p>
              <Select defaultValue="actual">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="actual">Actual Results</SelectItem>
                  <SelectItem value="close">Close Race (±2%)</SelectItem>
                  <SelectItem value="landslide">Landslide (60%+)</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-warning">
                Demo mode is for presentations only
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Announce Winner Dialog */}
      <AnnounceWinnerDialog
        open={showAnnounceDialog}
        onOpenChange={setShowAnnounceDialog}
      />
    </DashboardLayout>
  );
}
