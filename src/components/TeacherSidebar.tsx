import React from 'react';
import {
  FileCheck,
  BookOpen,
  CalendarCheck,
  FolderKanban,
  Gamepad2,
  Plus,
  Star,
  ExternalLink,
  Info,
  ChevronRight,
} from 'lucide-react';
import { TeacherCategoryId, TeacherLinkItem } from '../types';
import { TEACHER_CATEGORIES } from '../data/initialData';

interface TeacherSidebarProps {
  selectedCategory: TeacherCategoryId | null;
  onSelectCategory: (id: TeacherCategoryId | null) => void;
  items: TeacherLinkItem[];
  onOpenAddModal: (catId?: TeacherCategoryId) => void;
}

export const TeacherSidebar: React.FC<TeacherSidebarProps> = ({
  selectedCategory,
  onSelectCategory,
  items,
  onOpenAddModal,
}) => {
  const getIcon = (name: string) => {
    switch (name) {
      case 'FileCheck':
        return <FileCheck className="w-5 h-5 shrink-0" />;
      case 'BookOpen':
        return <BookOpen className="w-5 h-5 shrink-0" />;
      case 'CalendarCheck':
        return <CalendarCheck className="w-5 h-5 shrink-0" />;
      case 'FolderKanban':
        return <FolderKanban className="w-5 h-5 shrink-0" />;
      case 'Gamepad2':
        return <Gamepad2 className="w-5 h-5 shrink-0" />;
      default:
        return <BookOpen className="w-5 h-5 shrink-0" />;
    }
  };

  const getItemCount = (catId: TeacherCategoryId) => {
    return items.filter((i) => i.categoryId === catId).length;
  };

  return (
    <aside className="w-full lg:w-72 shrink-0 flex flex-col gap-4">
      {/* Teacher Area Header Card */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
              Ö
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 leading-tight">Öğretmen Alanı</h2>
              <p className="text-[11px] text-slate-600">Ders & Yönetim Menüsü</p>
            </div>
          </div>
          <button
            onClick={() => onOpenAddModal(selectedCategory || 'kaynaklarim')}
            className="p-1.5 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-600 hover:text-white transition-all text-xs font-semibold flex items-center gap-1"
            title="Yeni Bağlantı / Belge Ekle"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Ekle</span>
          </button>
        </div>

        {/* Categories Menu List */}
        <nav className="space-y-1.5">
          {TEACHER_CATEGORIES.map((cat) => {
            const count = getItemCount(cat.id);
            const isSelected = selectedCategory === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(isSelected ? null : cat.id)}
                className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left transition-all group ${
                  isSelected
                    ? `${cat.color.bg} ${cat.color.border} border shadow-xs`
                    : 'hover:bg-slate-50 text-slate-700 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    className={`p-1.5 rounded-lg transition-colors ${
                      isSelected
                        ? `${cat.color.text} bg-white shadow-2xs`
                        : `${cat.color.text} ${cat.color.bg} group-hover:scale-105`
                    }`}
                  >
                    {getIcon(cat.iconName)}
                  </div>
                  <div className="min-w-0">
                    <span
                      className={`text-xs font-bold block truncate ${
                        isSelected ? cat.color.text : 'text-slate-800'
                      }`}
                    >
                      {cat.title}
                    </span>
                    <span className="text-[10px] text-slate-600 block truncate">
                      {cat.shortDesc}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0 ml-2">
                  <span
                    className={`text-[11px] font-bold tabular-nums px-1.5 py-0.5 rounded-md ${
                      isSelected
                        ? 'bg-white text-slate-800 shadow-2xs'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {count}
                  </span>
                  <ChevronRight
                    className={`w-3.5 h-3.5 transition-transform ${
                      isSelected ? 'rotate-90 text-slate-800' : 'text-slate-400 group-hover:translate-x-0.5'
                    }`}
                  />
                </div>
              </button>
            );
          })}
        </nav>

        {/* Reset / All Overview View button */}
        {selectedCategory && (
          <button
            onClick={() => onSelectCategory(null)}
            className="w-full mt-2 py-1.5 text-center text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
          >
            ← Ana Sayfaya / Oyunlar Alanına Dön
          </button>
        )}
      </div>

      {/* Quick Add Notice Card (Teacher link guidance) */}
      <div className="bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-transparent rounded-2xl p-4 border border-amber-200/80 text-xs">
        <div className="flex items-start gap-2.5">
          <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-amber-900 block mb-0.5">
              Bağlantı & İçerik Ekleme
            </span>
            <p className="text-amber-800 text-[11px] leading-relaxed">
              Bu kategorilerdeki bağlantıları henüz paylaşmadınız. Kendi Google Drive, MEB, EBA veya ders bağlantılarınızı istediğiniz zaman &quot;+ Ekle&quot; butonuyla ekleyebilirsiniz.
            </p>
            <button
              onClick={() => onOpenAddModal(selectedCategory || 'sinavlarim')}
              className="mt-2 text-[11px] font-bold text-amber-900 hover:text-amber-950 underline inline-flex items-center gap-1"
            >
              <Plus className="w-3 h-3" />
              İlk bağlantını şimdi ekle
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};
