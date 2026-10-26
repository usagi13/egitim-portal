import React, { useState } from 'react';
import {
  ExternalLink,
  Copy,
  Check,
  Star,
  Trash2,
  Plus,
  Search,
  FileCheck,
  BookOpen,
  CalendarCheck,
  FolderKanban,
  Gamepad2,
  Filter,
  ArrowLeft,
} from 'lucide-react';
import { TeacherCategoryId, TeacherLinkItem } from '../types';
import { TEACHER_CATEGORIES } from '../data/initialData';

interface TeacherLinksWorkspaceProps {
  categoryId: TeacherCategoryId;
  items: TeacherLinkItem[];
  onOpenAddModal: (categoryId: TeacherCategoryId) => void;
  onToggleFavorite: (id: string) => void;
  onDeleteItem: (id: string) => void;
  onBackToHome: () => void;
  onShowToast: (msg: string) => void;
}

export const TeacherLinksWorkspace: React.FC<TeacherLinksWorkspaceProps> = ({
  categoryId,
  items,
  onOpenAddModal,
  onToggleFavorite,
  onDeleteItem,
  onBackToHome,
  onShowToast,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState<string>('all');

  const currentCat = TEACHER_CATEGORIES.find((c) => c.id === categoryId) || TEACHER_CATEGORIES[0];
  const categoryItems = items.filter((i) => i.categoryId === categoryId);

  const filteredItems = categoryItems.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.tags?.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesType = typeFilter === 'all' || item.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const handleCopy = (item: TeacherLinkItem) => {
    navigator.clipboard.writeText(item.url);
    setCopiedId(item.id);
    onShowToast(`"${item.title}" bağlantısı panoya kopyalandı!`);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getCategoryIcon = () => {
    switch (currentCat.iconName) {
      case 'FileCheck':
        return <FileCheck className="w-6 h-6" />;
      case 'BookOpen':
        return <BookOpen className="w-6 h-6" />;
      case 'CalendarCheck':
        return <CalendarCheck className="w-6 h-6" />;
      case 'FolderKanban':
        return <FolderKanban className="w-6 h-6" />;
      case 'Gamepad2':
        return <Gamepad2 className="w-6 h-6" />;
      default:
        return <BookOpen className="w-6 h-6" />;
    }
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* Category Header Banner */}
      <div className={`p-6 rounded-2xl border ${currentCat.color.bg} ${currentCat.color.border} relative overflow-hidden`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <button
              onClick={onBackToHome}
              className="p-2 bg-white rounded-xl text-slate-700 hover:text-slate-900 shadow-2xs border border-slate-200 hover:border-slate-300 transition-colors"
              title="Ana Sayfaya Dön"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div className={`p-2.5 rounded-xl bg-white shadow-2xs ${currentCat.color.text}`}>
              {getCategoryIcon()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600">
                  Öğretmen Alanı
                </span>
                <span className="text-slate-300">·</span>
                <span className="text-xs font-semibold text-slate-600">
                  {categoryItems.length} İçerik / Bağlantı
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                {currentCat.title}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-xl">
                {currentCat.shortDesc}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto">
            <button
              onClick={() => onOpenAddModal(categoryId)}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Yeni Bağlantı Ekle</span>
            </button>
          </div>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={`${currentCat.title} içinde ara...`}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-indigo-500 focus:bg-white"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setTypeFilter('all')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors ${
              typeFilter === 'all'
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Tümü ({categoryItems.length})
          </button>
          <button
            onClick={() => setTypeFilter('exam')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors ${
              typeFilter === 'exam'
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Sınavlar
          </button>
          <button
            onClick={() => setTypeFilter('doc')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors ${
              typeFilter === 'doc'
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Dokümanlar
          </button>
          <button
            onClick={() => setTypeFilter('link')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors ${
              typeFilter === 'link'
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Bağlantılar
          </button>
        </div>
      </div>

      {/* Items Grid */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-slate-300 p-6">
          <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-slate-100 text-slate-400 flex items-center justify-center">
            <Plus className="w-6 h-6" />
          </div>
          <h4 className="text-sm font-bold text-slate-800 mb-1">
            Bu kategoride henüz bağlantı bulunmuyor
          </h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">
            Daha sonra ekleyeceğiniz sınav, kaynak ve plan bağlantılarınızı hemen kaydetmek için aşağıdaki butonu kullanabilirsiniz.
          </p>
          <button
            onClick={() => onOpenAddModal(categoryId)}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors inline-flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            Yeni Bağlantı Ekle
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {filteredItems.map((item) => {
            const isCopied = copiedId === item.id;

            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl p-4 border border-slate-200/90 hover:border-indigo-300 hover:shadow-sm transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                      {item.type}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => onToggleFavorite(item.id)}
                        className={`p-1 rounded-md transition-colors ${
                          item.isFavorite
                            ? 'text-amber-500 hover:text-amber-600'
                            : 'text-slate-300 hover:text-amber-400'
                        }`}
                        title={item.isFavorite ? 'Favorilerden Çıkar' : 'Favorilere Ekle'}
                      >
                        <Star className={`w-3.5 h-3.5 ${item.isFavorite ? 'fill-current' : ''}`} />
                      </button>
                      <button
                        onClick={() => onDeleteItem(item.id)}
                        className="p-1 text-slate-300 hover:text-rose-500 rounded-md transition-colors"
                        title="Sil"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1 mb-1">
                    {item.title}
                  </h3>

                  <p className="text-xs text-slate-500 line-clamp-2 mb-3 leading-relaxed">
                    {item.description || 'Açıklama belirtilmedi.'}
                  </p>

                  {/* Tags */}
                  {item.tags && item.tags.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1.5 mb-3 text-[11px] text-slate-600">
                      {item.tags.map((tag, tIdx) => (
                        <span key={tIdx}>
                          #{tag}
                          {tIdx < item.tags!.length - 1 ? ' · ' : ''}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Actions bottom bar */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 mt-auto">
                  <span className="text-[10px] text-slate-600 tabular-nums">
                    {item.dateAdded}
                  </span>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleCopy(item)}
                      className="px-2.5 py-1 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1"
                      title="Bağlantıyı Kopyala"
                    >
                      {isCopied ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span className="text-emerald-700">Kopyalandı</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Kopyala</span>
                        </>
                      )}
                    </button>

                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1 text-xs font-bold text-indigo-600 hover:text-white bg-indigo-50 hover:bg-indigo-600 rounded-lg transition-colors flex items-center gap-1"
                    >
                      <span>Aç</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
