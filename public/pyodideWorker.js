importScripts('https://cdn.jsdelivr.net/pyodide/v0.26.1/full/pyodide.js');

let pyodideReadyPromise = loadPyodide({
  stdout: (text) => postMessage({ type: 'STDOUT', payload: text }),
  stderr: (text) => postMessage({ type: 'STDERR', payload: text }),
});

self.onmessage = async (event) => {
  const { code, testCode } = event.data;
  const pyodide = await pyodideReadyPromise;

  try {
    await pyodide.runPythonAsync(code);
    if (testCode) {
      await pyodide.runPythonAsync(testCode);
    }
    postMessage({ type: 'SUCCESS' });
  } catch (err) {
    postMessage({ type: 'ERROR', payload: err.message });
  }
};
