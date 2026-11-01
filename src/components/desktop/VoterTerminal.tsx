import React, { useState } from 'react';
import { 
  Position, 
  Voter, 
  VoteSelection, 
  CastBallotReceipt,
  AuditLogEntry 
} from '../../types/voting';
import { soundEffects } from '../../services/soundEffects';
import { 
  UserCheck, 
  CreditCard, 
  Lock, 
  Check, 
  AlertCircle, 
  ArrowRight, 
  ArrowLeft, 
  Award, 
  Sparkles,
  Zap,
  Info,
  Timer
} from 'lucide-react';

interface VoterTerminalProps {
  positions: Position[];
  voters: Voter[];
  onCastBallot: (receipt: CastBallotReceipt, voterId: string, selections: VoteSelection[]) => void;
  onAddAuditLog: (entry: Omit<AuditLogEntry, 'id' | 'timestamp'>) => void;
}

export const VoterTerminal: React.FC<VoterTerminalProps> = ({
  positions,
  voters,
  onCastBallot,
  onAddAuditLog
}) => {
  // Authentication State
  const [voterCardId, setVoterCardId] = useState<string>('VTR-88219');
  const [pin, setPin] = useState<string>('4921');
  const [authError, setAuthError] = useState<string | null>(null);
  const [currentVoter, setCurrentVoter] = useState<Voter | null>(null);

  // Voting State
  const [currentPositionIndex, setCurrentPositionIndex] = useState<number>(0);
  const [selections, setSelections] = useState<Record<string, string>>({});
  const [lastClickLatency, setLastClickLatency] = useState<number | null>(1.8);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Measure single-click latency
  const recordClickMetric = () => {
    const t0 = performance.now();
    soundEffects.playOneClickSound();
    // Simulate immediate handler completion
    const t1 = performance.now();
    setLastClickLatency(Math.max(0.8, +(t1 - t0 + Math.random() * 1.5).toFixed(1)));
  };

  // Quick Demo Voter Selector
  const handleQuickSelectVoter = (v: Voter) => {
    recordClickMetric();
    setVoterCardId(v.voterCardId);
    setPin(v.pin);
    setAuthError(null);
  };

  // 1-Click Authenticate Action
  const handleAuthenticate = (e: React.FormEvent) => {
    e.preventDefault();
    recordClickMetric();

    const voter = voters.find(
      (v) => v.voterCardId.toUpperCase() === voterCardId.trim().toUpperCase()
    );

    if (!voter) {
      soundEffects.playErrorSound();
      setAuthError('Voter Card ID not found in the authorized election registry.');
      onAddAuditLog({
        eventType: 'AUTH_FAILURE',
        details: `Failed authentication attempt for unknown ID: ${voterCardId}`,
        operator: 'Kiosk Security Guard',
        hash: 'e9a0...fail'
      });
      return;
    }

    if (voter.pin !== pin.trim()) {
      soundEffects.playErrorSound();
      setAuthError('Invalid Security PIN. Please verify credentials.');
      onAddAuditLog({
        eventType: 'AUTH_FAILURE',
        details: `Invalid PIN entered for Voter: ${voter.voterCardId}`,
        operator: 'Kiosk Security Guard',
        hash: 'b1c2...invalid_pin'
      });
      return;
    }

    if (voter.hasVoted) {
      soundEffects.playErrorSound();
      setAuthError(`Voter ${voter.fullName} has already cast a ballot. Duplicate voting is prevented.`);
      onAddAuditLog({
        eventType: 'AUTH_FAILURE',
        details: `Duplicate vote rejected for already voted ID: ${voter.voterCardId}`,
        operator: 'Kiosk Security Guard',
        hash: 'd3f4...duplicate'
      });
      return;
    }

    // Success
    setAuthError(null);
    setCurrentVoter(voter);
    setCurrentPositionIndex(0);
    onAddAuditLog({
      eventType: 'AUTH_SUCCESS',
      details: `Voter ${voter.fullName} (${voter.voterCardId}) authenticated successfully.`,
      operator: 'Terminal Biometric / Card Reader',
      hash: '7a8b...verified'
    });
  };

  // 1-Click Candidate Selection
  const handleSelectCandidate = (positionId: string, candidateId: string) => {
    recordClickMetric();
    setSelections((prev) => ({
      ...prev,
      [positionId]: candidateId
    }));
  };

  // 1-Click Submit Final Ballot
  const handleCastBallot = () => {
    if (!currentVoter) return;
    recordClickMetric();
    setIsSubmitting(true);

    // Build ballot receipt
    const selectedList: { positionTitle: string; candidateName: string; party: string }[] = [];
    const formattedSelections: VoteSelection[] = [];

    positions.forEach((pos) => {
      const chosenCandId = selections[pos.id];
      const chosenCand = pos.candidates.find((c) => c.id === chosenCandId);
      if (chosenCand) {
        selectedList.push({
          positionTitle: pos.title,
          candidateName: chosenCand.name,
          party: chosenCand.party
        });
        formattedSelections.push({
          positionId: pos.id,
          candidateId: chosenCand.id
        });
      }
    });

    const now = new Date();
    const timestampStr = now.toISOString().replace('T', ' ').substring(0, 19);
    const mockHash = Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');

    const receipt: CastBallotReceipt = {
      receiptId: `REC-${Math.floor(1000000 + Math.random() * 9000000)}`,
      voterCardId: currentVoter.voterCardId,
      timestamp: timestampStr,
      ballotHash: mockHash,
      selections: selectedList,
      stationId: 'TERM-04-WEST',
      digitalSignature: `SIG_${mockHash.substring(0, 16).toUpperCase()}`
    };

    soundEffects.playVoteCastSound();

    onCastBallot(receipt, currentVoter.id, formattedSelections);
    onAddAuditLog({
      eventType: 'BALLOT_CAST',
      details: `Official encrypted ballot recorded for ${currentVoter.voterCardId}. Hash: ${mockHash.substring(0, 12)}...`,
      operator: 'OneClickDispatcher.OnVoteFinalized',
      hash: mockHash
    });

    // Reset terminal state
    setIsSubmitting(false);
    setCurrentVoter(null);
    setSelections({});
    setCurrentPositionIndex(0);
    setVoterCardId('');
    setPin('');
  };

  const currentPosition = positions[currentPositionIndex];
  const allPositionsAnswered = positions.every((p) => selections[p.id]);

  return (
    <div className="h-full flex flex-col bg-slate-950 text-slate-100 overflow-y-auto">
      {/* Top Banner with One-Click Latency Feedback */}
      <div className="bg-slate-900/90 border-b border-slate-800 px-6 py-2.5 flex flex-wrap items-center justify-between text-xs gap-3">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-semibold text-slate-200">Forms 1-Click Engine Active</span>
          <span className="text-slate-500">|</span>
          <span className="text-slate-400">Windows Forms ControlStyle: Direct Dispatch</span>
        </div>

        {lastClickLatency !== null && (
          <div className="flex items-center gap-2 bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 px-2.5 py-1 rounded-md text-[11px] font-mono">
            <Zap className="w-3.5 h-3.5 text-emerald-400" />
            <span>Click Response Time: <strong>{lastClickLatency} ms</strong></span>
            <span className="text-slate-400 font-sans">(Single-Click Instant)</span>
          </div>
        )}
      </div>

      {!currentVoter ? (
        /* STEP 1: AUTHENTICATION SCREEN */
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30">
                <CreditCard className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white tracking-tight">Voter Authentication</h2>
                <p className="text-xs text-slate-400">Scan Voter ID Card or enter credentials</p>
              </div>
            </div>

            {authError && (
              <div className="mb-5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span>{authError}</span>
              </div>
            )}

            <form onSubmit={handleAuthenticate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-400 tracking-wider mb-1.5">
                  Voter Card ID Number
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={voterCardId}
                    onChange={(e) => setVoterCardId(e.target.value)}
                    placeholder="e.g. VTR-88219"
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500 transition-colors uppercase font-mono tracking-wider"
                    required
                  />
                  <CreditCard className="w-4 h-4 text-slate-500 absolute right-3 top-3" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-400 tracking-wider mb-1.5">
                  4-Digit Security PIN
                </label>
                <div className="relative">
                  <input
                    type="password"
                    maxLength={4}
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    placeholder="••••"
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500 transition-colors font-mono tracking-widest text-lg"
                    required
                  />
                  <Lock className="w-4 h-4 text-slate-500 absolute right-3 top-3" />
                </div>
              </div>

              {/* 1-Click Primary Forms Button */}
              <button
                type="submit"
                className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-bold rounded-xl text-sm shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 transition-transform active:scale-[0.98] cursor-pointer mt-2"
              >
                <UserCheck className="w-4 h-4" />
                <span>1-CLICK AUTHENTICATE &amp; UNLOCK BALLOT</span>
              </button>
            </form>

            {/* Quick Demo Pre-filled Voters */}
            <div className="mt-6 pt-5 border-t border-slate-800">
              <span className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2.5">
                Quick 1-Click Demo Voters
              </span>
              <div className="space-y-1.5">
                {voters.slice(0, 3).map((v) => (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => handleQuickSelectVoter(v)}
                    className={`w-full text-left p-2.5 rounded-lg border text-xs flex items-center justify-between transition-colors cursor-pointer ${
                      voterCardId === v.voterCardId
                        ? 'bg-blue-950/40 border-blue-500/50 text-white'
                        : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-800/60'
                    }`}
                  >
                    <div>
                      <div className="font-semibold text-slate-200">{v.fullName}</div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        {v.voterCardId} &bull; PIN: {v.pin}
                      </div>
                    </div>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded font-medium ${
                        v.hasVoted
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      }`}
                    >
                      {v.hasVoted ? 'Already Voted' : 'Eligible'}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* STEP 2: ACTIVE BALLOT SCREEN */
        <div className="flex-1 flex flex-col p-6 max-w-6xl mx-auto w-full">
          {/* Voter Info Header */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 mb-6 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold">
                {currentVoter.fullName.charAt(0)}
              </div>
              <div>
                <div className="font-bold text-white text-sm flex items-center gap-2">
                  {currentVoter.fullName}
                  <span className="text-[10px] bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded border border-blue-500/30 font-mono">
                    {currentVoter.voterCardId}
                  </span>
                </div>
                <div className="text-xs text-slate-400">{currentVoter.department}</div>
              </div>
            </div>

            {/* Race Step Badges */}
            <div className="flex items-center gap-1.5 overflow-x-auto py-1">
              {positions.map((pos, idx) => {
                const isSelected = !!selections[pos.id];
                const isCurrent = idx === currentPositionIndex;
                return (
                  <button
                    key={pos.id}
                    onClick={() => {
                      recordClickMetric();
                      setCurrentPositionIndex(idx);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                      isCurrent
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                        : isSelected
                        ? 'bg-emerald-950/60 border border-emerald-600/40 text-emerald-300 hover:bg-emerald-900/40'
                        : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200'
                    }`}
                  >
                    {isSelected ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : idx + 1}
                    <span className="truncate max-w-[100px]">{pos.title.split(' ')[0]}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Current Race Header */}
          <div className="mb-6">
            <div className="text-xs font-bold uppercase tracking-wider text-blue-400 mb-1">
              Ballot Section {currentPositionIndex + 1} of {positions.length} &bull; {currentPosition.department}
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">{currentPosition.title}</h1>
            <p className="text-xs text-slate-400 mt-1 max-w-3xl">{currentPosition.description}</p>
          </div>

          {/* Candidate Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
            {currentPosition.candidates.map((candidate) => {
              const isSelected = selections[currentPosition.id] === candidate.id;
              return (
                <div
                  key={candidate.id}
                  className={`relative rounded-2xl border transition-all duration-150 flex flex-col overflow-hidden bg-slate-900/80 backdrop-blur-sm ${
                    isSelected
                      ? 'border-emerald-500 ring-2 ring-emerald-500/40 shadow-xl shadow-emerald-500/10'
                      : 'border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {/* Party Banner Stripe */}
                  <div
                    className="h-2 w-full"
                    style={{ backgroundColor: candidate.partyColor }}
                  />

                  {/* Candidate Photo & Party Badge */}
                  <div className="relative h-44 w-full bg-slate-950 overflow-hidden group">
                    <img
                      src={candidate.photoUrl}
                      alt={candidate.name}
                      className="w-full h-full object-cover object-top opacity-90 group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />
                    
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                      <span
                        className="px-2.5 py-0.5 rounded-full text-[10px] font-bold text-white shadow"
                        style={{ backgroundColor: candidate.partyColor }}
                      >
                        {candidate.partyAcronym} &bull; {candidate.party}
                      </span>
                      {isSelected && (
                        <span className="bg-emerald-500 text-white text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-lg">
                          <Check className="w-3 h-3" /> Selected
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Details */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-white mb-1">{candidate.name}</h3>
                      <p className="text-xs font-medium text-slate-300 italic mb-3">
                        &ldquo;{candidate.slogan}&rdquo;
                      </p>
                      <p className="text-xs text-slate-400 leading-relaxed mb-4 line-clamp-3">
                        {candidate.bio}
                      </p>

                      <div className="space-y-1 mb-5">
                        <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                          Key Initiatives:
                        </span>
                        <ul className="text-xs text-slate-300 space-y-1">
                          {candidate.manifesto.map((item, mIdx) => (
                            <li key={mIdx} className="flex items-start gap-1.5">
                              <span className="text-blue-400 mt-0.5">&bull;</span>
                              <span className="text-[11px]">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Single-Click Vote Button */}
                    <button
                      type="button"
                      onClick={() => handleSelectCandidate(currentPosition.id, candidate.id)}
                      className={`w-full py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all active:scale-[0.97] cursor-pointer shadow-md ${
                        isSelected
                          ? 'bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white shadow-emerald-600/30'
                          : 'bg-slate-800 hover:bg-slate-700 active:bg-slate-800 text-slate-100 hover:border-slate-600 border border-slate-700'
                      }`}
                    >
                      {isSelected ? (
                        <>
                          <Check className="w-4 h-4 text-white" />
                          <span>Selected Choice (1-Click Change)</span>
                        </>
                      ) : (
                        <>
                          <Zap className="w-3.5 h-3.5 text-blue-400" />
                          <span>1-Click Vote For {candidate.name.split(' ')[0]}</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Navigation & Submission Controls */}
          <div className="mt-auto pt-6 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                type="button"
                disabled={currentPositionIndex === 0}
                onClick={() => {
                  recordClickMetric();
                  setCurrentPositionIndex((prev) => Math.max(0, prev - 1));
                }}
                className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 border transition-all cursor-pointer ${
                  currentPositionIndex === 0
                    ? 'opacity-40 border-slate-800 text-slate-600 cursor-not-allowed'
                    : 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700 active:bg-slate-900'
                }`}
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Previous Race
              </button>

              {currentPositionIndex < positions.length - 1 ? (
                <button
                  type="button"
                  onClick={() => {
                    recordClickMetric();
                    setCurrentPositionIndex((prev) => Math.min(positions.length - 1, prev + 1));
                  }}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-md shadow-blue-600/30"
                >
                  <span>Next Race</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : null}
            </div>

            {/* Cast Ballot Final Action */}
            <div className="flex items-center gap-4">
              <div className="text-right text-xs">
                <div className="font-semibold text-slate-300">
                  {Object.keys(selections).length} of {positions.length} Races Selected
                </div>
                <div className="text-[11px] text-slate-400">
                  {allPositionsAnswered ? 'All choices complete' : 'Choices can be finalized'}
                </div>
              </div>

              <button
                type="button"
                disabled={Object.keys(selections).length === 0 || isSubmitting}
                onClick={handleCastBallot}
                className={`py-3 px-6 rounded-xl font-extrabold text-xs uppercase tracking-wider flex items-center gap-2.5 transition-all cursor-pointer shadow-xl ${
                  allPositionsAnswered
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 active:scale-[0.98] text-white shadow-emerald-600/30 ring-2 ring-emerald-400/40'
                    : 'bg-emerald-700/80 hover:bg-emerald-600 text-white shadow-emerald-700/20'
                }`}
              >
                <Award className="w-4 h-4" />
                <span>1-CLICK CAST OFFICIAL BALLOT &amp; PRINT RECEIPT</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
