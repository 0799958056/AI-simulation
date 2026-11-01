import React from 'react';
import { DesktopFrame } from './components/desktop/DesktopFrame';

export default function App() {
  return (
    <div className="w-full min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <DesktopFrame />
    </div>
  );
}
