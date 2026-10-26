/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { TeacherSidebar } from './components/TeacherSidebar';
import { EducationalGamesHub } from './components/EducationalGamesHub';
import { TeacherLinksWorkspace } from './components/TeacherLinksWorkspace';
import { InspirationalQuotes } from './components/InspirationalQuotes';
import { InteractiveGameModal } from './components/InteractiveGameModal';
import { AddLinkModal } from './components/AddLinkModal';
import { AddGameModal } from './components/AddGameModal';
import { Toast } from './components/Toast';
import {
  INITIAL_CALENDAR_EVENTS,
  INITIAL_EDUCATIONAL_GAMES,
  INITIAL_EDUCATIONAL_QUOTES,
  INITIAL_TEACHER_LINKS,
} from './data/initialData';
import {
  CalendarEvent,
  EducationalGame,
  EducationalQuote,
  TeacherCategoryId,
  TeacherLinkItem,
} from './types';

export default function App() {
  // Persistence state
  const [teacherLinks, setTeacherLinks] = useState<TeacherLinkItem[]>(() => {
    try {
      const saved = localStorage.getItem('akademihub_teacher_links');
      return saved ? JSON.parse(saved) : INITIAL_TEACHER_LINKS;
    } catch {
      return INITIAL_TEACHER_LINKS;
    }
  });

  const [educationalGames, setEducationalGames] = useState<EducationalGame[]>(() => {
    try {
      const saved = localStorage.getItem('akademihub_games');
      return saved ? JSON.parse(saved) : INITIAL_EDUCATIONAL_GAMES;
    } catch {
      return INITIAL_EDUCATIONAL_GAMES;
    }
  });

  const [quotes, setQuotes] = useState<EducationalQuote[]>(() => {
    try {
      const saved = localStorage.getItem('akademihub_quotes');
      return saved ? JSON.parse(saved) : INITIAL_EDUCATIONAL_QUOTES;
    } catch {
      return INITIAL_EDUCATIONAL_QUOTES;
    }
  });

  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>(() => {
    try {
      const saved = localStorage.getItem('akademihub_calendar_events');
      return saved ? JSON.parse(saved) : INITIAL_CALENDAR_EVENTS;
    } catch {
      return INITIAL_CALENDAR_EVENTS;
    }
  });

  // UI state
  const [selectedCategory, setSelectedCategory] = useState<TeacherCategoryId | null>(null);
  const [activePlayGame, setActivePlayGame] = useState<EducationalGame | null>(null);
  const [isAddLinkModalOpen, setIsAddLinkModalOpen] = useState(false);
  const [targetCategoryForAdd, setTargetCategoryForAdd] = useState<TeacherCategoryId>('kaynaklarim');
  const [isAddGameModalOpen, setIsAddGameModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('akademihub_teacher_links', JSON.stringify(teacherLinks));
    } catch {
      // localStorage error fallback
    }
  }, [teacherLinks]);

  useEffect(() => {
    try {
      localStorage.setItem('akademihub_games', JSON.stringify(educationalGames));
    } catch {
      // localStorage error fallback
    }
  }, [educationalGames]);

  useEffect(() => {
    try {
      localStorage.setItem('akademihub_quotes', JSON.stringify(quotes));
    } catch {
      // localStorage error fallback
    }
  }, [quotes]);

  useEffect(() => {
    try {
      localStorage.setItem('akademihub_calendar_events', JSON.stringify(calendarEvents));
    } catch {
      // localStorage error fallback
    }
  }, [calendarEvents]);

  // Handlers for Teacher Links
  const handleOpenAddLinkModal = (catId?: TeacherCategoryId) => {
    if (catId) setTargetCategoryForAdd(catId);
    else if (selectedCategory) setTargetCategoryForAdd(selectedCategory);
    setIsAddLinkModalOpen(true);
  };

  const handleSaveLink = (newItem: Omit<TeacherLinkItem, 'id' | 'dateAdded'>) => {
    const item: TeacherLinkItem = {
      ...newItem,
      id: `link-${Date.now()}`,
      dateAdded: new Date().toISOString().split('T')[0],
    };
    setTeacherLinks((prev) => [item, ...prev]);
    setToastMessage(`"${item.title}" başarıyla kaydedildi!`);
  };

  const handleToggleFavoriteLink = (id: string) => {
    setTeacherLinks((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isFavorite: !item.isFavorite } : item))
    );
  };

  const handleDeleteLink = (id: string) => {
    setTeacherLinks((prev) => prev.filter((item) => item.id !== id));
    setToastMessage('Bağlantı listeden silindi.');
  };

  // Handlers for Games
  const handleSaveGame = (newGame: Omit<EducationalGame, 'id'>) => {
    const game: EducationalGame = {
      ...newGame,
      id: `game-${Date.now()}`,
    };
    setEducationalGames((prev) => [game, ...prev]);
    setToastMessage(`"${game.title}" oyunu eklendi!`);
  };

  const handleToggleFavoriteGame = (id: string) => {
    setEducationalGames((prev) =>
      prev.map((g) => (g.id === id ? { ...g, isTeacherFavorite: !g.isTeacherFavorite } : g))
    );
  };

  // Handlers for Quotes
  const handleAddQuote = (newQuote: Omit<EducationalQuote, 'id'>) => {
    const quote: EducationalQuote = {
      ...newQuote,
      id: `quote-${Date.now()}`,
    };
    setQuotes((prev) => [quote, ...prev]);
  };

  const handleToggleFavoriteQuote = (id: string) => {
    setQuotes((prev) =>
      prev.map((q) => (q.id === id ? { ...q, isFavorite: !q.isFavorite } : q))
    );
  };

  // Handlers for Calendar
  const handleAddCalendarEvent = (newEvent: Omit<CalendarEvent, 'id'>) => {
    const ev: CalendarEvent = {
      ...newEvent,
      id: `event-${Date.now()}`,
    };
    setCalendarEvents((prev) => [...prev, ev]);
    setToastMessage('Takvim etkinliği eklendi.');
  };

  const handleDeleteCalendarEvent = (id: string) => {
    setCalendarEvents((prev) => prev.filter((ev) => ev.id !== id));
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Top Bar Header with live clock & calendar widget */}
      <Header
        events={calendarEvents}
        onAddEvent={handleAddCalendarEvent}
        onDeleteEvent={handleDeleteCalendarEvent}
        onSelectCategory={setSelectedCategory}
        onOpenAddLinkModal={() => handleOpenAddLinkModal()}
      />

      {/* Main 3-Column Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
        <div className="flex flex-col lg:flex-row items-start gap-6">
          {/* Sol Taraf: Öğretmen Alanı Menüsü */}
          <TeacherSidebar
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            items={teacherLinks}
            onOpenAddModal={handleOpenAddLinkModal}
          />

          {/* Orta Bölüm: Canlı Renklerle Eğitsel Oyunlar veya Seçili Kategori Çalışma Alanı */}
          <section className="flex-1 min-w-0 w-full">
            {selectedCategory ? (
              <TeacherLinksWorkspace
                categoryId={selectedCategory}
                items={teacherLinks}
                onOpenAddModal={handleOpenAddLinkModal}
                onToggleFavorite={handleToggleFavoriteLink}
                onDeleteItem={handleDeleteLink}
                onBackToHome={() => setSelectedCategory(null)}
                onShowToast={setToastMessage}
              />
            ) : (
              <EducationalGamesHub
                games={educationalGames}
                onPlayGame={setActivePlayGame}
                onOpenAddGameModal={() => setIsAddGameModalOpen(true)}
                onToggleFavoriteGame={handleToggleFavoriteGame}
              />
            )}
          </section>

          {/* Sağ Taraf: Eğitimle İlgili İlham Veren Sözler & Düşünürler */}
          <InspirationalQuotes
            quotes={quotes}
            onToggleFavorite={handleToggleFavoriteQuote}
            onAddQuote={handleAddQuote}
            onShowToast={setToastMessage}
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-auto py-6 border-t border-slate-200/80 bg-white text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© 2026 AkademiHub · Öğretmen ve Eğitsel Oyun Geliştirme Portalı</p>
          <p className="text-slate-600">
            Ders kaynakları, sınavlar ve yeni eğitsel oyunlar ekleyerek her an zenginleştirilebilir.
          </p>
        </div>
      </footer>

      {/* Modals */}
      <InteractiveGameModal
        game={activePlayGame}
        onClose={() => setActivePlayGame(null)}
      />

      <AddLinkModal
        isOpen={isAddLinkModalOpen}
        onClose={() => setIsAddLinkModalOpen(false)}
        onSave={handleSaveLink}
        defaultCategoryId={targetCategoryForAdd}
      />

      <AddGameModal
        isOpen={isAddGameModalOpen}
        onClose={() => setIsAddGameModalOpen(false)}
        onSave={handleSaveGame}
      />

      <Toast
        message={toastMessage}
        onClose={() => setToastMessage(null)}
      />
    </div>
  );
}
