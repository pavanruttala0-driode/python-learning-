import { useState } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { python } from '@codemirror/lang-python';
import confetti from 'canvas-confetti';
import { Play, Flame, Coins, Award, CheckCircle2, AlertCircle } from 'lucide-react';
import { usePyodide } from './hooks/usePyodide';
import { CURRICULUM } from './data/curriculum';

export default function App() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const activeChallenge = CURRICULUM[currentIdx];
  const [code, setCode] = useState(activeChallenge.starterCode);
  const [xp, setXp] = useState(100);
  const [coins, setCoins] = useState(25);
  const [tab, setTab] = useState<'editor' | 'output' | 'brief'>('editor');

  const { runCode, output, isRunning } = usePyodide();
  const [evalStatus, setEvalStatus] = useState<'idle' | 'pass' | 'fail'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSelectChallenge = (index: number) => {
    setCurrentIdx(index);
    setCode(CURRICULUM[index].starterCode);
    setEvalStatus('idle');
    setErrorMessage(null);
  };

  const handleRun = async () => {
    setEvalStatus('idle');
    setErrorMessage(null);
    const result = await runCode(code, activeChallenge.testCode);

    if (result.success) {
      setEvalStatus('pass');
      setXp((prev) => prev + activeChallenge.xpReward);
      setCoins((prev) => prev + activeChallenge.coinReward);
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.8 } });
    } else {
      setEvalStatus('fail');
      setErrorMessage(result.error || 'Assertion failed.');
    }
  };

  return (
    <div className="flex flex-col h-screen bg-questDark text-gray-200">
      <header className="flex items-center justify-between px-4 py-3 bg-questPanel border-b border-questBorder">
        <div className="flex items-center space-x-2">
          <span className="text-xl font-bold tracking-wider text-questAccent">PYQUEST</span>
        </div>
        <div className="flex items-center space-x-5 text-sm">
          <div className="flex items-center space-x-1 text-orange-400">
            <Flame size={16} />
            <span className="font-bold">1d</span>
          </div>
          <div className="flex items-center space-x-1 text-yellow-400">
            <Coins size={16} />
            <span className="font-bold">{coins}</span>
          </div>
          <div className="flex items-center space-x-1 text-purple-400">
            <Award size={16} />
            <span className="font-bold">{xp} XP</span>
          </div>
        </div>
      </header>

      {/* Mobile Bar */}
      <div className="flex md:hidden border-b border-questBorder bg-questPanel">
        <button onClick={() => setTab('brief')} className={`flex-1 py-2 text-xs ${tab === 'brief' ? 'border-b-2 border-questAccent text-white' : 'text-gray-400'}`}>Brief</button>
        <button onClick={() => setTab('editor')} className={`flex-1 py-2 text-xs ${tab === 'editor' ? 'border-b-2 border-questAccent text-white' : 'text-gray-400'}`}>Editor</button>
        <button onClick={() => setTab('output')} className={`flex-1 py-2 text-xs ${tab === 'output' ? 'border-b-2 border-questAccent text-white' : 'text-gray-400'}`}>Terminal</button>
      </div>

      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Sidebar */}
        <div className={`w-full md:w-80 border-r border-questBorder flex flex-col bg-questPanel ${tab !== 'brief' ? 'hidden md:flex' : 'flex'}`}>
          <div className="p-4 border-b border-questBorder">
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Lessons</h2>
            <div className="mt-2 space-y-1">
              {CURRICULUM.map((item, idx) => (
                <button
                  key={item.id}
                  onClick={() => handleSelectChallenge(idx)}
                  className={`w-full text-left px-3 py-2 rounded text-sm ${idx === currentIdx ? 'bg-questAccent/20 text-questAccent' : 'hover:bg-questBorder/30 text-gray-300'}`}
                >
                  {item.title}
                </button>
              ))}
            </div>
          </div>
          <div className="p-4 flex-1 overflow-y-auto">
            <span className="text-xs px-2 py-0.5 rounded bg-questBorder text-cyan-400 font-mono">Tier: {activeChallenge.tier}</span>
            <h1 className="text-lg font-bold mt-2">{activeChallenge.title}</h1>
            <p className="mt-2 text-sm text-gray-300">{activeChallenge.description}</p>
          </div>
        </div>

        {/* Code Editor */}
        <div className={`flex-1 flex flex-col ${tab !== 'editor' ? 'hidden md:flex' : 'flex'}`}>
          <div className="flex-1 overflow-hidden">
            <CodeMirror
              value={code}
              height="100%"
              theme="dark"
              extensions={[python()]}
              onChange={(val) => setCode(val)}
              className="h-full text-sm font-mono"
            />
          </div>
          <div className="p-3 bg-questPanel border-t border-questBorder flex justify-end">
            <button
              onClick={handleRun}
              disabled={isRunning}
              className="flex items-center space-x-2 px-4 py-1.5 rounded bg-questAccent hover:bg-sky-400 text-black font-semibold text-sm disabled:opacity-50"
            >
              <Play size={15} fill="black" />
              <span>{isRunning ? 'Running...' : 'Run Code'}</span>
            </button>
          </div>
        </div>

        {/* Terminal */}
        <div className={`w-full md:w-80 border-l border-questBorder flex flex-col bg-[#05070a] font-mono text-xs ${tab !== 'output' ? 'hidden md:flex' : 'flex'}`}>
          <div className="px-4 py-2 border-b border-questBorder text-gray-400 flex justify-between items-center">
            <span>CONSOLE</span>
            {evalStatus === 'pass' && <span className="text-green-400 flex items-center space-x-1"><CheckCircle2 size={12} /><span>Passed</span></span>}
            {evalStatus === 'fail' && <span className="text-red-400 flex items-center space-x-1"><AlertCircle size={12} /><span>Failed</span></span>}
          </div>
          <div className="flex-1 p-3 overflow-y-auto space-y-1">
            {output.map((line, i) => (
              <div key={i} className="text-gray-300">{line}</div>
            ))}
            {errorMessage && <div className="text-red-400 mt-2">{errorMessage}</div>}
          </div>
        </div>
      </div>
    </div>
  );
}
