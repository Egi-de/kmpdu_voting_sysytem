import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { mockPositions } from '@/data/mockData';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Search, Upload, Filter, MoreHorizontal, Edit2, Trash2, Trophy, Check } from 'lucide-react';
import { toast } from 'sonner';

const ITEMS_PER_PAGE = 10;

export default function AdminCandidates() {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCandidates, setSelectedCandidates] = useState<string[]>([]);
  
  // State for Candidates Management
  const [candidates, setCandidates] = useState(() => 
    mockPositions.flatMap(p => 
      p.candidates.map(c => ({ ...c, positionTitle: p.title, positionId: p.id }))
    )
  );

  // Edit State
  const [editingCandidate, setEditingCandidate] = useState<any>(null);
  const [formData, setFormData] = useState({ name: '', bio: '', position: '' });

  // Delete State
  const [candidateToDelete, setCandidateToDelete] = useState<string | null>(null);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [isBulkDelete, setIsBulkDelete] = useState(false);

  const positions = mockPositions;

  // Derived filtered list
  const filteredCandidates = candidates.filter(c => {
    const matchesPosition = selectedPosition === 'all' || c.positionId === selectedPosition;
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesPosition && matchesSearch;
  });

  // Reset page and selection when filters change
  useEffect(() => {
    setCurrentPage(1);
    setSelectedCandidates([]);
  }, [selectedPosition, searchQuery]);

  // Pagination logic
  const totalPages = Math.ceil(filteredCandidates.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedCandidates = filteredCandidates.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // Handlers
  const handleAddCandidate = () => {
    if (editingCandidate) {
      // Update logic
      setCandidates(prev => prev.map(c => 
        c.id === editingCandidate.id 
          ? { ...c, name: formData.name, bio: formData.bio, positionId: formData.position }
          : c
      ));
      toast.success('Candidate updated successfully');
    } else {
      // Add logic (mock)
      const newCandidate = {
        id: Math.random().toString(36).substr(2, 9),
        name: formData.name,
        bio: formData.bio,
        position: formData.position,
        positionId: formData.position,
        positionTitle: mockPositions.find(p => p.id === formData.position)?.title || 'Unknown',
        photo: '',
        voteCount: 0,
        percentage: 0
      };
      setCandidates([newCandidate, ...candidates]);
      toast.success('Candidate added successfully');
    }
    closeDialog();
  };

  const openAddDialog = () => {
    setEditingCandidate(null);
    setFormData({ name: '', bio: '', position: '' });
    setShowAddDialog(true);
  };

  const openEditDialog = (candidate: any) => {
    setEditingCandidate(candidate);
    setFormData({
      name: candidate.name,
      bio: candidate.bio,
      position: candidate.positionId
    });
    setShowAddDialog(true);
  };

  const closeDialog = () => {
    setShowAddDialog(false);
    setEditingCandidate(null);
    setFormData({ name: '', bio: '', position: '' });
  };

  const confirmDelete = () => {
    if (isBulkDelete) {
      setCandidates(prev => prev.filter(c => !selectedCandidates.includes(c.id)));
      toast.success(`Deleted ${selectedCandidates.length} candidates successfully`);
      setSelectedCandidates([]);
    } else if (candidateToDelete) {
      setCandidates(prev => prev.filter(c => c.id !== candidateToDelete));
      toast.success('Candidate deleted successfully');
    }
    setShowDeleteAlert(false);
    setCandidateToDelete(null);
    setIsBulkDelete(false);
  };

  const initiateDelete = (id: string) => {
    setCandidateToDelete(id);
    setIsBulkDelete(false);
    setShowDeleteAlert(true);
  };

  const initiateBulkDelete = () => {
    setIsBulkDelete(true);
    setShowDeleteAlert(true);
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  };

  // Selection Logic
  const toggleSelectAll = () => {
    if (selectedCandidates.length === paginatedCandidates.length) {
      setSelectedCandidates([]);
    } else {
      setSelectedCandidates(paginatedCandidates.map(c => c.id));
    }
  };

  const toggleSelectCandidate = (candidateId: string) => {
    setSelectedCandidates(prev => 
      prev.includes(candidateId)
        ? prev.filter(id => id !== candidateId)
        : [...prev, candidateId]
    );
  };



  return (
    <DashboardLayout title="Candidate Management">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold">Candidates</h2>
          <p className="text-sm text-muted-foreground">
            {candidates.length} candidates across {mockPositions.length} positions
          </p>
        </div>
        <div className="flex gap-2">
          {selectedCandidates.length > 0 && (
            <Button 
              variant="destructive" 
              className="gap-2 animate-in fade-in slide-in-from-right-5"
              onClick={initiateBulkDelete}
            >
              <Trash2 className="h-4 w-4" />
              Delete Selected ({selectedCandidates.length})
            </Button>
          )}
          <Button variant="outline" className="gap-2">
            <Upload className="h-4 w-4" />
            Bulk Upload
          </Button>
          <Dialog open={showAddDialog} onOpenChange={(open) => !open && closeDialog()}>
            <DialogTrigger asChild>
              <Button className="gap-2" onClick={openAddDialog}>
                <Plus className="h-4 w-4" />
                Add Candidate
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>{editingCandidate ? 'Edit Candidate' : 'Add New Candidate'}</DialogTitle>
                <DialogDescription>
                  {editingCandidate ? 'Update the candidate details below' : "Enter the candidate's details below"}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="position">Position</Label>
                  <Select 
                    value={formData.position} 
                    onValueChange={(val) => setFormData({...formData, position: val})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select position" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockPositions.map(p => (
                        <SelectItem key={p.id} value={p.id}>{p.title}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input 
                    id="name" 
                    placeholder="Dr. John Doe"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bio">Biography</Label>
                  <Textarea 
                    id="bio" 
                    placeholder="Brief description of the candidate..."
                    rows={3}
                    value={formData.bio}
                    onChange={(e) => setFormData({...formData, bio: e.target.value})}
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
                <Button variant="outline" onClick={closeDialog}>
                  Cancel
                </Button>
                <Button onClick={handleAddCandidate}>
                  {editingCandidate ? 'Update Candidate' : 'Add Candidate'}
                </Button>
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

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">
                  <Checkbox 
                    checked={paginatedCandidates.length > 0 && selectedCandidates.length === paginatedCandidates.length}
                    onCheckedChange={toggleSelectAll}
                    aria-label="Select all"
                  />
                </TableHead>
                <TableHead className="w-[40%]">Candidate</TableHead>
                <TableHead className="w-[20%]">Position</TableHead>
                <TableHead className="w-[15%]">Votes</TableHead>
                <TableHead className="w-[15%]">Status</TableHead>
                <TableHead className="w-[10%] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedCandidates.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    No candidates found.
                  </TableCell>
                </TableRow>
              ) : (
                paginatedCandidates.map((candidate) => (
                  <TableRow key={candidate.id} className={selectedCandidates.includes(candidate.id) ? "bg-muted/50" : ""}>
                     <TableCell>
                      <Checkbox 
                        checked={selectedCandidates.includes(candidate.id)}
                        onCheckedChange={() => toggleSelectCandidate(candidate.id)}
                        aria-label={`Select ${candidate.name}`}
                      />
                    </TableCell>
                    <TableCell className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={candidate.photo} alt={candidate.name} />
                        <AvatarFallback>{getInitials(candidate.name)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{candidate.name}</div>
                        <div className="text-xs text-muted-foreground line-clamp-1 max-w-[200px]">
                          {candidate.bio}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{candidate.positionTitle}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium">{candidate.voteCount.toLocaleString()}</span>
                        <span className="text-xs text-muted-foreground">{candidate.percentage}%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {candidate.voteCount > 3000 ? ( // Logic just for demo
                        <Badge variant="default" className="bg-green-100 text-green-700 hover:bg-green-200 border-green-200">
                           Leading
                        </Badge>
                      ) : (
                         <Badge variant="outline">contenting</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => openEditDialog(candidate)}
                        >
                          <Edit2 className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => initiateDelete(candidate.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-4">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                />
              </PaginationItem>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <PaginationItem key={page}>
                  <PaginationLink
                    isActive={currentPage === page}
                    onClick={() => setCurrentPage(page)}
                    className="cursor-pointer"
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the 
              {isBulkDelete ? ` ${selectedCandidates.length} selected candidates` : " candidate"} 
              and remove them from the database.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
}
