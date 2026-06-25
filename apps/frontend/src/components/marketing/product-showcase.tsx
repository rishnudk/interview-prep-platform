export function ProductShowcase() {
  return (
    <section className="w-full max-w-[1200px] mx-auto px-6 relative mt-8 mb-24 z-10">
      {/* Product Mockup Container */}
      <div className="relative rounded-[16px] bg-[#191919] border border-white/5 overflow-hidden shadow-[0_0_44px_rgba(0,0,0,0.8)] aspect-[16/10] md:aspect-video flex flex-col">
        {/* Top bar */}
        <div className="h-12 border-b border-[#525252]/30 flex items-center px-4 gap-4 bg-[#131313]">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-[#525252]/50" />
            <div className="w-3 h-3 rounded-full bg-[#525252]/50" />
            <div className="w-3 h-3 rounded-full bg-[#525252]/50" />
          </div>
          <div className="flex-1 flex justify-center">
            <div className="bg-[#191919] text-[#868f97] text-xs font-medium px-6 py-1.5 rounded-full border border-white/5">
              Problems → Strings → Reverse String
            </div>
          </div>
          <div className="w-16 hidden md:block" />
        </div>

        {/* Main Workspace layout */}
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <div className="w-48 border-r border-[#525252]/30 bg-[#131313] p-4 hidden md:flex flex-col gap-1">
            <div className="text-[#868f97] text-xs font-semibold mb-2 uppercase tracking-wider">
              Menu
            </div>
            {['Dashboard', 'Problems', 'Submissions', 'Progress', 'Analytics', 'Settings'].map(
              (item, i) => (
                <div
                  key={item}
                  className={`px-3 py-2 rounded-[10px] text-sm font-medium ${i === 1 ? 'bg-[#191919] text-white border border-white/5' : 'text-[#868f97] hover:text-[#cccccc]'}`}
                >
                  {item}
                </div>
              ),
            )}

            <div className="mt-auto">
              <div className="flex items-center gap-3 p-2 bg-[#0b0b0b] rounded-[10px] border border-white/5">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#479ffa] to-[#191919]" />
                <div>
                  <div className="text-white text-xs font-medium">Dev User</div>
                  <div className="text-[#868f97] text-[10px]">dev@example.com</div>
                </div>
              </div>
            </div>
          </div>

          {/* Problem Area */}
          <div className="flex-1 flex flex-col min-w-0 border-r border-[#525252]/30 bg-[#191919]">
            <div className="p-6 overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl text-white font-bold tracking-tight">Reverse String</h2>
                <span className="px-3 py-1 rounded-full bg-[#4ebe96]/10 text-[#4ebe96] text-xs font-semibold border border-[#4ebe96]/20">
                  Easy
                </span>
              </div>
              <p className="text-[#cccccc] text-sm mb-8">
                Given a string, return the string with all characters reversed.
              </p>

              <div className="text-white text-sm font-semibold mb-3">Example</div>
              <div className="bg-[#0b0b0b] border border-white/5 rounded-[10px] p-4 mb-6">
                <div className="text-[#868f97] text-xs mb-2">Input</div>
                <code className="text-[#479ffa] font-mono text-sm">"hello"</code>
                <div className="text-[#868f97] text-xs mt-4 mb-2">Output</div>
                <code className="text-[#479ffa] font-mono text-sm">"olleh"</code>
              </div>

              <div className="text-white text-sm font-semibold mb-3">Submission Result</div>
              <div className="bg-[#4ebe96]/5 border border-[#4ebe96]/20 rounded-[10px] p-4 flex flex-col gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#4ebe96] shadow-[0_0_8px_#4ebe96]" />
                  <span className="text-[#4ebe96] font-medium text-sm">Accepted</span>
                </div>
                <div className="flex gap-8 text-sm">
                  <div>
                    <div className="text-[#868f97] text-xs">Runtime</div>
                    <div className="text-white font-mono mt-1">24 ms</div>
                  </div>
                  <div>
                    <div className="text-[#868f97] text-xs">Memory</div>
                    <div className="text-white font-mono mt-1">7 MB</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Code Editor Area */}
          <div className="flex-1 hidden lg:flex flex-col min-w-0 bg-[#0b0b0b] relative">
            <div className="h-10 border-b border-[#525252]/30 flex items-center px-4 justify-between bg-[#131313]">
              <div className="text-[#868f97] text-xs font-mono">solution.js</div>
              <div className="text-[#479ffa] text-xs font-mono">JavaScript</div>
            </div>
            <div className="p-4 font-mono text-sm leading-loose overflow-hidden">
              <div className="text-[#479ffa]">
                function <span className="text-white">reverseString</span>
                <span className="text-[#cccccc]">(</span>
                <span className="text-orange-400">str</span>
                <span className="text-[#cccccc]">) {'{'}</span>
              </div>
              <div className="pl-6">
                <span className="text-purple-400">return</span> str.split(
                <span className="text-[#4ebe96]">""</span>).reverse().join(
                <span className="text-[#4ebe96]">""</span>);
              </div>
              <div className="text-[#cccccc]">{'}'}</div>
            </div>

            {/* Floating Execution Badge */}
            <div className="absolute bottom-6 right-6 px-4 py-2 bg-[#131313] border border-white/10 rounded-full shadow-lg flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-[#4ebe96] shadow-[0_0_8px_#4ebe96] animate-pulse" />
              <span className="text-[#cccccc] text-xs font-mono">Node.js 22 Running</span>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Widgets Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
        <div className="bg-[#191919] border border-white/5 rounded-[16px] p-6 shadow-[0_0_20px_rgba(0,0,0,0.5)]">
          <div className="text-[#868f97] text-xs uppercase tracking-wider mb-4">Current Streak</div>
          <div className="text-3xl font-bold text-white tracking-[-0.05em]">
            18 Days{' '}
            <span className="bg-[var(--image-fey-ember)] text-transparent bg-clip-text">🔥</span>
          </div>
        </div>

        <div className="bg-[#191919] border border-white/5 rounded-[16px] p-6 shadow-[0_0_20px_rgba(0,0,0,0.5)]">
          <div className="text-[#868f97] text-xs uppercase tracking-wider mb-4">
            Problems Solved
          </div>
          <div className="text-3xl font-bold text-white tracking-[-0.05em]">127</div>
          <div className="mt-3 h-1 bg-[#0b0b0b] rounded-full overflow-hidden border border-white/5">
            <div className="h-full bg-[#479ffa] w-[80%]" />
          </div>
        </div>

        <div className="bg-[#191919] border border-white/5 rounded-[16px] p-6 shadow-[0_0_20px_rgba(0,0,0,0.5)]">
          <div className="text-[#868f97] text-xs uppercase tracking-wider mb-4">Success Rate</div>
          <div className="text-3xl font-bold text-white tracking-[-0.05em]">91%</div>
        </div>

        <div className="bg-[#191919] border border-[var(--color-fey-ember)]/30 rounded-[16px] p-6 shadow-[0_0_20px_rgba(0,0,0,0.5)] relative overflow-hidden">
          <div className="absolute inset-0 bg-[var(--image-fey-ember)] opacity-[0.03]" />
          <div className="relative">
            <div className="text-white/60 text-xs uppercase tracking-wider mb-4">Global Rank</div>
            <div className="text-3xl font-bold text-white tracking-[-0.05em]">#1,248</div>
            <div className="mt-1 text-[#ff8a5c] text-xs font-medium">Top 5% this week</div>
          </div>
        </div>
      </div>
    </section>
  );
}
