import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { mockBranches } from '@/data/mockData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Building, Users, TrendingUp, Search, Download, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Branch } from '@/types/voting';
import { BranchDetailsDialog } from '@/components/admin/BranchDetailsDialog';

export default function AdminBranches() {
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);

  const branches = mockBranches;
  const totalVoters = branches.reduce((sum, b) => sum + b.totalMembers, 0);
  const totalVoted = branches.reduce((sum, b) => sum + b.votedCount, 0);
  const avgTurnout = (totalVoted / totalVoters) * 100;

  const handleViewDetails = (branch: Branch) => {
    setSelectedBranch(branch);
    setShowDetailsDialog(true);
  };

  return (
    <DashboardLayout title="Branch Management">
      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Building className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Branches</p>
                <p className="text-2xl font-bold">{branches.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
                <Users className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Members</p>
                <p className="text-2xl font-bold">{totalVoters.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10">
                <TrendingUp className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Average Turnout</p>
                <p className="text-2xl font-bold text-success">{avgTurnout.toFixed(1)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning/10">
                <Users className="h-5 w-5 text-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Yet to Vote</p>
                <p className="text-2xl font-bold">{(totalVoters - totalVoted).toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search branches..." className="pl-9" />
        </div>
        <Button variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Export Report
        </Button>
      </div>

      {/* Branches Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {branches.map((branch, index) => (
          <Card 
            key={branch.id} 
            className="hover:shadow-md transition-shadow stagger-enter"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-base">{branch.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {branch.totalMembers.toLocaleString()} members
                    </p>
                  </div>
                </div>
                <Badge className={cn(
                  branch.turnoutPercentage >= 75 ? 'bg-success/10 text-success border-success/20' :
                  branch.turnoutPercentage >= 50 ? 'bg-warning/10 text-warning border-warning/20' :
                  'bg-destructive/10 text-destructive border-destructive/20'
                )} variant="outline">
                  {branch.turnoutPercentage >= 75 ? 'High' :
                   branch.turnoutPercentage >= 50 ? 'Medium' : 'Low'} Turnout
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Voted</p>
                  <p className="font-semibold text-success">{branch.votedCount.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Remaining</p>
                  <p className="font-semibold text-warning">
                    {(branch.totalMembers - branch.votedCount).toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Turnout</span>
                  <span className="font-semibold">{branch.turnoutPercentage}%</span>
                </div>
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

              <Button 
                variant="outline" 
                size="sm" 
                className="w-full"
                onClick={() => handleViewDetails(branch)}
              >
                View Details
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Branch Details Dialog */}
      <BranchDetailsDialog
        branch={selectedBranch}
        open={showDetailsDialog}
        onOpenChange={setShowDetailsDialog}
      />
    </DashboardLayout>
  );
}
