import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { mockPositions, mockBranches } from '@/data/mockData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { 
  Download, 
  Trophy, 
  Megaphone, 
  TrendingUp,
  Share2,
  AlertTriangle,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { AnnounceWinnerDialog } from '@/components/admin/AnnounceWinnerDialog';
import { useVoting } from '@/contexts/VotingContext';
import { useAuth } from '@/contexts/AuthContext';

export default function AdminResults() {
  const [showAnnounceDialog, setShowAnnounceDialog] = useState(false);
  const { user } = useAuth();
  const { selectedLevel, setSelectedLevel, positions: allPositions } = useVoting();

  // Default to national level if not set
  useEffect(() => {
    if (!selectedLevel) {
      setSelectedLevel('national');
    }
  }, [selectedLevel, setSelectedLevel]);

  // Filter positions based on selected level
  const activeLevel = selectedLevel || 'national';
  const positions = allPositions.filter(p => {
    if (activeLevel === 'national') {
      return p.type === 'national';
    } else {
      return p.type === 'branch' && p.branch === user?.branch;
    }
  });

  const [expandedPositions, setExpandedPositions] = useState<string[]>([positions[0]?.id]);
  
  // Calculate overall stats
  const totalVotesAllPositions = positions.reduce((sum, p) => sum + p.totalVotes, 0);
  const totalEligibleVoters = positions.reduce((sum, p) => sum + p.eligibleVoters, 0);
  const overallTurnout = (totalVotesAllPositions / totalEligibleVoters * 100).toFixed(1);

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
          <div className="text-sm text-muted-foreground">
            {positions.length} Positions • {totalVotesAllPositions.toLocaleString()} Total Votes
          </div>
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
          {/* Overall Stats */}
          <div className="grid grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="text-sm text-muted-foreground">Total Votes Cast</div>
                <div className="text-2xl font-bold">{totalVotesAllPositions.toLocaleString()}</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-sm text-muted-foreground">Overall Turnout</div>
                <div className="text-2xl font-bold text-accent">{overallTurnout}%</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-sm text-muted-foreground">Active Positions</div>
                <div className="text-2xl font-bold">{positions.length}</div>
              </CardContent>
            </Card>
          </div>

          {/* Position Results Accordion */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Results by Position</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Accordion 
                type="multiple" 
                value={expandedPositions} 
                onValueChange={setExpandedPositions}
                className="w-full"
              >
                {positions.map((position) => {
                  const sortedCandidates = position.candidates.slice().sort((a, b) => b.percentage - a.percentage);
                  const leader = sortedCandidates[0];
                  const turnout = ((position.totalVotes / position.eligibleVoters) * 100).toFixed(1);
                  
                  return (
                    <AccordionItem key={position.id} value={position.id} className="border-b last:border-0">
                      <AccordionTrigger className="px-6 hover:bg-muted/50 hover:no-underline">
                        <div className="flex items-center justify-between w-full pr-4">
                          <div className="flex items-center gap-4">
                            <div>
                              <h3 className="font-semibold text-base text-left">{position.title}</h3>
                              <p className="text-sm text-muted-foreground text-left">
                                {position.totalVotes.toLocaleString()} votes • {turnout}% turnout
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="text-right">
                              <p className="text-sm font-medium">{leader.name}</p>
                              <p className="text-xs text-muted-foreground">Leading with {leader.percentage.toFixed(1)}%</p>
                            </div>
                            <Badge className="bg-accent text-accent-foreground">
                              <Trophy className="h-3 w-3 mr-1" />
                              {leader.voteCount.toLocaleString()}
                            </Badge>
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-6 pb-6">
                        <div className="space-y-4 mt-2">
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
                                  'transition-all duration-1000',
                                  index === 0 ? 'bg-accent' : 'bg-primary/70'
                                )}
                              />
                            </div>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  );
                })}
              </Accordion>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Top Leaders */}
          <Card className="border-accent bg-accent/5">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Trophy className="h-4 w-4 text-accent" />
                Leading Candidates
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {positions.slice(0, 3).map((position) => {
                const leader = position.candidates.reduce((a, b) => 
                  a.percentage > b.percentage ? a : b
                );
                return (
                  <div key={position.id} className="p-3 rounded-lg bg-background border">
                    <p className="text-xs text-muted-foreground mb-1">{position.title}</p>
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-sm">{leader.name}</p>
                      <Badge variant="secondary" className="text-xs">
                        {leader.percentage.toFixed(1)}%
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Positions</span>
                <span className="font-semibold">{positions.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Total Candidates</span>
                <span className="font-semibold">
                  {positions.reduce((sum, p) => sum + p.candidates.length, 0)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Eligible Voters</span>
                <span className="font-semibold">{totalEligibleVoters.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Votes Cast</span>
                <span className="font-semibold">{totalVotesAllPositions.toLocaleString()}</span>
              </div>
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
