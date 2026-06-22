'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Editor from '@monaco-editor/react';
import ReactMarkdown from 'react-markdown';
import { useAuth, useSocket, useToast } from '@/providers';
import { Button } from '@/components/ui/button';
import { DifficultyBadge } from '@/components/ui/difficulty-badge';
import Link from 'next/link';
import {
  Loader2,
  ChevronLeft,
  Play,
  Send,
  RotateCcw,
  Sparkles,
  BookOpen,
  Terminal,
  Settings,
  FileCode,
  History,
  Eye,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Problem {
  id: string;
  title: string;
  slug: string;
  description: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  category: string;
  starterCode: string;
  starterFiles?: Record<string, string> | null;
  solvedCount: number;
  attemptCount: number;
}

interface ReactWorkspaceProps {
  problem: Problem;
}

interface ConsoleLog {
  level: 'log' | 'info' | 'warn' | 'error';
  message: string;
  timestamp: number;
}

export default function ReactWorkspace({ problem }: ReactWorkspaceProps) {
  const router = useRouter();
  const { apiFetch } = useAuth();
  const socket = useSocket();
  const { success: showSuccess, error: showError, info: showInfo } = useToast();

  // Load starter files or default files
  const defaultFiles = problem.starterFiles || {
    'Counter.js': problem.starterCode,
    'App.js': `function App() {
  return (
    <div className="p-4 text-center">
      <h1 className="text-xl font-bold mb-4">React App</h1>
      <Counter />
    </div>
  );
}`,
    'styles.css': `body {
  font-family: sans-serif;
  background-color: #121212;
  color: #ffffff;
  margin: 0;
}`,
  };

  const [files, setFiles] = useState<Record<string, string>>(defaultFiles);
  const [activeFile, setActiveFile] = useState<string>(
    Object.keys(defaultFiles).find((f) => f.endsWith('.js') && f !== 'App.js') || 'App.js',
  );

  // Settings
  const [fontSize, setFontSize] = useState<number>(14);
  const [editorTheme, setEditorTheme] = useState<'vs-dark' | 'light'>('vs-dark');

  // Preview state
  const [previewSrcdoc, setPreviewSrcdoc] = useState<string>('');
  const [consoleLogs, setConsoleLogs] = useState<ConsoleLog[]>([]);
  const [rightTab, setRightTab] = useState<'preview' | 'console' | 'result'>('preview');

  // Run & Submit state
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeJobId, setActiveJobId] = useState<string | null>(null);
  const [consoleOutput, setConsoleOutput] = useState<{
    status: string;
    stdout?: string;
    passed?: boolean;
    error?: string;
  } | null>(null);

  // AI Hint state
  const [hint, setHint] = useState<string | null>(null);
  const [hintError, setHintError] = useState<string | null>(null);
  const [isHintLoading, setIsHintLoading] = useState(false);

  // Debounced update for iframe srcdoc
  useEffect(() => {
    const timer = setTimeout(() => {
      buildPreviewHtml();
    }, 500);

    return () => clearTimeout(timer);
  }, [files]);

  const cleanCode = (code: string) => {
    return code
      .replace(/import\s+.*?\s+from\s+['"]react['"];?/g, '')
      .replace(/import\s+.*?\s+from\s+['"]react-dom['"];?/g, '')
      .replace(/import\s+.*?\s+from\s+['"].*?['"];?/g, '')
      .replace(/export\s+default\s+/g, '')
      .replace(/export\s+const\s+/g, 'const ')
      .replace(/export\s+function\s+/g, 'function ');
  };

  const buildPreviewHtml = () => {
    let cssContent = '';
    let jsContent = '';

    for (const [filename, content] of Object.entries(files)) {
      if (filename.endsWith('.css')) {
        cssContent += content + '\n';
      } else if (filename.endsWith('.js') || filename.endsWith('.jsx')) {
        jsContent += cleanCode(content) + '\n';
      }
    }

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          ${cssContent}
        </style>
        <script src="https://unpkg.com/react@19/umd/react.development.js" crossorigin></script>
        <script src="https://unpkg.com/react-dom@19/umd/react-dom.development.js" crossorigin></script>
        <script src="https://unpkg.com/@babel/standalone/babel.min.js" crossorigin></script>
        <script>
          // Intercept console messages and post to parent window
          const createLogInterceptor = (level) => {
            const original = console[level];
            console[level] = (...args) => {
              original.apply(console, args);
              window.parent.postMessage({
                type: 'REACT_CONSOLE',
                level,
                message: args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : String(arg)).join(' ')
              }, '*');
            };
          };

          createLogInterceptor('log');
          createLogInterceptor('info');
          createLogInterceptor('warn');
          createLogInterceptor('error');

          window.onerror = (message, source, lineno, colno, error) => {
            window.parent.postMessage({
              type: 'REACT_CONSOLE',
              level: 'error',
              message: \`Runtime Error: \${message}\`
            }, '*');
            return false;
          };
        </script>
      </head>
      <body>
        <div id="root"></div>
        <script type="text/babel">
          try {
            ${jsContent}

            const AppComp = typeof App !== 'undefined' ? App : (typeof Counter !== 'undefined' ? Counter : null);
            if (AppComp) {
              const root = ReactDOM.createRoot(document.getElementById('root'));
              root.render(React.createElement(AppComp));
            } else {
              console.error('No renderable component found (define App or Counter)');
            }
          } catch (err) {
            console.error(err.message || String(err));
          }
        </script>
      </body>
      </html>
    `;

    setPreviewSrcdoc(html);
  };

  // Listen for logs from preview iframe
  useEffect(() => {
    const handleIframeMessage = (event: MessageEvent) => {
      if (event.data?.type === 'REACT_CONSOLE') {
        setConsoleLogs((prev) => [
          ...prev,
          {
            level: event.data.level,
            message: event.data.message,
            timestamp: Date.now(),
          },
        ]);
      }
    };

    window.addEventListener('message', handleIframeMessage);
    return () => window.removeEventListener('message', handleIframeMessage);
  }, []);

  // Listen for real-time WebSocket updates
  useEffect(() => {
    if (!socket || !activeJobId) return;

    const handleStatusUpdate = (payload: {
      submissionId: string;
      status: string;
      data?: any;
      error?: string;
    }) => {
      if (payload.submissionId !== activeJobId) return;

      if (payload.status === 'PROCESSING') {
        setConsoleOutput({
          status: 'Processing',
          stdout: 'Executing UI component tests inside sandboxed JSDOM container...',
        });
      } else {
        setIsRunning(false);
        setIsSubmitting(false);
        setActiveJobId(null);

        if (
          payload.status === 'ACCEPTED' ||
          payload.status === 'SUCCESS' ||
          payload.status === 'Finished'
        ) {
          showSuccess('All component tests passed! Solution Accepted.');
        } else if (payload.status === 'WRONG_ANSWER') {
          showError('Wrong Answer: Test case assertions failed.');
        } else if (payload.status === 'RUNTIME_ERROR') {
          showError('Runtime Error: Code execution crashed.');
        } else if (payload.status === 'COMPILATION_ERROR') {
          showError('Compilation Error: Check syntax/JSX.');
        } else {
          showError('Execution failed: ' + payload.status);
        }

        let stdout = '';
        if (payload.error) {
          stdout = payload.error;
        } else if (payload.data?.results) {
          const results = payload.data.results as Array<{
            id: string;
            passed: boolean;
            actual: any;
            expected: any;
            runtime: number;
            error?: string;
          }>;
          stdout = results
            .map((res, i) => {
              const tcTitle = `Test Case ${i + 1}: ${res.passed ? 'PASSED ✅' : 'FAILED ❌'} (${res.runtime}ms)`;
              const detail = res.passed
                ? 'Component interactions matched expected UI states.'
                : `Error: ${res.error || 'UI state mismatch.'}`;
              return `${tcTitle}\n${detail}`;
            })
            .join('\n\n');
        } else if (payload.data) {
          const d = payload.data;
          stdout = `Passed Cases: ${d.passedCases} / ${d.totalCases}\nRuntime: ${d.runtime} ms`;
        }

        setConsoleOutput({
          status: payload.status,
          stdout,
          passed:
            payload.status === 'ACCEPTED' ||
            payload.status === 'Finished' ||
            payload.status === 'SUCCESS',
          error: payload.error,
        });
      }
    };

    socket.on('submission:status', handleStatusUpdate);
    return () => {
      socket.off('submission:status', handleStatusUpdate);
    };
  }, [socket, activeJobId]);

  const handleRunCode = async () => {
    setIsRunning(true);
    setRightTab('result');
    setConsoleOutput({
      status: 'Queueing',
      stdout: 'Queueing React component execution in the sandbox...',
    });
    showInfo('Code execution queued...');

    try {
      const result = await apiFetch<{ jobId: string; status: string }>('/api/submissions/run', {
        method: 'POST',
        body: JSON.stringify({
          problemId: problem.id,
          code: files[activeFile],
          files,
          language: 'javascript',
        }),
      });

      setActiveJobId(result.jobId);
    } catch (err: any) {
      setIsRunning(false);
      const errMsg = err.message || 'Failed to trigger runner';
      setConsoleOutput({
        status: 'Error',
        error: errMsg,
      });
      showError(errMsg);
    }
  };

  const handleSubmitCode = async () => {
    setIsSubmitting(true);
    setRightTab('result');
    setConsoleOutput({
      status: 'Queueing',
      stdout: 'Queueing React submission to the judge...',
    });
    showInfo('React submission queued...');

    try {
      const result = await apiFetch<{ id: string; status: string }>('/api/submissions', {
        method: 'POST',
        body: JSON.stringify({
          problemId: problem.id,
          code: files[activeFile],
          files,
          language: 'javascript',
        }),
      });

      setActiveJobId(result.id);
    } catch (err: any) {
      setIsSubmitting(false);
      const errMsg = err.message || 'Failed to submit solution';
      setConsoleOutput({
        status: 'Error',
        error: errMsg,
      });
      showError(errMsg);
    }
  };

  const handleResetCode = () => {
    if (confirm('Are you sure you want to reset all files to their starter templates?')) {
      setFiles(defaultFiles);
      setConsoleLogs([]);
    }
  };

  const handleFileChange = (value: string | undefined) => {
    if (value === undefined) return;
    setFiles((prev) => ({
      ...prev,
      [activeFile]: value,
    }));
  };

  const handleFetchHint = async () => {
    setIsHintLoading(true);
    setHintError(null);
    try {
      const response = await apiFetch<{ hint: string }>(`/api/problems/${problem.slug}/hint`, {
        method: 'POST',
        body: JSON.stringify({ code: files[activeFile] }),
      });
      setHint(response.hint);
      showSuccess('AI Hint generated!');
    } catch (err: any) {
      const msg = err.message || 'Failed to generate hint';
      setHintError(msg);
      showError(msg);
    } finally {
      setIsHintLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-5.5rem)] -m-4 overflow-hidden bg-[#1e1e1e] text-foreground">
      {/* Workspace Header */}
      <div className="flex items-center justify-between px-6 py-2 border-b border-zinc-800 bg-[#151515] select-none">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push('/problems')}
            className="rounded-lg h-9 hover:bg-zinc-800 active:scale-95 text-zinc-400 hover:text-white transition-all flex items-center gap-1.5"
          >
            <ChevronLeft size={16} />
            Back
          </Button>
          <div className="h-4 w-px bg-zinc-800 hidden sm:block" />
          <h1 className="text-sm font-bold truncate text-zinc-200">{problem.title}</h1>
          <DifficultyBadge difficulty={problem.difficulty} />
          <span className="text-[10px] font-extrabold tracking-wider bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded-full uppercase">
            React Workspace
          </span>
        </div>

        {/* Editor Config Controls */}
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-1 bg-zinc-900 border border-zinc-800 px-2.5 py-1 rounded-lg">
            <Settings size={12} className="text-zinc-500" />
            <select
              value={fontSize}
              onChange={(e) => setFontSize(Number(e.target.value))}
              className="bg-transparent text-[11px] font-semibold text-zinc-300 outline-none cursor-pointer pr-1"
            >
              <option value="12">12px</option>
              <option value="14">14px</option>
              <option value="16">16px</option>
              <option value="18">18px</option>
            </select>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setEditorTheme(editorTheme === 'vs-dark' ? 'light' : 'vs-dark')}
            className="h-8.5 text-xs font-semibold rounded-lg border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800"
          >
            {editorTheme === 'vs-dark' ? 'Light Theme' : 'Dark Theme'}
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleResetCode}
            className="h-8.5 text-xs font-semibold rounded-lg border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800 active:scale-95 transition-all"
            title="Reset files to template"
          >
            <RotateCcw size={14} />
          </Button>
        </div>
      </div>

      {/* 3-Panel Main Layout */}
      <div className="flex-1 flex overflow-hidden min-h-0">
        {/* Panel 1: Description (25% width) */}
        <div className="w-[25%] flex flex-col border-r border-zinc-800 bg-[#181818] overflow-hidden">
          <div className="flex items-center justify-between px-6 py-2.5 border-b border-zinc-800 bg-[#151515] shrink-0 text-xs font-semibold text-zinc-400 select-none">
            <div className="flex items-center gap-1.5">
              <BookOpen size={13} className="text-zinc-500" />
              Problem Description
            </div>
            <Link
              href="/submissions"
              className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1 active:scale-95 transition-all"
            >
              <History size={12} />
              History
            </Link>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-5 prose prose-indigo dark:prose-invert max-w-none text-sm text-zinc-300 scrollbar-thin">
            <ReactMarkdown>{problem.description}</ReactMarkdown>

            {/* AI Hint Section */}
            <div className="mt-8 pt-6 border-t border-zinc-800 not-prose">
              <div className="bg-gradient-to-br from-indigo-500/5 to-violet-500/5 rounded-xl border border-indigo-500/10 p-4.5 space-y-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
                  <h4 className="text-xs font-bold text-zinc-200">AI Component Hints</h4>
                </div>

                <p className="text-[11px] text-zinc-400 leading-relaxed">
                  Stuck on this component's logic or event handling? Let the AI analyze your active
                  file and provide a conceptual hint.
                </p>

                {hint && (
                  <div className="bg-zinc-900 border border-indigo-500/10 rounded-lg p-3 text-[11px] text-zinc-300 leading-relaxed shadow-sm">
                    <span className="inline-block text-[9px] font-bold text-indigo-400 uppercase tracking-wider mb-1">
                      AI Hint
                    </span>
                    <p>{hint}</p>
                  </div>
                )}

                {hintError && (
                  <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-lg p-3 text-[11px] font-semibold leading-relaxed">
                    <span>{hintError}</span>
                  </div>
                )}

                <div className="flex justify-end pt-1">
                  <Button
                    onClick={handleFetchHint}
                    disabled={isHintLoading}
                    size="sm"
                    className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold shadow-md active:scale-95 transition-all flex items-center gap-1.5"
                  >
                    {isHintLoading ? (
                      <>
                        <Loader2 className="w-3 h-3 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3 h-3" />
                        Get AI Hint
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Panel 2: Multi-tab Monaco Editor (40% width) */}
        <div className="w-[40%] flex flex-col border-r border-zinc-800 bg-[#1e1e1e] overflow-hidden">
          {/* File Tabs Bar */}
          <div className="flex items-center justify-between border-b border-zinc-800 bg-[#151515] shrink-0 select-none overflow-x-auto scrollbar-none">
            <div className="flex">
              {Object.keys(files).map((filename) => (
                <button
                  key={filename}
                  onClick={() => setActiveFile(filename)}
                  className={cn(
                    'px-4 py-2 border-r border-zinc-800 text-xs font-medium font-mono tracking-wide flex items-center gap-1.5 transition-all cursor-pointer',
                    activeFile === filename
                      ? 'bg-[#1e1e1e] text-zinc-200 border-t-2 border-t-indigo-500 font-bold'
                      : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900',
                  )}
                >
                  <FileCode
                    size={13}
                    className={activeFile === filename ? 'text-indigo-400' : 'text-zinc-600'}
                  />
                  {filename}
                </button>
              ))}
            </div>
            <div className="px-4 text-[9px] font-mono font-extrabold text-zinc-600 uppercase tracking-widest">
              Editor
            </div>
          </div>

          {/* Editor view */}
          <div className="flex-1 min-h-0 bg-[#1e1e1e]">
            <Editor
              height="100%"
              language={activeFile.endsWith('.css') ? 'css' : 'javascript'}
              theme={editorTheme}
              value={files[activeFile]}
              onChange={handleFileChange}
              options={{
                fontSize: fontSize,
                minimap: { enabled: false },
                scrollbar: {
                  vertical: 'visible',
                  horizontal: 'visible',
                  verticalScrollbarSize: 8,
                  horizontalScrollbarSize: 8,
                },
                scrollBeyondLastLine: false,
                lineNumbers: 'on',
                automaticLayout: true,
                fontFamily:
                  'Fira Code, JetBrains Mono, source-code-pro, Menlo, Monaco, Consolas, Courier New, monospace',
                fontLigatures: true,
                padding: { top: 12, bottom: 12 },
              }}
            />
          </div>
        </div>

        {/* Panel 3: Live Preview & Console Output (35% width) */}
        <div className="w-[35%] flex flex-col bg-[#121212] overflow-hidden">
          {/* Header tabs for Right Panel */}
          <div className="flex items-center justify-between border-b border-zinc-800 bg-[#151515] shrink-0 select-none">
            <div className="flex">
              <button
                onClick={() => setRightTab('preview')}
                className={cn(
                  'px-4 py-2 border-r border-zinc-800 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer',
                  rightTab === 'preview'
                    ? 'bg-[#121212] text-zinc-200 border-t-2 border-t-indigo-500'
                    : 'text-zinc-500 hover:text-zinc-300',
                )}
              >
                <Eye size={13} />
                Live Preview
              </button>
              <button
                onClick={() => setRightTab('console')}
                className={cn(
                  'px-4 py-2 border-r border-zinc-800 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer',
                  rightTab === 'console'
                    ? 'bg-[#121212] text-zinc-200 border-t-2 border-t-indigo-500'
                    : 'text-zinc-500 hover:text-zinc-300',
                )}
              >
                <Terminal size={13} />
                Console logs
                {consoleLogs.length > 0 && (
                  <span className="ml-1 bg-amber-500/20 text-amber-400 font-extrabold text-[9px] px-1.5 py-0.5 rounded-full">
                    {consoleLogs.length}
                  </span>
                )}
              </button>
              <button
                onClick={() => setRightTab('result')}
                className={cn(
                  'px-4 py-2 border-r border-zinc-800 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer',
                  rightTab === 'result'
                    ? 'bg-[#121212] text-zinc-200 border-t-2 border-t-indigo-500'
                    : 'text-zinc-500 hover:text-zinc-300',
                )}
              >
                <Sparkles size={13} />
                Sandbox Result
              </button>
            </div>
            {rightTab === 'console' && consoleLogs.length > 0 && (
              <button
                onClick={() => setConsoleLogs([])}
                className="px-3 text-[10px] text-zinc-500 hover:text-zinc-300 font-semibold cursor-pointer active:scale-95 transition-all"
              >
                Clear
              </button>
            )}
          </div>

          {/* Right tab content */}
          <div className="flex-1 relative overflow-hidden min-h-0 bg-[#121212]">
            {rightTab === 'preview' && (
              <div className="w-full h-full bg-[#121212] flex flex-col">
                {previewSrcdoc ? (
                  <iframe
                    title="Live Preview Sandbox"
                    srcDoc={previewSrcdoc}
                    sandbox="allow-scripts"
                    className="w-full h-full bg-[#121212] border-0"
                  />
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-zinc-600 gap-2 select-none">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span className="text-xs">Loading Live Sandbox...</span>
                  </div>
                )}
              </div>
            )}

            {rightTab === 'console' && (
              <div className="w-full h-full overflow-y-auto px-5 py-4 font-mono text-[11px] space-y-2.5 scrollbar-thin bg-[#151515]">
                {consoleLogs.length === 0 ? (
                  <div className="text-zinc-600 text-center py-10 select-none">
                    No console messages. Call console.log() in your code to view logs.
                  </div>
                ) : (
                  consoleLogs.map((log, index) => (
                    <div
                      key={index}
                      className={cn(
                        'pb-1.5 border-b border-zinc-900/60 leading-relaxed flex items-start gap-2',
                        log.level === 'error' && 'text-rose-400',
                        log.level === 'warn' && 'text-amber-400',
                        log.level === 'info' && 'text-cyan-400',
                        log.level === 'log' && 'text-zinc-300',
                      )}
                    >
                      <span className="opacity-45 text-[9px] shrink-0 font-sans mt-0.5 select-none">
                        {new Date(log.timestamp).toLocaleTimeString([], {
                          hour12: false,
                          hour: '2-digit',
                          minute: '2-digit',
                          second: '2-digit',
                        })}
                      </span>
                      <span className="font-extrabold uppercase text-[8px] tracking-wider px-1.5 rounded shrink-0 select-none bg-zinc-900 border border-zinc-800">
                        {log.level}
                      </span>
                      <pre className="whitespace-pre-wrap word-break-all font-mono">
                        {log.message}
                      </pre>
                    </div>
                  ))
                )}
              </div>
            )}

            {rightTab === 'result' && (
              <div className="w-full h-full overflow-y-auto px-6 py-5 font-mono text-xs text-zinc-300 leading-normal scrollbar-thin bg-[#151515]">
                {isRunning ? (
                  <div className="flex flex-col items-center justify-center gap-2.5 text-zinc-400 py-10 select-none animate-pulse">
                    <Loader2 size={16} className="animate-spin text-indigo-400" />
                    <span>Executing code against JSDOM test cases...</span>
                  </div>
                ) : isSubmitting ? (
                  <div className="flex flex-col items-center justify-center gap-2.5 text-zinc-400 py-10 select-none animate-pulse">
                    <Loader2 size={16} className="animate-spin text-emerald-500" />
                    <span>Submitting solution to judge worker queue...</span>
                  </div>
                ) : consoleOutput ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 select-none">
                      <span
                        className={cn(
                          'px-2.5 py-0.5 rounded text-[10px] font-extrabold tracking-wider uppercase border',
                          consoleOutput.status === 'Accepted' ||
                            consoleOutput.status === 'Finished' ||
                            consoleOutput.status === 'ACCEPTED' ||
                            consoleOutput.status === 'SUCCESS'
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                            : 'bg-rose-500/10 text-rose-400 border-rose-500/20',
                        )}
                      >
                        {consoleOutput.status}
                      </span>
                    </div>
                    <pre className="p-3 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-300 whitespace-pre-wrap leading-relaxed">
                      {consoleOutput.stdout}
                    </pre>
                  </div>
                ) : (
                  <div className="text-center text-zinc-500 py-10 select-none">
                    Run or Submit code to inspect sandbox test case execution results.
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Console Execution Controls footer in panel 3 */}
          <div className="border-t border-zinc-800 bg-[#151515] px-6 py-3 flex items-center justify-between shrink-0 select-none">
            <div className="text-[10px] font-mono text-zinc-500">Ctrl+Enter to Run Code</div>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={handleRunCode}
                disabled={isRunning || isSubmitting}
                className="h-8.5 px-3 rounded-lg border-zinc-700 bg-zinc-900 text-zinc-300 hover:text-white hover:bg-zinc-800 text-xs font-bold active:scale-95 transition-all"
              >
                {isRunning ? (
                  <Loader2 size={13} className="animate-spin mr-1" />
                ) : (
                  <Play size={12} className="mr-1.5 fill-current" />
                )}
                Run Code
              </Button>
              <Button
                size="sm"
                onClick={handleSubmitCode}
                disabled={isRunning || isSubmitting}
                className="h-8.5 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold active:scale-95 shadow-sm shadow-emerald-600/10 hover:shadow-emerald-500/20 border-transparent transition-all"
              >
                {isSubmitting ? (
                  <Loader2 size={13} className="animate-spin mr-1" />
                ) : (
                  <Send size={12} className="mr-1.5" />
                )}
                Submit
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
