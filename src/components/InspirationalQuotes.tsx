import React, { useState } from 'react';
import {
  Quote,
  Shuffle,
  Volume2,
  Copy,
  Check,
  Star,
  Plus,
  Sparkles,
  Search,
  BookMarked,
  X,
  VolumeX,
} from 'lucide-react';
import { EducationalQuote } from '../types';

interface InspirationalQuotesProps {
  quotes: EducationalQuote[];
  onToggleFavorite: (id: string) => void;
  onAddQuote: (newQuote: Omit<EducationalQuote, 'id'>) => void;
  onShowToast: (msg: string) => void;
}

export const InspirationalQuotes: React.FC<InspirationalQuotesProps> = ({
  quotes,
  onToggleFavorite,
  onAddQuote,
  onShowToast,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [viewMode, setViewMode] = useState<'spotlight' | 'list'>('spotlight');
  const [searchFilter, setSearchFilter] = useState('');

  // New quote form state
  const [newAuthor, setNewAuthor] = useState('');
  const [newRole, setNewRole] = useState('');
  const [newQuoteText, setNewQuoteText] = useState('');
  const [newEra, setNewEra] = useState('');
  const [newTags, setNewTags] = useState('');

  const currentQuote = quotes[currentIndex] || quotes[0];

  const handleNextQuote = () => {
    let nextIdx = Math.floor(Math.random() * quotes.length);
    if (nextIdx === currentIndex) {
      nextIdx = (currentIndex + 1) % quotes.length;
    }
    setCurrentIndex(nextIdx);
  };

  const handleCopyQuote = () => {
    if (!currentQuote) return;
    const textToCopy = `"${currentQuote.quote}" — ${currentQuote.author} (${currentQuote.role})`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    onShowToast('İlham veren söz panoya kopyalandı!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSpeakQuote = () => {
    if (!('speechSynthesis' in window)) {
      onShowToast('Tarayıcınız sesli okumayı desteklemiyor.');
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(currentQuote.quote);
    utterance.lang = 'tr-TR';
    utterance.rate = 0.95;

    // Pick a Turkish voice if available
    const voices = window.speechSynthesis.getVoices();
    const trVoice = voices.find((v) => v.lang.startsWith('tr'));
    if (trVoice) {
      utterance.voice = trVoice;
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const handleSaveNewQuote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAuthor.trim() || !newQuoteText.trim()) return;

    onAddQuote({
      author: newAuthor.trim(),
      role: newRole.trim() || 'Eğitimci / Düşünür',
      quote: newQuoteText.trim(),
      era: newEra.trim() || 'Günümüz',
      bio: `${newAuthor} tarafından paylaşılan ilham verici eğitim felsefesi.`,
      tags: newTags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
      isCustom: true,
      isFavorite: true,
    });

    setNewAuthor('');
    setNewRole('');
    setNewQuoteText('');
    setNewEra('');
    setNewTags('');
    setShowAddModal(false);
    onShowToast('Yeni ilham sözü başarıyla eklendi!');
  };

  const filteredQuotes = quotes.filter(
    (q) =>
      q.author.toLowerCase().includes(searchFilter.toLowerCase()) ||
      q.quote.toLowerCase().includes(searchFilter.toLowerCase()) ||
      q.role.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <aside className="w-full lg:w-80 xl:w-88 shrink-0 flex flex-col gap-4">
      {/* Container Card */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs flex flex-col justify-between">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-700 flex items-center justify-center font-bold">
              <Quote className="w-4 h-4 fill-current" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 leading-tight">
                Eğitimde İz Bırakanlar
              </h2>
              <p className="text-[11px] text-slate-600">İlham Veren Düşünceler</p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setViewMode(viewMode === 'spotlight' ? 'list' : 'spotlight')}
              className="text-[11px] font-bold text-slate-600 hover:text-indigo-600 px-2 py-1 rounded-lg hover:bg-slate-50 transition-colors"
            >
              {viewMode === 'spotlight' ? 'Tümünü Gör' : 'Tekli Görünüm'}
            </button>
          </div>
        </div>

        {/* View Mode 1: Spotlight / Featured Quote Card */}
        {viewMode === 'spotlight' && currentQuote && (
          <div className="space-y-4">
            {/* Quote Body Card */}
            <div className="relative p-5 rounded-2xl bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-amber-500/5 border border-amber-200/80">
              <Quote className="w-8 h-8 text-amber-400/40 absolute top-3 right-3 pointer-events-none" />

              <blockquote className="text-xs sm:text-sm font-semibold text-slate-800 leading-relaxed italic mb-4 relative z-10">
                &quot;{currentQuote.quote}&quot;
              </blockquote>

              {/* Author info */}
              <div className="pt-3 border-t border-amber-200/60 flex items-start justify-between gap-2">
                <div>
                  <div className="text-xs font-bold text-slate-900">
                    {currentQuote.author}
                  </div>
                  <div className="text-[11px] text-amber-800 font-medium leading-tight">
                    {currentQuote.role}
                  </div>
                  <div className="text-[10px] text-slate-600 mt-0.5">
                    {currentQuote.era}
                  </div>
                </div>

                <button
                  onClick={() => onToggleFavorite(currentQuote.id)}
                  className={`p-1.5 rounded-lg transition-colors shrink-0 ${
                    currentQuote.isFavorite
                      ? 'text-amber-500 hover:text-amber-600'
                      : 'text-slate-300 hover:text-amber-400'
                  }`}
                  title={currentQuote.isFavorite ? 'Favorilerden Çıkar' : 'Favorilere Ekle'}
                >
                  <Star className={`w-4 h-4 ${currentQuote.isFavorite ? 'fill-current' : ''}`} />
                </button>
              </div>

              {/* Bio summary */}
              {currentQuote.bio && (
                <p className="text-[11px] text-slate-600 mt-2.5 pt-2 border-t border-amber-100">
                  {currentQuote.bio}
                </p>
              )}
            </div>

            {/* Action Bar */}
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={handleNextQuote}
                className="px-2.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5"
                title="Yeni bir söz getir"
              >
                <Shuffle className="w-3.5 h-3.5" />
                <span>Yeni Söz</span>
              </button>

              <button
                onClick={handleSpeakQuote}
                className={`px-2.5 py-2 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 ${
                  isSpeaking
                    ? 'bg-amber-500 text-white animate-pulse'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
                title="Sesli Olarak Dinle"
              >
                {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                <span>{isSpeaking ? 'Durdur' : 'Dinle'}</span>
              </button>

              <button
                onClick={handleCopyQuote}
                className="px-2.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5"
                title="Sözü Panoya Kopyala"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700">Kopyalandı</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Kopyala</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* View Mode 2: All Quotes List */}
        {viewMode === 'list' && (
          <div className="space-y-3">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="Düşünür veya söz ara..."
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="max-h-[440px] overflow-y-auto space-y-2.5 pr-1">
              {filteredQuotes.map((q, idx) => (
                <div
                  key={q.id}
                  onClick={() => {
                    setCurrentIndex(quotes.findIndex((item) => item.id === q.id));
                    setViewMode('spotlight');
                  }}
                  className="p-3 rounded-xl border border-slate-200/90 hover:border-amber-300 hover:bg-amber-50/30 cursor-pointer transition-all text-xs"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-slate-900">{q.author}</span>
                    <span className="text-[10px] text-slate-600">{q.era}</span>
                  </div>
                  <p className="text-slate-600 italic line-clamp-2 leading-relaxed">
                    &quot;{q.quote}&quot;
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Bottom Add Custom Quote Button */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
          <span className="text-[11px] text-slate-600">
            {quotes.length} Düşünce Kayıtlı
          </span>
          <button
            onClick={() => setShowAddModal(true)}
            className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Kendi Sözünü Ekle</span>
          </button>
        </div>
      </div>

      {/* Add Custom Quote Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-150">
            <div className="px-5 py-4 bg-gradient-to-r from-amber-600 to-orange-600 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-200" />
                <h3 className="text-base font-bold text-white">İlham Veren Söz Ekle</h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-lg text-amber-100 hover:text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveNewQuote} className="p-5 space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Eğitimci / Düşünür Adı *
                </label>
                <input
                  type="text"
                  required
                  value={newAuthor}
                  onChange={(e) => setNewAuthor(e.target.value)}
                  placeholder="Örn: İsmail Hakkı Tonguç, Aziz Sancar"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Unvanı / Rolü
                </label>
                <input
                  type="text"
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  placeholder="Örn: Eğitim Bilimci, Nobel Ödüllü Bilim İnsanı"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Düşünce / Söz *
                </label>
                <textarea
                  rows={3}
                  required
                  value={newQuoteText}
                  onChange={(e) => setNewQuoteText(e.target.value)}
                  placeholder="Eğitim, çocuk ve öğretmenlik üzerine ilham veren düşünce..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Dönem / Yıl
                  </label>
                  <input
                    type="text"
                    value={newEra}
                    onChange={(e) => setNewEra(e.target.value)}
                    placeholder="Örn: 1897 - 1960"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Etiketler
                  </label>
                  <input
                    type="text"
                    value={newTags}
                    onChange={(e) => setNewTags(e.target.value)}
                    placeholder="Eğitim, Bilim, Çaba"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3.5 py-1.5 text-xs text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100"
                >
                  Vazgeç
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
                >
                  Sözü Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </aside>
  );
};
