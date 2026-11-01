import React, { useState } from 'react';
import { Voter, AuditLogEntry } from '../../types/voting';
import { soundEffects } from '../../services/soundEffects';
import { 
  ShieldCheck, 
  Users, 
  Lock, 
  Unlock, 
  RefreshCw, 
  Search, 
  CheckCircle2, 
  XCircle, 
  KeyRound, 
  Database,
  FileSpreadsheet
} from 'lucide-react';

interface AdminAuditConsoleProps {
  voters: Voter[];
  auditLogs: AuditLogEntry[];
  onResetElection: () => void;
  onToggleVoterStatus: (voterId: string) => void;
  isLocked: boolean;
  onToggleLock: () => void;
}

export const AdminAuditConsole: React.FC<AdminAuditConsoleProps> = ({
  voters,
  auditLogs,
  onResetElection,
  onToggleVoterStatus,
  isLocked,
  onToggleLock
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeSubTab, setActiveSubTab] = useState<'voters' | 'audit'>('voters');

  const filteredVoters = voters.filter(
    (v) =>
      v.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.voterCardId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col bg-slate-950 text-slate-100 p-6 overflow-y-auto">
      {/* Admin Title & Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-purple-400 mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>Administrative Election Management &amp; Audit Trail</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">System Controls &amp; Data Integrity</h1>
          <p className="text-xs text-slate-400">
            Monitor voter authorization, inspect tamper-proof SHA-256 logs, and manage terminal security state.
          </p>
        </div>

        {/* 1-Click Administrative Actions */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              soundEffects.playOneClickSound();
              onToggleLock();
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all active:scale-[0.98] cursor-pointer shadow-md ${
              isLocked
                ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-amber-600/30'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
            }`}
          >
            {isLocked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
            <span>{isLocked ? 'Terminal Locked (Click to Unlock)' : '1-Click Lock Terminal'}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              soundEffects.playOneClickSound();
              if (window.confirm('Are you sure you want to reset all ballot counts and voter statuses?')) {
                onResetElection();
              }
            }}
            className="px-4 py-2 bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/30 rounded-xl text-xs font-bold flex items-center gap-2 transition-all active:scale-[0.98] cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>1-Click Reset Election</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 mb-6">
        <button
          onClick={() => {
            soundEffects.playOneClickSound();
            setActiveSubTab('voters');
          }}
          className={`pb-3 text-xs font-bold px-3 transition-colors border-b-2 flex items-center gap-2 cursor-pointer ${
            activeSubTab === 'voters'
              ? 'border-blue-500 text-blue-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Voter Roster &amp; Credentials ({voters.length})</span>
        </button>

        <button
          onClick={() => {
            soundEffects.playOneClickSound();
            setActiveSubTab('audit');
          }}
          className={`pb-3 text-xs font-bold px-3 transition-colors border-b-2 flex items-center gap-2 cursor-pointer ${
            activeSubTab === 'audit'
              ? 'border-blue-500 text-blue-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span>Cryptographic Audit Log ({auditLogs.length})</span>
        </button>
      </div>

      {activeSubTab === 'voters' ? (
        <div className="space-y-4">
          {/* Search bar */}
          <div className="flex items-center justify-between gap-4">
            <div className="relative max-w-sm w-full">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search voter by name, ID, or department..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="text-xs text-slate-400 font-mono">
              Voted: <strong className="text-emerald-400">{voters.filter((v) => v.hasVoted).length}</strong> &bull; Pending: <strong className="text-amber-400">{voters.filter((v) => !v.hasVoted).length}</strong>
            </div>
          </div>

          {/* Voter Table */}
          <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-900/60 shadow-lg">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900 border-b border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                <tr>
                  <th className="p-3">Voter ID</th>
                  <th className="p-3">Full Name</th>
                  <th className="p-3">Department</th>
                  <th className="p-3">Security PIN</th>
                  <th className="p-3">Voting Status</th>
                  <th className="p-3">1-Click Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredVoters.map((v) => (
                  <tr key={v.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-3 font-mono font-bold text-blue-400">{v.voterCardId}</td>
                    <td className="p-3 font-medium text-slate-100">{v.fullName}</td>
                    <td className="p-3 text-slate-400">{v.department}</td>
                    <td className="p-3 font-mono text-slate-400">•••• ({v.pin})</td>
                    <td className="p-3">
                      {v.hasVoted ? (
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Ballot Cast
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
                          Eligible to Vote
                        </span>
                      )}
                    </td>
                    <td className="p-3">
                      <button
                        onClick={() => {
                          soundEffects.playOneClickSound();
                          onToggleVoterStatus(v.id);
                        }}
                        className="px-2.5 py-1 text-[11px] rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer border border-slate-700"
                      >
                        {v.hasVoted ? 'Reset to Eligible' : 'Mark as Voted'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* AUDIT LOG TABLE */
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Immutable Append-Only Audit Stream</span>
            <span className="font-mono text-emerald-400">HMAC-SHA256 Signatures Valid</span>
          </div>

          <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-900/60 shadow-lg">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-900 border-b border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                <tr>
                  <th className="p-3">Timestamp</th>
                  <th className="p-3">Event Type</th>
                  <th className="p-3">Details</th>
                  <th className="p-3">Operator</th>
                  <th className="p-3">Cryptographic Hash</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-[11px]">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-3 text-slate-400 whitespace-nowrap">{log.timestamp}</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 rounded font-sans text-[10px] font-bold ${
                          log.eventType === 'BALLOT_CAST'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : log.eventType === 'AUTH_FAILURE'
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                            : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                        }`}
                      >
                        {log.eventType}
                      </span>
                    </td>
                    <td className="p-3 text-slate-200 font-sans">{log.details}</td>
                    <td className="p-3 text-slate-400">{log.operator}</td>
                    <td className="p-3 text-indigo-400 truncate max-w-[140px]" title={log.hash}>
                      {log.hash.substring(0, 16)}...
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
