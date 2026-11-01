import { Position, Voter, AuditLogEntry } from '../types/voting';

export const INITIAL_POSITIONS: Position[] = [
  {
    id: 'pos_president',
    title: 'President of Student Government & Board',
    department: 'Executive Branch',
    description: 'Leads student executive board, manages $1.8M budget, and represents 24,000 voters.',
    maxChoices: 1,
    candidates: [
      {
        id: 'cand_pres_1',
        name: 'Dr. Sarah Jenkins',
        party: 'Progressive Alliance',
        partyAcronym: 'PA',
        partyColor: '#2563eb', // Blue
        photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
        slogan: 'Transparency, Innovation & Student Prosperity',
        bio: 'Senior Scholar with 3 years on the Financial Oversight Committee and campus sustainability lead.',
        manifesto: [
          '24/7 Library & Collaborative Tech Commons funding',
          'Free campus transit passes & electric shuttle expansion',
          '100% open-access digital textbook grant program'
        ],
        votes: 1420
      },
      {
        id: 'cand_pres_2',
        name: 'Alexander Morales',
        party: 'Student First Coalition',
        partyAcronym: 'SFC',
        partyColor: '#059669', // Emerald
        photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
        slogan: 'Empowering Every Voice, Building Real Careers',
        bio: 'Engineering Council President and founder of the Student Startup Accelerator.',
        manifesto: [
          'Direct corporate internship pipeline with 40+ industry partners',
          'Dining hall affordability freeze & culinary upgrades',
          'Mental health counseling capacity doubled within 60 days'
        ],
        votes: 1285
      },
      {
        id: 'cand_pres_3',
        name: 'Victoria Nyong\'o',
        party: 'Independent Reform Action',
        partyAcronym: 'IRA',
        partyColor: '#7c3aed', // Purple
        photoUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=80',
        slogan: 'Action Over Politics — Accountable Representation',
        bio: 'Mock Trial Champion and student affairs liaison with published civic engagement research.',
        manifesto: [
          'Immediate student activity fee audit and 15% rebate',
          'Expanded campus safety emergency beacons and night escorts',
          'Democratized student referendum voting via secure applet'
        ],
        votes: 940
      }
    ]
  },
  {
    id: 'pos_vp',
    title: 'Vice President of Academic & Student Affairs',
    department: 'Executive Branch',
    description: 'Chairs the Academic Senate, manages student clubs, and oversees judicial committee.',
    maxChoices: 1,
    candidates: [
      {
        id: 'cand_vp_1',
        name: 'Elijah Vance',
        party: 'Student First Coalition',
        partyAcronym: 'SFC',
        partyColor: '#059669',
        photoUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&auto=format&fit=crop&q=80',
        slogan: 'Bridging Faculty, Research, and Student Well-being',
        bio: 'Pre-Med Representative with extensive community healthcare outreach experience.',
        manifesto: [
          'Universal lecture capture & recorded class policy',
          'Streamlined club funding approvals within 48 hours'
        ],
        votes: 1610
      },
      {
        id: 'cand_vp_2',
        name: 'Mei-Ling Zhou',
        party: 'Progressive Alliance',
        partyAcronym: 'PA',
        partyColor: '#2563eb',
        photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
        slogan: 'Inclusive Campuses, Flexible Learning Paths',
        bio: 'Data Science major and lead peer mentor for international and transfer scholars.',
        manifesto: [
          'Hybrid lab and tutorial schedule flexibility',
          'Emergency student micro-grants for unexpected hardship'
        ],
        votes: 1495
      }
    ]
  },
  {
    id: 'pos_treasurer',
    title: 'Treasurer & Comptroller of Treasury',
    department: 'Financial Division',
    description: 'Manages allocation of student organization grants and oversees fiscal audits.',
    maxChoices: 1,
    candidates: [
      {
        id: 'cand_tr_1',
        name: 'Kavita Patel',
        party: 'Independent Reform Action',
        partyAcronym: 'IRA',
        partyColor: '#7c3aed',
        photoUrl: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=400&auto=format&fit=crop&q=80',
        slogan: 'Precision Accounting, Real-Time Public Ledger',
        bio: 'Finance & Accounting double major with Deloitte audit internship background.',
        manifesto: [
          'Public blockchain-style transparent ledger for all student expenditure',
          'Zero bureaucracy grant disbursement through direct card deposit'
        ],
        votes: 1780
      },
      {
        id: 'cand_tr_2',
        name: 'David O\'Connor',
        party: 'Progressive Alliance',
        partyAcronym: 'PA',
        partyColor: '#2563eb',
        photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
        slogan: 'Investing In Student Enterprise & Innovation',
        bio: 'Economics Society President and treasurer for the Robotics Competition Team.',
        manifesto: [
          'Double the venture fund for student-led hardware & software startups',
          'Financial literacy and tax-filing free workshops for all undergraduates'
        ],
        votes: 1320
      }
    ]
  },
  {
    id: 'pos_referendum',
    title: 'Referendum Measure 4A: Renewable Solar Canopy & Tech Hub',
    department: 'Campus Ballot Measure',
    description: 'Authorization to reallocate $450,000 from reserve capital to install solar carports and high-speed outdoor WiFi across parking sectors.',
    maxChoices: 1,
    candidates: [
      {
        id: 'ref_yes',
        name: 'YES on Measure 4A (Approve)',
        party: 'Green Campus Initiative',
        partyAcronym: 'YES',
        partyColor: '#10b981',
        photoUrl: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?w=400&auto=format&fit=crop&q=80',
        slogan: 'Net-Zero Emissions and Lower Electricity Rates',
        bio: 'Supported by 18 student environmental and engineering societies.',
        manifesto: [
          'Offsets 65% of campus daytime power demands',
          'Shaded vehicle parking and 24 outdoor solar charging workstations'
        ],
        votes: 2140
      },
      {
        id: 'ref_no',
        name: 'NO on Measure 4A (Reject)',
        party: 'Fiscal Caution Committee',
        partyAcronym: 'NO',
        partyColor: '#ef4444',
        photoUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&auto=format&fit=crop&q=80',
        slogan: 'Preserve Reserve Funds for Tuition Assistance',
        bio: 'Advocates redirecting capital towards need-based student food security and housing grants.',
        manifesto: [
          'Keep reserve capital intact for economic contingencies',
          'Re-examine solar contract bids in subsequent fiscal year'
        ],
        votes: 910
      }
    ]
  }
];

export const INITIAL_VOTERS: Voter[] = [
  {
    id: 'vtr_1',
    voterCardId: 'VTR-88219',
    pin: '4921',
    fullName: 'Elena Rostova',
    department: 'Computer Science & Software Eng.',
    hasVoted: false
  },
  {
    id: 'vtr_2',
    voterCardId: 'VTR-77104',
    pin: '8103',
    fullName: 'Marcus Sterling',
    department: 'Biomedical & Neural Sciences',
    hasVoted: false
  },
  {
    id: 'vtr_3',
    voterCardId: 'VTR-99451',
    pin: '3390',
    fullName: 'Aisha Al-Mansoor',
    department: 'School of Architecture & Urban Design',
    hasVoted: true,
    votedAt: '2026-11-01 08:31:14',
    ballotHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'
  },
  {
    id: 'vtr_4',
    voterCardId: 'VTR-44288',
    pin: '6619',
    fullName: 'Julian Hayes',
    department: 'Economics & Public Policy',
    hasVoted: false
  },
  {
    id: 'vtr_5',
    voterCardId: 'VTR-12903',
    pin: '5512',
    fullName: 'Kendra Washington',
    department: 'Mechanical Engineering',
    hasVoted: false
  }
];

export const INITIAL_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: 'aud_1',
    timestamp: '2026-11-01 08:00:00',
    eventType: 'RESET',
    details: 'Election terminal #04 initialized. Zero votes in ballot registry.',
    operator: 'Election Commissioner Admin (ID: ADM-01)',
    hash: 'a1b2c3d4e5f67890123456789abcdef0123456789abcdef0123456789abcdef0'
  },
  {
    id: 'aud_2',
    timestamp: '2026-11-01 08:02:15',
    eventType: 'SYSTEM_LOCK',
    details: 'Hardware security module (HSM) verified. Cryptographic seed key active.',
    operator: 'System Security Daemon',
    hash: 'b2c3d4e5f6a17890123456789abcdef0123456789abcdef0123456789abcdef1'
  },
  {
    id: 'aud_3',
    timestamp: '2026-11-01 08:31:14',
    eventType: 'BALLOT_CAST',
    details: 'Encrypted ballot receipt generated for Voter VTR-99451 (4 races submitted).',
    operator: 'Voter Terminal UI (One-Click Dispatcher)',
    hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'
  }
];
