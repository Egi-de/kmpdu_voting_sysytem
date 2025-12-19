import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { CandidateCard } from '@/components/shared/CandidateCard';
import { useAuth } from '@/contexts/AuthContext';
import { useVoting } from '@/contexts/VotingContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
  LogOut
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'react-toastify';

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

  // Filter positions based on current phase
  const currentPositions = allPositions.filter(p => {
    if (phase === 'national') return p.type === 'national' && p.status === 'active';
    if (phase === 'branch') return p.type === 'branch' && p.status === 'active' && p.branch === user?.branch;
    return false;
  }).sort((a, b) => a.title.localeCompare(b.title)); // Ensure consistent order, preferably by priority if available

  const currentPosition = currentPositions[currentIndex];
  
  // Auto-redirect if no positions in this phase (e.g., no active elections)
  useEffect(() => {
    if (phase !== 'completed' && currentPositions.length === 0 && allPositions.length > 0) {
      // If we are in national and empty, try branch? Or just finish?
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
      
      // Send "Email" (Mock)
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
        // Interns or Admins might not vote in branch or strictly defined only 'member' does branch
        // Requirement: "if the user is a member (not an intern)... redirect to branch"
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

  // Filter positions based on current phase

  if (phase === 'completed') {
    // Auto logout or show summary then logout?
    // Requirement: "Once all voting activities are completed, the user is automatically logged out"
    // But instant logout might be jarring. Let's show a success screen for 3 seconds then logout.
    
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

  // If no positions found for the phase (and not handled by effect yet)
  if (!currentPosition) {
     return (
        <DashboardLayout title="Ballot">
            <div className="flex justify-center p-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        </DashboardLayout>
     )
  }

  return (
    <DashboardLayout title={`${phase === 'national' ? 'National' : 'Branch'} Elections`}>
      <div className="max-w-4xl mx-auto">
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
              Select your preferred candidate to proceed
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
              {currentPosition.candidates.map((candidate) => (
                <div key={candidate.id} className="relative group">
                     {/* Overlay for selection effect */}
                     <CandidateCard
                        candidate={candidate}
                        selectable={!processingSelection}
                        isSelected={selections[currentPosition.id] === candidate.id}
                        onSelect={() => handleSelectCandidate(candidate.id)}
                     />
                     {processingSelection && selections[currentPosition.id] === candidate.id && (
                         <div className="absolute inset-0 bg-primary/20 flex items-center justify-center rounded-xl backdrop-blur-[1px] transition-all">
                             <Loader2 className="h-8 w-8 text-primary animate-spin" />
                         </div>
                     )}
                </div>
              ))}
            </div>
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
