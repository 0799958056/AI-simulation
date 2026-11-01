import React, { useState } from 'react';
import { 
  Position, 
  Voter, 
  VoteSelection, 
  CastBallotReceipt,
  AuditLogEntry 
} from '../../types/voting';
import { INITIAL_POSITIONS, INITIAL_VOTERS, INITIAL_AUDIT_LOGS } from '../../data/initialElectionData';
import { MenuBar } from './MenuBar';
import { VoterTerminal } from './VoterTerminal';
import { LiveResultsGraphics } from './LiveResultsGraphics';
import { AdminAuditConsole } from './AdminAuditConsole';
import { ReceiptModal } from './ReceiptModal';
import { CodeExplorer } from '../csharp/CodeExplorer';
import { OneClickLab } from '../lab/OneClickLab';
import { ControlsShowcase } from '../controls/ControlsShowcase';
import { soundEffects } from '../../services/soundEffects';
import { 
  Shield, 
  Minus, 
  Square, 
  X, 
  Vote, 
  BarChart2, 
  ShieldCheck, 
  Code, 
  Zap, 
  Boxes,
  Lock,
  Wifi
} from 'lucide-react';

export const DesktopFrame: React.FC = () => {
  // Navigation
  const [activeTab, setActiveTab] = useState<'terminal' | 'results' | 'admin' | 'code' | 'lab' | 'controls'>('terminal');

  // Election State
  const [positions, setPositions] = useState<Position[]>(INITIAL_POSITIONS);
  const [voters, setVoters] = useState<Voter[]>(INITIAL_VOTERS);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(INITIAL_AUDIT_LOGS);
  const [activeReceipt, setActiveReceipt] = useState<CastBallotReceipt | null>(null);
  const [isStationLocked, setIsStationLocked] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [isMaximized, setIsMaximized] = useState<boolean>(false);

  // Compute stats
  const totalVotesCast = voters.filter((v) => v.hasVoted).length;
  const totalRegistered = voters.length;

  // Toggle Sound
  const handleToggleSound = () => {
    const nextState = !soundEnabled;
    setSoundEnabled(nextState);
    soundEffects.setSoundEnabled(nextState);
    if (nextState) {
      soundEffects.playOneClickSound();
    }
  };

  // Ballot Cast Handler
  const handleCastBallot = (receipt: CastBallotReceipt, voterId: string, selections: VoteSelection[]) => {
    // 1. Mark voter as voted
    setVoters((prev) =>
      prev.map((v) =>
        v.id === voterId
          ? {
              ...v,
              hasVoted: true,
              votedAt: receipt.timestamp,
              ballotHash: receipt.ballotHash
            }
          : v
      )
    );

    // 2. Increment candidate votes
    setPositions((prev) =>
      prev.map((pos) => {
        const sel = selections.find((s) => s.positionId === pos.id);
        if (!sel) return pos;

        return {
          ...pos,
          candidates: pos.candidates.map((c) =>
            c.id === sel.candidateId ? { ...c, votes: c.votes + 1 } : c
          )
        };
      })
    );

    // 3. Show receipt modal
    setActiveReceipt(receipt);
  };

  // Simulate Influx of Votes for live graphics
  const handleSimulateVotes = () => {
    setPositions((prev) =>
      prev.map((pos) => ({
        ...pos,
        candidates: pos.candidates.map((c) => ({
          ...c,
          votes: c.votes + Math.floor(15 + Math.random() * 45)
        }))
      }))
    );

    const randomHash = Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    setAuditLogs((prev) => [
      {
        id: `aud_${Date.now()}`,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        eventType: 'RESULTS_EXPORT',
        details: 'Batch encrypted ballot tally synchronization (+100 simulated votes).',
        operator: 'Batch Precinct Aggregator',
        hash: randomHash
      },
      ...prev
    ]);
  };

  // Reset Election
  const handleResetElection = () => {
    setPositions(INITIAL_POSITIONS);
    setVoters(INITIAL_VOTERS.map((v) => ({ ...v, hasVoted: false, votedAt: undefined, ballotHash: undefined })));
    setAuditLogs([
      {
        id: `aud_${Date.now()}`,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        eventType: 'RESET',
        details: 'Full ballot registry reset to zero. Initialized by Admin.',
        operator: 'Election Commissioner',
        hash: '0000000000000000000000000000000000000000000000000000000000000000'
      }
    ]);
  };

  // Toggle voter eligibility
  const handleToggleVoter = (voterId: string) => {
    setVoters((prev) =>
      prev.map((v) => (v.id === voterId ? { ...v, hasVoted: !v.hasVoted } : v))
    );
  };

  // Add audit log
  const handleAddAuditLog = (entry: Omit<AuditLogEntry, 'id' | 'timestamp'>) => {
    setAuditLogs((prev) => [
      {
        id: `aud_${Date.now()}`,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        ...entry
      },
      ...prev
    ]);
  };

  return (
    <div className={`min-h-screen bg-slate-950 p-2 sm:p-4 flex flex-col justify-center items-center font-sans ${isMaximized ? 'p-0!' : ''}`}>
      {/* Desktop Window Container */}
      <div className={`w-full max-w-7xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl flex flex-col overflow-hidden ${
        isMaximized ? 'h-screen rounded-none border-none' : 'h-[92vh]'
      }`}>
        {/* Windows 11 Form Title Bar */}
        <div className="bg-slate-900 border-b border-slate-800 px-4 py-2.5 flex items-center justify-between select-none">
          {/* Left: Window Icon & Title */}
          <div className="flex items-center gap-3">
            <div className="h-6 w-6 rounded bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-sm">
              <Shield className="w-3.5 h-3.5" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-100 tracking-tight">
                ElectraDesk v3.4 &bull; C# Windows Forms Voting Station [Terminal #04]
              </span>
              <span className="text-[10px] bg-blue-500/20 text-blue-300 border border-blue-500/30 px-2 py-0.2 rounded font-mono">
                STAThread &bull; HighDpi
              </span>
            </div>
          </div>

          {/* Right: Window Controls */}
          <div className="flex items-center gap-1 -mr-1">
            <button
              onClick={() => soundEffects.playOneClickSound()}
              className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
              title="Minimize"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => {
                soundEffects.playOneClickSound();
                setIsMaximized(!isMaximized);
              }}
              className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
              title={isMaximized ? 'Restore' : 'Maximize'}
            >
              <Square className="w-3 h-3" />
            </button>
            <button
              onClick={() => soundEffects.playOneClickSound()}
              className="p-1.5 rounded hover:bg-rose-600 text-slate-400 hover:text-white transition-colors"
              title="Close Station"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* MenuStrip */}
        <MenuBar
          onResetElection={handleResetElection}
          onOpenAudit={() => setActiveTab('admin')}
          onSwitchView={(v) => setActiveTab(v)}
          soundEnabled={soundEnabled}
          onToggleSound={handleToggleSound}
        />

        {/* Desktop View Navigation Tabs (WinForms TabControl) */}
        <div className="bg-slate-900/90 border-b border-slate-800 px-3 pt-1 flex items-center gap-1 select-none overflow-x-auto">
          <button
            onClick={() => {
              soundEffects.playOneClickSound();
              setActiveTab('terminal');
            }}
            className={`px-3 py-2 text-xs font-semibold flex items-center gap-2 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'terminal'
                ? 'border-blue-500 text-white bg-slate-800/80 rounded-t-lg'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <Vote className="w-3.5 h-3.5 text-blue-400" />
            <span>Voter Kiosk Terminal</span>
          </button>

          <button
            onClick={() => {
              soundEffects.playOneClickSound();
              setActiveTab('results');
            }}
            className={`px-3 py-2 text-xs font-semibold flex items-center gap-2 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'results'
                ? 'border-blue-500 text-white bg-slate-800/80 rounded-t-lg'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <BarChart2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Live GDI+ Results &amp; Charts</span>
          </button>

          <button
            onClick={() => {
              soundEffects.playOneClickSound();
              setActiveTab('admin');
            }}
            className={`px-3 py-2 text-xs font-semibold flex items-center gap-2 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'admin'
                ? 'border-blue-500 text-white bg-slate-800/80 rounded-t-lg'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
            <span>Admin &amp; Security Console</span>
          </button>

          <button
            onClick={() => {
              soundEffects.playOneClickSound();
              setActiveTab('code');
            }}
            className={`px-3 py-2 text-xs font-semibold flex items-center gap-2 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'code'
                ? 'border-blue-500 text-white bg-slate-800/80 rounded-t-lg'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <Code className="w-3.5 h-3.5 text-indigo-400" />
            <span>Visual Studio C# Code</span>
          </button>

          <button
            onClick={() => {
              soundEffects.playOneClickSound();
              setActiveTab('lab');
            }}
            className={`px-3 py-2 text-xs font-semibold flex items-center gap-2 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'lab'
                ? 'border-blue-500 text-white bg-slate-800/80 rounded-t-lg'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>1-Click Button Diagnostics Lab</span>
          </button>

          <button
            onClick={() => {
              soundEffects.playOneClickSound();
              setActiveTab('controls');
            }}
            className={`px-3 py-2 text-xs font-semibold flex items-center gap-2 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'controls'
                ? 'border-blue-500 text-white bg-slate-800/80 rounded-t-lg'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <Boxes className="w-3.5 h-3.5 text-teal-400" />
            <span>Controls &amp; Graphics Catalog</span>
          </button>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-hidden relative">
          {isStationLocked && activeTab !== 'admin' ? (
            <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm z-30 flex flex-col items-center justify-center p-6 text-center">
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 mb-4 shadow-xl">
                <Lock className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-bold text-white mb-2">Voting Station Locked</h2>
              <p className="text-xs text-slate-400 max-w-sm mb-5">
                The election commissioner has paused active voting. Please contact the precinct supervisor.
              </p>
              <button
                onClick={() => setActiveTab('admin')}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold border border-slate-700 cursor-pointer"
              >
                Go to Admin Security Console to Unlock
              </button>
            </div>
          ) : null}

          {activeTab === 'terminal' && (
            <VoterTerminal
              positions={positions}
              voters={voters}
              onCastBallot={handleCastBallot}
              onAddAuditLog={handleAddAuditLog}
            />
          )}

          {activeTab === 'results' && (
            <LiveResultsGraphics
              positions={positions}
              totalRegistered={totalRegistered}
              totalVotesCast={totalVotesCast}
              onSimulateBallotTally={handleSimulateVotes}
            />
          )}

          {activeTab === 'admin' && (
            <AdminAuditConsole
              voters={voters}
              auditLogs={auditLogs}
              onResetElection={handleResetElection}
              onToggleVoterStatus={handleToggleVoter}
              isLocked={isStationLocked}
              onToggleLock={() => setIsStationLocked(!isStationLocked)}
            />
          )}

          {activeTab === 'code' && <CodeExplorer />}

          {activeTab === 'lab' && <OneClickLab />}

          {activeTab === 'controls' && <ControlsShowcase />}
        </div>

        {/* Windows StatusStrip */}
        <div className="bg-slate-900 border-t border-slate-800 px-4 py-1.5 flex items-center justify-between text-[11px] text-slate-400 select-none">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Kiosk Station Ready
            </span>
            <span className="text-slate-600">|</span>
            <span>
              Turnout: <strong className="text-white">{totalVotesCast} / {totalRegistered}</strong> voters ({((totalVotesCast / totalRegistered) * 100).toFixed(1)}%)
            </span>
            <span className="text-slate-600">|</span>
            <span>Button Dispatch: <strong className="text-emerald-400">1-Click Immediate (0ms Debounce Delay)</strong></span>
          </div>

          <div className="flex items-center gap-3 font-mono text-[10px]">
            <span className="flex items-center gap-1 text-slate-400">
              <Wifi className="w-3 h-3 text-emerald-400" />
              HSM Local Isolated
            </span>
            <span className="text-slate-600">|</span>
            <span>UTF-8 / SHA-256</span>
          </div>
        </div>
      </div>

      {/* Ballot Receipt Modal */}
      <ReceiptModal
        receipt={activeReceipt}
        onClose={() => setActiveReceipt(null)}
      />
    </div>
  );
};
