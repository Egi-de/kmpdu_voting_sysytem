import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useVoting } from '@/contexts/VotingContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
} from '@/components/ui/dialog';
import { 
  Check, 
  Shield, 
  Lock,
  AlertTriangle,
  Loader2,
  LogOut,
  User as UserIcon
} from 'lucide-react';
import { toast } from 'react-toastify';
import { Progress } from '@/components/ui/progress';

type VotingPhase = 'national' | 'branch' | 'completed';

export default function Ballot() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { 
    positions: allPositions, 
    hasUserVotedForPosition, 
    castVote 
  } = useVoting();
  
  const [phase, setPhase] = useState<VotingPhase>('national');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selections, setSelections] = useState<Record<string, string>>({});
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [processingSelection, setProcessingSelection] = useState(false);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Filter positions based on current phase
  const currentPositions = allPositions.filter(p => {
    if (phase === 'national') return p.type === 'national' && p.status === 'active';
    if (phase === 'branch') return p.type === 'branch' && p.status === 'active' && p.branch === user?.branch;
    return false;
  }).sort((a, b) => a.title.localeCompare(b.title));

  const currentPosition = currentPositions[currentIndex];
  
  // Reset pagination when position changes
  useEffect(() => {
    setCurrentPage(1);
  }, [currentIndex]);

  // Auto-redirect if no positions in this phase
  useEffect(() => {
    if (phase !== 'completed' && currentPositions.length === 0 && allPositions.length > 0) {
      if (phase === 'national') {
        handlePhaseCompletion();
      } else if (phase === 'branch') {
        setPhase('completed');
      }
    }
  }, [phase, currentPositions.length, allPositions.length]);

  // Auto-logout timer
  useEffect(() => {
    if (phase === 'completed') {
      const timer = setTimeout(() => {
        handleLogout();
      }, 5000); // 5 seconds auto-logout
      return () => clearTimeout(timer);
    }
  }, [phase]);

  const handleSelectCandidate = async (candidateId: string) => {
    if (processingSelection) return;
    setProcessingSelection(true);

    // Update selection
    setSelections(prev => ({
      ...prev,
      [currentPosition.id]: candidateId,
    }));

    // Visual feedback delay then auto-advance
    await new Promise(resolve => setTimeout(resolve, 600));

    if (currentIndex < currentPositions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setShowConfirmDialog(true);
    }
    setProcessingSelection(false);
  };

  const handleSubmitPhase = async () => {
    setIsSubmitting(true);
    
    try {
      // Submit votes for current phase
      for (const position of currentPositions) {
        const candidateId = selections[position.id];
        if (candidateId && !hasUserVotedForPosition(position.id)) {
          await castVote(position.id, candidateId);
        }
      }

      setShowConfirmDialog(false);
      
      toast.success(
        <div>
          <strong>Vote Confirmation</strong>
          <p className="text-sm mt-1">Your {phase} selections have been securely recorded. Confirmation sent to {user?.email}</p>
        </div>
      );

      handlePhaseCompletion();
      
    } catch (error) {
      toast.error('Failed to submit votes. Please try again.');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePhaseCompletion = () => {
    setSelections({});
    setCurrentIndex(0);

    if (phase === 'national') {
      if (user?.role === 'member') {
        setPhase('branch');
        toast.info(
            <div>
                <strong>Proceeding to Branch Elections</strong>
                <p className="text-sm mt-1">You will now vote for your branch positions.</p>
            </div>
        );
      } else {
        setPhase('completed');
      }
    } else {
      setPhase('completed');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    toast.info('Logged out successfully');
  };

  if (phase === 'completed') {
    return (
      <DashboardLayout title="Voting Complete">
        <div className="max-w-2xl mx-auto text-center py-12 animate-fade-in">
          <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-success/10 check-animate">
            <Check className="h-12 w-12 text-success" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-4">All Voting Activities Completed</h1>
          <p className="text-muted-foreground mb-8 text-lg">
            Thank you for participating in the KMPDU 2024 Elections. 
            Your votes have been permanently recorded.
          </p>
          
          <div className="flex justify-center">
              <Button onClick={handleLogout} size="lg" className="gap-2">
                  <LogOut className="h-4 w-4" />
                  Sign Out Securely
              </Button>
          </div>
          
          <p className="mt-8 text-sm text-muted-foreground">
             Use the button above to close your session.
          </p>
        </div>
      </DashboardLayout>
    );
  }

  if (!currentPosition) {
     return (
        <DashboardLayout title="Ballot">
            <div className="flex justify-center p-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        </DashboardLayout>
     )
  }

  // Pagination Logic
  const totalPages = Math.ceil(currentPosition.candidates.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentCandidates = currentPosition.candidates.slice(startIndex, endIndex);

  return (
    <DashboardLayout title={`${phase === 'national' ? 'National' : 'Branch'} Elections`}>
      <div className="max-w-5xl mx-auto">
        {/* Progress System */}
        <div className="mb-8">
           <div className="flex justify-between items-end mb-2">
               <div>
                   <h2 className="text-2xl font-bold">
                       {phase === 'national' ? 'National Positions' : `${user?.branch} Positions`}
                   </h2>
                   <p className="text-muted-foreground">
                       Position {currentIndex + 1} of {currentPositions.length}
                   </p>
               </div>
               <div className="text-right">
                   <div className="text-sm font-medium text-primary">
                       Step {currentIndex + 1}/{currentPositions.length}
                   </div>
               </div>
           </div>
           <div className="h-2 bg-secondary rounded-full overflow-hidden">
               <div 
                   className="h-full bg-primary transition-all duration-500 ease-out"
                   style={{ width: `${((currentIndex + 1) / currentPositions.length) * 100}%` }}
               />
           </div>
        </div>

        {/* Voting Card */}
        <Card className="border-0 shadow-md">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3 mb-2">
               <Badge variant={phase === 'national' ? 'default' : 'secondary'}>
                   {phase.toUpperCase()}
               </Badge>
               <span className="text-sm text-muted-foreground flex items-center gap-1">
                   <Shield className="h-3 w-3" />
                   Secure Ballot
               </span>
            </div>
            <CardTitle className="text-3xl">{currentPosition.title}</CardTitle>
            <CardDescription className="text-lg">
              Select your preferred candidate from the list below to proceed
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[300px]">Candidate</TableHead>
                    <TableHead>Bio</TableHead>
                    <TableHead className="text-right">Status</TableHead>
                    <TableHead className="w-[150px] text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentCandidates.map((candidate) => {
                    const isSelected = selections[currentPosition.id] === candidate.id;
                    return (
                      <TableRow key={candidate.id} className={isSelected ? "bg-primary/5" : ""}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-secondary text-sm font-bold text-muted-foreground">
                              {candidate.photo ? (
                                <img src={candidate.photo} alt={candidate.name} className="h-full w-full rounded-full object-cover" />
                              ) : (
                                <UserIcon className="h-5 w-5" />
                              )}
                            </div>
                            <div className="flex flex-col">
                              <span className="font-semibold">{candidate.name}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                           <p className="text-muted-foreground text-sm line-clamp-2">{candidate.bio}</p>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end">
                            <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
                              Active
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button 
                            variant={isSelected ? "default" : "outline"}
                            size="sm"
                            disabled={processingSelection}
                            onClick={() => handleSelectCandidate(candidate.id)}
                            className={isSelected ? "bg-green-600 hover:bg-green-700" : ""}
                          >
                            {isSelected ? (
                              <>
                                <Check className="mr-2 h-4 w-4" />
                                Selected
                              </>
                            ) : (
                              "Select"
                            )}
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="mt-4">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                    
                    {Array.from({ length: totalPages }).map((_, i) => (
                      <PaginationItem key={i + 1}>
                        <PaginationLink 
                          isActive={currentPage === i + 1}
                          onClick={() => setCurrentPage(i + 1)}
                          className="cursor-pointer"
                        >
                          {i + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}

                    <PaginationItem>
                      <PaginationNext 
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-warning" />
              Confirm {phase === 'national' ? 'National' : 'Branch'} Votes
            </DialogTitle>
            <DialogDescription>
              Please review your selections. 
              <span className="font-bold text-foreground block mt-1">
                  Once submitted, these votes cannot be changed.
              </span>
            </DialogDescription>
          </DialogHeader>
          
          <div className="max-h-[60vh] overflow-y-auto pr-2 space-y-3 py-4">
            {currentPositions.map(position => {
              const candidate = position.candidates.find(c => c.id === selections[position.id]);
              return (
                <div key={position.id} className="flex items-center justify-between py-3 border-b border-border/50 last:border-0">
                  <span className="text-sm font-medium text-muted-foreground w-1/2">{position.title}</span>
                  <span className="text-sm font-bold text-primary w-1/2 text-right">
                      {candidate?.name || 'Abstained'}
                  </span>
                </div>
              );
            })}
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="ghost" onClick={() => setShowConfirmDialog(false)} disabled={isSubmitting}>
              Back to Edit
            </Button>
            <Button onClick={handleSubmitPhase} className="gap-2 w-full sm:w-auto" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Recording...
                </>
              ) : (
                <>
                  <Lock className="h-4 w-4" />
                  Confirm & Submit
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}

