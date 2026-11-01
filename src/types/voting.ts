export interface Candidate {
  id: string;
  name: string;
  party: string;
  partyAcronym: string;
  partyColor: string;
  photoUrl: string;
  slogan: string;
  bio: string;
  manifesto: string[];
  votes: number;
}

export interface Position {
  id: string;
  title: string;
  department: string;
  description: string;
  maxChoices: number;
  candidates: Candidate[];
}

export interface Voter {
  id: string;
  voterCardId: string;
  pin: string;
  fullName: string;
  department: string;
  hasVoted: boolean;
  votedAt?: string;
  ballotHash?: string;
}

export interface VoteSelection {
  positionId: string;
  candidateId: string;
}

export interface CastBallotReceipt {
  receiptId: string;
  voterCardId: string;
  timestamp: string;
  ballotHash: string;
  selections: {
    positionTitle: string;
    candidateName: string;
    party: string;
  }[];
  stationId: string;
  digitalSignature: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  eventType: 'AUTH_SUCCESS' | 'AUTH_FAILURE' | 'BALLOT_CAST' | 'RESULTS_EXPORT' | 'SYSTEM_LOCK' | 'RESET';
  details: string;
  operator: string;
  hash: string;
}

export interface CSharpSourceFile {
  name: string;
  path: string;
  category: 'Entry' | 'Forms' | 'Controls' | 'Models' | 'Services' | 'Project';
  description: string;
  content: string;
}
