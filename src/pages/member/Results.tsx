import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { CandidateCard } from '@/components/shared/CandidateCard';
import { useAuth } from '@/contexts/AuthContext';
import { useVoting } from '@/contexts/VotingContext';
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
  BarChart3, 
  PieChart, 
  Building, 
  Trophy,
  TrendingUp,
  Users,
  RefreshCw,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { mockBranches } from '@/data/mockData';

export default function Results() {
  const { user } = useAuth();
  const { positions: allPositions, refreshResults } = useVoting();
  const [selectedPosition, setSelectedPosition] = useState<string>('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // Filter positions visible to this user
  const positions = allPositions.filter(
    p => p.type === 'national' || p.branch === user?.branch
  );

  useEffect(() => {
    if (positions.length > 0 && !selectedPosition) {
      setSelectedPosition(positions[0].id);
    }
  }, [positions, selectedPosition]);

  // Real-time updates simulation
  useEffect(() => {
    const interval = setInterval(() => {
      refreshResults();
      setLastUpdated(new Date());
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, [refreshResults]);

  const handleManualRefresh = () => {
    setIsRefreshing(true);
    refreshResults();
    setLastUpdated(new Date());
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const currentPosition = positions.find(p => p.id === selectedPosition);
  const sortedCandidates = currentPosition?.candidates.slice().sort((a, b) => b.percentage - a.percentage) || [];
  const leader = sortedCandidates[0];

  const turnoutPercentage = currentPosition 
    ? ((currentPosition.totalVotes / currentPosition.eligibleVoters) * 100).toFixed(1)
    : '0';

  return (
    <DashboardLayout title="Live Results">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-success opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-success"></span>
            </span>
            <span className="text-sm font-medium text-success">Live Results</span>
          </div>
          <span className="text-xs text-muted-foreground">
            Updated: {lastUpdated.toLocaleTimeString()}
          </span>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleManualRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw className={cn("h-4 w-4", isRefreshing && "animate-spin")} />
          </Button>
        </div>
        <Select value={selectedPosition} onValueChange={setSelectedPosition}>
          <SelectTrigger className="w-[250px]">
            <SelectValue placeholder="Select position" />
          </SelectTrigger>
          <SelectContent>
            {positions.map(p => (
              <SelectItem key={p.id} value={p.id}>
                <div className="flex items-center gap-2">
                  {p.title}
                  <Badge variant="outline" className="text-xs">
                    {p.type === 'national' ? 'National' : 'Branch'}
                  </Badge>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        {/* Main Results */}
        <div className="lg:col-span-3 space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <Users className="h-4 w-4" />
                  <span className="text-xs">Total Votes</span>
                </div>
                <p className="text-2xl font-bold">{currentPosition?.totalVotes.toLocaleString()}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <TrendingUp className="h-4 w-4" />
                  <span className="text-xs">Turnout</span>
                </div>
                <p className="text-2xl font-bold text-accent">{turnoutPercentage}%</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <Trophy className="h-4 w-4" />
                  <span className="text-xs">Lead Margin</span>
                </div>
                <p className="text-2xl font-bold text-success">
                  {(sortedCandidates[0]?.percentage - (sortedCandidates[1]?.percentage || 0)).toFixed(1)}%
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <Users className="h-4 w-4" />
                  <span className="text-xs">Candidates</span>
                </div>
                <p className="text-2xl font-bold">{currentPosition?.candidates.length}</p>
              </CardContent>
            </Card>
          </div>

          {/* Results Visualization */}
          <Tabs defaultValue="chart" className="space-y-4">
            <TabsList>
              <TabsTrigger value="chart" className="gap-2">
                <BarChart3 className="h-4 w-4" />
                Chart View
              </TabsTrigger>
              <TabsTrigger value="cards" className="gap-2">
                <PieChart className="h-4 w-4" />
                Card View
              </TabsTrigger>
            </TabsList>

            <TabsContent value="chart">
              <Card>
                <CardContent className="p-6 space-y-6">
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
                            ({candidate.voteCount.toLocaleString()} votes)
                          </span>
                        </div>
                      </div>
                      <Progress 
                        value={candidate.percentage} 
                        className="h-4"
                        indicatorClassName={cn(
                          index === 0 ? 'bg-accent' : 'bg-primary/70'
                        )}
                      />
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="cards" className="space-y-4">
              {sortedCandidates.map((candidate, index) => (
                <CandidateCard
                  key={candidate.id}
                  candidate={candidate}
                  isLeading={index === 0}
                />
              ))}
            </TabsContent>
          </Tabs>

          {/* Branch Turnout */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Building className="h-4 w-4 text-accent" />
                Branch Turnout
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {mockBranches.map((branch) => (
                <div key={branch.id} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{branch.name}</span>
                    <span className="text-muted-foreground">
                      {branch.votedCount.toLocaleString()} / {branch.totalMembers.toLocaleString()} ({branch.turnoutPercentage}%)
                    </span>
                  </div>
                  <Progress 
                    value={branch.turnoutPercentage} 
                    className="h-2"
                    indicatorClassName="bg-accent"
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - Position List */}
        <div className="space-y-6">
          {/* Leading Candidate */}
          {leader && (
            <Card className="border-accent bg-accent/5">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Trophy className="h-4 w-4 text-accent" />
                  Currently Leading
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-accent/20 text-xl font-bold text-accent">
                  {leader.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
                <h3 className="font-semibold">{leader.name}</h3>
                <p className="text-sm text-muted-foreground mb-3">{currentPosition?.title}</p>
                <div className="flex justify-center gap-4 text-sm">
                  <div>
                    <p className="font-bold text-accent">{leader.percentage.toFixed(1)}%</p>
                    <p className="text-xs text-muted-foreground">Vote share</p>
                  </div>
                  <div>
                    <p className="font-bold">{leader.voteCount.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">Total votes</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* All Positions */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">All Positions</CardTitle>
            </CardHeader>
            <CardContent className="p-2">
              {positions.map((position) => {
                const posLeader = position.candidates.reduce((a, b) => 
                  a.percentage > b.percentage ? a : b
                );
                const isSelected = selectedPosition === position.id;
                return (
                  <button
                    key={position.id}
                    onClick={() => setSelectedPosition(position.id)}
                    className={cn(
                      'w-full text-left p-3 rounded-lg transition-colors',
                      isSelected ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-sm flex-1">{position.title}</p>
                      <Badge variant="outline" className={cn(
                        "text-xs",
                        isSelected && "border-primary-foreground/30 text-primary-foreground"
                      )}>
                        {position.type === 'national' ? 'N' : 'B'}
                      </Badge>
                    </div>
                    <p className={cn(
                      'text-xs mt-0.5',
                      isSelected ? 'text-primary-foreground/70' : 'text-muted-foreground'
                    )}>
                      {posLeader.name} • {posLeader.percentage.toFixed(1)}%
                    </p>
                  </button>
                );
              })}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
