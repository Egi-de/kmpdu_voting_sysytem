import { useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StatCard } from '@/components/shared/StatCard';
import { PositionCard } from '@/components/shared/PositionCard';
import { CandidateCard } from '@/components/shared/CandidateCard';
import { NotificationItem } from '@/components/shared/NotificationItem';
import { useAuth } from '@/contexts/AuthContext';
import { useVoting } from '@/contexts/VotingContext';
import { mockElectionStats } from '@/data/mockData';
import { Users, Vote, TrendingUp, Building, ChevronRight, CheckCircle, Globe } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNavigate } from 'react-router-dom';

export default function MemberDashboard() {
  const { user } = useAuth();
  const { 
    positions: allPositions, 
    notifications, 
    userVotedPositions, 
    hasUserVotedForPosition,
    selectedLevel,
    setSelectedLevel,
  } = useVoting();
  const navigate = useNavigate();
  
  // Default to national level if not set
  useEffect(() => {
    if (!selectedLevel) {
      setSelectedLevel('national');
    }
  }, [selectedLevel, setSelectedLevel]);

  // Ensure selectedLevel matches state or defaults to national safe-guard
  const activeLevel = selectedLevel || 'national';
  
  const stats = mockElectionStats;
  
  // Filter positions based on selected level
  const positions = allPositions.filter(p => {
    if (p.status !== 'active') return false;
    if (activeLevel === 'national') {
      return p.type === 'national';
    } else {
      return p.type === 'branch' && p.branch === user?.branch;
    }
  });
  
  const votedCount = positions.filter(p => hasUserVotedForPosition(p.id)).length;
  const hasVotedAll = positions.length > 0 && positions.every(p => hasUserVotedForPosition(p.id));
  
  const levelLabel = activeLevel === 'national' ? 'National' : user?.branch;
  const LevelIcon = activeLevel === 'national' ? Globe : Building;

  return (
    <DashboardLayout title={`${activeLevel === 'national' ? 'National' : 'Branch'} Dashboard`}>
      {/* Welcome Header & View Switcher */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
            <LevelIcon className="h-4 w-4" />
            <span>{levelLabel} Elections</span>
            <Badge variant="outline" className="text-xs bg-primary/10 text-primary border-primary/20">
              {activeLevel === 'national' ? 'Nationwide' : 'Branch Level'}
            </Badge>
          </div>
          <h2 className="text-2xl font-bold text-foreground">
            Welcome back, {user?.name.split(' ')[0]}!
          </h2>
          <p className="text-muted-foreground mt-1">
            {activeLevel === 'national' 
              ? 'The 2024 KMPDU National Elections are underway.'
              : `Vote for ${user?.branch} branch leadership positions.`
            }
          </p>
        </div>

        {/* View Switcher */}
        <Tabs 
          value={activeLevel} 
          onValueChange={(val) => setSelectedLevel(val as 'national' | 'branch')}
          className="w-full md:w-auto"
        >
          <TabsList className="grid w-full grid-cols-2 md:w-[300px]">
            <TabsTrigger value="national" className="gap-2">
              <Globe className="h-4 w-4" />
              National
            </TabsTrigger>
            <TabsTrigger value="branch" className="gap-2">
              <Building className="h-4 w-4" />
              Branch
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatCard
          title="Total Votes Cast"
          value={stats.totalVotesCast.toLocaleString()}
          icon={Vote}
          variant="primary"
          subtitle={`of ${stats.totalVoters.toLocaleString()} eligible`}
        />
        <StatCard
          title="Turnout"
          value={`${stats.turnoutPercentage}%`}
          icon={TrendingUp}
          variant="accent"
          trend={{ value: 5.2, label: 'from yesterday', positive: true }}
        />
        <StatCard
          title="Active Branches"
          value={stats.activeBranches}
          icon={Building}
          variant="default"
        />
        <StatCard
          title="Open Positions"
          value={stats.activePositions}
          icon={Users}
          variant="success"
        />
      </div>

      {/* Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Positions to Vote */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-foreground">Positions</h3>
            <Button variant="ghost" size="sm" onClick={() => navigate('/member/ballot')}>
              Go to Ballot
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>

          {positions.length === 0 ? (
            <Card className="bg-muted/30 border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
                    <p>No active positions found for {levelLabel}.</p>
                    {activeLevel === 'branch' && <p className="text-sm mt-1">Check back later for branch elections.</p>}
                </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {positions.map((position) => (
                <PositionCard
                  key={position.id}
                  position={position}
                  onVote={() => navigate('/member/ballot')}
                />
              ))}
            </div>
          )}


        </div>

        {/* Notifications Sidebar */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-foreground">Notifications</h3>
            <Badge variant="secondary">{notifications.filter(n => !n.read).length} new</Badge>
          </div>
          <Card>
            <CardContent className="p-3 space-y-1">
              {notifications.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">No notifications</p>
              ) : (
                notifications.slice(0, 4).map((notification) => (
                    <NotificationItem key={notification.id} notification={notification} />
                ))
              )}
            </CardContent>
          </Card>

          {/* Your Branch Status */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Building className="h-4 w-4 text-accent" />
                Your Branch Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Branch</span>
                  <span className="font-medium">{user?.branch}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Member ID</span>
                  <span className="font-mono text-sm">{user?.memberId}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Branch Turnout</span>
                  <span className="font-medium text-accent">80%</span>
                </div>
                <div className="flex items-center justify-between">
                  {/* Status badge logic */}
                  <span className="text-sm text-muted-foreground">Your Status</span>
                  {hasVotedAll ? (
                    <Badge className="bg-success/10 text-success border-0">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      All Voted
                    </Badge>
                  ) : votedCount > 0 ? (
                    <Badge className="bg-warning/10 text-warning border-0">
                      {votedCount}/{positions.length} Voted
                    </Badge>
                  ) : (
                    <Badge className="bg-muted text-muted-foreground border-0">
                      Not Voted
                    </Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
