import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StatCard } from '@/components/shared/StatCard';
import { NotificationItem } from '@/components/shared/NotificationItem';
import { mockElectionStats, mockBranches, mockPositions, mockAdminNotifications } from '@/data/mockData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Users,
  Vote,
  TrendingUp,
  Building,
  Activity,
  AlertTriangle,
  Play,
  Pause,
  Download,
  ChevronRight,
  Shield,
  Clock,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { useVoting } from '@/contexts/VotingContext';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect } from 'react';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { selectedLevel, setSelectedLevel, positions: allPositions } = useVoting();
  const stats = mockElectionStats;

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

  return (
    <DashboardLayout title="Admin Dashboard">
      {/* Status Banner */}
      <div className="mb-6 rounded-xl gradient-hero p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-success opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-success"></span>
              </span>
              <span className="text-sm font-medium">Election Active</span>
            </div>
            <h2 className="text-2xl font-bold">KMPDU 2024 National Elections</h2>
            <p className="text-white/70 mt-1">Started Dec 1, 2024 • Ends Dec 5, 2024 at 6:00 PM</p>
          </div>
          <div className="flex gap-3">
            <Button variant="secondary" className="gap-2">
              <Pause className="h-4 w-4" />
              Pause Election
            </Button>
            <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20 gap-2">
              <Download className="h-4 w-4" />
              Export Data
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <StatCard
          title="Registered Voters"
          value={stats.totalVoters.toLocaleString()}
          icon={Users}
          variant="primary"
          trend={{ value: 2.3, label: 'new today', positive: true }}
        />
        <StatCard
          title="Votes Cast"
          value={stats.totalVotesCast.toLocaleString()}
          icon={Vote}
          variant="accent"
          subtitle={`${stats.turnoutPercentage}% turnout`}
        />
        <StatCard
          title="Inactive Voters"
          value={(stats.totalVoters - stats.totalVotesCast).toLocaleString()}
          icon={AlertTriangle}
          variant="warning"
          subtitle="Haven't voted yet"
        />
        <StatCard
          title="System Health"
          value="100%"
          icon={Activity}
          variant="success"
          subtitle="All nodes operational"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Branch Analytics - Only show in National view */}
          {activeLevel === 'national' && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Building className="h-4 w-4 text-accent" />
                  Branch-by-Branch Analytics
                </CardTitle>
                <Button variant="ghost" size="sm" onClick={() => navigate('/admin/branches')}>
                  View All
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockBranches.slice(0, 5).map((branch, index) => (
                    <div key={branch.id} className="flex items-center gap-4 stagger-enter" style={{ animationDelay: `${index * 50}ms` }}>
                      <div className="w-32 truncate text-sm font-medium">{branch.name.replace(' Branch', '')}</div>
                      <div className="flex-1">
                        <Progress 
                          value={branch.turnoutPercentage} 
                          className="h-2"
                          indicatorClassName={cn(
                            branch.turnoutPercentage >= 75 ? 'bg-success' :
                            branch.turnoutPercentage >= 50 ? 'bg-accent' :
                            'bg-warning'
                          )}
                        />
                      </div>
                      <div className="w-20 text-right">
                        <span className="font-semibold">{branch.turnoutPercentage}%</span>
                        <span className="text-xs text-muted-foreground ml-1">
                          ({branch.votedCount.toLocaleString()})
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Branch-specific info - Only show in Branch view */}
          {activeLevel === 'branch' && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Building className="h-4 w-4 text-accent" />
                  {user?.branch} Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Branch</span>
                    <span className="font-medium">{user?.branch}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Total Members</span>
                    <span className="font-semibold">4,520</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Votes Cast</span>
                    <span className="font-semibold">3,616</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Turnout</span>
                    <span className="font-semibold text-accent">80%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Positions Overview */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-base">Position Analytics</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => navigate('/admin/positions')}>
                Manage Positions
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </CardHeader>
            <CardContent>
              {positions.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No {activeLevel} positions found
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  {positions.map((position) => {
                    const turnout = (position.totalVotes / position.eligibleVoters) * 100;
                    const leader = position.candidates.reduce((a, b) => 
                      a.percentage > b.percentage ? a : b
                    );
                    return (
                      <div
                        key={position.id}
                        className="rounded-lg border p-4 hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() => navigate('/admin/results')}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-medium">{position.title}</h4>
                          <Badge variant="outline" className={cn(
                            'text-xs',
                            position.status === 'active' && 'bg-success/10 text-success border-success/20'
                          )}>
                            {position.status === 'active' && (
                              <span className="mr-1 h-1.5 w-1.5 rounded-full bg-success pulse-live inline-block" />
                            )}
                            {position.status}
                          </Badge>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Leading</span>
                            <span className="font-medium">{leader.name.split(' ').slice(-1)[0]} ({leader.percentage.toFixed(1)}%)</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Turnout</span>
                            <span className="font-medium">{turnout.toFixed(1)}%</span>
                          </div>
                          <Progress value={turnout} className="h-1.5" indicatorClassName="bg-accent" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-2">
              <Button variant="outline" className="justify-start" onClick={() => navigate('/admin/positions')}>
                <Play className="h-4 w-4 mr-2" />
                Start New Position
              </Button>
              <Button variant="outline" className="justify-start" onClick={() => navigate('/admin/candidates')}>
                <Users className="h-4 w-4 mr-2" />
                Add Candidate
              </Button>
              <Button variant="outline" className="justify-start" onClick={() => navigate('/admin/results')}>
                <TrendingUp className="h-4 w-4 mr-2" />
                View Live Results
              </Button>
              <Button variant="outline" className="justify-start" onClick={() => navigate('/admin/audit')}>
                <Shield className="h-4 w-4 mr-2" />
                Audit Trail
              </Button>
            </CardContent>
          </Card>

          {/* Admin Notifications */}
          <Card>
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
              <CardTitle className="text-base">System Alerts</CardTitle>
              <Badge variant="secondary">{mockAdminNotifications.filter(n => !n.read).length} new</Badge>
            </CardHeader>
            <CardContent className="p-2 space-y-1">
              {mockAdminNotifications.slice(0, 4).map((notification) => (
                <NotificationItem key={notification.id} notification={notification} />
              ))}
            </CardContent>
          </Card>

          {/* Blockchain Status */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Shield className="h-4 w-4 text-accent" />
                Blockchain Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Verification Status</span>
                <Badge className="bg-success/10 text-success border-0">Verified</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Last Block</span>
                <span className="text-sm font-mono">#4,521,892</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Sync Status</span>
                <span className="text-sm text-success">100%</span>
              </div>
              <Button variant="outline" size="sm" className="w-full mt-2">
                View Verification Panel
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
