import { vi, describe, it, expect, beforeEach, beforeAll } from 'vitest';
import fs from 'fs';

// Setup dynamic mock registry on globalThis before vi.mock and before importing ReactExecutor
(globalThis as any).mockCreateContainer = vi.fn();

vi.mock('dockerode', () => {
  return {
    default: vi.fn().mockImplementation(() => ({
      createContainer: (...args: any[]) => (globalThis as any).mockCreateContainer(...args),
    })),
  };
});

let ReactExecutorClass: any;

describe('ReactExecutor Unit Tests', () => {
  let executor: any;

  const mockStart = vi.fn();
  const mockPutArchive = vi.fn().mockImplementation((stream) => {
    if (stream && typeof stream.destroy === 'function') {
      stream.destroy();
    }
    return Promise.resolve();
  });
  const mockStop = vi.fn();
  const mockRemove = vi.fn();
  const mockInspect = vi.fn();
  const mockExecStart = vi.fn();
  const mockExecInspect = vi.fn();

  const mockExec = vi.fn().mockResolvedValue({
    start: mockExecStart,
    inspect: mockExecInspect,
  });

  const mockContainer = {
    start: mockStart,
    putArchive: mockPutArchive,
    exec: mockExec,
    stop: mockStop,
    remove: mockRemove,
    inspect: mockInspect,
    modem: {
      demuxStream: vi.fn((_stream, _stdout, _stderr) => {
        // Mock default behavior does nothing
      }),
    },
  };

  const testCases = [
    {
      id: '1',
      input:
        '{"steps":[{"action":"click","testId":"increment-btn"}],"assertions":[{"testId":"count-display","text":"1"}]}',
      expectedOutput: '"passed"',
    },
  ];

  beforeAll(async () => {
    const mod = await import('./ReactExecutor.js');
    ReactExecutorClass = mod.ReactExecutor;
  });

  beforeEach(() => {
    vi.clearAllMocks();
    executor = new ReactExecutorClass();

    mockInspect.mockResolvedValue({
      State: { ExitCode: 0 },
    });

    mockExecInspect.mockResolvedValue({
      ExitCode: 0,
    });

    mockContainer.modem.demuxStream = vi.fn();
    (globalThis as any).mockCreateContainer.mockResolvedValue(mockContainer);

    vi.spyOn(fs, 'createReadStream').mockImplementation(() => {
      const { PassThrough } = require('stream');
      return new PassThrough();
    });
  });

  describe('Sandbox Execution', () => {
    it('should return success when SQL runner output returns all passed', async () => {
      // Mock stream end & write to stdout
      mockExecStart.mockResolvedValue({
        on: vi.fn((event, cb) => {
          if (event === 'end') {
            setTimeout(cb, 10);
          }
        }),
      });

      // Mock demux to write the JSON results to stdout stream
      mockContainer.modem.demuxStream = vi.fn((_execStream, stdoutStream, _stderrStream) => {
        stdoutStream.write(
          Buffer.from(
            JSON.stringify({
              results: [
                {
                  id: '1',
                  passed: true,
                  actual: 'passed',
                  expected: 'passed',
                  runtime: 12.34,
                  error: null,
                },
              ],
            }),
          ),
        );
      });

      const res = await executor.execute('sub-react-123', 'function Counter() {}', testCases);

      expect(res.passed).toBe(true);
      expect(res.passedCases).toBe(1);
      expect(res.totalCases).toBe(1);
      expect(res.results[0].passed).toBe(true);
    });

    it('should report runtime error if runner script exits with non-zero exit code', async () => {
      mockExecStart.mockResolvedValue({
        on: vi.fn((event, cb) => {
          if (event === 'end') cb();
        }),
      });

      mockExecInspect.mockResolvedValue({
        ExitCode: 1,
      });

      mockContainer.modem.demuxStream = vi.fn((_execStream, _stdoutStream, stderrStream) => {
        stderrStream.write(Buffer.from('SyntaxError: Unexpected token'));
      });

      const res = await executor.execute('sub-react-123', 'function Counter() {}', testCases);

      expect(res.passed).toBe(false);
      expect(res.error).toBe('SyntaxError: Unexpected token');
    });

    it('should timeout if container execution hangs', async () => {
      // Return a dummy stream that never ends
      mockExecStart.mockResolvedValue({
        on: vi.fn(),
      });

      const res = await executor.execute('sub-react-123', 'function Counter() {}', testCases, 100);

      expect(res.passed).toBe(false);
      expect(res.error).toContain('Time Limit Exceeded');
    });

    it('should handle malformed runner output gracefully', async () => {
      mockExecStart.mockResolvedValue({
        on: vi.fn((event, cb) => {
          if (event === 'end') cb();
        }),
      });

      mockContainer.modem.demuxStream = vi.fn((_execStream, stdoutStream, _stderrStream) => {
        stdoutStream.write(Buffer.from('Not a JSON output'));
      });

      const res = await executor.execute('sub-react-123', 'function Counter() {}', testCases);

      expect(res.passed).toBe(false);
      expect(res.error).toContain('Output format error');
    });
  });
});
