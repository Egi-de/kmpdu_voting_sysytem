import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { Position, VoteReceipt, VoteTransaction, Notification } from '@/types/voting';
import { mockPositions, mockNotifications } from '@/data/mockData';
import { useAuth } from './AuthContext';

export type VotingLevel = 'national' | 'branch' | null;

interface VotingContextType {
  positions: Position[];
  userVotedPositions: Record<string, boolean>;
  voteReceipts: VoteReceipt[];
  notifications: Notification[];
  
  // Voting level selection
  selectedLevel: VotingLevel;
  setSelectedLevel: (level: VotingLevel) => void;
  requestLevelSwitch: (newLevel: VotingLevel) => void;
  hasSelectedLevel: boolean;
  
  // Voting actions
  hasUserVotedForPosition: (positionId: string) => boolean;
  canUserVoteForPosition: (positionId: string) => boolean;
  castVote: (positionId: string, candidateId: string) => Promise<VoteReceipt>;
  
  // Real-time updates
  refreshResults: () => void;
  
  // Notifications
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markNotificationRead: (notificationId: string) => void;
}

const VotingContext = createContext<VotingContextType | undefined>(undefined);

export function VotingProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [positions, setPositions] = useState<Position[]>(mockPositions);
  const [userVotedPositions, setUserVotedPositions] = useState<Record<string, boolean>>({});
  const [voteReceipts, setVoteReceipts] = useState<VoteReceipt[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [selectedLevel, setSelectedLevel] = useState<VotingLevel>(null);
  
  const hasSelectedLevel = selectedLevel !== null;

  // Check if user has already voted for a specific position
  const hasUserVotedForPosition = useCallback((positionId: string): boolean => {
    return userVotedPositions[positionId] === true;
  }, [userVotedPositions]);

  // Check if user CAN vote for a position (branch restrictions + already voted check)
  const canUserVoteForPosition = useCallback((positionId: string): boolean => {
    if (!user) return false;
    
    const position = positions.find(p => p.id === positionId);
    if (!position) return false;
    
    // Check if already voted
    if (hasUserVotedForPosition(positionId)) return false;
    
    // Check position status
    if (position.status !== 'active') return false;
    
    // Check branch restrictions for branch-level elections
    if (position.type === 'branch' && position.branch !== user.branch) {
      return false;
    }
    
    return true;
  }, [user, positions, hasUserVotedForPosition]);

  // Cast a vote with blockchain verification
  const castVote = useCallback(async (positionId: string, candidateId: string): Promise<VoteReceipt> => {
    // Anti-fraud: Double-check user hasn't voted
    if (!canUserVoteForPosition(positionId)) {
      throw new Error('You cannot vote for this position');
    }

    const position = positions.find(p => p.id === positionId);
    const candidate = position?.candidates.find(c => c.id === candidateId);
    
    if (!position || !candidate) {
      throw new Error('Invalid position or candidate');
    }

    // Simulate blockchain transaction
    const blockchainHash = 'KMPDU-BLK-' + Date.now().toString(36).toUpperCase() + '-' + 
                           Math.random().toString(36).substring(2, 8).toUpperCase();
    const verificationToken = 'KMPDU-VRF-' + Math.random().toString(36).substring(2, 10).toUpperCase();

    // Create anonymous vote transaction (NO voter info stored)
    const voteTransaction: VoteTransaction = {
      id: 'txn_' + Date.now(),
      positionId,
      timestamp: new Date(),
      blockHash: blockchainHash,
      blockNumber: Math.floor(4500000 + Math.random() * 100000),
      verified: true,
    };

    // Create receipt for voter (only they have this)
    const receipt: VoteReceipt = {
      id: 'rcpt_' + Date.now(),
      positionId,
      positionTitle: position.title,
      candidateId,
      candidateName: candidate.name,
      timestamp: new Date(),
      verificationToken,
      blockchainHash,
    };

    // Update state - mark as voted (IMMUTABLE - cannot be undone)
    setUserVotedPositions(prev => ({
      ...prev,
      [positionId]: true,
    }));

    // Update vote counts
    setPositions(prev => prev.map(p => {
      if (p.id === positionId) {
        return {
          ...p,
          totalVotes: p.totalVotes + 1,
          candidates: p.candidates.map(c => {
            if (c.id === candidateId) {
              const newVoteCount = c.voteCount + 1;
              return {
                ...c,
                voteCount: newVoteCount,
                percentage: (newVoteCount / (p.totalVotes + 1)) * 100,
              };
            }
            return {
              ...c,
              percentage: (c.voteCount / (p.totalVotes + 1)) * 100,
            };
          }),
        };
      }
      return p;
    }));

    // Store receipt
    setVoteReceipts(prev => [...prev, receipt]);

    // Add confirmation notification
    addNotification({
      title: 'Vote Confirmed',
      message: `Your vote for ${position.title} has been recorded and verified on the blockchain.`,
      type: 'success',
    });

    return receipt;
  }, [positions, canUserVoteForPosition]);

  const refreshResults = useCallback(() => {
    // Simulate real-time updates from the server
    // In production, this would fetch from the blockchain/database
    setPositions(prev => [...prev]);
  }, []);

  const addNotification = useCallback((notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: 'notif_' + Date.now(),
      timestamp: new Date(),
      read: false,
    };
    setNotifications(prev => [newNotification, ...prev]);
  }, []);

  const markNotificationRead = useCallback((notificationId: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
    );
  }, []);

  // Request level switch with confirmation if current phase incomplete
  const requestLevelSwitch = useCallback((newLevel: VotingLevel) => {
    if (!newLevel || newLevel === selectedLevel) return;

    // Check if current level has incomplete voting
    if (selectedLevel) {
      const currentPositions = positions.filter(p => {
        if (selectedLevel === 'national') return p.type === 'national' && p.status === 'active';
        if (selectedLevel === 'branch') return p.type === 'branch' && p.status === 'active' && p.branch === user?.branch;
        return false;
      });

      const hasIncompleteVoting = currentPositions.some(p => !hasUserVotedForPosition(p.id));

      if (hasIncompleteVoting) {
        const levelName = selectedLevel === 'national' ? 'National' : 'Branch';
        const confirmed = window.confirm(
          `You have not completed voting in ${levelName} elections.\n\n` +
          `Are you sure you want to switch? You can return to complete it later.`
        );
        
        if (!confirmed) {
          return; // User cancelled the switch
        }
      }
    }

    // Proceed with the switch
    setSelectedLevel(newLevel);
  }, [selectedLevel, positions, user?.branch, hasUserVotedForPosition]);

  return (
    <VotingContext.Provider
      value={{
        positions,
        userVotedPositions,
        voteReceipts,
        notifications,
        selectedLevel,
        setSelectedLevel,
        requestLevelSwitch,
        hasSelectedLevel,
        hasUserVotedForPosition,
        canUserVoteForPosition,
        castVote,
        refreshResults,
        addNotification,
        markNotificationRead,
      }}
    >
      {children}
    </VotingContext.Provider>
  );
}

export function useVoting() {
  const context = useContext(VotingContext);
  if (context === undefined) {
    throw new Error('useVoting must be used within a VotingProvider');
  }
  return context;
}
