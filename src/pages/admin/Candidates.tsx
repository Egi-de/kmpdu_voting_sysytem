import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { CandidateCard } from '@/components/shared/CandidateCard';
import { mockPositions } from '@/data/mockData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Search, Upload, Filter } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminCandidates() {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const positions = mockPositions;
  const allCandidates = positions.flatMap(p => 
    p.candidates.map(c => ({ ...c, positionTitle: p.title, positionId: p.id }))
  );

  const filteredCandidates = allCandidates.filter(c => {
    const matchesPosition = selectedPosition === 'all' || c.positionId === selectedPosition;
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesPosition && matchesSearch;
  });

  const handleAddCandidate = () => {
    setShowAddDialog(false);
    toast.success('Candidate added successfully');
  };

  return (
    <DashboardLayout title="Candidate Management">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold">Candidates</h2>
          <p className="text-sm text-muted-foreground">
            {allCandidates.length} candidates across {positions.length} positions
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Upload className="h-4 w-4" />
            Bulk Upload
          </Button>
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Add Candidate
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Add New Candidate</DialogTitle>
                <DialogDescription>
                  Enter the candidate's details below
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="position">Position</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select position" />
                    </SelectTrigger>
                    <SelectContent>
                      {positions.map(p => (
                        <SelectItem key={p.id} value={p.id}>{p.title}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" placeholder="Dr. John Doe" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bio">Biography</Label>
                  <Textarea 
                    id="bio" 
                    placeholder="Brief description of the candidate..."
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="photo">Photo</Label>
                  <div className="flex items-center gap-4">
                    <div className="h-20 w-20 rounded-lg bg-muted flex items-center justify-center">
                      <Upload className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <Button variant="outline" size="sm">Upload Photo</Button>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddCandidate}>Add Candidate</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search candidates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={selectedPosition} onValueChange={setSelectedPosition}>
          <SelectTrigger className="w-[200px]">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Filter by position" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Positions</SelectItem>
            {positions.map(p => (
              <SelectItem key={p.id} value={p.id}>{p.title}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Candidates by Position */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All ({allCandidates.length})</TabsTrigger>
          {positions.map(p => (
            <TabsTrigger key={p.id} value={p.id}>
              {p.title.split(' ').slice(-1)[0]} ({p.candidates.length})
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredCandidates.map((candidate, index) => (
              <div key={candidate.id} className="stagger-enter" style={{ animationDelay: `${index * 50}ms` }}>
                <CandidateCard
                  candidate={candidate}
                  showAdminControls
                  onEdit={() => toast.info('Edit candidate: ' + candidate.name)}
                  onDelete={() => toast.error('Delete candidate: ' + candidate.name)}
                />
              </div>
            ))}
          </div>
        </TabsContent>

        {positions.map(position => (
          <TabsContent key={position.id} value={position.id} className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">{position.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {position.candidates.map((candidate, index) => (
                    <div key={candidate.id} className="stagger-enter" style={{ animationDelay: `${index * 50}ms` }}>
                      <CandidateCard
                        candidate={candidate}
                        showAdminControls
                        onEdit={() => toast.info('Edit candidate: ' + candidate.name)}
                        onDelete={() => toast.error('Delete candidate: ' + candidate.name)}
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </DashboardLayout>
  );
}
