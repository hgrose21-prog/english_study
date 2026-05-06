/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Globe, 
  Clock, 
  Trophy, 
  Target, 
  ChevronRight, 
  ChevronLeft, 
  MapPin, 
  BookOpen,
  ArrowRight,
  Loader2,
  CheckCircle2
} from 'lucide-react';
import { generateCurriculum, type Curriculum, type Lesson } from './lib/gemini';

type Step = 'language' | 'duration' | 'level' | 'goals' | 'loading' | 'dashboard';

const LANGUAGES = [
  { id: 'english', label: 'English', icon: '🇬🇧', description: 'Universal travel language' },
  { id: 'french', label: 'Français', icon: '🇫🇷', description: 'The language of romance & cuisine' },
  { id: 'chinese', label: '中文', icon: '🇨🇳', description: 'Unlock the heart of Asia' },
];

const DURATIONS = [
  { id: '1week', label: '1 Week', sub: 'The Essentials' },
  { id: '2weeks', label: '2 Weeks', sub: 'Conversational' },
  { id: '1month', label: '1 Month', sub: 'Deep Immersion' },
];

const LEVELS = [
  { id: 'beginner', label: 'Beginner', desc: 'No prior knowledge' },
  { id: 'intermediate', label: 'Intermediate', desc: 'Can handle basic interactions' },
  { id: 'advanced', label: 'Advanced', desc: 'Looking for fluency & nuance' },
];

const GOALS = [
  { id: 'food', label: 'Ordering Food', icon: '🍽️' },
  { id: 'transport', label: 'Navigation', icon: '🚆' },
  { id: 'culture', label: 'Local Culture', icon: '🏛️' },
  { id: 'social', label: 'Making Friends', icon: '👋' },
];

export default function App() {
  const [step, setStep] = useState<Step>('language');
  const [selection, setSelection] = useState({
    language: '',
    duration: '',
    level: '',
    goals: [] as string[],
  });
  const [curriculum, setCurriculum] = useState<Curriculum | null>(null);
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);

  const startGeneration = async () => {
    setStep('loading');
    try {
      const data = await generateCurriculum(
        selection.language,
        selection.duration,
        selection.level,
        selection.goals.join(', ')
      );
      setCurriculum(data);
      setStep('dashboard');
    } catch (error) {
      console.error(error);
      setStep('goals'); // Fallback
    }
  };

  const handleGoalToggle = (goal: string) => {
    setSelection(prev => ({
      ...prev,
      goals: prev.goals.includes(goal) 
        ? prev.goals.filter(g => g !== goal)
        : [...prev.goals, goal]
    }));
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8">
      <AnimatePresence mode="wait">
        {/* Step: Language */}
        {step === 'language' && (
          <motion.div 
            key="language"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full max-w-2xl text-center"
          >
            <div className="mb-8 flex justify-center">
              <div className="p-3 bg-brand-olive rounded-full text-white">
                <Globe size={32} />
              </div>
            </div>
            <h1 className="serif text-5xl md:text-6xl mb-4 font-medium italic">Destination Language?</h1>
            <p className="text-gray-500 mb-12">Choose the language you want to master for your next journey.</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.id}
                  id={`lang-${lang.id}`}
                  onClick={() => {
                    setSelection({ ...selection, language: lang.label });
                    setStep('duration');
                  }}
                  className="p-6 bg-white border-2 border-transparent hover:border-brand-olive rounded-3xl text-left transition-all group shadow-sm"
                >
                  <span className="text-4xl mb-4 block">{lang.icon}</span>
                  <h3 className="font-semibold text-lg">{lang.label}</h3>
                  <p className="text-sm text-gray-500">{lang.description}</p>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Step: Duration */}
        {step === 'duration' && (
          <motion.div 
            key="duration"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="w-full max-w-2xl text-center"
          >
            <button 
              onClick={() => setStep('language')}
              className="mb-8 text-gray-400 hover:text-brand-ink flex items-center gap-2 mx-auto transition-colors"
            >
              <ChevronLeft size={18} /> Back
            </button>
            <div className="mb-8 flex justify-center">
              <div className="p-3 bg-brand-olive rounded-full text-white">
                <Clock size={32} />
              </div>
            </div>
            <h1 className="serif text-5xl md:text-6xl mb-4 font-medium italic">Prep Time?</h1>
            <p className="text-gray-500 mb-12">How long do you have before your departure?</p>
            <div className="flex flex-col gap-4">
              {DURATIONS.map((dur) => (
                <button
                  key={dur.id}
                  id={`dur-${dur.id}`}
                  onClick={() => {
                    setSelection({ ...selection, duration: dur.label });
                    setStep('level');
                  }}
                  className="p-6 bg-white border-2 border-transparent hover:border-brand-olive rounded-3xl flex items-center justify-between transition-all group shadow-sm"
                >
                  <div className="text-left">
                    <h3 className="font-semibold text-lg">{dur.label}</h3>
                    <p className="text-sm text-gray-500">{dur.sub}</p>
                  </div>
                  <ChevronRight size={24} className="text-gray-300 group-hover:text-brand-olive transition-colors" />
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Step: Level */}
        {step === 'level' && (
          <motion.div 
            key="level"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="w-full max-w-2xl text-center"
          >
            <button 
              onClick={() => setStep('duration')}
              className="mb-8 text-gray-400 hover:text-brand-ink flex items-center gap-2 mx-auto transition-colors"
            >
              <ChevronLeft size={18} /> Back
            </button>
            <div className="mb-8 flex justify-center">
              <div className="p-3 bg-brand-olive rounded-full text-white">
                <Trophy size={32} />
              </div>
            </div>
            <h1 className="serif text-5xl md:text-6xl mb-4 font-medium italic">Current Skill?</h1>
            <p className="text-gray-500 mb-12">Be honest—it helps tailor the curriculum.</p>
            <div className="grid grid-cols-1 gap-4">
              {LEVELS.map((lvl) => (
                <button
                  key={lvl.id}
                  id={`lvl-${lvl.id}`}
                  onClick={() => {
                    setSelection({ ...selection, level: lvl.label });
                    setStep('goals');
                  }}
                  className="p-6 bg-white border-2 border-transparent hover:border-brand-olive rounded-3xl text-left transition-all group shadow-sm"
                >
                  <h3 className="font-semibold text-lg">{lvl.label}</h3>
                  <p className="text-sm text-gray-500">{lvl.desc}</p>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Step: Goals */}
        {step === 'goals' && (
          <motion.div 
            key="goals"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="w-full max-w-2xl text-center"
          >
            <button 
              onClick={() => setStep('level')}
              className="mb-8 text-gray-400 hover:text-brand-ink flex items-center gap-2 mx-auto transition-colors"
            >
              <ChevronLeft size={18} /> Back
            </button>
            <div className="mb-8 flex justify-center">
              <div className="p-3 bg-brand-olive rounded-full text-white">
                <Target size={32} />
              </div>
            </div>
            <h1 className="serif text-5xl md:text-6xl mb-4 font-medium italic">Learning Goals?</h1>
            <p className="text-gray-500 mb-12">What are you hoping to achieve overseas?</p>
            <div className="grid grid-cols-2 gap-4 mb-12">
              {GOALS.map((goal) => (
                <button
                  key={goal.id}
                  id={`goal-${goal.id}`}
                  onClick={() => handleGoalToggle(goal.label)}
                  className={`p-6 rounded-3xl text-left transition-all shadow-sm border-2 ${
                    selection.goals.includes(goal.label) 
                      ? 'bg-brand-olive text-white border-brand-olive' 
                      : 'bg-white border-transparent text-brand-ink hover:border-brand-olive/30'
                  }`}
                >
                  <span className="text-3xl mb-3 block">{goal.icon}</span>
                  <h3 className="font-semibold">{goal.label}</h3>
                </button>
              ))}
            </div>
            <button
              onClick={startGeneration}
              disabled={selection.goals.length === 0}
              className="w-full py-4 bg-brand-ink text-white rounded-2xl font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-zinc-800 transition-colors"
            >
              Generate My Voyage <ArrowRight size={20} />
            </button>
          </motion.div>
        )}

        {/* Step: Loading */}
        {step === 'loading' && (
          <motion.div 
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center"
          >
            <Loader2 className="w-12 h-12 text-brand-olive animate-spin mx-auto mb-6" />
            <h2 className="serif text-4xl mb-2 italic">Crafting your curriculum...</h2>
            <p className="text-gray-500">Integrating your goals with {selection.language} essentials.</p>
          </motion.div>
        )}

        {/* Step: Dashboard */}
        {step === 'dashboard' && curriculum && (
          <motion.div 
            key="dashboard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full max-w-5xl"
          >
            <header className="mb-12 text-center md:text-left flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-brand-olive/10 pb-12">
              <div>
                <div className="flex items-center gap-2 text-brand-olive mb-2 justify-center md:justify-start">
                  <MapPin size={18} />
                  <span className="uppercase tracking-widest text-xs font-bold">Personalized Voyage</span>
                </div>
                <h1 className="serif text-6xl md:text-7xl font-medium italic">{selection.language} for you</h1>
                <p className="text-gray-500 max-w-xl mt-4 leading-relaxed">{curriculum.overview}</p>
              </div>
              <div className="flex gap-4 justify-center">
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-brand-olive/10 flex flex-col items-center min-w-[100px]">
                  <span className="text-xs uppercase text-gray-400 font-bold mb-1">Time</span>
                  <span className="font-medium">{selection.duration}</span>
                </div>
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-brand-olive/10 flex flex-col items-center min-w-[100px]">
                  <span className="text-xs uppercase text-gray-400 font-bold mb-1">Level</span>
                  <span className="font-medium">{selection.level}</span>
                </div>
              </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
              <aside className="md:col-span-4 space-y-4">
                <h3 className="serif text-2xl mb-4 italic font-medium">Curriculum Path</h3>
                {curriculum.lessons.map((lesson, idx) => (
                  <button
                    key={idx}
                    id={`lesson-tab-${idx}`}
                    onClick={() => setActiveLesson(lesson)}
                    className={`w-full p-6 text-left rounded-3xl transition-all shadow-sm border-2 ${
                      activeLesson?.title === lesson.title 
                        ? 'bg-brand-olive text-white border-brand-olive' 
                        : 'bg-white border-transparent hover:border-brand-olive/30'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                        activeLesson?.title === lesson.title ? 'bg-white text-brand-olive' : 'bg-brand-cream text-brand-ink'
                      }`}>
                        {idx + 1}
                      </span>
                      <div>
                        <h4 className="font-semibold leading-tight">{lesson.title}</h4>
                      </div>
                    </div>
                  </button>
                ))}
              </aside>

              <main className="md:col-span-8 bg-white p-8 md:p-12 rounded-[2.5rem] shadow-sm border border-brand-olive/5 min-h-[500px]">
                {activeLesson ? (
                  <motion.div
                    key={activeLesson.title}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-2 bg-brand-cream rounded-xl text-brand-olive">
                        <BookOpen size={24} />
                      </div>
                      <h2 className="serif text-4xl font-medium">{activeLesson.title}</h2>
                    </div>
                    <p className="text-gray-500 mb-10 leading-relaxed">{activeLesson.description}</p>
                    
                    <div className="space-y-4">
                      <h4 className="text-xs uppercase tracking-widest font-bold text-gray-400 mb-4">Key Phrases</h4>
                      {activeLesson.phrases.map((phrase, pIdx) => (
                        <div key={pIdx} className="group p-6 bg-brand-cream/30 rounded-3xl hover:bg-brand-cream transition-colors border border-transparent hover:border-brand-olive/10">
                          <div className="flex justify-between items-start mb-2">
                            <span className="font-semibold text-lg">{phrase.translated}</span>
                            <CheckCircle2 className="text-brand-olive opacity-0 group-hover:opacity-100 transition-opacity" size={20} />
                          </div>
                          <p className="text-brand-olive font-serif text-xl italic mb-1">{phrase.original}</p>
                          <div className="flex items-center gap-2 mt-2">
                             <div className="w-1 h-1 bg-brand-olive/40 rounded-full" />
                             <span className="text-sm font-mono text-gray-400 tracking-tight">{phrase.pronunciation}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
                    <BookOpen size={64} className="mb-4 text-brand-olive" />
                    <h3 className="serif text-2xl italic">Select a lesson to begin</h3>
                    <p className="text-sm max-w-xs mx-auto mt-2">Choose the path on the left to start mastering phrases.</p>
                  </div>
                )}
              </main>
            </div>

            <footer className="mt-20 py-12 border-t border-brand-olive/10 flex flex-col md:flex-row items-center justify-between gap-6">
              <span className="serif text-2xl italic opacity-50">VoyageLingu</span>
              <button 
                onClick={() => {
                  setStep('language');
                  setCurriculum(null);
                  setActiveLesson(null);
                }}
                className="text-sm font-bold uppercase tracking-widest text-brand-olive hover:text-brand-ink transition-colors"
              >
                Plan another trip
              </button>
            </footer>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

