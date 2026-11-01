import React, { useState } from 'react';
import { soundEffects } from '../../services/soundEffects';
import { 
  Boxes, 
  Layers, 
  Palette, 
  Zap, 
  CheckCircle2, 
  MousePointerClick, 
  ImageIcon, 
  BarChart, 
  FileText,
  Table
} from 'lucide-react';

export const ControlsShowcase: React.FC = () => {
  const [selectedControl, setSelectedControl] = useState<string>('oneclick_btn');

  const controls = [
    {
      id: 'oneclick_btn',
      name: 'OneClickButton',
      baseClass: 'System.Windows.Forms.Button',
      purpose: 'Single-click immediate vote trigger without double-click latency or duplicate vote submission.',
      icon: MousePointerClick,
      color: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
      properties: [
        { prop: 'SetStyle(StandardDoubleClick, false)', desc: 'Disables OS double-click wait timer' },
        { prop: 'Interlocked.CompareExchange', desc: 'Atomic lock prevents duplicate ballot recording' },
        { prop: 'Cursor = Cursors.Hand', desc: 'Clear affordance of clickability' },
        { prop: 'DoubleBuffered = true', desc: 'Hardware-buffered smooth repaints' }
      ],
      snippet: `var btnVote = new OneClickButton {
    Text = "CAST 1-CLICK BALLOT",
    PrimaryColor = Color.FromArgb(37, 99, 235),
    BorderRadius = 8,
    Cursor = Cursors.Hand
};
btnVote.SingleClickTriggered += (s, e) => ProcessVote();`
    },
    {
      id: 'candidate_card',
      name: 'CandidateCardControl',
      baseClass: 'System.Windows.Forms.UserControl',
      purpose: 'Composite card encapsulating candidate portrait (PictureBox), party brand stripe, manifesto, and embedded OneClickButton.',
      icon: ImageIcon,
      color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
      properties: [
        { prop: 'PictureBoxSizeMode.Zoom', desc: 'Maintains aspect ratio of candidate photos' },
        { prop: 'GDI+ Selection Border', desc: 'Anti-aliased green outline when candidate is selected' },
        { prop: 'FlowLayoutPanel Parent', desc: 'Auto-wraps cards dynamically across screen widths' }
      ],
      snippet: `public class CandidateCardControl : UserControl {
    public void BindCandidate(Candidate cand, bool selected) {
        lblName.Text = cand.Name;
        picPhoto.Image = cand.PortraitImage;
        btnVote.PrimaryColor = cand.BrandColor;
    }
}`
    },
    {
      id: 'gdi_chart',
      name: 'GdiChartControl',
      baseClass: 'System.Windows.Forms.Control',
      purpose: 'Custom owner-drawn GDI+ graphics surface rendering anti-aliased horizontal vote bars and live distribution percentages.',
      icon: BarChart,
      color: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
      properties: [
        { prop: 'SmoothingMode.HighQuality', desc: 'Sub-pixel smooth edges on charts and bars' },
        { prop: 'LinearGradientBrush', desc: 'Vibrant party gradient fills' },
        { prop: 'ControlStyles.OptimizedDoubleBuffer', desc: 'Zero screen tearing or flicker during updates' }
      ],
      snippet: `protected override void OnPaint(PaintEventArgs e) {
    e.Graphics.SmoothingMode = SmoothingMode.AntiAlias;
    using (var brush = new LinearGradientBrush(barRect, startColor, endColor, 0f)) {
        e.Graphics.FillRectangle(brush, barRect);
    }
}`
    },
    {
      id: 'audit_grid',
      name: 'AuditDataGridView',
      baseClass: 'System.Windows.Forms.DataGridView',
      purpose: 'Styled, read-only data grid presenting immutable voter status, ballot hashes, and tamper logs.',
      icon: Table,
      color: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
      properties: [
        { prop: 'ReadOnly = true', desc: 'Prevents tampering with election logs' },
        { prop: 'SelectionMode.FullRowSelect', desc: 'Convenient row inspection' },
        { prop: 'AlternatingRowsDefaultCellStyle', desc: 'Zebra striping for enhanced readability' }
      ],
      snippet: `gridAudit.AutoGenerateColumns = false;
gridAudit.Columns.Add(new DataGridViewTextBoxColumn {
    DataPropertyName = "BallotHash",
    HeaderText = "Cryptographic SHA-256 Hash"
});`
    }
  ];

  const activeControl = controls.find((c) => c.id === selectedControl) || controls[0];

  return (
    <div className="h-full flex flex-col bg-slate-950 text-slate-100 p-6 overflow-y-auto">
      <div className="mb-6">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-400 mb-1">
          <Boxes className="w-4 h-4" />
          <span>User Controls &amp; Graphic Elements Catalog</span>
        </div>
        <h1 className="text-2xl font-bold text-white tracking-tight">
          Recommended C# WinForms / WPF Controls for Voting Systems
        </h1>
        <p className="text-xs text-slate-400">
          Architecture, custom GDI+ drawing techniques, and single-click properties for each election UI component.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">
        {/* Controls Selector Column */}
        <div className="space-y-3">
          {controls.map((item) => {
            const Icon = item.icon;
            const isSelected = item.id === selectedControl;
            return (
              <button
                key={item.id}
                onClick={() => {
                  soundEffects.playOneClickSound();
                  setSelectedControl(item.id);
                }}
                className={`w-full text-left p-4 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-slate-900 border-blue-500 ring-1 ring-blue-500/50 shadow-lg'
                    : 'bg-slate-900/40 border-slate-800 hover:bg-slate-900/80 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className={`p-2 rounded-lg border ${item.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-sm text-white">{item.name}</div>
                    <div className="text-[10px] text-slate-500 font-mono">{item.baseClass}</div>
                  </div>
                </div>
                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                  {item.purpose}
                </p>
              </button>
            );
          })}
        </div>

        {/* Selected Control Details & Code */}
        <div className="lg:col-span-2 p-6 rounded-2xl border border-slate-800 bg-slate-900/60 shadow-xl flex flex-col">
          <div className="flex items-start justify-between mb-4 pb-4 border-b border-slate-800">
            <div>
              <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">
                {activeControl.baseClass}
              </span>
              <h2 className="text-xl font-bold text-white mt-0.5">{activeControl.name}</h2>
              <p className="text-xs text-slate-300 mt-1">{activeControl.purpose}</p>
            </div>
          </div>

          {/* Key Properties & Settings */}
          <div className="mb-6">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Critical WinForms &amp; Graphic Properties
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {activeControl.properties.map((p, idx) => (
                <div key={idx} className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                  <div className="font-mono text-emerald-400 font-semibold text-[11px] mb-0.5">
                    {p.prop}
                  </div>
                  <div className="text-slate-400 text-[11px]">{p.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* C# Implementation Snippet */}
          <div className="flex-1 flex flex-col">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              C# Usage &amp; Event Wiring
            </h3>
            <div className="flex-1 rounded-xl bg-slate-950 border border-slate-800 p-4 font-mono text-xs text-slate-300 overflow-auto">
              <pre className="whitespace-pre">{activeControl.snippet}</pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
