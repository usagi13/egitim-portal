import React, { useState } from 'react';
import { X, Gamepad2, Plus, Sparkles } from 'lucide-react';
import { EducationalGame, GameSubject } from '../types';

interface AddGameModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (game: Omit<EducationalGame, 'id'>) => void;
}

export const AddGameModal: React.FC<AddGameModalProps> = ({ isOpen, onClose, onSave }) => {
  const [title, setTitle] = useState('');
  const [tagline, setTagline] = useState('');
  const [description, setDescription] = useState('');
  const [subject, setSubject] = useState<GameSubject>('Matematik');
  const [grade, setGrade] = useState('4-8. Sınıf');
  const [duration, setDuration] = useState('5-10 Dk');
  const [playerCount, setPlayerCount] = useState('Bireysel / Sınıf');
  const [externalUrl, setExternalUrl] = useState('');
  const [outcomes, setOutcomes] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    const outcomeList = outcomes
      .split('\n')
      .map((o) => o.trim())
      .filter(Boolean);

    onSave({
      title: title.trim(),
      tagline: tagline.trim() || 'Eğitsel Sınıf Oyunu',
      description: description.trim(),
      subject,
      grade,
      duration,
      playerCount,
      interactiveType: externalUrl.trim() ? 'external' : 'external',
      externalUrl: externalUrl.trim().startsWith('http')
        ? externalUrl.trim()
        : externalUrl.trim()
        ? `https://${externalUrl.trim()}`
        : undefined,
      learningOutcomes:
        outcomeList.length > 0 ? outcomeList : ['Etkileşimli katılım ve pekiştirme'],
      accentColor: 'from-indigo-500 to-purple-600',
      isTeacherFavorite: true,
    });

    setTitle('');
    setTagline('');
    setDescription('');
    setExternalUrl('');
    setOutcomes('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-150 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-purple-700 to-indigo-700 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <Gamepad2 className="w-5 h-5 text-amber-300" />
            <h3 className="text-base font-bold text-white">Yeni Eğitsel Oyun Ekle</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Oyun Başlığı *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Örn: Kesirlerle Pizza Partisi, Bilim Tombalası"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Ders / Alan
              </label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value as GameSubject)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:border-indigo-500"
              >
                <option value="Matematik">Matematik</option>
                <option value="Fen Bilimleri">Fen Bilimleri</option>
                <option value="Türkçe">Türkçe</option>
                <option value="Zeka & Mantık">Zeka & Mantık</option>
                <option value="Kodlama">Kodlama</option>
                <option value="Genel Kültür">Genel Kültür</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Hedef Sınıf / Kademe
              </label>
              <input
                type="text"
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                placeholder="Örn: 5-8. Sınıf"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Kısa Vurgu / Slogan
            </label>
            <input
              type="text"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              placeholder="Örn: Hızlı Mantık ve Kavram Yarışması"
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Oyun Açıklaması & Kurallar *
            </label>
            <textarea
              rows={2}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Oyun nasıl oynanır, sınıf içinde nasıl uygulanır?"
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Harici Oyun / Simülasyon Linki (İsteğe Bağlı)
            </label>
            <input
              type="text"
              value={externalUrl}
              onChange={(e) => setExternalUrl(e.target.value)}
              placeholder="https://wordwall.net/..., kahoot.it veya phet.colorado.edu"
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Eğitsel Kazanımlar (Her satıra bir kazanım)
            </label>
            <textarea
              rows={2}
              value={outcomes}
              onChange={(e) => setOutcomes(e.target.value)}
              placeholder="Örn: Problem çözme hızı&#10;Grup içi yardımlaşma"
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100"
            >
              Vazgeç
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
            >
              Oyunu Kaydet
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
