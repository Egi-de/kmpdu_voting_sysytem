import { User, Position, Branch, ElectionStats, Notification, Candidate } from '@/types/voting';

export const mockUser: User = {
  id: 'usr_001',
  name: 'Dr. Sarah Wanjiku',
  email: 'sarah.wanjiku@kmpdu.org',
  phone: '+254 712 345 678',
  role: 'member',
  branch: 'Nairobi Branch',
  memberId: 'KMPDU-2024-00456',
  avatar: undefined,
};

export const mockAdminUser: User = {
  id: 'adm_001',
  name: 'James Ochieng',
  email: 'admin@kmpdu.org',
  phone: '+254 700 000 001',
  role: 'admin',
  branch: 'Headquarters',
  memberId: 'KMPDU-ADM-001',
  avatar: undefined,
};

export const mockBranches: Branch[] = [
  { id: 'br_001', name: 'Nairobi Branch', totalMembers: 4520, votedCount: 3616, turnoutPercentage: 80 },
  { id: 'br_002', name: 'Mombasa Branch', totalMembers: 1890, votedCount: 1417, turnoutPercentage: 75 },
  { id: 'br_003', name: 'Kisumu Branch', totalMembers: 1456, votedCount: 1019, turnoutPercentage: 70 },
  { id: 'br_004', name: 'Nakuru Branch', totalMembers: 980, votedCount: 686, turnoutPercentage: 70 },
  { id: 'br_005', name: 'Eldoret Branch', totalMembers: 1120, votedCount: 728, turnoutPercentage: 65 },
  { id: 'br_006', name: 'Nyeri Branch', totalMembers: 650, votedCount: 455, turnoutPercentage: 70 },
  { id: 'br_007', name: 'Machakos Branch', totalMembers: 520, votedCount: 338, turnoutPercentage: 65 },
  { id: 'br_008', name: 'Kisii Branch', totalMembers: 780, votedCount: 546, turnoutPercentage: 70 },
];

export const mockCandidates: Record<string, Candidate[]> = {
  secretary_general: [
    { id: 'cand_001', name: 'Dr. Davji Atellah', photo: undefined, bio: 'Experienced union leader with 15 years of advocacy', position: 'Secretary General', voteCount: 4250, percentage: 45.2 },
    { id: 'cand_002', name: 'Dr. Ouma Oluga', photo: undefined, bio: 'Former branch secretary, champion of doctor welfare', position: 'Secretary General', voteCount: 3180, percentage: 33.8 },
    { id: 'cand_003', name: 'Dr. Mercy Korir', photo: undefined, bio: 'Public health specialist and policy advocate', position: 'Secretary General', voteCount: 1970, percentage: 21.0 },
  ],
  chairman: [
    { id: 'cand_004', name: 'Dr. Simon Kigondu', photo: undefined, bio: 'Senior consultant with leadership experience', position: 'National Chairman', voteCount: 5120, percentage: 54.5 },
    { id: 'cand_005', name: 'Dr. Agnes Muthoni', photo: undefined, bio: 'Pediatric specialist and hospital administrator', position: 'National Chairman', voteCount: 4280, percentage: 45.5 },
  ],
  treasurer: [
    { id: 'cand_006', name: 'Dr. Peter Magana', photo: undefined, bio: 'Financial management expert in healthcare', position: 'National Treasurer', voteCount: 3890, percentage: 41.4 },
    { id: 'cand_007', name: 'Dr. Faith Mueni', photo: undefined, bio: 'Healthcare economist and budget specialist', position: 'National Treasurer', voteCount: 2950, percentage: 31.4 },
    { id: 'cand_008', name: 'Dr. John Kamau', photo: undefined, bio: 'Former hospital CFO with audit experience', position: 'National Treasurer', voteCount: 2560, percentage: 27.2 },
  ],
  nairobi_chair: [
    { id: 'cand_009', name: 'Dr. Lucy Mwangi', photo: undefined, bio: 'KNH consultant and branch activist', position: 'Nairobi Branch Chairman', voteCount: 1820, percentage: 50.3 },
    { id: 'cand_010', name: 'Dr. Michael Otieno', photo: undefined, bio: 'Private practice owner and union organizer', position: 'Nairobi Branch Chairman', voteCount: 1796, percentage: 49.7 },
  ],
};

export const mockPositions: Position[] = [
  {
    id: 'pos_001',
    title: 'Secretary General',
    type: 'national',
    candidates: mockCandidates.secretary_general,
    totalVotes: 9400,
    eligibleVoters: 12000,
    status: 'active',
    startTime: new Date('2024-12-01T08:00:00'),
    endTime: new Date('2024-12-05T18:00:00'),
  },
  {
    id: 'pos_002',
    title: 'National Chairman',
    type: 'national',
    candidates: mockCandidates.chairman,
    totalVotes: 9400,
    eligibleVoters: 12000,
    status: 'active',
    startTime: new Date('2024-12-01T08:00:00'),
    endTime: new Date('2024-12-05T18:00:00'),
  },
  {
    id: 'pos_003',
    title: 'National Treasurer',
    type: 'national',
    candidates: mockCandidates.treasurer,
    totalVotes: 9400,
    eligibleVoters: 12000,
    status: 'active',
    startTime: new Date('2024-12-01T08:00:00'),
    endTime: new Date('2024-12-05T18:00:00'),
  },
  {
    id: 'pos_004',
    title: 'Nairobi Branch Chairman',
    type: 'branch',
    branch: 'Nairobi Branch',
    candidates: mockCandidates.nairobi_chair,
    totalVotes: 3616,
    eligibleVoters: 4520,
    status: 'active',
    startTime: new Date('2024-12-01T08:00:00'),
    endTime: new Date('2024-12-05T18:00:00'),
  },
];

export const mockElectionStats: ElectionStats = {
  totalVoters: 11916,
  totalVotesCast: 8805,
  turnoutPercentage: 73.9,
  activeBranches: 8,
  activePositions: 4,
  timeRemaining: '1d 6h 23m',
};

export const mockNotifications: Notification[] = [
  {
    id: 'notif_001',
    title: 'Vote Confirmed',
    message: 'Your vote for Secretary General has been recorded successfully.',
    type: 'success',
    timestamp: new Date('2024-12-04T10:30:00'),
    read: false,
  },
  {
    id: 'notif_002',
    title: 'Voting Reminder',
    message: 'National voting closes in 1 day 6 hours. Don\'t forget to cast your vote!',
    type: 'warning',
    timestamp: new Date('2024-12-04T09:00:00'),
    read: false,
  },
  {
    id: 'notif_003',
    title: 'Election Started',
    message: 'The KMPDU 2024 National Elections have officially begun.',
    type: 'info',
    timestamp: new Date('2024-12-01T08:00:00'),
    read: true,
  },
];

export const mockAdminNotifications: Notification[] = [
  {
    id: 'adm_notif_001',
    title: 'High Turnout Alert',
    message: 'Nairobi Branch has exceeded 80% voter turnout.',
    type: 'success',
    timestamp: new Date('2024-12-04T11:00:00'),
    read: false,
  },
  {
    id: 'adm_notif_002',
    title: 'System Health',
    message: 'All voting nodes are operational. No anomalies detected.',
    type: 'info',
    timestamp: new Date('2024-12-04T10:00:00'),
    read: false,
  },
  {
    id: 'adm_notif_003',
    title: 'Candidate Upload',
    message: 'New candidate added to Mombasa Branch Secretary position.',
    type: 'info',
    timestamp: new Date('2024-12-03T15:30:00'),
    read: true,
  },
];
