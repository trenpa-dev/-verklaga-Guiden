import { useState } from 'react'
import { Sun, Plus, Trash2, Users, Calendar } from 'lucide-react'

const WEEKS = [
  { week: 25, half1: { label: 'mån–ons', dates: '15–17 jun', days: 3 }, half2: { label: 'tor–sön', dates: '18–21 jun', days: 4 } },
  { week: 26, half1: { label: 'mån–ons', dates: '22–24 jun', days: 3 }, half2: { label: 'tor–sön', dates: '25–28 jun', days: 4 } },
  { week: 27, half1: { label: 'mån–ons', dates: '29 jun–1 jul', days: 3 }, half2: { label: 'tor–sön', dates: '2–5 jul', days: 4 } },
  { week: 28, half1: { label: 'mån–ons', dates: '6–8 jul', days: 3 }, half2: { label: 'tor–sön', dates: '9–12 jul', days: 4 } },
  { week: 29, half1: { label: 'mån–ons', dates: '13–15 jul', days: 3 }, half2: { label: 'tor–sön', dates: '16–19 jul', days: 4 } },
  { week: 30, half1: { label: 'mån–ons', dates: '20–22 jul', days: 3 }, half2: { label: 'tor–sön', dates: '23–26 jul', days: 4 } },
  { week: 31, half1: { label: 'mån–ons', dates: '27–29 jul', days: 3 }, half2: { label: 'tor–sön', dates: '30 jul–2 aug', days: 4 } },
  { week: 32, half1: { label: 'mån–ons', dates: '3–5 aug', days: 3 }, half2: { label: 'tor–sön', dates: '6–9 aug', days: 4 } },
  { week: 33, half1: { label: 'mån–ons', dates: '10–12 aug', days: 3 }, half2: { label: 'tor–sön', dates: '13–16 aug', days: 4 } },
  { week: 34, half1: { label: 'mån–ons', dates: '17–19 aug', days: 3 }, half2: { label: 'tor–sön', dates: '20–23 aug', days: 4 } },
]

const COLORS = [
  { bg: 'bg-blue-500', light: 'bg-blue-100', border: 'border-blue-400', text: 'text-blue-700', dot: 'bg-blue-500' },
  { bg: 'bg-emerald-500', light: 'bg-emerald-100', border: 'border-emerald-400', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  { bg: 'bg-violet-500', light: 'bg-violet-100', border: 'border-violet-400', text: 'text-violet-700', dot: 'bg-violet-500' },
  { bg: 'bg-amber-500', light: 'bg-amber-100', border: 'border-amber-400', text: 'text-amber-700', dot: 'bg-amber-500' },
  { bg: 'bg-rose-500', light: 'bg-rose-100', border: 'border-rose-400', text: 'text-rose-700', dot: 'bg-rose-500' },
]

export default function App() {
  const [people, setPeople] = useState([
    { id: 1, name: 'Person 1' },
    { id: 2, name: 'Person 2' },
  ])
  const [editingId, setEditingId] = useState(null)
  const [newName, setNewName] = useState('')
  const [selections, setSelections] = useState({})
  const [nextId, setNextId] = useState(3)

  function toggleSlot(personId, weekNum, half) {
    const key = `${weekNum}-${half}`
    setSelections(prev => {
      const current = new Set(prev[personId] || [])
      if (current.has(key)) current.delete(key)
      else current.add(key)
      return { ...prev, [personId]: new Set(current) }
    })
  }

  function isSelected(personId, weekNum, half) {
    return (selections[personId] || new Set()).has(`${weekNum}-${half}`)
  }

  function addPerson() {
    const id = nextId
    setPeople(prev => [...prev, { id, name: `Person ${id}` }])
    setNextId(id + 1)
  }

  function removePerson(id) {
    setPeople(prev => prev.filter(p => p.id !== id))
    setSelections(prev => { const n = { ...prev }; delete n[id]; return n })
  }

  function startEdit(person) {
    setEditingId(person.id)
    setNewName(person.name)
  }

  function commitEdit(id) {
    setPeople(prev => prev.map(p => p.id === id ? { ...p, name: newName || p.name } : p))
    setEditingId(null)
  }

  function totalDays(personId) {
    const sel = selections[personId] || new Set()
    let total = 0
    for (const key of sel) {
      const [weekStr, half] = key.split('-')
      const week = WEEKS.find(w => w.week === parseInt(weekStr))
      if (week) total += week[half].days
    }
    return total
  }

  function commonSlots() {
    if (people.length < 2) return new Set()
    const allSets = people.map(p => selections[p.id] || new Set())
    const first = allSets[0]
    const common = new Set()
    for (const key of first) {
      if (allSets.every(s => s.has(key))) common.add(key)
    }
    return common
  }

  function commonDays(common) {
    let total = 0
    for (const key of common) {
      const [weekStr, half] = key.split('-')
      const week = WEEKS.find(w => w.week === parseInt(weekStr))
      if (week) total += week[half].days
    }
    return total
  }

  const common = commonSlots()

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-amber-50">
      <header className="bg-white border-b border-slate-200 px-6 py-4 shadow-sm">
        <div className="max-w-5xl mx-auto flex items-center gap-3">
          <div className="w-10 h-10 bg-amber-400 rounded-2xl flex items-center justify-center shadow-md">
            <Sun className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800">Semesterplanering 2026</h1>
            <p className="text-xs text-slate-500">Vecka 25–34 · Markera era semesterveckor</p>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8 space-y-6">

        {/* People manager */}
        <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-slate-700 font-semibold">
              <Users className="w-4 h-4" />
              <span>Personer</span>
            </div>
            {people.length < 5 && (
              <button
                onClick={addPerson}
                className="flex items-center gap-1 text-sm bg-slate-100 hover:bg-slate-200 text-slate-600 px-3 py-1.5 rounded-lg transition"
              >
                <Plus className="w-4 h-4" /> Lägg till person
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-3">
            {people.map((p, i) => {
              const color = COLORS[i % COLORS.length]
              return (
                <div key={p.id} className={`flex items-center gap-2 px-3 py-2 rounded-xl border ${color.border} ${color.light}`}>
                  <div className={`w-2.5 h-2.5 rounded-full ${color.dot}`} />
                  {editingId === p.id ? (
                    <input
                      autoFocus
                      value={newName}
                      onChange={e => setNewName(e.target.value)}
                      onBlur={() => commitEdit(p.id)}
                      onKeyDown={e => e.key === 'Enter' && commitEdit(p.id)}
                      className="text-sm font-medium bg-transparent outline-none w-24 border-b border-slate-400"
                    />
                  ) : (
                    <span
                      className={`text-sm font-medium ${color.text} cursor-pointer hover:underline`}
                      onClick={() => startEdit(p)}
                      title="Klicka för att byta namn"
                    >
                      {p.name}
                    </span>
                  )}
                  <span className={`text-xs ${color.text} opacity-60`}>{totalDays(p.id)} dagar</span>
                  {people.length > 1 && (
                    <button onClick={() => removePerson(p.id)} className="ml-1 opacity-30 hover:opacity-60 transition">
                      <Trash2 className="w-3.5 h-3.5 text-slate-500" />
                    </button>
                  )}
                </div>
              )
            })}
          </div>
        </section>

        {/* Calendar grid */}
        <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center gap-2 text-slate-700 font-semibold">
            <Calendar className="w-4 h-4" />
            <span>Välj semesterperioder</span>
            <span className="text-xs text-slate-400 font-normal ml-1">— klicka för att markera/avmarkera</span>
          </div>

          <div className="grid grid-cols-[72px_1fr_1fr] text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-2 bg-slate-50 border-b border-slate-100">
            <div>Vecka</div>
            <div className="text-center pl-2">Första halvan (mån–ons)</div>
            <div className="text-center pl-2">Andra halvan (tor–sön)</div>
          </div>

          {WEEKS.map((w, wi) => {
            const isCommonH1 = common.has(`${w.week}-half1`)
            const isCommonH2 = common.has(`${w.week}-half2`)
            return (
              <div
                key={w.week}
                className={`grid grid-cols-[72px_1fr_1fr] items-stretch border-b border-slate-100 last:border-0 ${wi % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'}`}
              >
                <div className="flex flex-col justify-center px-4 py-3">
                  <span className="font-bold text-slate-700 text-sm">v.{w.week}</span>
                </div>

                {['half1', 'half2'].map(half => {
                  const isCommon = half === 'half1' ? isCommonH1 : isCommonH2
                  const halfData = w[half]
                  return (
                    <div key={half} className="border-l border-slate-100 p-2">
                      <div className="text-[10px] text-slate-400 mb-1.5 text-center font-medium">
                        {halfData.dates}
                        <span className="ml-1 text-slate-300">·</span>
                        <span className="ml-1">{halfData.days} dagar</span>
                      </div>
                      <div className="flex flex-col gap-1">
                        {people.map((p, i) => {
                          const color = COLORS[i % COLORS.length]
                          const sel = isSelected(p.id, w.week, half)
                          return (
                            <button
                              key={p.id}
                              onClick={() => toggleSlot(p.id, w.week, half)}
                              className={`w-full py-1.5 px-2 rounded-lg text-xs font-medium transition-all border ${
                                sel
                                  ? `${color.bg} text-white border-transparent shadow-sm scale-[1.01]`
                                  : `bg-white ${color.text} border-slate-200 hover:border-current`
                              }`}
                            >
                              {p.name}
                            </button>
                          )
                        })}
                        {isCommon && (
                          <div className="text-center text-[10px] text-amber-500 font-bold mt-0.5">★ Gemensamt</div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )
          })}
        </section>

        {/* Summary */}
        <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
          <h2 className="font-semibold text-slate-700 mb-4">Sammanfattning</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {people.map((p, i) => {
              const color = COLORS[i % COLORS.length]
              const days = totalDays(p.id)
              const slots = (selections[p.id] || new Set()).size
              return (
                <div key={p.id} className={`rounded-xl p-4 ${color.light} border ${color.border}`}>
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`w-2.5 h-2.5 rounded-full ${color.dot}`} />
                    <span className={`font-semibold text-sm ${color.text}`}>{p.name}</span>
                  </div>
                  <div className={`text-3xl font-bold ${color.text}`}>{days}</div>
                  <div className={`text-xs mt-0.5 ${color.text} opacity-70`}>{slots} halvveckor · {days} dagar</div>
                </div>
              )
            })}
            {people.length >= 2 && (
              <div className="rounded-xl p-4 bg-amber-50 border border-amber-200">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-amber-400 font-bold">★</span>
                  <span className="font-semibold text-sm text-amber-700">Gemensamt</span>
                </div>
                <div className="text-3xl font-bold text-amber-600">{commonDays(common)}</div>
                <div className="text-xs mt-0.5 text-amber-600 opacity-70">{common.size} halvveckor · {commonDays(common)} dagar</div>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  )
}
