import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StatCard } from '@/components/shared/StatCard';
import { PositionCard } from '@/components/shared/PositionCard';
import { CandidateCard } from '@/components/shared/CandidateCard';
import { NotificationItem } from '@/components/shared/NotificationItem';
import { LevelSelectionScreen } from '@/components/member/LevelSelectionScreen';
import { useAuth } from '@/contexts/AuthContext';
import { useVoting, VotingLevel } from '@/contexts/VotingContext';
import { mockElectionStats } from '@/data/mockData';
import { Users, Vote, TrendingUp, Building, MapPin, ChevronRight, Lock, CheckCircle, Globe } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
    hasSelectedLevel
  } = useVoting();
  const navigate = useNavigate();
  
  // Show level selection screen if no level selected
  if (!hasSelectedLevel) {
    return <LevelSelectionScreen onSelectLevel={setSelectedLevel} />;
  }
  
  const stats = mockElectionStats;
  
  // Filter positions based on selected level
  const positions = allPositions.filter(p => {
    if (p.status !== 'active') return false;
    if (selectedLevel === 'national') {
      return p.type === 'national';
    } else {
      return p.type === 'branch' && p.branch === user?.branch;
    }
  });
  
  const votedCount = positions.filter(p => hasUserVotedForPosition(p.id)).length;

  const hasVotedAll = positions.length > 0 && positions.every(p => hasUserVotedForPosition(p.id));
  
  const levelLabel = selectedLevel === 'national' ? 'National' : user?.branch;
  const LevelIcon = selectedLevel === 'national' ? Globe : Building;

  return (
    <DashboardLayout title={`${selectedLevel === 'national' ? 'National' : 'Branch'} Dashboard`}>
      {/* Welcome Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
          <LevelIcon className="h-4 w-4" />
          <span>{levelLabel} Elections</span>
          <Badge variant="outline" className="text-xs bg-primary/10 text-primary border-primary/20">
            {selectedLevel === 'national' ? 'Nationwide' : 'Branch Level'}
          </Badge>
        </div>
        <h2 className="text-2xl font-bold text-foreground">
          Welcome back, {user?.name.split(' ')[0]}!
        </h2>
        <p className="text-muted-foreground mt-1">
          {selectedLevel === 'national' 
            ? 'The 2024 KMPDU National Elections are underway. Cast your vote now.'
            : `Vote for ${user?.branch} branch leadership positions.`
          }
        </p>
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
          <div className="space-y-3">
            {positions.map((position) => (
              <PositionCard
                key={position.id}
                position={position}
                onVote={() => navigate('/member/ballot')}
              />
            ))}
          </div>

          {/* Leading Candidates Preview */}
          <Card className="mt-6">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Leading Candidates</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => navigate('/member/results')}>
                  View All Results
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {positions.slice(0, 2).map((position) => {
                const leader = position.candidates.reduce((a, b) => 
                  a.percentage > b.percentage ? a : b
                );
                return (
                  <CandidateCard
                    key={leader.id}
                    candidate={leader}
                    isLeading
                  />
                );
              })}
            </CardContent>
          </Card>
        </div>

        {/* Notifications Sidebar */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-foreground">Notifications</h3>
            <Badge variant="secondary">{notifications.filter(n => !n.read).length} new</Badge>
          </div>
          <Card>
            <CardContent className="p-3 space-y-1">
              {notifications.slice(0, 4).map((notification) => (
                <NotificationItem key={notification.id} notification={notification} />
              ))}
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
