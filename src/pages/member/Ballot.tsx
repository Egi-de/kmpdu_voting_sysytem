import { useState, useEffect } from 'react';
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
  ChevronLeft, 
  ChevronRight, 
  Check, 
  Shield, 
  Copy, 
  CheckCircle, 
  Lock,
  AlertTriangle,
  Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { VoteReceipt } from '@/types/voting';

type BallotStep = 'select' | 'confirm' | 'success';

export default function Ballot() {
  const { user } = useAuth();
  const { 
    positions: allPositions, 
    hasUserVotedForPosition, 
    canUserVoteForPosition,
    castVote 
  } = useVoting();
  
  const [currentPositionIndex, setCurrentPositionIndex] = useState(0);
  const [selections, setSelections] = useState<Record<string, string>>({});
  const [step, setStep] = useState<BallotStep>('select');
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [voteReceipts, setVoteReceipts] = useState<VoteReceipt[]>([]);

  // Filter positions: active + (national OR user's branch) + not already voted
  const positions = allPositions.filter(p => {
    if (p.status !== 'active') return false;
    if (p.type === 'branch' && p.branch !== user?.branch) return false;
    // Show even if voted, but mark as locked
    return true;
  });

  // Positions user can still vote on
  const votablePositions = positions.filter(p => canUserVoteForPosition(p.id));

  const currentPosition = positions[currentPositionIndex];
  const canVoteCurrentPosition = currentPosition ? canUserVoteForPosition(currentPosition.id) : false;
  const hasVotedCurrentPosition = currentPosition ? hasUserVotedForPosition(currentPosition.id) : false;
  
  const selectedCandidate = currentPosition?.candidates.find(
    c => c.id === selections[currentPosition.id]
  );

  // Check if all positions have been voted
  const allPositionsVoted = positions.every(p => hasUserVotedForPosition(p.id));

  useEffect(() => {
    // Skip to first votable position
    if (currentPosition && hasVotedCurrentPosition && votablePositions.length > 0) {
      const nextVotableIndex = positions.findIndex(p => canUserVoteForPosition(p.id));
      if (nextVotableIndex !== -1 && nextVotableIndex !== currentPositionIndex) {
        setCurrentPositionIndex(nextVotableIndex);
      }
    }
  }, []);

  const handleSelectCandidate = (candidateId: string) => {
    if (!canVoteCurrentPosition) {
      toast.error('You have already voted for this position');
      return;
    }
    setSelections(prev => ({
      ...prev,
      [currentPosition.id]: candidateId,
    }));
  };

  const handleNext = () => {
    if (currentPositionIndex < positions.length - 1) {
      setCurrentPositionIndex(prev => prev + 1);
    } else {
      // Only show confirm if there are new selections
      const newSelections = Object.keys(selections).filter(
        posId => !hasUserVotedForPosition(posId)
      );
      if (newSelections.length > 0) {
        setShowConfirmDialog(true);
      } else {
        toast.info('No new votes to submit');
      }
    }
  };

  const handlePrevious = () => {
    if (currentPositionIndex > 0) {
      setCurrentPositionIndex(prev => prev - 1);
    }
  };

  const handleSubmitVote = async () => {
    setIsSubmitting(true);
    const receipts: VoteReceipt[] = [];
    
    try {
      // Submit each vote - these are IMMUTABLE once cast
      for (const positionId of Object.keys(selections)) {
        if (!hasUserVotedForPosition(positionId)) {
          const candidateId = selections[positionId];
          if (candidateId) {
            const receipt = await castVote(positionId, candidateId);
            receipts.push(receipt);
          }
        }
      }

      setVoteReceipts(receipts);
      setShowConfirmDialog(false);
      setStep('success');
      
      // Simulate SMS notification
      toast.success('Vote submitted! SMS confirmation sent to your phone.');
      
    } catch (error) {
      toast.error('Failed to submit vote. Please try again.');
      console.error('Vote submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // All positions voted - show completion message
  if (allPositionsVoted && step !== 'success') {
    return (
      <DashboardLayout title="Ballot">
        <div className="max-w-2xl mx-auto text-center py-12">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-success/10">
            <CheckCircle className="h-10 w-10 text-success" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">All Votes Cast!</h1>
          <p className="text-muted-foreground mb-8">
            You have already voted in all available positions. Thank you for participating.
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-6">
            <Lock className="h-4 w-4" />
            <span>Votes are immutable and cannot be changed</span>
          </div>
          <Button onClick={() => window.location.href = '/member'}>
            Return to Dashboard
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  if (step === 'success') {
    return (
      <DashboardLayout title="Ballot">
        <div className="max-w-2xl mx-auto text-center py-12 animate-fade-in">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-success/10 check-animate">
            <CheckCircle className="h-10 w-10 text-success" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Vote Submitted!</h1>
          <p className="text-muted-foreground mb-8">
            Your vote has been securely recorded and verified on the blockchain.
          </p>

          <Card className="text-left mb-6">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Shield className="h-4 w-4 text-accent" />
                Vote Receipt
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {voteReceipts.map((receipt) => (
                <div key={receipt.id} className="rounded-lg bg-muted/50 p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{receipt.positionTitle}</span>
                    <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                      <Check className="h-3 w-3 mr-1" />
                      Verified
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Blockchain Hash</span>
                    <div className="flex items-center gap-2">
                      <code className="font-mono text-xs">{receipt.blockchainHash}</code>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => {
                          navigator.clipboard.writeText(receipt.blockchainHash);
                          toast.success('Copied to clipboard');
                        }}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Verification Token</span>
                    <code className="font-mono text-xs">{receipt.verificationToken}</code>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Timestamp</span>
                    <span className="text-xs">{receipt.timestamp.toLocaleString()}</span>
                  </div>
                </div>
              ))}

              <div className="border-t pt-4 space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Lock className="h-4 w-4" />
                  <span>Votes are immutable and cannot be edited or deleted</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Shield className="h-4 w-4" />
                  <span>Your identity is separated from your vote (anonymous)</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <p className="text-sm text-muted-foreground mb-6">
            An SMS confirmation has been sent to your registered phone number.
          </p>

          <Button onClick={() => window.location.href = '/member'}>
            Return to Dashboard
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Ballot">
      <div className="max-w-4xl mx-auto">
        {/* Security Notice */}
        <div className="mb-6 rounded-lg bg-accent/10 border border-accent/20 p-4 flex items-center gap-3">
          <Shield className="h-5 w-5 text-accent flex-shrink-0" />
          <div className="text-sm">
            <span className="font-medium">Secure Voting:</span>{' '}
            <span className="text-muted-foreground">
              Each vote is encrypted, anonymized, and recorded on the blockchain. 
              You can only vote once per position.
            </span>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">
              Position {currentPositionIndex + 1} of {positions.length}
            </span>
            <span className="text-sm font-medium">
              {Object.keys(selections).filter(id => !hasUserVotedForPosition(id)).length} new selections
            </span>
          </div>
          <div className="h-2 bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${((currentPositionIndex + 1) / positions.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Position Card */}
        <Card className={cn("mb-6", hasVotedCurrentPosition && "opacity-75")}>
          <CardHeader>
            <div className="flex items-center gap-3">
              <Badge variant="outline" className={cn(
                currentPosition?.type === 'national' 
                  ? 'bg-primary/10 text-primary border-primary/20'
                  : 'bg-accent/10 text-accent border-accent/20'
              )}>
                {currentPosition?.type === 'national' ? 'National' : 'Branch'}
              </Badge>
              <CardTitle>{currentPosition?.title}</CardTitle>
              {hasVotedCurrentPosition && (
                <Badge className="bg-success/10 text-success border-success/20">
                  <Check className="h-3 w-3 mr-1" />
                  Voted
                </Badge>
              )}
            </div>
            <CardDescription>
              {hasVotedCurrentPosition 
                ? 'You have already voted for this position. Your vote is locked and cannot be changed.'
                : 'Select one candidate for this position'
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            {hasVotedCurrentPosition ? (
              <div className="flex items-center justify-center py-8 text-muted-foreground">
                <Lock className="h-5 w-5 mr-2" />
                <span>Vote recorded - position locked</span>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {currentPosition?.candidates.map((candidate) => (
                  <CandidateCard
                    key={candidate.id}
                    candidate={candidate}
                    selectable
                    isSelected={selections[currentPosition.id] === candidate.id}
                    onSelect={() => handleSelectCandidate(candidate.id)}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentPositionIndex === 0}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Previous
          </Button>

          {!hasVotedCurrentPosition && (
            <Button
              variant="ghost"
              className="text-muted-foreground"
              onClick={handleNext}
            >
              Skip Position
            </Button>
          )}

          <Button
            onClick={handleNext}
            disabled={!hasVotedCurrentPosition && !selections[currentPosition?.id]}
          >
            {currentPositionIndex === positions.length - 1 ? (
              <>
                Review & Submit
                <Check className="h-4 w-4 ml-1" />
              </>
            ) : (
              <>
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-warning" />
              Confirm Your Vote
            </DialogTitle>
            <DialogDescription>
              <strong className="text-foreground">This action cannot be undone.</strong> Once submitted, 
              your votes are permanently recorded on the blockchain.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-4">
            {positions.map(position => {
              const candidate = position.candidates.find(c => c.id === selections[position.id]);
              const alreadyVoted = hasUserVotedForPosition(position.id);
              return (
                <div key={position.id} className="flex items-center justify-between py-2 border-b last:border-0">
                  <span className="text-sm text-muted-foreground">{position.title}</span>
                  <span className={cn(
                    "text-sm font-medium",
                    alreadyVoted && "text-muted-foreground"
                  )}>
                    {alreadyVoted ? (
                      <span className="flex items-center gap-1">
                        <Lock className="h-3 w-3" />
                        Already Voted
                      </span>
                    ) : (
                      candidate?.name || 'Abstained'
                    )}
                  </span>
                </div>
              );
            })}
          </div>
          <div className="rounded-lg bg-warning/10 border border-warning/20 p-3 text-sm">
            <div className="flex items-start gap-2">
              <Shield className="h-4 w-4 text-warning mt-0.5" />
              <div>
                <p className="font-medium text-warning">Vote Integrity Notice</p>
                <p className="text-muted-foreground text-xs mt-1">
                  Votes cannot be edited or deleted after submission. Your identity is kept separate 
                  from your vote to ensure privacy.
                </p>
              </div>
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setShowConfirmDialog(false)} disabled={isSubmitting}>
              Go Back
            </Button>
            <Button onClick={handleSubmitVote} className="gap-2" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Shield className="h-4 w-4" />
                  Submit Vote
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
