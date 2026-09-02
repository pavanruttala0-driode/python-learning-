import { useState, useEffect, useRef, useCallback } from 'react';

export function usePyodide() {
  const workerRef = useRef<Worker | null>(null);
  const [output, setOutput] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    const worker = new Worker(`${import.meta.env.BASE_URL}pyodideWorker.js`);
    workerRef.current = worker;

    worker.onmessage = (e) => {
      const { type, payload } = e.data;
      if (type === 'STDOUT' || type === 'STDERR') {
        setOutput((prev) => [...prev, payload]);
      }
    };

    return () => worker.terminate();
  }, []);

  const runCode = useCallback((code: string, testCode = ''): Promise<{ success: boolean; error?: string }> => {
    return new Promise((resolve) => {
      if (!workerRef.current) {
        resolve({ success: false, error: 'Worker unavailable' });
        return;
      }

      setIsRunning(true);
      setOutput([]);

      const handleMessage = (e: MessageEvent) => {
        const { type, payload } = e.data;
        if (type === 'SUCCESS') {
          cleanup();
          setIsRunning(false);
          resolve({ success: true });
        } else if (type === 'ERROR') {
          cleanup();
          setIsRunning(false);
          resolve({ success: false, error: payload });
        }
      };

      const cleanup = () => {
        workerRef.current?.removeEventListener('message', handleMessage);
      };

      workerRef.current.addEventListener('message', handleMessage);
      workerRef.current.postMessage({ code, testCode });
    });
  }, []);

  return { runCode, output, isRunning };
}
