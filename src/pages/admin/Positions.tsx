import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { mockPositions } from '@/data/mockData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Plus,
  Settings,
  Upload,
  Play,
  Pause,
  Users,
  Clock,
  MoreHorizontal,
  Edit2,
  Trash2,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export default function AdminPositions() {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const positions = mockPositions;

  const handleCreatePosition = () => {
    setShowCreateDialog(false);
    toast.success('Position created successfully');
  };

  return (
    <DashboardLayout title="Position Management">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold">Election Positions</h2>
          <p className="text-sm text-muted-foreground">Manage positions and candidates for the election</p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Create Position
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Position</DialogTitle>
              <DialogDescription>
                Add a new position for the election
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Position Title</Label>
                <Input id="title" placeholder="e.g., Secretary General" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Position Type</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="national">National</SelectItem>
                    <SelectItem value="branch">Branch</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="start">Start Date & Time</Label>
                  <Input id="start" type="datetime-local" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="end">End Date & Time</Label>
                  <Input id="end" type="datetime-local" />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreatePosition}>Create Position</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {positions.map((position) => {
          const turnout = (position.totalVotes / position.eligibleVoters) * 100;
          const leader = position.candidates.reduce((a, b) => 
            a.percentage > b.percentage ? a : b
          );

          return (
            <Card key={position.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold">{position.title}</h3>
                      <Badge variant="outline" className={cn(
                        position.type === 'national'
                          ? 'bg-primary/10 text-primary border-primary/20'
                          : 'bg-accent/10 text-accent border-accent/20'
                      )}>
                        {position.type === 'national' ? 'National' : 'Branch'}
                      </Badge>
                      <Badge variant="outline" className={cn(
                        position.status === 'active' && 'bg-success/10 text-success border-success/20',
                        position.status === 'upcoming' && 'bg-info/10 text-info border-info/20',
                        position.status === 'closed' && 'bg-muted text-muted-foreground'
                      )}>
                        {position.status === 'active' && (
                          <span className="mr-1 h-1.5 w-1.5 rounded-full bg-success pulse-live inline-block" />
                        )}
                        {position.status.charAt(0).toUpperCase() + position.status.slice(1)}
                      </Badge>
                    </div>
                    
                    {position.branch && (
                      <p className="text-sm text-muted-foreground mb-3">{position.branch}</p>
                    )}

                    <div className="grid grid-cols-4 gap-6 mt-4">
                      <div>
                        <div className="flex items-center gap-1 text-muted-foreground mb-1">
                          <Users className="h-4 w-4" />
                          <span className="text-xs">Candidates</span>
                        </div>
                        <p className="font-semibold">{position.candidates.length}</p>
                      </div>
                      <div>
                        <div className="flex items-center gap-1 text-muted-foreground mb-1">
                          <Users className="h-4 w-4" />
                          <span className="text-xs">Eligible Voters</span>
                        </div>
                        <p className="font-semibold">{position.eligibleVoters.toLocaleString()}</p>
                      </div>
                      <div>
                        <div className="flex items-center gap-1 text-muted-foreground mb-1">
                          <Clock className="h-4 w-4" />
                          <span className="text-xs">Votes Cast</span>
                        </div>
                        <p className="font-semibold">{position.totalVotes.toLocaleString()}</p>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground mb-1">Leading</div>
                        <p className="font-semibold">{leader.name.split(' ').slice(-1)[0]} ({leader.percentage.toFixed(1)}%)</p>
                      </div>
                    </div>

                    <div className="mt-4 space-y-1.5">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Turnout</span>
                        <span className="font-medium">{turnout.toFixed(1)}%</span>
                      </div>
                      <Progress value={turnout} className="h-2" indicatorClassName="bg-accent" />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 ml-6">
                    {position.status === 'active' ? (
                      <Button variant="outline" size="sm" className="gap-1">
                        <Pause className="h-4 w-4" />
                        Pause
                      </Button>
                    ) : position.status === 'upcoming' ? (
                      <Button variant="outline" size="sm" className="gap-1">
                        <Play className="h-4 w-4" />
                        Start
                      </Button>
                    ) : null}
                    
                    <Button variant="outline" size="sm" className="gap-1">
                      <Upload className="h-4 w-4" />
                      Candidates
                    </Button>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Edit2 className="h-4 w-4 mr-2" />
                          Edit Position
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Settings className="h-4 w-4 mr-2" />
                          Settings
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete Position
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </DashboardLayout>
  );
}
