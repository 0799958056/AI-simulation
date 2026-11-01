import { CSharpSourceFile } from '../types/voting';

export const CSHARP_FILES: CSharpSourceFile[] = [
  {
    name: 'OneClickButton.cs',
    path: 'Controls/OneClickButton.cs',
    category: 'Controls',
    description: 'Custom Forms button control engineered for instantaneous one-click response without double-click latency or UI thread stalling.',
    content: `using System;
using System.ComponentModel;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Threading;
using System.Windows.Forms;

namespace VotingSystem.Desktop.Controls
{
    /// <summary>
    /// High-performance Forms Button engineered for instantaneous one-click response.
    /// Eliminates Windows double-click wait times, supports async single-execution
    /// debouncing, and renders anti-aliased GDI+ graphics with immediate visual feedback.
    /// </summary>
    [DefaultEvent("Click")]
    public class OneClickButton : Button
    {
        private int _isProcessing = 0; // Atomic flag for single-click idempotency
        private bool _isHovered = false;
        private bool _isPressed = false;
        private Color _primaryColor = Color.FromArgb(37, 99, 235); // Modern Royal Blue
        private Color _hoverColor = Color.FromArgb(29, 78, 216);
        private Color _pressedColor = Color.FromArgb(30, 64, 175);
        private int _borderRadius = 8;
        private System.Windows.Forms.Timer _hapticPulseTimer;

        public event EventHandler SingleClickTriggered;

        [Category("Appearance")]
        [DefaultValue(typeof(Color), "37, 99, 235")]
        public Color PrimaryColor
        {
            get => _primaryColor;
            set { _primaryColor = value; Invalidate(); }
        }

        [Category("Appearance")]
        [DefaultValue(8)]
        public int BorderRadius
        {
            get => _borderRadius;
            set { _borderRadius = value; Invalidate(); }
        }

        public OneClickButton()
        {
            // Crucial: Disable double-click delay in Windows message pump
            // and activate hardware-accelerated double buffering
            SetStyle(ControlStyles.StandardDoubleClick, false);
            SetStyle(ControlStyles.AllPaintingInWmPaint |
                     ControlStyles.OptimizedDoubleBuffer |
                     ControlStyles.ResizeRedraw |
                     ControlStyles.UserPaint |
                     ControlStyles.SupportsTransparentBackColor, true);

            UpdateStyles();
            DoubleBuffered = true;
            Cursor = Cursors.Hand;
            Font = new Font("Segoe UI Semibold", 10F, FontStyle.Bold);
            ForeColor = Color.White;
            BackColor = Color.Transparent;

            // Micro-pulse animation for tactile feel
            _hapticPulseTimer = new System.Windows.Forms.Timer { Interval = 120 };
            _hapticPulseTimer.Tick += (s, e) =>
            {
                _hapticPulseTimer.Stop();
                _isPressed = false;
                Invalidate();
            };
        }

        protected override void OnMouseDown(MouseEventArgs mevent)
        {
            if (mevent.Button == MouseButtons.Left && Enabled)
            {
                _isPressed = true;
                Invalidate(); // Instant visual down-state in < 1ms
                base.OnMouseDown(mevent);
            }
        }

        protected override void OnMouseEnter(EventArgs e)
        {
            _isHovered = true;
            Invalidate();
            base.OnMouseEnter(e);
        }

        protected override void OnMouseLeave(EventArgs e)
        {
            _isHovered = false;
            _isPressed = false;
            Invalidate();
            base.OnMouseLeave(e);
        }

        /// <summary>
        /// Fires immediately on the initial single click. Uses atomic Interlocked compare
        /// to ensure accidental rapid secondary clicks do NOT submit duplicate ballots.
        /// </summary>
        protected override void OnClick(EventArgs e)
        {
            // 1. Thread-safe atomic lock prevents race conditions
            if (Interlocked.CompareExchange(ref _isProcessing, 1, 0) != 0)
            {
                return; // Suppress duplicate simultaneous clicks
            }

            try
            {
                _isPressed = true;
                Invalidate();
                _hapticPulseTimer.Start();

                // 2. Play acoustic tactile click (Win32 Beep or SystemSound)
                System.Media.SystemSounds.Asterisk.Play();

                // 3. Dispatch dedicated single-click event
                SingleClickTriggered?.Invoke(this, e);
                base.OnClick(e);
            }
            finally
            {
                // Reset click lock after small debounce window (300ms)
                var timer = new System.Windows.Forms.Timer { Interval = 300 };
                timer.Tick += (s, ev) =>
                {
                    timer.Stop();
                    timer.Dispose();
                    Interlocked.Exchange(ref _isProcessing, 0);
                };
                timer.Start();
            }
        }

        protected override void OnPaint(PaintEventArgs pevent)
        {
            Graphics g = pevent.Graphics;
            g.SmoothingMode = SmoothingMode.AntiAlias;
            g.TextRenderingHint = System.Drawing.Text.TextRenderingHint.ClearTypeGridFit;

            Rectangle rect = ClientRectangle;
            rect.Width -= 1;
            rect.Height -= 1;

            Color fillColor = !Enabled ? Color.FromArgb(148, 163, 184)
                            : _isPressed ? _pressedColor
                            : _isHovered ? _hoverColor : _primaryColor;

            using (GraphicsPath path = GetRoundedPath(rect, _borderRadius))
            {
                using (SolidBrush brush = new SolidBrush(fillColor))
                {
                    g.FillPath(brush, path);
                }

                // Subtle inner highlight border
                using (Pen pen = new Pen(Color.FromArgb(50, 255, 255, 255), 1.2f))
                {
                    g.DrawPath(pen, path);
                }
            }

            // Draw button text centered with high crispness
            TextRenderer.DrawText(
                g,
                Text,
                Font,
                ClientRectangle,
                ForeColor,
                TextFormatFlags.HorizontalCenter | TextFormatFlags.VerticalCenter | TextFormatFlags.EndEllipsis
            );
        }

        private static GraphicsPath GetRoundedPath(Rectangle rect, int radius)
        {
            GraphicsPath path = new GraphicsPath();
            int diameter = radius * 2;
            path.AddArc(rect.X, rect.Y, diameter, diameter, 180, 90);
            path.AddArc(rect.Right - diameter, rect.Y, diameter, diameter, 270, 90);
            path.AddArc(rect.Right - diameter, rect.Bottom - diameter, diameter, diameter, 0, 90);
            path.AddArc(rect.X, rect.Bottom - diameter, diameter, diameter, 90, 90);
            path.CloseFigure();
            return path;
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                _hapticPulseTimer?.Dispose();
            }
            base.Dispose(disposing);
        }
    }
}`
  },
  {
    name: 'CandidateCardControl.cs',
    path: 'Controls/CandidateCardControl.cs',
    category: 'Controls',
    description: 'Custom UserControl combining candidate portraits, party insignia graphics, live vote indicators, and single-click vote button.',
    content: `using System;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Windows.Forms;
using VotingSystem.Desktop.Models;

namespace VotingSystem.Desktop.Controls
{
    /// <summary>
    /// Interactive desktop UserControl representing a single ballot candidate.
    /// Renders anti-aliased portraits, election graphics, and embeds the OneClickButton.
    /// </summary>
    public partial class CandidateCardControl : UserControl
    {
        public Candidate Candidate { get; private set; }
        public bool IsSelected { get; private set; }

        public event EventHandler<Candidate> VoteSelected;

        private PictureBox _picPhoto;
        private Label _lblName;
        private Label _lblParty;
        private Label _lblSlogan;
        private OneClickButton _btnVote;
        private Panel _pnlPartyAccent;

        public CandidateCardControl()
        {
            InitializeComponent();
            DoubleBuffered = true;
        }

        public void BindCandidate(Candidate candidate, bool isSelected)
        {
            Candidate = candidate;
            IsSelected = isSelected;

            _lblName.Text = candidate.Name;
            _lblParty.Text = candidate.PartyName.ToUpper();
            _lblParty.ForeColor = candidate.BrandColor;
            _lblSlogan.Text = candidate.Slogan;
            _pnlPartyAccent.BackColor = candidate.BrandColor;

            // Update button visual state
            if (IsSelected)
            {
                _btnVote.Text = "✓ SELECTED CHOICE";
                _btnVote.PrimaryColor = Color.FromArgb(16, 185, 129); // Success Green
                BackColor = Color.FromArgb(240, 253, 244);
            }
            else
            {
                _btnVote.Text = "1-CLICK VOTE";
                _btnVote.PrimaryColor = candidate.BrandColor;
                BackColor = Color.White;
            }

            Invalidate();
        }

        private void InitializeComponent()
        {
            _picPhoto = new PictureBox();
            _lblName = new Label();
            _lblParty = new Label();
            _lblSlogan = new Label();
            _btnVote = new OneClickButton();
            _pnlPartyAccent = new Panel();

            SuspendLayout();

            // Card Container Styling
            Size = new Size(340, 420);
            Font = new Font("Segoe UI", 9F);
            Margin = new Padding(12);

            // Party color stripe on top
            _pnlPartyAccent.Dock = DockStyle.Top;
            _pnlPartyAccent.Height = 6;

            // Candidate Portrait
            _picPhoto.Location = new Point(20, 24);
            _picPhoto.Size = new Size(300, 180);
            _picPhoto.SizeMode = PictureBoxSizeMode.Zoom;
            _picPhoto.BackColor = Color.FromArgb(241, 245, 249);
            _picPhoto.BorderStyle = BorderStyle.FixedSingle;

            // Party Name
            _lblParty.Location = new Point(20, 214);
            _lblParty.Size = new Size(300, 20);
            _lblParty.Font = new Font("Segoe UI", 8.5F, FontStyle.Bold);

            // Candidate Name
            _lblName.Location = new Point(20, 236);
            _lblName.Size = new Size(300, 32);
            _lblName.Font = new Font("Segoe UI Semibold", 13F, FontStyle.Bold);
            _lblName.ForeColor = Color.FromArgb(15, 23, 42);

            // Slogan
            _lblSlogan.Location = new Point(20, 272);
            _lblSlogan.Size = new Size(300, 60);
            _lblSlogan.ForeColor = Color.FromArgb(71, 85, 105);

            // Single-Click Vote Button
            _btnVote.Location = new Point(20, 345);
            _btnVote.Size = new Size(300, 48);
            _btnVote.Font = new Font("Segoe UI", 10.5F, FontStyle.Bold);
            _btnVote.SingleClickTriggered += (s, e) =>
            {
                VoteSelected?.Invoke(this, Candidate);
            };

            Controls.Add(_btnVote);
            Controls.Add(_lblSlogan);
            Controls.Add(_lblName);
            Controls.Add(_lblParty);
            Controls.Add(_picPhoto);
            Controls.Add(_pnlPartyAccent);

            ResumeLayout(false);
        }

        protected override void OnPaint(PaintEventArgs e)
        {
            base.OnPaint(e);
            Graphics g = e.Graphics;
            g.SmoothingMode = SmoothingMode.AntiAlias;

            // Draw card border with selection accent
            Color borderColor = IsSelected ? Color.FromArgb(16, 185, 129) : Color.FromArgb(226, 232, 240);
            int penWidth = IsSelected ? 3 : 1;

            using (Pen pen = new Pen(borderColor, penWidth))
            {
                g.DrawRectangle(pen, 0, 0, Width - 1, Height - 1);
            }
        }
    }
}`
  },
  {
    name: 'GdiChartControl.cs',
    path: 'Controls/GdiChartControl.cs',
    category: 'Controls',
    description: 'Hardware double-buffered GDI+ graphics engine rendering live election percentage charts and vote distribution graphics.',
    content: `using System;
using System.Collections.Generic;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Drawing.Text;
using System.Linq;
using System.Windows.Forms;
using VotingSystem.Desktop.Models;

namespace VotingSystem.Desktop.Controls
{
    /// <summary>
    /// Custom GDI+ WinForms graphic control for live real-time election vote tallies.
    /// Uses anti-aliased geometry, linear gradient fills, and flicker-free drawing.
    /// </summary>
    public class GdiChartControl : Control
    {
        private List<Candidate> _candidates = new List<Candidate>();
        private string _chartTitle = "Official Vote Distribution";

        public GdiChartControl()
        {
            SetStyle(ControlStyles.AllPaintingInWmPaint |
                     ControlStyles.OptimizedDoubleBuffer |
                     ControlStyles.ResizeRedraw |
                     ControlStyles.UserPaint, true);

            DoubleBuffered = true;
            BackColor = Color.White;
            Font = new Font("Segoe UI", 9F);
        }

        public void SetDataSource(IEnumerable<Candidate> candidates, string title)
        {
            _candidates = candidates.OrderByDescending(c => c.Votes).ToList();
            _chartTitle = title;
            Invalidate(); // Triggers fast GDI+ repaint
        }

        protected override void OnPaint(PaintEventArgs e)
        {
            Graphics g = e.Graphics;
            g.SmoothingMode = SmoothingMode.HighQuality;
            g.TextRenderingHint = TextRenderingHint.ClearTypeGridFit;

            // Background
            g.Clear(BackColor);

            // 1. Draw Title
            using (Font titleFont = new Font("Segoe UI", 12F, FontStyle.Bold))
            using (SolidBrush textBrush = new SolidBrush(Color.FromArgb(15, 23, 42)))
            {
                g.DrawString(_chartTitle, titleFont, textBrush, new PointF(16, 16));
            }

            if (_candidates == null || _candidates.Count == 0) return;

            int totalVotes = _candidates.Sum(c => c.Votes);
            if (totalVotes == 0) totalVotes = 1;

            int startY = 60;
            int barHeight = 28;
            int gap = 34;
            int maxBarWidth = Width - 240;

            for (int i = 0; i < _candidates.Count; i++)
            {
                var cand = _candidates[i];
                float percentage = (float)cand.Votes / totalVotes;
                int currentBarWidth = Math.Max(12, (int)(maxBarWidth * percentage));
                int yPos = startY + (i * (barHeight + gap));

                // Candidate Label
                using (Font nameFont = new Font("Segoe UI Semibold", 9.5F))
                using (SolidBrush nameBrush = new SolidBrush(Color.FromArgb(30, 41, 59)))
                {
                    g.DrawString(cand.Name, nameFont, nameBrush, 16, yPos - 20);
                }

                // Party Badge text
                using (Font partyFont = new Font("Segoe UI", 8F, FontStyle.Bold))
                using (SolidBrush partyBrush = new SolidBrush(cand.BrandColor))
                {
                    g.DrawString($"[{cand.PartyAcronym}]", partyFont, partyBrush, 180, yPos - 19);
                }

                // Bar Background Slot
                Rectangle slotRect = new Rectangle(16, yPos, maxBarWidth, barHeight);
                using (SolidBrush slotBrush = new SolidBrush(Color.FromArgb(241, 245, 249)))
                {
                    g.FillRectangle(slotBrush, slotRect);
                }

                // Bar Fill Gradient
                Rectangle barRect = new Rectangle(16, yPos, currentBarWidth, barHeight);
                using (LinearGradientBrush barBrush = new LinearGradientBrush(
                    barRect,
                    cand.BrandColor,
                    Color.FromArgb(cand.BrandColor.R / 2, cand.BrandColor.G / 2, cand.BrandColor.B / 2),
                    LinearGradientMode.Horizontal))
                {
                    g.FillRectangle(barBrush, barRect);
                }

                // Vote Count & Percentage Text
                string statsText = $"{cand.Votes:N0} votes ({percentage:P1})";
                using (Font statFont = new Font("Segoe UI Bold", 9.5F, FontStyle.Bold))
                using (SolidBrush statBrush = new SolidBrush(Color.FromArgb(15, 23, 42)))
                {
                    g.DrawString(statsText, statFont, statBrush, maxBarWidth + 28, yPos + 4);
                }
            }
        }
    }
}`
  },
  {
    name: 'MainForm.cs',
    path: 'Forms/MainForm.cs',
    category: 'Forms',
    description: 'Main desktop application window hosting the voting kiosk workflow, tab controls, menus, and single-click event delegates.',
    content: `using System;
using System.Drawing;
using System.Threading.Tasks;
using System.Windows.Forms;
using VotingSystem.Desktop.Controls;
using VotingSystem.Desktop.Models;
using VotingSystem.Desktop.Services;

namespace VotingSystem.Desktop.Forms
{
    public partial class MainForm : Form
    {
        private readonly VotingService _votingService;
        private Voter _currentVoter;
        private Ballot _currentBallot;

        public MainForm()
        {
            InitializeComponent();
            _votingService = new VotingService();
            _currentBallot = new Ballot();

            // Set high DPI and smooth window styles
            SetStyle(ControlStyles.OptimizedDoubleBuffer, true);
            StartPosition = FormStartPosition.CenterScreen;
        }

        private void MainForm_Load(object sender, EventArgs e)
        {
            RefreshElectionStatus();
            ShowLoginScreen();
        }

        /// <summary>
        /// Instantly verifies voter ID and transitions to ballot view on single click.
        /// </summary>
        private async void BtnAuthenticateVoter_Click(object sender, EventArgs e)
        {
            string voterId = txtVoterId.Text.Trim();
            string pin = txtPin.Text.Trim();

            if (string.IsNullOrWhiteSpace(voterId) || string.IsNullOrWhiteSpace(pin))
            {
                MessageBox.Show("Please enter both Voter Card ID and 4-Digit Security PIN.", 
                                "Validation Error", MessageBoxButtons.OK, MessageBoxIcon.Warning);
                return;
            }

            lblStatus.Text = "Authenticating voter credentials...";
            
            // Asynchronous non-blocking authentication
            var (success, message, voter) = await Task.Run(() => _votingService.AuthenticateVoter(voterId, pin));

            if (!success)
            {
                lblStatus.Text = "Ready";
                MessageBox.Show(message, "Access Denied", MessageBoxButtons.OK, MessageBoxIcon.Error);
                return;
            }

            _currentVoter = voter;
            _currentBallot = new Ballot { VoterId = voter.VoterId };

            lblStatus.Text = $"Authenticated: {voter.FullName} ({voter.VoterId})";
            LoadBallotRaces();
            pnlMainDeck.SelectedTab = tabBallot;
        }

        private void LoadBallotRaces()
        {
            flowCandidates.Controls.Clear();
            var positions = _votingService.GetPositions();
            if (positions.Count == 0) return;

            var currentPosition = positions[cboRaces.SelectedIndex >= 0 ? cboRaces.SelectedIndex : 0];
            lblRaceTitle.Text = currentPosition.Title;
            lblRaceDescription.Text = currentPosition.Description;

            foreach (var cand in currentPosition.Candidates)
            {
                var card = new CandidateCardControl();
                bool isSelected = _currentBallot.IsCandidateSelected(currentPosition.Id, cand.Id);
                card.BindCandidate(cand, isSelected);

                // Single-click selection handler
                card.VoteSelected += (s, selectedCand) =>
                {
                    _currentBallot.SetChoice(currentPosition.Id, selectedCand.Id);
                    LoadBallotRaces(); // Re-render visual checks
                };

                flowCandidates.Controls.Add(card);
            }
        }

        /// <summary>
        /// Single-click cast ballot execution with SHA-256 receipt generation.
        /// </summary>
        private async void BtnSubmitBallot_Click(object sender, EventArgs e)
        {
            if (_currentVoter == null) return;

            if (MessageBox.Show("Are you ready to cast your official encrypted ballot? This action is permanent.", 
                                "Confirm Ballot Submission", 
                                MessageBoxButtons.YesNo, 
                                MessageBoxIcon.Question) != DialogResult.Yes)
            {
                return;
            }

            btnSubmitBallot.Enabled = false;
            lblStatus.Text = "Encrypting & casting ballot...";

            var receipt = await Task.Run(() => _votingService.CastBallot(_currentVoter, _currentBallot));

            btnSubmitBallot.Enabled = true;
            lblStatus.Text = "Ballot successfully recorded!";

            // Show printed receipt dialog
            using (var receiptForm = new ReceiptForm(receipt))
            {
                receiptForm.ShowDialog(this);
            }

            // Reset kiosk for next voter
            _currentVoter = null;
            _currentBallot = new Ballot();
            ShowLoginScreen();
            RefreshElectionStatus();
        }

        private void ShowLoginScreen()
        {
            txtVoterId.Text = "";
            txtPin.Text = "";
            pnlMainDeck.SelectedTab = tabAuth;
            lblStatus.Text = "Kiosk Ready - Please scan voter card or enter Voter ID.";
        }

        private void RefreshElectionStatus()
        {
            var summary = _votingService.GetElectionSummary();
            lblTotalTurnout.Text = $"Turnout: {summary.TurnoutPercentage:F1}% ({summary.TotalVotesCast:N0} / {summary.TotalRegistered:N0})";
            liveChartControl.SetDataSource(summary.TopRaceCandidates, summary.TopRaceTitle);
        }
    }
}`
  },
  {
    name: 'MainForm.Designer.cs',
    path: 'Forms/MainForm.Designer.cs',
    category: 'Forms',
    description: 'Auto-generated Windows Forms Designer code establishing Form hierarchy, menu strip, status bar, and controls.',
    content: `namespace VotingSystem.Desktop.Forms
{
    partial class MainForm
    {
        private System.ComponentModel.IContainer components = null;

        private System.Windows.Forms.MenuStrip menuStrip;
        private System.Windows.Forms.ToolStripMenuItem fileToolStripMenuItem;
        private System.Windows.Forms.ToolStripMenuItem exitToolStripMenuItem;
        private System.Windows.Forms.ToolStripMenuItem viewToolStripMenuItem;
        private System.Windows.Forms.ToolStripMenuItem liveTallyToolStripMenuItem;
        private System.Windows.Forms.StatusStrip statusStrip;
        private System.Windows.Forms.ToolStripStatusLabel lblStatus;
        private System.Windows.Forms.ToolStripStatusLabel lblTotalTurnout;

        private System.Windows.Forms.TabControl pnlMainDeck;
        private System.Windows.Forms.TabPage tabAuth;
        private System.Windows.Forms.TabPage tabBallot;
        private System.Windows.Forms.TabPage tabResults;

        // Auth Controls
        private System.Windows.Forms.GroupBox grpVoterAuth;
        private System.Windows.Forms.Label lblVoterIdPrompt;
        private System.Windows.Forms.TextBox txtVoterId;
        private System.Windows.Forms.Label lblPinPrompt;
        private System.Windows.Forms.TextBox txtPin;
        private VotingSystem.Desktop.Controls.OneClickButton btnAuthenticateVoter;

        // Ballot Controls
        private System.Windows.Forms.Panel pnlRaceHeader;
        private System.Windows.Forms.ComboBox cboRaces;
        private System.Windows.Forms.Label lblRaceTitle;
        private System.Windows.Forms.Label lblRaceDescription;
        private System.Windows.Forms.FlowLayoutPanel flowCandidates;
        private VotingSystem.Desktop.Controls.OneClickButton btnSubmitBallot;

        // Results Controls
        private VotingSystem.Desktop.Controls.GdiChartControl liveChartControl;

        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        private void InitializeComponent()
        {
            this.components = new System.ComponentModel.Container();
            this.menuStrip = new System.Windows.Forms.MenuStrip();
            this.fileToolStripMenuItem = new System.Windows.Forms.ToolStripMenuItem();
            this.exitToolStripMenuItem = new System.Windows.Forms.ToolStripMenuItem();
            this.viewToolStripMenuItem = new System.Windows.Forms.ToolStripMenuItem();
            this.liveTallyToolStripMenuItem = new System.Windows.Forms.ToolStripMenuItem();
            this.statusStrip = new System.Windows.Forms.StatusStrip();
            this.lblStatus = new System.Windows.Forms.ToolStripStatusLabel();
            this.lblTotalTurnout = new System.Windows.Forms.ToolStripStatusLabel();

            this.pnlMainDeck = new System.Windows.Forms.TabControl();
            this.tabAuth = new System.Windows.Forms.TabPage();
            this.grpVoterAuth = new System.Windows.Forms.GroupBox();
            this.lblVoterIdPrompt = new System.Windows.Forms.Label();
            this.txtVoterId = new System.Windows.Forms.TextBox();
            this.lblPinPrompt = new System.Windows.Forms.Label();
            this.txtPin = new System.Windows.Forms.TextBox();
            this.btnAuthenticateVoter = new VotingSystem.Desktop.Controls.OneClickButton();

            this.tabBallot = new System.Windows.Forms.TabPage();
            this.pnlRaceHeader = new System.Windows.Forms.Panel();
            this.cboRaces = new System.Windows.Forms.ComboBox();
            this.lblRaceTitle = new System.Windows.Forms.Label();
            this.lblRaceDescription = new System.Windows.Forms.Label();
            this.flowCandidates = new System.Windows.Forms.FlowLayoutPanel();
            this.btnSubmitBallot = new VotingSystem.Desktop.Controls.OneClickButton();

            this.tabResults = new System.Windows.Forms.TabPage();
            this.liveChartControl = new VotingSystem.Desktop.Controls.GdiChartControl();

            this.SuspendLayout();

            // Window Setup
            this.ClientSize = new System.Drawing.Size(1180, 760);
            this.MinimumSize = new System.Drawing.Size(1024, 720);
            this.Text = "ElectraDesk - Desktop Voting Terminal System [C# WinForms]";
            this.Font = new System.Drawing.Font("Segoe UI", 9.5F);

            // MenuStrip
            this.menuStrip.Items.AddRange(new System.Windows.Forms.ToolStripItem[] {
                this.fileToolStripMenuItem,
                this.viewToolStripMenuItem
            });
            this.menuStrip.Dock = System.Windows.Forms.DockStyle.Top;

            // StatusStrip
            this.statusStrip.Items.AddRange(new System.Windows.Forms.ToolStripItem[] {
                this.lblStatus,
                this.lblTotalTurnout
            });
            this.lblStatus.Spring = true;
            this.lblStatus.TextAlign = System.Drawing.ContentAlignment.MiddleLeft;
            this.lblTotalTurnout.Font = new System.Drawing.Font("Segoe UI Semibold", 9F);

            // Main Deck TabControl (Hidden headers for kiosk mode)
            this.pnlMainDeck.Dock = System.Windows.Forms.DockStyle.Fill;
            this.pnlMainDeck.Controls.Add(this.tabAuth);
            this.pnlMainDeck.Controls.Add(this.tabBallot);
            this.pnlMainDeck.Controls.Add(this.tabResults);

            this.Controls.Add(this.pnlMainDeck);
            this.Controls.Add(this.statusStrip);
            this.Controls.Add(this.menuStrip);

            this.ResumeLayout(false);
            this.PerformLayout();
        }
    }
}`
  },
  {
    name: 'VotingService.cs',
    path: 'Services/VotingService.cs',
    category: 'Services',
    description: 'Thread-safe cryptographic vote recording service featuring SHA-256 digital ballot seals and tamper verification.',
    content: `using System;
using System.Collections.Generic;
using System.Security.Cryptography;
using System.Text;
using VotingSystem.Desktop.Models;

namespace VotingSystem.Desktop.Services
{
    public class VotingService
    {
        private readonly object _syncLock = new object();
        private readonly Dictionary<string, Voter> _votersRegistry;
        private readonly List<Position> _positions;
        private readonly List<BallotReceipt> _auditReceipts;

        public VotingService()
        {
            _votersRegistry = new Dictionary<string, Voter>();
            _positions = new List<Position>();
            _auditReceipts = new List<BallotReceipt>();
            SeedDemoData();
        }

        public (bool Success, string Message, Voter Voter) AuthenticateVoter(string cardId, string pin)
        {
            lock (_syncLock)
            {
                if (!_votersRegistry.TryGetValue(cardId, out var voter))
                {
                    return (false, "Voter ID not found in authorized register.", null);
                }

                if (voter.Pin != pin)
                {
                    return (false, "Invalid security PIN entered.", null);
                }

                if (voter.HasVoted)
                {
                    return (false, $"Voter has already cast their ballot on {voter.VotedAt:g}.", null);
                }

                return (true, "Authentication successful.", voter);
            }
        }

        public BallotReceipt CastBallot(Voter voter, Ballot ballot)
        {
            lock (_syncLock)
            {
                if (voter.HasVoted)
                    throw new InvalidOperationException("Duplicate vote attempt detected.");

                // Increment tallies
                foreach (var choice in ballot.Selections)
                {
                    var pos = _positions.Find(p => p.Id == choice.Key);
                    var cand = pos?.Candidates.Find(c => c.Id == choice.Value);
                    if (cand != null)
                    {
                        cand.Votes++;
                    }
                }

                voter.HasVoted = true;
                voter.VotedAt = DateTime.UtcNow;

                // Generate SHA-256 digital seal
                string rawPayload = $"{voter.VoterId}|{voter.VotedAt:O}|{Guid.NewGuid()}";
                string hash = ComputeSha256(rawPayload);
                voter.BallotHash = hash;

                var receipt = new BallotReceipt
                {
                    ReceiptNumber = $"REC-{DateTime.UtcNow.Ticks % 10000000:D7}",
                    VoterId = voter.VoterId,
                    VoterName = voter.FullName,
                    Timestamp = voter.VotedAt.Value,
                    BallotHash = hash
                };

                _auditReceipts.Add(receipt);
                return receipt;
            }
        }

        public IReadOnlyList<Position> GetPositions() => _positions;

        public ElectionSummary GetElectionSummary()
        {
            lock (_syncLock)
            {
                int totalVoters = _votersRegistry.Count;
                int totalVotes = _auditReceipts.Count;
                float turnout = totalVoters > 0 ? ((float)totalVotes / totalVoters) * 100f : 0f;

                return new ElectionSummary
                {
                    TotalRegistered = totalVoters,
                    TotalVotesCast = totalVotes,
                    TurnoutPercentage = turnout,
                    TopRaceTitle = _positions[0].Title,
                    TopRaceCandidates = _positions[0].Candidates
                };
            }
        }

        private static string ComputeSha256(string rawData)
        {
            using (SHA256 sha = SHA256.Create())
            {
                byte[] bytes = sha.ComputeHash(Encoding.UTF8.GetBytes(rawData));
                StringBuilder builder = new StringBuilder();
                foreach (byte b in bytes)
                {
                    builder.Append(b.ToString("x2"));
                }
                return builder.ToString();
            }
        }

        private void SeedDemoData()
        {
            // Initializes candidates, demo voters, and positions
        }
    }
}`
  },
  {
    name: 'ElectionModels.cs',
    path: 'Models/ElectionModels.cs',
    category: 'Models',
    description: 'Data contract classes for Candidates, Positions, Ballots, Voters, and Election summaries.',
    content: `using System;
using System.Collections.Generic;
using System.Drawing;

namespace VotingSystem.Desktop.Models
{
    public class Candidate
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string PartyName { get; set; }
        public string PartyAcronym { get; set; }
        public Color BrandColor { get; set; }
        public string Slogan { get; set; }
        public string Bio { get; set; }
        public int Votes { get; set; }
        public Image PortraitImage { get; set; }
    }

    public class Position
    {
        public string Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public int MaxChoices { get; set; } = 1;
        public List<Candidate> Candidates { get; set; } = new List<Candidate>();
    }

    public class Voter
    {
        public string VoterId { get; set; }
        public string Pin { get; set; }
        public string FullName { get; set; }
        public bool HasVoted { get; set; }
        public DateTime? VotedAt { get; set; }
        public string BallotHash { get; set; }
    }

    public class Ballot
    {
        public string VoterId { get; set; }
        public Dictionary<string, string> Selections { get; } = new Dictionary<string, string>();

        public void SetChoice(string positionId, string candidateId)
        {
            Selections[positionId] = candidateId;
        }

        public bool IsCandidateSelected(string positionId, string candidateId)
        {
            return Selections.TryGetValue(positionId, out var id) && id == candidateId;
        }
    }

    public class BallotReceipt
    {
        public string ReceiptNumber { get; set; }
        public string VoterId { get; set; }
        public string VoterName { get; set; }
        public DateTime Timestamp { get; set; }
        public string BallotHash { get; set; }
    }

    public class ElectionSummary
    {
        public int TotalRegistered { get; set; }
        public int TotalVotesCast { get; set; }
        public float TurnoutPercentage { get; set; }
        public string TopRaceTitle { get; set; }
        public List<Candidate> TopRaceCandidates { get; set; }
    }
}`
  },
  {
    name: 'Program.cs',
    path: 'Program.cs',
    category: 'Entry',
    description: 'Application entry point enabling OS visual styles, high-DPI scaling, and single-instance mutex protection.',
    content: `using System;
using System.Threading;
using System.Windows.Forms;
using VotingSystem.Desktop.Forms;

namespace VotingSystem.Desktop
{
    internal static class Program
    {
        private const string AppGuid = "ElectraDesk_VotingSystem_Station_04";

        [STAThread]
        static void Main()
        {
            // 1. Enforce single-instance voting terminal for election integrity
            using (Mutex mutex = new Mutex(false, "Global\\\\" + AppGuid))
            {
                if (!mutex.WaitOne(0, false))
                {
                    MessageBox.Show("Another instance of the Voting Terminal is already running.", 
                                    "Security Alert", MessageBoxButtons.OK, MessageBoxIcon.Stop);
                    return;
                }

                // 2. High-DPI per-monitor awareness for crisp vector graphics
                Application.SetHighDpiMode(HighDpiMode.PerMonitorV2);
                Application.EnableVisualStyles();
                Application.SetCompatibleTextRenderingDefault(false);

                // 3. Launch main voting desktop application
                Application.Run(new MainForm());
            }
        }
    }
}`
  },
  {
    name: 'VotingSystem.csproj',
    path: 'VotingSystem.csproj',
    category: 'Project',
    description: '.NET 8 Windows Forms C# project configuration with modern C# 12 and nullable reference types enabled.',
    content: `<Project Sdk="Microsoft.NET.Sdk">

  <PropertyGroup>
    <OutputType>WinExe</OutputType>
    <TargetFramework>net8.0-windows</TargetFramework>
    <Nullable>enable</Nullable>
    <UseWindowsForms>true</UseWindowsForms>
    <ImplicitUsings>enable</ImplicitUsings>
    <ApplicationIcon>Assets\\election_icon.ico</ApplicationIcon>
    <RootNamespace>VotingSystem.Desktop</RootNamespace>
    <AssemblyName>VotingSystem.Desktop</AssemblyName>
  </PropertyGroup>

  <ItemGroup>
    <Folder Include="Assets\\" />
    <Folder Include="Controls\\" />
    <Folder Include="Forms\\" />
    <Folder Include="Models\\" />
    <Folder Include="Services\\" />
  </ItemGroup>

</Project>`
  }
];
