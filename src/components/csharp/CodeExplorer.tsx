import React, { useState } from 'react';
import { CSHARP_FILES } from '../../data/csharpCodebase';
import { CSharpSourceFile } from '../../types/voting';
import { soundEffects } from '../../services/soundEffects';
import { 
  Code2, 
  FileCode, 
  Copy, 
  Check, 
  FolderTree, 
  Download, 
  Terminal, 
  Cpu, 
  Sparkles,
  ExternalLink,
  Layers
} from 'lucide-react';

export const CodeExplorer: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<CSharpSourceFile>(CSHARP_FILES[0]);
  const [copied, setCopied] = useState<boolean>(false);

  const handleSelectFile = (file: CSharpSourceFile) => {
    soundEffects.playOneClickSound();
    setSelectedFile(file);
    setCopied(false);
  };

  const handleCopyCode = () => {
    soundEffects.playOneClickSound();
    navigator.clipboard.writeText(selectedFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadFile = () => {
    soundEffects.playOneClickSound();
    const blob = new Blob([selectedFile.content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = selectedFile.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDownloadAll = () => {
    soundEffects.playOneClickSound();
    // Bundle all files into a single text report or individual downloads
    const combined = CSHARP_FILES.map(
      (f) => `// ==========================================\n// FILE: ${f.path}\n// ==========================================\n\n${f.content}\n\n`
    ).join('\n');

    const blob = new Blob([combined], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'VotingSystem_CSharp_CompleteSolution.cs';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Group files by category
  const categories: Array<CSharpSourceFile['category']> = ['Controls', 'Forms', 'Services', 'Models', 'Entry', 'Project'];

  return (
    <div className="h-full flex flex-col bg-slate-950 text-slate-100 overflow-hidden">
      {/* Top Banner */}
      <div className="p-4 bg-slate-900 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-400 mb-1">
            <Code2 className="w-4 h-4" />
            <span>Visual Studio Solution &bull; .NET 8 C# Architecture</span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">Complete C# Desktop Source Code</h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyCode}
            className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied File!' : 'Copy Active File'}</span>
          </button>

          <button
            onClick={handleDownloadFile}
            className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Save .cs</span>
          </button>

          <button
            onClick={handleDownloadAll}
            className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all shadow-md shadow-indigo-600/30 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Full Solution</span>
          </button>
        </div>
      </div>

      {/* Main Split View: Solution Explorer & Code Viewer */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Solution Explorer Sidebar */}
        <div className="w-full md:w-72 bg-slate-900/90 border-r border-slate-800 flex flex-col overflow-y-auto">
          <div className="p-3 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400 font-semibold uppercase tracking-wider">
            <span className="flex items-center gap-2">
              <FolderTree className="w-4 h-4 text-indigo-400" />
              Solution Explorer
            </span>
            <span className="text-[10px] text-slate-500">.NET 8</span>
          </div>

          <div className="p-2 space-y-4 text-xs">
            {categories.map((cat) => {
              const filesInCat = CSHARP_FILES.filter((f) => f.category === cat);
              if (filesInCat.length === 0) return null;

              return (
                <div key={cat}>
                  <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    {cat}
                  </div>
                  <div className="space-y-0.5">
                    {filesInCat.map((file) => {
                      const isSelected = selectedFile.name === file.name;
                      return (
                        <button
                          key={file.name}
                          onClick={() => handleSelectFile(file)}
                          className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center gap-2 transition-colors cursor-pointer ${
                            isSelected
                              ? 'bg-indigo-600 text-white font-medium shadow-sm'
                              : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                          }`}
                        >
                          <FileCode className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-indigo-400'}`} />
                          <span className="truncate">{file.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Code Content & Description */}
        <div className="flex-1 flex flex-col overflow-hidden bg-slate-950">
          {/* Active File Bar */}
          <div className="p-3 bg-slate-900/60 border-b border-slate-800 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <FileCode className="w-4 h-4 text-indigo-400" />
              <span className="font-mono text-slate-200 font-semibold">{selectedFile.path}</span>
              <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded border border-slate-700">
                {selectedFile.category}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden lg:block">
              {selectedFile.description}
            </p>
          </div>

          {/* Code Viewer with Syntax Line Numbers */}
          <div className="flex-1 overflow-auto p-4 font-mono text-xs text-slate-300 leading-relaxed bg-slate-950">
            <pre className="overflow-x-auto whitespace-pre">
              {selectedFile.content.split('\n').map((line, idx) => (
                <div key={idx} className="flex hover:bg-slate-900/50 -mx-4 px-4 py-0.5">
                  <span className="w-10 select-none text-slate-600 text-right pr-4 shrink-0 font-mono text-[11px]">
                    {idx + 1}
                  </span>
                  <span className="font-mono text-slate-200">{line}</span>
                </div>
              ))}
            </pre>
          </div>

          {/* Technical Implementation Footnote */}
          <div className="p-3 bg-slate-900 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              <span>Compilation Target: Windows x64 / ARM64 &bull; Windows Forms Core</span>
            </div>
            <div className="font-mono text-indigo-400">
              C# 12.0 Language Features
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
