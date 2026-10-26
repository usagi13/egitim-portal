import React, { useState } from 'react';
import {
  Gamepad2,
  Sparkles,
  Play,
  Plus,
  Clock,
  Users,
  Award,
  Layers,
  ChevronRight,
  BookmarkCheck,
  Star,
  Search,
} from 'lucide-react';
import { EducationalGame, GameSubject } from '../types';

interface EducationalGamesHubProps {
  games: EducationalGame[];
  onPlayGame: (game: EducationalGame) => void;
  onOpenAddGameModal: () => void;
  onToggleFavoriteGame: (id: string) => void;
}

const SUBJECT_FILTERS: ('Tümü' | GameSubject)[] = [
  'Tümü',
  'Matematik',
  'Fen Bilimleri',
  'Türkçe',
  'Zeka & Mantık',
  'Kodlama',
  'Genel Kültür',
];

export const EducationalGamesHub: React.FC<EducationalGamesHubProps> = ({
  games,
  onPlayGame,
  onOpenAddGameModal,
  onToggleFavoriteGame,
}) => {
  const [activeFilter, setActiveFilter] = useState<'Tümü' | GameSubject>('Tümü');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredGames = games.filter((game) => {
    const matchesFilter = activeFilter === 'Tümü' || game.subject === activeFilter;
    const matchesSearch =
      game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      game.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      game.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      game.learningOutcomes.some((outcome) =>
        outcome.toLowerCase().includes(searchQuery.toLowerCase())
      );
    return matchesFilter && matchesSearch;
  });

  const featuredGame = games[0] || null;

  return (
    <div className="space-y-6">
      {/* Hero Showcase Banner */}
      <div className="relative rounded-3xl overflow-hidden shadow-lg border border-indigo-200/60 bg-gradient-to-r from-indigo-900 via-purple-900 to-slate-900 text-white min-h-[220px] flex flex-col justify-between p-6 sm:p-8">
        {/* Background Image Scrim */}
        <div className="absolute inset-0 opacity-25 mix-blend-overlay pointer-events-none">
          <img
            src="/src/assets/images/edu_portal_hero_1793035495554.jpg"
            alt="Eğitsel Oyun Alanı"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="relative z-10 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-amber-300 text-xs font-bold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Canlı & Etkileşimli Eğitsel Oyun Alanı</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-2 leading-tight">
            Öğrenmeyi Oyuna, Merakı Keşfe Dönüştürün
          </h1>
          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed max-w-lg">
            Matematikten bilime, dilden zeka bulmacalarına kadar derslerinizi zenginleştirecek interaktif oyunlar ve sınıf içi etkinlikler.
          </p>
        </div>

        <div className="relative z-10 pt-4 flex flex-wrap items-center gap-3">
          {featuredGame && (
            <button
              onClick={() => onPlayGame(featuredGame)}
              className="px-5 py-2.5 bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-slate-950 font-extrabold text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center gap-2 transform active:scale-95"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Günün Oyunu: {featuredGame.title}</span>
            </button>
          )}

          <button
            onClick={onOpenAddGameModal}
            className="px-4 py-2.5 bg-white/15 hover:bg-white/25 text-white font-bold text-xs sm:text-sm rounded-xl backdrop-blur-md border border-white/20 transition-all flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Yeni Oyun / İçerik Ekle</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-3 border border-slate-200/80 shadow-2xs space-y-3">
        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Oyun adı, ders konusu veya kazanım ara..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-indigo-500 focus:bg-white"
          />
        </div>

        {/* Subject Filter Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {SUBJECT_FILTERS.map((subject) => {
            const isActive = activeFilter === subject;
            return (
              <button
                key={subject}
                onClick={() => setActiveFilter(subject)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-xs scale-102'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                }`}
              >
                {subject}
              </button>
            );
          })}
        </div>
      </div>

      {/* Games Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredGames.map((game) => {
          return (
            <div
              key={game.id}
              className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden hover:border-indigo-300 hover:shadow-md transition-all flex flex-col group"
            >
              {/* Optional Game Image Banner */}
              {game.image && (
                <div className="h-36 w-full relative overflow-hidden bg-slate-100">
                  <img
                    src={game.image}
                    alt={game.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                  <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-white text-xs">
                    <span className="font-bold text-amber-300 drop-shadow-xs">
                      {game.subject}
                    </span>
                    <span className="text-[11px] opacity-90 drop-shadow-xs">
                      {game.grade}
                    </span>
                  </div>
                </div>
              )}

              {/* Card Body */}
              <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                <div>
                  {!game.image && (
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
                        {game.subject}
                      </span>
                      <span className="text-xs text-slate-600 font-medium">
                        {game.grade}
                      </span>
                    </div>
                  )}

                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                      {game.title}
                    </h3>
                    <button
                      onClick={() => onToggleFavoriteGame(game.id)}
                      className={`p-1 rounded-md transition-colors ${
                        game.isTeacherFavorite
                          ? 'text-amber-500'
                          : 'text-slate-300 hover:text-amber-400'
                      }`}
                      title="Favori Oyun"
                    >
                      <Star className={`w-4 h-4 ${game.isTeacherFavorite ? 'fill-current' : ''}`} />
                    </button>
                  </div>

                  <p className="text-xs font-semibold text-slate-600 mb-2">
                    {game.tagline}
                  </p>

                  <p className="text-xs text-slate-600 leading-relaxed mb-3 line-clamp-2">
                    {game.description}
                  </p>

                  {/* Meta items: time & player count */}
                  <div className="flex items-center gap-3 text-[11px] text-slate-600 mb-3 pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-amber-500" />
                      <span>{game.duration}</span>
                    </div>
                    <span>·</span>
                    <div className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-indigo-500" />
                      <span>{game.playerCount}</span>
                    </div>
                  </div>

                  {/* Learning outcomes */}
                  {game.learningOutcomes && game.learningOutcomes.length > 0 && (
                    <div className="space-y-1 mb-4">
                      <div className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">
                        Kazanımlar:
                      </div>
                      {game.learningOutcomes.slice(0, 2).map((item, i) => (
                        <div key={i} className="flex items-center gap-1.5 text-[11px] text-slate-600">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                          <span className="truncate">{item}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Play Button */}
                <button
                  onClick={() => onPlayGame(game)}
                  className="w-full mt-2 py-2.5 px-4 bg-slate-900 hover:bg-indigo-600 text-white font-bold text-xs rounded-xl shadow-xs hover:shadow-md transition-all flex items-center justify-center gap-2 group-hover:bg-indigo-600"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Oyunu Başlat & Oyna</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredGames.length === 0 && (
        <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 p-6">
          <p className="text-sm font-bold text-slate-700">Aramanıza uygun oyun bulunamadı.</p>
          <p className="text-xs text-slate-500 mt-1 mb-4">
            Filtreyi temizleyebilir veya yeni bir oyun ekleyebilirsiniz.
          </p>
          <button
            onClick={() => {
              setActiveFilter('Tümü');
              setSearchQuery('');
            }}
            className="px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded-xl"
          >
            Filtreleri Temizle
          </button>
        </div>
      )}
    </div>
  );
};
