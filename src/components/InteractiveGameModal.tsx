import React, { useState, useEffect, useRef } from 'react';
import { EducationalGame } from '../types';
import { sounds } from '../utils/sound';
import {
  X,
  Trophy,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Flame,
  Lightbulb,
  Clock,
  ArrowRight,
} from 'lucide-react';

interface InteractiveGameModalProps {
  game: EducationalGame | null;
  onClose: () => void;
}

export const InteractiveGameModal: React.FC<InteractiveGameModalProps> = ({ game, onClose }) => {
  if (!game) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-bold tracking-wider text-amber-400">
                {game.subject} · {game.grade}
              </span>
            </div>
            <h2 className="text-lg font-bold text-white tracking-tight">{game.title}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            title="Kapat"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1">
          {game.interactiveType === 'math_challenge' && <MathChallengeGame />}
          {game.interactiveType === 'memory_match' && <MemoryMatchGame />}
          {game.interactiveType === 'trivia_quiz' && <ScienceTriviaGame />}
          {game.interactiveType === 'word_puzzle' && <WordPuzzleGame />}
          {game.interactiveType === 'external' && <ExternalGameView game={game} />}
        </div>
      </div>
    </div>
  );
};

/* -------------------------------------------------------------
   GAME 1: Math Challenge (Matematik Hızlı Çözüm)
------------------------------------------------------------- */
function MathChallengeGame() {
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [question, setQuestion] = useState({ text: '7 + 8', answer: 15 });
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const generateQuestion = () => {
    const ops = ['+', '-', '×'];
    const op = ops[Math.floor(Math.random() * ops.length)];
    let a = Math.floor(Math.random() * 12) + 2;
    let b = Math.floor(Math.random() * 12) + 2;
    let answer = 0;

    if (op === '+') {
      answer = a + b;
    } else if (op === '-') {
      if (a < b) [a, b] = [b, a];
      answer = a - b;
    } else {
      a = Math.floor(Math.random() * 9) + 2;
      b = Math.floor(Math.random() * 9) + 2;
      answer = a * b;
    }

    setQuestion({ text: `${a} ${op} ${b}`, answer });
    setUserAnswer('');
  };

  const startGame = () => {
    setScore(0);
    setStreak(0);
    setTimeLeft(30);
    setIsPlaying(true);
    setIsGameOver(false);
    generateQuestion();
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsPlaying(false);
          setIsGameOver(true);
          sounds.playWin();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isPlaying]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isPlaying || !userAnswer) return;

    const num = parseInt(userAnswer.trim(), 10);
    if (num === question.answer) {
      sounds.playSuccess();
      setScore((s) => s + 10 + streak * 2);
      setStreak((st) => st + 1);
      setFeedback('correct');
      setTimeout(() => setFeedback(null), 300);
      generateQuestion();
    } else {
      sounds.playClick();
      setStreak(0);
      setFeedback('wrong');
      setTimeout(() => setFeedback(null), 300);
    }
  };

  if (!isPlaying && !isGameOver) {
    return (
      <div className="text-center py-6">
        <div className="w-16 h-16 mx-auto mb-4 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center">
          <Flame className="w-9 h-9" />
        </div>
        <h3 className="text-xl font-bold text-slate-800 mb-2">30 Saniyede Kaç İşlem?</h3>
        <p className="text-sm text-slate-600 max-w-md mx-auto mb-6">
          Zihinden toplama, çıkarma ve çarpma yaparak en yüksek puanı toplayın. Seri yaptıkça puan çarpanınız katlanır!
        </p>
        <button
          onClick={startGame}
          className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all"
        >
          Oyunu Başlat
        </button>
      </div>
    );
  }

  if (isGameOver) {
    return (
      <div className="text-center py-6 animate-in zoom-in-95 duration-200">
        <div className="w-16 h-16 mx-auto mb-3 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center">
          <Trophy className="w-8 h-8" />
        </div>
        <h3 className="text-2xl font-bold text-slate-800 mb-1">Tebrikler! Süre Doldu</h3>
        <p className="text-slate-500 text-sm mb-4">Harika bir zihinsel maraton sergilediniz.</p>
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 inline-block mb-6 min-w-48">
          <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Toplam Skor</div>
          <div className="text-4xl font-extrabold text-amber-600 tabular-nums">{score}</div>
          <div className="text-xs text-slate-600 mt-1">Puan</div>
        </div>
        <div>
          <button
            onClick={startGame}
            className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-xl transition-all inline-flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Tekrar Oyna
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-2">
      {/* Top metrics bar */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-600">
          <Clock className="w-4 h-4 text-amber-500" />
          <span>Kalan Süre:</span>
          <span className="font-bold tabular-nums text-amber-600 text-lg">{timeLeft}s</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-sm">
            <span className="text-slate-500">Seri:</span>{' '}
            <span className="font-bold text-emerald-600 tabular-nums">🔥 {streak}x</span>
          </div>
          <div className="text-sm">
            <span className="text-slate-500">Puan:</span>{' '}
            <span className="font-extrabold text-slate-900 tabular-nums text-lg">{score}</span>
          </div>
        </div>
      </div>

      {/* Question Card */}
      <div
        className={`p-8 rounded-2xl border text-center transition-all ${
          feedback === 'correct'
            ? 'bg-emerald-50 border-emerald-300 scale-102'
            : feedback === 'wrong'
            ? 'bg-rose-50 border-rose-300 shake'
            : 'bg-gradient-to-b from-slate-50 to-amber-50/40 border-slate-200'
        }`}
      >
        <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">İşlem</span>
        <div className="text-5xl font-black text-slate-900 my-4 tracking-wider tabular-nums font-mono">
          {question.text} = ?
        </div>

        <form onSubmit={handleSubmit} className="flex gap-2 max-w-xs mx-auto">
          <input
            ref={inputRef}
            type="number"
            autoFocus
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            placeholder="Cevap"
            className="flex-1 px-4 py-2.5 text-center text-xl font-bold bg-white border-2 border-amber-300 rounded-xl focus:outline-none focus:border-amber-500 shadow-sm"
          />
          <button
            type="submit"
            className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl transition-all"
          >
            Tamam
          </button>
        </form>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------
   GAME 2: Memory Match (Kavram & Eşleştirme Kartları)
------------------------------------------------------------- */
interface CardItem {
  id: number;
  pairId: number;
  label: string;
  category: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const MEMORY_PAIRS = [
  { pairId: 1, a: 'H₂O', b: 'Su Molekülü', cat: 'Fen' },
  { pairId: 2, a: '7 × 8', b: '56', cat: 'Matematik' },
  { pairId: 3, a: 'Fotosentez', b: 'Işık & Klorofil', cat: 'Biyoloji' },
  { pairId: 4, a: 'Eş Anlam: Al', b: 'Kırmızı', cat: 'Türkçe' },
  { pairId: 5, a: 'Jüpiter', b: 'En Büyük Gezegen', cat: 'Uzay' },
  { pairId: 6, a: 'Türkiye', b: 'Ankara', cat: 'Coğrafya' },
];

function MemoryMatchGame() {
  const [cards, setCards] = useState<CardItem[]>([]);
  const [selected, setSelected] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [matchedCount, setMatchedCount] = useState(0);

  const initGame = () => {
    const deck: CardItem[] = [];
    let idCounter = 1;
    MEMORY_PAIRS.forEach((item) => {
      deck.push({
        id: idCounter++,
        pairId: item.pairId,
        label: item.a,
        category: item.cat,
        isFlipped: false,
        isMatched: false,
      });
      deck.push({
        id: idCounter++,
        pairId: item.pairId,
        label: item.b,
        category: item.cat,
        isFlipped: false,
        isMatched: false,
      });
    });
    // Shuffle
    deck.sort(() => Math.random() - 0.5);
    setCards(deck);
    setSelected([]);
    setMoves(0);
    setMatchedCount(0);
  };

  useEffect(() => {
    initGame();
  }, []);

  const handleCardClick = (index: number) => {
    if (selected.length === 2) return;
    if (cards[index].isFlipped || cards[index].isMatched) return;

    sounds.playClick();
    const updated = [...cards];
    updated[index].isFlipped = true;
    setCards(updated);

    const newSelected = [...selected, index];
    setSelected(newSelected);

    if (newSelected.length === 2) {
      setMoves((m) => m + 1);
      const [firstIdx, secondIdx] = newSelected;
      if (cards[firstIdx].pairId === cards[secondIdx].pairId) {
        sounds.playSuccess();
        setTimeout(() => {
          setCards((prev) => {
            const next = [...prev];
            next[firstIdx].isMatched = true;
            next[secondIdx].isMatched = true;
            return next;
          });
          setMatchedCount((c) => {
            const nextC = c + 1;
            if (nextC === MEMORY_PAIRS.length) {
              sounds.playWin();
            }
            return nextC;
          });
          setSelected([]);
        }, 500);
      } else {
        setTimeout(() => {
          setCards((prev) => {
            const next = [...prev];
            next[firstIdx].isFlipped = false;
            next[secondIdx].isFlipped = false;
            return next;
          });
          setSelected([]);
        }, 900);
      }
    }
  };

  const isWon = matchedCount === MEMORY_PAIRS.length;

  return (
    <div>
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4 text-sm">
        <div className="text-slate-600">
          Hamle: <span className="font-bold text-slate-900">{moves}</span>
        </div>
        <div className="text-slate-600">
          Eşleşen: <span className="font-bold text-emerald-600">{matchedCount} / {MEMORY_PAIRS.length}</span>
        </div>
        <button
          onClick={initGame}
          className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Yeniden Karıştır
        </button>
      </div>

      {isWon ? (
        <div className="text-center py-8">
          <div className="w-16 h-16 mx-auto mb-3 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center">
            <Trophy className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-1">Mükemmel Hafıza!</h3>
          <p className="text-sm text-slate-500 mb-4">
            Tüm kavramları {moves} hamlede başarıyla eşleştirdiniz.
          </p>
          <button
            onClick={initGame}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-xl transition-all"
          >
            Tekrar Oyna
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
          {cards.map((card, idx) => (
            <button
              key={card.id}
              onClick={() => handleCardClick(idx)}
              disabled={card.isFlipped || card.isMatched}
              className={`h-22 rounded-xl p-2.5 text-center transition-all flex flex-col items-center justify-center border font-medium text-xs relative ${
                card.isMatched
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-800 opacity-80'
                  : card.isFlipped
                  ? 'bg-amber-50 border-amber-300 text-slate-900 font-bold shadow-sm'
                  : 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-400'
              }`}
            >
              {card.isFlipped || card.isMatched ? (
                <>
                  <span className="text-[10px] uppercase font-semibold text-slate-600 mb-1">
                    {card.category}
                  </span>
                  <span className="text-xs font-bold leading-tight line-clamp-2">
                    {card.label}
                  </span>
                </>
              ) : (
                <div className="text-slate-400 text-lg font-bold">?</div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* -------------------------------------------------------------
   GAME 3: Science Trivia (Gezegenler & Bilim Gezgini)
------------------------------------------------------------- */
const TRIVIA_QUESTIONS = [
  {
    q: 'Güneş sistemimizde "Kızıl Gezegen" olarak adlandırılan ve yüzeyindeki demir oksit nedeniyle kırmızı görünen gezegen hangisidir?',
    options: ['Venüs', 'Mars', 'Jüpiter', 'Satürn'],
    answer: 1,
    info: 'Mars, yüzeyindeki paslı demir mineralleri nedeniyle kızıl görünür.',
  },
  {
    q: 'Bitkilerin güneş ışığını, suyu ve karbondioksiti kullanarak besin ve oksijen ürettiği sürecin adı nedir?',
    options: ['Solunum', 'Fermantasyon', 'Fotosentez', 'Buharlaşma'],
    answer: 2,
    info: 'Fotosentez, klorofilin güneş enerjisini kimyasal enerjiye dönüştürdüğü hayati süreçtir.',
  },
  {
    q: 'Canlıların kalıtsal özelliklerini taşıyan ve hücre çekirdeğinde bulunan genetik materyalin adı nedir?',
    options: ['DNA', 'Ribozom', 'Mitokondri', 'Sitoplazma'],
    answer: 0,
    info: 'DNA (Deoksiribonükleik asit), tüm canlıların genetik şifresini barındırır.',
  },
  {
    q: 'Güneş sistemimizdeki halkalarıyla ünlü en belirgin gaz devi gezegen hangisidir?',
    options: ['Merkür', 'Satürn', 'Uranüs', 'Mars'],
    answer: 1,
    info: 'Satürn, buz ve kaya parçalarından oluşan muhteşem halka sistemiyle bilinir.',
  },
];

function ScienceTriviaGame() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const curQ = TRIVIA_QUESTIONS[currentIdx];

  const handleSelect = (idx: number) => {
    if (selectedOpt !== null) return;
    setSelectedOpt(idx);
    if (idx === curQ.answer) {
      sounds.playSuccess();
      setScore((s) => s + 25);
    } else {
      sounds.playClick();
    }
  };

  const handleNext = () => {
    if (currentIdx + 1 < TRIVIA_QUESTIONS.length) {
      setCurrentIdx((prev) => prev + 1);
      setSelectedOpt(null);
    } else {
      setIsFinished(true);
      sounds.playWin();
    }
  };

  const handleRestart = () => {
    setCurrentIdx(0);
    setSelectedOpt(null);
    setScore(0);
    setIsFinished(false);
  };

  if (isFinished) {
    return (
      <div className="text-center py-6">
        <div className="w-16 h-16 mx-auto mb-3 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center">
          <Trophy className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-slate-800 mb-1">Bilim Turu Tamamlandı!</h3>
        <p className="text-slate-500 text-sm mb-4">
          Tüm fen sorularını yanıtladınız.
        </p>
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl inline-block mb-6 min-w-44">
          <div className="text-xs text-blue-600 uppercase font-semibold">Skor</div>
          <div className="text-3xl font-extrabold text-blue-700">{score} / 100</div>
        </div>
        <div>
          <button
            onClick={handleRestart}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-all"
          >
            Yeniden Başlat
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4 text-xs font-semibold text-slate-500">
        <span>Soru {currentIdx + 1} / {TRIVIA_QUESTIONS.length}</span>
        <span className="text-blue-600 font-bold tabular-nums">Puan: {score}</span>
      </div>

      <h3 className="text-base font-semibold text-slate-900 mb-5 leading-relaxed">
        {curQ.q}
      </h3>

      <div className="space-y-2.5 mb-6">
        {curQ.options.map((opt, i) => {
          let btnStyle = 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800';
          if (selectedOpt !== null) {
            if (i === curQ.answer) {
              btnStyle = 'bg-emerald-50 border-emerald-400 text-emerald-900 font-bold';
            } else if (i === selectedOpt) {
              btnStyle = 'bg-rose-50 border-rose-400 text-rose-900';
            } else {
              btnStyle = 'bg-slate-50/50 border-slate-200 text-slate-400';
            }
          }

          return (
            <button
              key={i}
              onClick={() => handleSelect(i)}
              disabled={selectedOpt !== null}
              className={`w-full text-left px-4 py-3 rounded-xl border text-sm transition-all flex items-center justify-between ${btnStyle}`}
            >
              <span>{opt}</span>
              {selectedOpt !== null && i === curQ.answer && (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              )}
            </button>
          );
        })}
      </div>

      {selectedOpt !== null && (
        <div className="p-3.5 bg-blue-50/80 border border-blue-200 rounded-xl text-xs text-blue-900 mb-4 flex items-start gap-2 animate-in fade-in">
          <Lightbulb className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">Açıklama:</span> {curQ.info}
          </div>
        </div>
      )}

      {selectedOpt !== null && (
        <div className="flex justify-end">
          <button
            onClick={handleNext}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl text-sm transition-all flex items-center gap-1.5"
          >
            {currentIdx + 1 === TRIVIA_QUESTIONS.length ? 'Sonucu Gör' : 'Sonraki Soru'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}

/* -------------------------------------------------------------
   GAME 4: Word Puzzle (Kelime Avcısı)
------------------------------------------------------------- */
const WORD_PUZZLES = [
  { word: 'ÖĞRETMEN', clue: 'Bilgi ve aydınlığı nesillere aktaran rehber.' },
  { word: 'KÜTÜPHANE', clue: 'Binlerce kitabın ve bilginin bir arada korunduğu mekan.' },
  { word: 'FELSEFE', clue: 'Varlığı ve düşünceyi akıl yoluyla temellendiren düşünme sanatı.' },
  { word: 'BİLİM', clue: 'Deney ve gözleme dayalı düzenli ve kanıtlanabilir bilgi.' },
];

function WordPuzzleGame() {
  const [puzzleIndex, setPuzzleIndex] = useState(0);
  const [typedLetters, setTypedLetters] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  const curPuzzle = WORD_PUZZLES[puzzleIndex];
  const targetLetters = curPuzzle.word.split('');

  // Scrambled letters once per puzzle
  const [scrambled, setScrambled] = useState<{ id: number; char: string; used: boolean }[]>([]);

  useEffect(() => {
    const list = targetLetters.map((char, id) => ({ id, char, used: false }));
    list.sort(() => Math.random() - 0.5);
    setScrambled(list);
    setTypedLetters([]);
  }, [puzzleIndex]);

  const handlePickLetter = (itemIndex: number) => {
    const item = scrambled[itemIndex];
    if (item.used) return;

    sounds.playClick();
    const updated = [...scrambled];
    updated[itemIndex].used = true;
    setScrambled(updated);

    const nextTyped = [...typedLetters, item.char];
    setTypedLetters(nextTyped);

    if (nextTyped.length === targetLetters.length) {
      if (nextTyped.join('') === curPuzzle.word) {
        sounds.playSuccess();
        setScore((s) => s + 25);
        setTimeout(() => {
          if (puzzleIndex + 1 < WORD_PUZZLES.length) {
            setPuzzleIndex((prev) => prev + 1);
          } else {
            setIsCompleted(true);
            sounds.playWin();
          }
        }, 600);
      } else {
        // Reset
        setTimeout(() => {
          setTypedLetters([]);
          setScrambled((prev) => prev.map((l) => ({ ...l, used: false })));
        }, 600);
      }
    }
  };

  const handleClear = () => {
    setTypedLetters([]);
    setScrambled((prev) => prev.map((l) => ({ ...l, used: false })));
  };

  if (isCompleted) {
    return (
      <div className="text-center py-6">
        <div className="w-16 h-16 mx-auto mb-3 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center">
          <Trophy className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-slate-800 mb-1">Sözcük Avı Tamamlandı!</h3>
        <p className="text-slate-500 text-sm mb-4">
          Tüm kelimeleri başarıyla çözdünüz.
        </p>
        <button
          onClick={() => {
            setPuzzleIndex(0);
            setIsCompleted(false);
            setScore(0);
          }}
          className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-xl transition-all"
        >
          Yeniden Oyna
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4 text-xs font-semibold text-slate-500">
        <span>Kelime {puzzleIndex + 1} / {WORD_PUZZLES.length}</span>
        <span className="text-purple-600 font-bold tabular-nums">Puan: {score}</span>
      </div>

      <div className="p-4 bg-purple-50/70 border border-purple-200 rounded-xl mb-6 text-center">
        <span className="text-[11px] font-bold text-purple-600 uppercase tracking-wider block mb-1">
          İpucu
        </span>
        <p className="text-sm font-medium text-slate-800">{curPuzzle.clue}</p>
      </div>

      {/* Answer Slots */}
      <div className="flex justify-center gap-1.5 sm:gap-2 mb-6">
        {targetLetters.map((_, i) => (
          <div
            key={i}
            className="w-10 h-12 rounded-lg border-2 border-slate-300 bg-white flex items-center justify-center text-lg font-bold text-slate-900 shadow-xs"
          >
            {typedLetters[i] || ''}
          </div>
        ))}
      </div>

      {/* Available Scrambled Letters */}
      <div className="flex flex-wrap justify-center gap-2 mb-6">
        {scrambled.map((item, idx) => (
          <button
            key={item.id}
            onClick={() => handlePickLetter(idx)}
            disabled={item.used}
            className={`w-11 h-11 rounded-xl text-base font-bold transition-all shadow-xs ${
              item.used
                ? 'opacity-30 bg-slate-200 border-slate-200 text-slate-400 cursor-not-allowed'
                : 'bg-white border-2 border-purple-300 text-purple-700 hover:bg-purple-50 hover:scale-105 active:scale-95'
            }`}
          >
            {item.char}
          </button>
        ))}
      </div>

      <div className="flex justify-center">
        <button
          onClick={handleClear}
          className="text-xs text-slate-500 hover:text-slate-800 underline font-medium"
        >
          Harfleri Sıfırla
        </button>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------
   EXTERNAL / LINK GAME VIEW
------------------------------------------------------------- */
function ExternalGameView({ game }: { game: EducationalGame }) {
  return (
    <div className="text-center py-6">
      <div className="w-16 h-16 mx-auto mb-4 bg-slate-100 text-slate-600 rounded-2xl flex items-center justify-center">
        <ExternalLink className="w-8 h-8" />
      </div>
      <h3 className="text-xl font-bold text-slate-800 mb-2">{game.title}</h3>
      <p className="text-sm text-slate-600 max-w-md mx-auto mb-6">
        {game.description}
      </p>

      {game.externalUrl ? (
        <a
          href={game.externalUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl shadow-md transition-all"
        >
          <span>Oyunu Yeni Sekmede Aç</span>
          <ExternalLink className="w-4 h-4" />
        </a>
      ) : (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 max-w-sm mx-auto">
          Bu oyun için harici bir bağlantı henüz eklenmedi. &quot;Düzenle&quot; ile kendi oyun bağlantınızı ekleyebilirsiniz.
        </div>
      )}
    </div>
  );
}
