import { useState, useRef } from 'react'
import { Scale, Lock, FileText, CheckCheck, Download } from 'lucide-react'

const STEPS = [
  { p: 20, t: 'OCR: Läser in dokumenttext...' },
  { p: 45, t: 'Identifierar tillämpliga lagrum...' },
  { p: 75, t: 'Letar efter motstridiga uppgifter...' },
  { p: 95, t: 'Formulerar juridiskt yttrande...' },
  { p: 100, t: 'Klart!' },
]

export default function App() {
  const [view, setView] = useState('upload')
  const [step, setStep] = useState(1)
  const [progress, setProgress] = useState(0)
  const [statusMsg, setStatusMsg] = useState('Läser paragrafer...')
  const fileInputRef = useRef(null)

  function simulateProcessing() {
    setView('analyzing')
    setStep(2)
    STEPS.forEach((s, i) => {
      setTimeout(() => {
        setProgress(s.p)
        setStatusMsg(s.t)
        if (s.p === 100) {
          setTimeout(() => {
            setView('result')
            setStep(3)
          }, 600)
        }
      }, (i + 1) * 1200)
    })
  }

  function reset() {
    setView('upload')
    setStep(1)
    setProgress(0)
    setStatusMsg('Läser paragrafer...')
  }

  return (
    <div className="bg-[#f8fafc] text-slate-900 min-h-screen">
      {/* Header */}
      <nav className="bg-white/80 sticky top-0 z-50 backdrop-blur-md border-b border-slate-200 px-6 py-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2 font-bold text-2xl text-blue-800 tracking-tight">
            <Scale className="w-8 h-8" />
            <span>
              Rättshjälp
              <span className="text-blue-500 underline decoration-2 underline-offset-4">AI</span>
            </span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <a href="#" className="hover:text-blue-600 transition">Hur det fungerar</a>
            <a href="#" className="hover:text-blue-600 transition">Priser</a>
            <a href="#" className="bg-blue-50 text-blue-700 px-4 py-2 rounded-full flex items-center gap-2">
              <Lock className="w-4 h-4" /> Logga in med BankID
            </a>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-16">
        {/* Stepper */}
        <div className="flex justify-between mb-16 relative max-w-2xl mx-auto">
          {[
            { num: 1, label: 'Ladda upp' },
            { num: 2, label: 'Analys' },
            { num: 3, label: 'Färdigt' },
          ].map(({ num, label }) => (
            <div key={num} className="flex flex-col items-center z-10">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold mb-3 transition-all ${
                step >= num
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
                  : 'bg-white border-2 border-slate-200 text-slate-400'
              }`}>
                {num}
              </div>
              <span className={`text-xs font-bold uppercase tracking-widest ${
                step >= num ? 'text-blue-600' : 'text-slate-400'
              }`}>
                {label}
              </span>
            </div>
          ))}
          <div className="absolute top-6 left-0 w-full h-[2px] bg-slate-200 -z-0" />
        </div>

        {/* View: Upload */}
        {view === 'upload' && (
          <section>
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">
                Fått ett avslag? <br />
                <span className="text-blue-600">Vi hjälper dig att vinna.</span>
              </h1>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
                Vår AI analyserar ditt beslut mot gällande lagstiftning och skriver ett professionellt
                överklagande på under 60 sekunder.
              </p>
            </div>

            <div className="glass-card rounded-[2rem] p-4 shadow-2xl shadow-blue-100">
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-blue-200 rounded-[1.5rem] p-16 text-center hover:bg-blue-50/50 hover:border-blue-400 transition-all cursor-pointer group"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  accept=".pdf,image/*"
                  onChange={simulateProcessing}
                />
                <div className="w-24 h-24 bg-blue-100 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-inner">
                  <FileText className="text-blue-600 w-10 h-10" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">Ladda upp ditt beslut</h3>
                <p className="text-slate-500">Dra och släpp din PDF eller ta ett foto</p>
                <p className="text-[10px] text-slate-400 mt-4 uppercase tracking-[0.2em]">
                  Säker hantering via SSL & GDPR
                </p>
              </div>
            </div>

            <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-8 opacity-40 grayscale contrast-125">
              <div className="flex justify-center">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/e/e9/F%C3%B6rs%C3%A4kringskassan_logo.svg"
                  className="h-6"
                  alt="Försäkringskassan"
                />
              </div>
              <div className="flex justify-center">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/2/2b/Arbetsf%C3%B6rmedlingen_logo.svg"
                  className="h-6"
                  alt="Arbetsförmedlingen"
                />
              </div>
              <div className="flex justify-center items-center text-sm font-bold">MIGRATIONSVERKET</div>
              <div className="flex justify-center items-center text-sm font-bold">KOMMUNEN</div>
            </div>
          </section>
        )}

        {/* View: Analyzing */}
        {view === 'analyzing' && (
          <section className="text-center py-12">
            <div className="spinner mx-auto mb-8" />
            <h2 className="text-3xl font-bold mb-4">Analyserar juridiska grunder...</h2>
            <p className="text-slate-500 text-lg mb-10 italic">{statusMsg}</p>
            <div className="max-w-md mx-auto bg-slate-200 h-2 rounded-full overflow-hidden">
              <div
                className="bg-blue-600 h-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </section>
        )}

        {/* View: Result */}
        {view === 'result' && (
          <section className="space-y-8">
            <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-2xl flex gap-4 items-center shadow-sm">
              <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center text-white shrink-0">
                <CheckCheck />
              </div>
              <div>
                <h3 className="font-bold text-emerald-900">Analys genomförd</h3>
                <p className="text-emerald-700 text-sm">
                  Vi har identifierat två lagrum där beslutet strider mot förvaltningslagen.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-[2rem] shadow-2xl border border-slate-200 overflow-hidden">
              <div className="bg-slate-900 p-4 flex justify-between items-center text-white px-8">
                <span className="text-xs font-mono opacity-70">DRAFT_APPEAL_v1.0.pdf</span>
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                </div>
              </div>
              <div className="p-12 legal-font text-slate-800 leading-[1.8]">
                <div className="text-right mb-12 italic text-slate-500">Bilaga 1: Överklagande</div>
                <p className="mb-8 font-bold text-lg underline">TILL FÖRVALTNINGSRÄTTEN</p>
                <p className="mb-6">
                  <strong>Klagande:</strong> [Användarens Namn]<br />
                  <strong>Motpart:</strong> Försäkringskassan
                </p>
                <p className="mb-8 font-bold uppercase tracking-tight">
                  Överklagande av beslut daterat 2023-11-01
                </p>
                <p className="mb-6">
                  Härmed överklagas rubricerat beslut. Jag yrkar att Förvaltningsrätten upphäver
                  myndighetens beslut och återförvisar ärendet för ny handläggning.
                </p>
                <h4 className="font-bold mb-4 border-b border-slate-300 pb-2">
                  GRUNDER FÖR ÖVERKLAGANDET
                </h4>
                <p className="mb-6">
                  Myndigheten har brustit i sin utredningsskyldighet enligt 23 § förvaltningslagen.
                  Genom att bortse från det medicinska underlaget i aktbilaga 14 har en felaktig
                  bedömning gjorts av arbetsförmågan...
                </p>
                <div className="h-40 bg-gradient-to-t from-white to-transparent" />
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4">
              <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-6 rounded-2xl font-bold text-xl shadow-xl shadow-blue-200 transition-all flex items-center justify-center gap-3">
                <Download /> Ladda ner (.PDF)
              </button>
              <button
                onClick={reset}
                className="px-10 py-6 bg-white border border-slate-200 text-slate-500 rounded-2xl font-bold hover:bg-slate-50 transition-all"
              >
                Börja om
              </button>
            </div>
          </section>
        )}
      </main>

      <footer className="max-w-4xl mx-auto px-6 py-12 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-6 text-slate-400 text-xs">
        <p>© 2024 Rättshjälp AI (Beta). Ej en advokatbyrå.</p>
        <div className="flex gap-6 italic">
          <a href="#">Användarvillkor</a>
          <a href="#">Integritetspolicy</a>
        </div>
      </footer>
    </div>
  )
}
