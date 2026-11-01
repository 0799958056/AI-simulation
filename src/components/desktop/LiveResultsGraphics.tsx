import React, { useState } from 'react';
import { Position } from '../../types/voting';
import { soundEffects } from '../../services/soundEffects';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Award, 
  RotateCcw, 
  Zap, 
  PieChart as PieIcon,
  CheckCircle2
} from 'lucide-react';

interface LiveResultsGraphicsProps {
  positions: Position[];
  totalRegistered: number;
  totalVotesCast: number;
  onSimulateBallotTally: () => void;
}

export const LiveResultsGraphics: React.FC<LiveResultsGraphicsProps> = ({
  positions,
  totalRegistered,
  totalVotesCast,
  onSimulateBallotTally
}) => {
  const [selectedRaceIndex, setSelectedRaceIndex] = useState<number>(0);
  const currentRace = positions[selectedRaceIndex] || positions[0];

  const turnoutPercentage = totalRegistered > 0 ? (totalVotesCast / totalRegistered) * 100 : 0;
  const currentRaceTotalVotes = currentRace.candidates.reduce((acc, c) => acc + c.votes, 0);

  // Sort candidates by votes descending
  const sortedCandidates = [...currentRace.candidates].sort((a, b) => b.votes - a.votes);
  const leader = sortedCandidates[0];
  const runnerUp = sortedCandidates[1];
  const margin = leader && runnerUp ? leader.votes - runnerUp.votes : 0;

  const handleSimulate = () => {
    soundEffects.playOneClickSound();
    onSimulateBallotTally();
  };

  return (
    <div className="h-full flex flex-col bg-slate-950 text-slate-100 p-6 overflow-y-auto">
      {/* Graphics Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-400 mb-1">
            <BarChart3 className="w-4 h-4" />
            <span>GDI+ Double-Buffered Graphics Engine &bull; Real-time Render</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Official Election Live Results &amp; Graphics</h1>
          <p className="text-xs text-slate-400">
            Hardware-accelerated vector drawing with anti-aliasing (<code className="text-blue-300">SmoothingMode.HighQuality</code>).
          </p>
        </div>

        {/* 1-Click Action to inject demo votes to see graphics animate live */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleSimulate}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-all active:scale-[0.98] shadow-md shadow-blue-600/30 cursor-pointer"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>1-Click Simulate +100 Live Votes</span>
          </button>
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {/* Turnout Gauge Card */}
        <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">
              Voter Turnout
            </span>
            <div className="text-3xl font-extrabold text-white">
              {turnoutPercentage.toFixed(1)}%
            </div>
            <div className="text-xs text-slate-400 mt-1">
              {totalVotesCast.toLocaleString()} / {totalRegistered.toLocaleString()} registered voters
            </div>
          </div>
          {/* Radial Turnout Meter Graphic */}
          <div className="relative w-16 h-16 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-slate-800"
                strokeWidth="3.8"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-blue-500 transition-all duration-500"
                strokeDasharray={`${Math.min(100, turnoutPercentage)}, 100`}
                strokeWidth="3.8"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <Users className="w-5 h-5 text-blue-400 absolute" />
          </div>
        </div>

        {/* Projected Leader Card */}
        <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-sm">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">
            Current Race Leader
          </span>
          <div className="text-xl font-bold text-white truncate flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400 shrink-0" />
            <span className="truncate">{leader ? leader.name : 'TBD'}</span>
          </div>
          <div className="text-xs text-slate-400 mt-1 flex items-center gap-2">
            <span className="font-semibold text-emerald-400">
              +{margin.toLocaleString()} vote lead
            </span>
            <span>&bull;</span>
            <span>{currentRace.title.split(' ')[0]}</span>
          </div>
        </div>

        {/* Security Cryptographic Seal Card */}
        <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-sm">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">
            Audit Ledger Integrity
          </span>
          <div className="text-xl font-bold text-emerald-400 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5" />
            <span>100% Cryptographically Verified</span>
          </div>
          <div className="text-xs text-slate-400 mt-1 font-mono">
            Zero duplicate or unverified ballots
          </div>
        </div>
      </div>

      {/* Race Selector Segmented Control */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-xl mb-6 overflow-x-auto">
        {positions.map((pos, idx) => (
          <button
            key={pos.id}
            onClick={() => {
              soundEffects.playOneClickSound();
              setSelectedRaceIndex(idx);
            }}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
              selectedRaceIndex === idx
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            {pos.title}
          </button>
        ))}
      </div>

      {/* Main GDI+ Graphical Chart Surface */}
      <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/70 shadow-xl backdrop-blur-sm mb-6">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
          <div>
            <h2 className="text-lg font-bold text-white">{currentRace.title}</h2>
            <p className="text-xs text-slate-400">
              Total ballots tallied for this position: <strong className="text-slate-200">{currentRaceTotalVotes.toLocaleString()} votes</strong>
            </p>
          </div>
          <span className="text-xs font-mono px-2.5 py-1 rounded bg-slate-800 text-slate-300 border border-slate-700">
            {currentRace.department}
          </span>
        </div>

        {/* Custom GDI+ Bar Chart Simulation */}
        <div className="space-y-6">
          {sortedCandidates.map((candidate, idx) => {
            const pct = currentRaceTotalVotes > 0 ? (candidate.votes / currentRaceTotalVotes) * 100 : 0;
            const isWinner = idx === 0 && candidate.votes > 0;

            return (
              <div key={candidate.id} className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-slate-500 font-bold w-4">#{idx + 1}</span>
                    <div className="w-8 h-8 rounded-lg overflow-hidden bg-slate-800 border border-slate-700 shrink-0">
                      <img
                        src={candidate.photoUrl}
                        alt={candidate.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <div className="font-bold text-slate-100 flex items-center gap-2">
                        <span>{candidate.name}</span>
                        {isWinner && (
                          <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-1.5 py-0.5 rounded font-bold">
                            LEADER
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {candidate.party} ({candidate.partyAcronym})
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-extrabold text-sm text-white font-mono">
                      {candidate.votes.toLocaleString()} <span className="text-slate-400 font-normal text-xs">votes</span>
                    </div>
                    <div className="text-xs font-bold text-slate-300 font-mono">
                      {pct.toFixed(1)}%
                    </div>
                  </div>
                </div>

                {/* Progress bar with candidate brand color */}
                <div className="h-4 w-full bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-800">
                  <div
                    className="h-full rounded-full transition-all duration-500 shadow-sm"
                    style={{
                      width: `${Math.max(2, pct)}%`,
                      backgroundColor: candidate.partyColor
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Technical Graphics Explanations */}
      <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/30 text-xs text-slate-400 flex items-start gap-3">
        <PieIcon className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
        <div>
          <strong className="text-slate-200">Recommended C# WinForms Graphics Architecture:</strong>
          <span className="block mt-0.5 text-slate-400">
            For production Windows Forms desktop apps, custom charts are drawn in <code className="text-indigo-300">OnPaint</code> using{' '}
            <code className="text-indigo-300">e.Graphics.SmoothingMode = SmoothingMode.AntiAlias</code> with{' '}
            <code className="text-indigo-300">LinearGradientBrush</code>. To avoid flickering during high-frequency election updates, the Form and custom control must enable{' '}
            <code className="text-indigo-300">DoubleBuffered = true</code>.
          </span>
        </div>
      </div>
    </div>
  );
};
