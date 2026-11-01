import React, { useState, useRef, useEffect } from 'react';
import { 
  Shield, 
  Volume2, 
  VolumeX, 
  RefreshCw, 
  Printer, 
  Monitor, 
  Info, 
  Cpu, 
  Lock,
  ChevronDown
} from 'lucide-react';
import { soundEffects } from '../../services/soundEffects';

interface MenuBarProps {
  onResetElection: () => void;
  onOpenAudit: () => void;
  onSwitchView: (view: 'terminal' | 'results' | 'admin' | 'code' | 'lab') => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export const MenuBar: React.FC<MenuBarProps> = ({
  onResetElection,
  onOpenAudit,
  onSwitchView,
  soundEnabled,
  onToggleSound
}) => {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [highDpi, setHighDpi] = useState<string>('PerMonitorV2 (100%)');
  const [antiAliasing, setAntiAliasing] = useState<boolean>(true);
  const [showAbout, setShowAbout] = useState<boolean>(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenMenu(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMenuClick = (name: string) => {
    soundEffects.playOneClickSound();
    setOpenMenu(openMenu === name ? null : name);
  };

  return (
    <div ref={menuRef} className="bg-slate-900 border-b border-slate-800 text-xs text-slate-300 flex items-center px-3 select-none relative z-40">
      <div className="flex items-center gap-1">
        {/* File Menu */}
        <div className="relative">
          <button
            onClick={() => handleMenuClick('file')}
            className={`px-2.5 py-1.5 rounded hover:bg-slate-800 transition-colors flex items-center gap-1 ${
              openMenu === 'file' ? 'bg-slate-800 text-white' : ''
            }`}
          >
            File
          </button>
          {openMenu === 'file' && (
            <div className="absolute left-0 top-full mt-0.5 w-56 bg-slate-900 border border-slate-700 shadow-xl rounded-md py-1 z-50 text-slate-200">
              <button
                onClick={() => {
                  soundEffects.playOneClickSound();
                  onResetElection();
                  setOpenMenu(null);
                }}
                className="w-full text-left px-3 py-1.5 hover:bg-indigo-600 hover:text-white flex items-center justify-between"
              >
                <span className="flex items-center gap-2">
                  <RefreshCw className="w-3.5 h-3.5" />
                  Reset Ballot Session
                </span>
                <span className="text-[10px] text-slate-400">Ctrl+R</span>
              </button>
              <button
                onClick={() => {
                  soundEffects.playOneClickSound();
                  onOpenAudit();
                  setOpenMenu(null);
                }}
                className="w-full text-left px-3 py-1.5 hover:bg-indigo-600 hover:text-white flex items-center justify-between"
              >
                <span className="flex items-center gap-2">
                  <Printer className="w-3.5 h-3.5" />
                  Export Audit Ledger
                </span>
                <span className="text-[10px] text-slate-400">Ctrl+P</span>
              </button>
              <div className="border-t border-slate-800 my-1" />
              <button
                onClick={() => {
                  soundEffects.playOneClickSound();
                  setOpenMenu(null);
                }}
                className="w-full text-left px-3 py-1.5 hover:bg-rose-600 hover:text-white flex items-center justify-between"
              >
                <span>Exit Terminal (Simulated)</span>
                <span className="text-[10px] text-slate-400">Alt+F4</span>
              </button>
            </div>
          )}
        </div>

        {/* View Menu */}
        <div className="relative">
          <button
            onClick={() => handleMenuClick('view')}
            className={`px-2.5 py-1.5 rounded hover:bg-slate-800 transition-colors flex items-center gap-1 ${
              openMenu === 'view' ? 'bg-slate-800 text-white' : ''
            }`}
          >
            View
          </button>
          {openMenu === 'view' && (
            <div className="absolute left-0 top-full mt-0.5 w-52 bg-slate-900 border border-slate-700 shadow-xl rounded-md py-1 z-50 text-slate-200">
              <button
                onClick={() => {
                  soundEffects.playOneClickSound();
                  onSwitchView('terminal');
                  setOpenMenu(null);
                }}
                className="w-full text-left px-3 py-1.5 hover:bg-indigo-600 hover:text-white"
              >
                Voter Kiosk Terminal
              </button>
              <button
                onClick={() => {
                  soundEffects.playOneClickSound();
                  onSwitchView('results');
                  setOpenMenu(null);
                }}
                className="w-full text-left px-3 py-1.5 hover:bg-indigo-600 hover:text-white"
              >
                Real-Time GDI+ Tally Graphics
              </button>
              <button
                onClick={() => {
                  soundEffects.playOneClickSound();
                  onSwitchView('admin');
                  setOpenMenu(null);
                }}
                className="w-full text-left px-3 py-1.5 hover:bg-indigo-600 hover:text-white"
              >
                Admin &amp; Security Console
              </button>
              <div className="border-t border-slate-800 my-1" />
              <button
                onClick={() => {
                  soundEffects.playOneClickSound();
                  onSwitchView('code');
                  setOpenMenu(null);
                }}
                className="w-full text-left px-3 py-1.5 hover:bg-indigo-600 hover:text-white font-medium text-indigo-400"
              >
                Visual Studio C# Solution
              </button>
              <button
                onClick={() => {
                  soundEffects.playOneClickSound();
                  onSwitchView('lab');
                  setOpenMenu(null);
                }}
                className="w-full text-left px-3 py-1.5 hover:bg-indigo-600 hover:text-white font-medium text-emerald-400"
              >
                1-Click Button Diagnostics Lab
              </button>
            </div>
          )}
        </div>

        {/* Graphics & Controls Menu */}
        <div className="relative">
          <button
            onClick={() => handleMenuClick('controls')}
            className={`px-2.5 py-1.5 rounded hover:bg-slate-800 transition-colors flex items-center gap-1 ${
              openMenu === 'controls' ? 'bg-slate-800 text-white' : ''
            }`}
          >
            Graphics &amp; Controls
          </button>
          {openMenu === 'controls' && (
            <div className="absolute left-0 top-full mt-0.5 w-64 bg-slate-900 border border-slate-700 shadow-xl rounded-md py-1 z-50 text-slate-200">
              <div className="px-3 py-1 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                GDI+ Rendering Pipeline
              </div>
              <button
                onClick={() => {
                  soundEffects.playOneClickSound();
                  setAntiAliasing(!antiAliasing);
                }}
                className="w-full text-left px-3 py-1.5 hover:bg-indigo-600 hover:text-white flex items-center justify-between"
              >
                <span>SmoothingMode.AntiAlias</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded ${antiAliasing ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-700 text-slate-400'}`}>
                  {antiAliasing ? 'ON' : 'OFF'}
                </span>
              </button>
              <button
                onClick={() => {
                  soundEffects.playOneClickSound();
                  setHighDpi(highDpi.includes('100%') ? 'PerMonitorV2 (125%)' : 'PerMonitorV2 (100%)');
                }}
                className="w-full text-left px-3 py-1.5 hover:bg-indigo-600 hover:text-white flex items-center justify-between"
              >
                <span>DPI Scaling Mode</span>
                <span className="text-[10px] text-slate-400">{highDpi}</span>
              </button>
              <div className="border-t border-slate-800 my-1" />
              <div className="px-3 py-1 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Single-Click Response
              </div>
              <div className="px-3 py-1.5 text-[11px] text-slate-400">
                Direct <code className="text-indigo-400">OnClick</code> execution active (0ms debounce lag).
              </div>
            </div>
          )}
        </div>

        {/* Security Menu */}
        <div className="relative">
          <button
            onClick={() => handleMenuClick('security')}
            className={`px-2.5 py-1.5 rounded hover:bg-slate-800 transition-colors flex items-center gap-1 ${
              openMenu === 'security' ? 'bg-slate-800 text-white' : ''
            }`}
          >
            Security
          </button>
          {openMenu === 'security' && (
            <div className="absolute left-0 top-full mt-0.5 w-60 bg-slate-900 border border-slate-700 shadow-xl rounded-md py-1 z-50 text-slate-200">
              <div className="px-3 py-1.5 text-xs flex items-center gap-2 text-emerald-400">
                <Shield className="w-3.5 h-3.5" />
                <span>SHA-256 Ballot Sealing Active</span>
              </div>
              <div className="px-3 py-1.5 text-xs flex items-center gap-2 text-blue-400">
                <Lock className="w-3.5 h-3.5" />
                <span>Single-Instance Mutex Locked</span>
              </div>
              <button
                onClick={() => {
                  soundEffects.playOneClickSound();
                  onOpenAudit();
                  setOpenMenu(null);
                }}
                className="w-full text-left px-3 py-1.5 hover:bg-indigo-600 hover:text-white"
              >
                Inspect Tamper-Proof Audit Trail
              </button>
            </div>
          )}
        </div>

        {/* Help Menu */}
        <div className="relative">
          <button
            onClick={() => handleMenuClick('help')}
            className={`px-2.5 py-1.5 rounded hover:bg-slate-800 transition-colors flex items-center gap-1 ${
              openMenu === 'help' ? 'bg-slate-800 text-white' : ''
            }`}
          >
            Help
          </button>
          {openMenu === 'help' && (
            <div className="absolute left-0 top-full mt-0.5 w-60 bg-slate-900 border border-slate-700 shadow-xl rounded-md py-1 z-50 text-slate-200">
              <button
                onClick={() => {
                  soundEffects.playOneClickSound();
                  setShowAbout(true);
                  setOpenMenu(null);
                }}
                className="w-full text-left px-3 py-1.5 hover:bg-indigo-600 hover:text-white flex items-center gap-2"
              >
                <Info className="w-3.5 h-3.5" />
                About ElectraDesk C# Voting System
              </button>
              <button
                onClick={() => {
                  soundEffects.playOneClickSound();
                  onSwitchView('lab');
                  setOpenMenu(null);
                }}
                className="w-full text-left px-3 py-1.5 hover:bg-indigo-600 hover:text-white flex items-center gap-2"
              >
                <Cpu className="w-3.5 h-3.5" />
                One-Click WinForms Specification
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Right side status indicators */}
      <div className="ml-auto flex items-center gap-3">
        <button
          onClick={onToggleSound}
          title={soundEnabled ? 'Click Sound Enabled' : 'Click Sound Muted'}
          className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors flex items-center gap-1.5 text-[11px]"
        >
          {soundEnabled ? (
            <>
              <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>1-Click Sound On</span>
            </>
          ) : (
            <>
              <VolumeX className="w-3.5 h-3.5 text-slate-500" />
              <span>Muted</span>
            </>
          )}
        </button>

        <span className="text-slate-600">|</span>
        <span className="text-[11px] text-slate-400 font-mono">
          .NET 8.0 &bull; WinForms GDI+
        </span>
      </div>

      {/* About Dialog Modal */}
      {showAbout && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-xl bg-indigo-600 text-white shadow-lg">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">ElectraDesk Desktop Voting System</h3>
                <p className="text-xs text-slate-400">C# / .NET 8 Windows Forms Application</p>
              </div>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              Designed with high-efficiency Windows Forms user controls including custom single-click buttons, 
              hardware double-buffered GDI+ charts, cryptographic SHA-256 digital seals, and instant one-click event delegates.
            </p>
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-xs font-mono text-slate-400 space-y-1 mb-5">
              <div>Runtime: Microsoft .NET 8.0-windows</div>
              <div>Graphics: GDI+ Hardware Double-Buffered (Zero Flicker)</div>
              <div>Button Latency: &lt; 2.5ms (Single Click Dispatch)</div>
              <div>Security: SHA-256 Hash Chaining &amp; Single Mutex</div>
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => {
                  soundEffects.playOneClickSound();
                  setShowAbout(false);
                }}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-medium transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
