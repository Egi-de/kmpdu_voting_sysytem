import { useState, useMemo } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { mockPositions, mockBranches } from '@/data/mockData';
import { Position, Branch } from '@/types/voting';
import { Trophy, Check, Globe, MapPin, Users, Vote } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface AnnounceWinnerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface WinnerSelection {
  positionId: string;
  candidateId: string;
  votes: string;
}

export function AnnounceWinnerDialog({ open, onOpenChange }: AnnounceWinnerDialogProps) {
  const [selectedLevel, setSelectedLevel] = useState<'national' | string>('');
  const [winnerSelections, setWinnerSelections] = useState<Record<string, WinnerSelection>>({});

  // Get positions based on selected level
  const availablePositions = useMemo(() => {
    if (!selectedLevel) return [];
    if (selectedLevel === 'national') {
      return mockPositions.filter(p => p.type === 'national');
    }
    // Branch selected - show branch-specific positions
    return mockPositions.filter(p => p.type === 'branch' && p.branch === selectedLevel);
  }, [selectedLevel]);

  const handleCandidateSelect = (positionId: string, candidateId: string) => {
    const position = mockPositions.find(p => p.id === positionId);
    const candidate = position?.candidates.find(c => c.id === candidateId);
    
    setWinnerSelections(prev => ({
      ...prev,
      [positionId]: {
        positionId,
        candidateId,
        votes: candidate?.voteCount.toString() || '',
      }
    }));
  };

  const handleVotesChange = (positionId: string, votes: string) => {
    setWinnerSelections(prev => ({
      ...prev,
      [positionId]: {
        ...prev[positionId],
        votes,
      }
    }));
  };

  const handleAnnounce = () => {
    const selections = Object.values(winnerSelections);
    if (selections.length === 0) {
      toast.error('Please select at least one winner');
      return;
    }

    const incompleteSelections = selections.filter(s => !s.candidateId || !s.votes);
    if (incompleteSelections.length > 0) {
      toast.error('Please complete all winner selections with vote counts');
      return;
    }

    // Announce all winners
    selections.forEach(selection => {
      const position = mockPositions.find(p => p.id === selection.positionId);
      const candidate = position?.candidates.find(c => c.id === selection.candidateId);
      if (position && candidate) {
        toast.success(`${candidate.name} announced as winner for ${position.title} with ${parseInt(selection.votes).toLocaleString()} votes!`);
      }
    });

    onOpenChange(false);
    resetForm();
  };

  const resetForm = () => {
    setSelectedLevel('');
    setWinnerSelections({});
  };

  const handleClose = (isOpen: boolean) => {
    if (!isOpen) {
      resetForm();
    }
    onOpenChange(isOpen);
  };

  const selectedBranch = selectedLevel !== 'national' ? mockBranches.find(b => b.name === selectedLevel) : null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-accent" />
            Announce Winners
          </DialogTitle>
          <DialogDescription>
            Select election level, then choose winners for each position and assign final vote counts.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Level Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Select Election Level</label>
            <Select value={selectedLevel} onValueChange={setSelectedLevel}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Choose National or a Branch" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="national">
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-primary" />
                    <span>National Level</span>
                  </div>
                </SelectItem>
                <Separator className="my-2" />
                {mockBranches.map(branch => (
                  <SelectItem key={branch.id} value={branch.name}>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-accent" />
                      <span>{branch.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Level Info Card */}
          {selectedLevel && (
            <Card className="bg-muted/30">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  {selectedLevel === 'national' ? (
                    <>
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                        <Globe className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold">National Election</h4>
                        <p className="text-sm text-muted-foreground">
                          {availablePositions.length} positions to announce
                        </p>
                      </div>
                    </>
                  ) : selectedBranch && (
                    <>
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
                        <MapPin className="h-6 w-6 text-accent" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold">{selectedBranch.name}</h4>
                        <div className="flex gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {selectedBranch.totalMembers.toLocaleString()} members
                          </span>
                          <span className="flex items-center gap-1">
                            <Vote className="h-3 w-3" />
                            {selectedBranch.turnoutPercentage}% turnout
                          </span>
                        </div>
                      </div>
                      <Badge variant="outline">
                        {availablePositions.length} position{availablePositions.length !== 1 ? 's' : ''}
                      </Badge>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Positions & Winner Selection */}
          {selectedLevel && (
            <ScrollArea className="h-[300px] pr-4">
              <div className="space-y-4">
                {availablePositions.length === 0 ? (
                  <Card>
                    <CardContent className="p-6 text-center text-muted-foreground">
                      No positions available for this level
                    </CardContent>
                  </Card>
                ) : (
                  availablePositions.map(position => (
                    <PositionWinnerSelect
                      key={position.id}
                      position={position}
                      selection={winnerSelections[position.id]}
                      onCandidateSelect={(candidateId) => handleCandidateSelect(position.id, candidateId)}
                      onVotesChange={(votes) => handleVotesChange(position.id, votes)}
                    />
                  ))
                )}
              </div>
            </ScrollArea>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => handleClose(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleAnnounce}
            className="gap-2"
            disabled={!selectedLevel || Object.keys(winnerSelections).length === 0}
          >
            <Check className="h-4 w-4" />
            Confirm & Announce ({Object.keys(winnerSelections).length})
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

interface PositionWinnerSelectProps {
  position: Position;
  selection?: WinnerSelection;
  onCandidateSelect: (candidateId: string) => void;
  onVotesChange: (votes: string) => void;
}

function PositionWinnerSelect({ position, selection, onCandidateSelect, onVotesChange }: PositionWinnerSelectProps) {
  const selectedCandidate = position.candidates.find(c => c.id === selection?.candidateId);
  const sortedCandidates = [...position.candidates].sort((a, b) => b.percentage - a.percentage);

  return (
    <Card className={cn(
      "transition-all",
      selection?.candidateId && selection?.votes ? "border-success/50 bg-success/5" : ""
    )}>
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="font-semibold">{position.title}</h4>
          {selection?.candidateId && selection?.votes && (
            <Badge className="bg-success/20 text-success border-success/30">
              <Check className="h-3 w-3 mr-1" />
              Selected
            </Badge>
          )}
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label className="text-xs text-muted-foreground">Select Winner</label>
            <Select 
              value={selection?.candidateId || ''} 
              onValueChange={onCandidateSelect}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choose candidate" />
              </SelectTrigger>
              <SelectContent>
                {sortedCandidates.map((candidate, index) => (
                  <SelectItem key={candidate.id} value={candidate.id}>
                    <div className="flex items-center gap-2">
                      {index === 0 && <Trophy className="h-3 w-3 text-accent" />}
                      <span>{candidate.name}</span>
                      <span className="text-xs text-muted-foreground">
                        ({candidate.percentage.toFixed(1)}%)
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs text-muted-foreground">Final Vote Count</label>
            <Input
              type="number"
              value={selection?.votes || ''}
              onChange={(e) => onVotesChange(e.target.value)}
              placeholder="Enter votes"
              min="0"
            />
          </div>
        </div>

        {selectedCandidate && selection?.votes && (
          <div className="flex items-center gap-3 p-3 rounded-lg bg-accent/10 border border-accent/20">
            <Trophy className="h-5 w-5 text-accent" />
            <div>
              <p className="font-medium">{selectedCandidate.name}</p>
              <p className="text-xs text-muted-foreground">
                {parseInt(selection.votes).toLocaleString()} votes
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
