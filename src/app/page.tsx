import Orb from '../components/Orb';
import Header from '../components/Header';
import TextType from '../components/TextType';

export default function Home() {
  return (
    <div className="min-h-screen flex items-start justify-center relative">
      <Header />
      <div className="absolute inset-0 flex items-center justify-center z-20">
  <div className="w-full max-w-7xl px-8 flex items-center gap-12 h-full">
          <div className="flex items-center gap-8">
            {/* Left column: Orb + status */}
            <div className="flex flex-col items-center gap-6">
              <div className="relative w-[450px] h-[450px]">
                <Orb hue={0} hoverIntensity={0.5} rotateOnHover={true} />

                {/* Inner Orb - positioned absolutely within outer orb container */}
                <div className="absolute inset-0 flex items-center justify-center" style={{ zIndex: -1 }}>
                  <div className="w-[290px] h-[290px]">
                    <Orb hue={0} hoverIntensity={0.5} rotateOnHover={true} />
                  </div>
                </div>
              </div>

              <div className="z-30 items-center text-center">
                <TextType
                  as="h1"
                  text="I am Online.."
                  className="text-5xl font-bold text-slate-200 font-orbitron"
                  typingSpeed={40}
                  cursorCharacter="|"
                />
                <p className="mt-2 text-slate-500 font-mono font-bold blur-in">Listening to your command</p>
              </div>
            </div>

            {/* Right column: glass-style chat box (placeholder content styled per your example) */}
            <aside className="glass-ui-enhanced self-end w-[760px] max-w-[60vw] h-[70vh] max-h-[80vh] rounded-xl backdrop-blur-md bg-white/5 border border-white/10 overflow-hidden">
              {/* Message area (moved directly into the aside so there's a single chat box) */}
              <div className="flex-1 p-4 h-full flex flex-col">
                <div className="space-y-4 mb-4 overflow-y-auto p-2 h-64">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-linear-to-br from-purple-600 to-cyan-400 shrink-0 flex items-center justify-center text-sm font-bold text-white">J</div>
                    <div>
                      <p className="font-bold text-white/90">Jarvis</p>
                      <div className="mt-1 text-white/80 bg-black/30 rounded-lg p-3 text-sm">Initializing AI models... Face authentication successful. Welcome back, sir. How may I assist you today?</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 justify-end">
                    <div>
                      <p className="font-bold text-white/90 text-right">You</p>
                      <div className="mt-1 text-white bg-linear-to-r from-purple-600/70 to-cyan-400/70 rounded-lg p-3 text-sm inline-block">Run diagnostics on the main server.</div>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-white/20 shrink-0 flex items-center justify-center text-sm font-bold text-white">Y</div>
                  </div>
                </div>

                {/* Voice-only: input removed (system will be voice operated) */}
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}
