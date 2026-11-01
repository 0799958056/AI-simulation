import React from 'react';
import { CastBallotReceipt } from '../../types/voting';
import { soundEffects } from '../../services/soundEffects';
import { Printer, CheckCircle2, QrCode, ShieldCheck, X } from 'lucide-react';

interface ReceiptModalProps {
  receipt: CastBallotReceipt | null;
  onClose: () => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({ receipt, onClose }) => {
  if (!receipt) return null;

  const handlePrint = () => {
    soundEffects.playOneClickSound();
    window.print();
  };

  const handleDismiss = () => {
    soundEffects.playOneClickSound();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 bg-slate-800/80 border-b border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Ballot Cast Confirmation</h3>
              <p className="text-[11px] text-slate-400">Cryptographic SHA-256 Voter Receipt Generated</p>
            </div>
          </div>
          <button
            onClick={handleDismiss}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Paper Receipt Simulation */}
        <div className="p-6 overflow-y-auto bg-slate-950 flex flex-col items-center">
          <div className="w-full max-w-sm bg-white text-slate-900 rounded-lg shadow-xl p-6 font-mono text-xs border border-slate-300 relative print:shadow-none">
            {/* Top Serrated Edge Graphic */}
            <div className="text-center pb-3 border-b-2 border-dashed border-slate-300 mb-4">
              <div className="font-extrabold text-sm tracking-wider uppercase">ELECTRADESK OFFICIAL BALLOT</div>
              <div className="text-[10px] text-slate-500 font-sans">STATE &amp; CAMPUS ELECTION BOARD</div>
              <div className="text-[10px] text-slate-500 mt-1">Terminal ID: {receipt.stationId}</div>
            </div>

            <div className="space-y-1 mb-4 text-[11px]">
              <div className="flex justify-between">
                <span className="text-slate-500">Receipt No:</span>
                <span className="font-bold">{receipt.receiptId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Voter Card ID:</span>
                <span className="font-bold">{receipt.voterCardId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Timestamp:</span>
                <span>{receipt.timestamp}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Status:</span>
                <span className="text-emerald-700 font-bold">OFFICIALLY RECORDED</span>
              </div>
            </div>

            {/* Candidate Choices */}
            <div className="border-t border-b border-slate-300 py-3 my-3">
              <div className="font-bold text-[10px] uppercase text-slate-500 tracking-wider mb-2 font-sans">
                Recorded Ballot Selections
              </div>
              <div className="space-y-2.5">
                {receipt.selections.map((sel, idx) => (
                  <div key={idx} className="bg-slate-50 p-2 rounded border border-slate-200">
                    <div className="text-[10px] text-slate-500 font-sans truncate">{sel.positionTitle}</div>
                    <div className="font-bold text-xs text-slate-900 flex items-center justify-between">
                      <span>{sel.candidateName}</span>
                      <span className="text-[10px] font-normal text-slate-600 bg-slate-200 px-1 rounded">
                        {sel.party}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Cryptographic Seal & Barcode Graphic */}
            <div className="pt-2 text-center">
              <div className="flex items-center justify-center gap-3 my-3">
                <div className="p-2 border border-slate-300 rounded bg-slate-50">
                  <QrCode className="w-16 h-16 text-slate-800" />
                </div>
              </div>
              <div className="text-[9px] text-slate-500 font-sans uppercase tracking-wider mb-1">
                Cryptographic Ballot Hash (SHA-256)
              </div>
              <div className="text-[9px] text-slate-700 break-all bg-slate-100 p-1.5 rounded font-mono border border-slate-200 leading-tight">
                {receipt.ballotHash}
              </div>
              <div className="text-[9px] text-slate-400 mt-2 font-sans">
                Keep this receipt to verify your vote in the public audit ledger.
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-4 bg-slate-800/80 border-t border-slate-700 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-emerald-400">
            <CheckCircle2 className="w-4 h-4" />
            <span>Kiosk ready for next voter</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              Print Receipt
            </button>
            <button
              onClick={handleDismiss}
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white rounded-lg text-xs font-bold transition-all shadow-md shadow-indigo-600/30 cursor-pointer"
            >
              Done &bull; Return to Kiosk
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
