export type TeacherCategoryId =
  | 'sinavlarim'
  | 'kaynaklarim'
  | 'planlarim'
  | 'dosyalarim'
  | 'oyunlarim';

export interface TeacherCategoryInfo {
  id: TeacherCategoryId;
  title: string;
  shortDesc: string;
  iconName: string;
  color: {
    bg: string;
    text: string;
    border: string;
    activeBg: string;
    badge: string;
  };
}

export type ItemType = 'link' | 'pdf' | 'doc' | 'presentation' | 'exam' | 'game';

export interface TeacherLinkItem {
  id: string;
  categoryId: TeacherCategoryId;
  title: string;
  description: string;
  url: string;
  type: ItemType;
  dateAdded: string;
  isFavorite?: boolean;
  tags?: string[];
}

export type GameSubject =
  | 'Matematik'
  | 'Fen Bilimleri'
  | 'Türkçe'
  | 'Zeka & Mantık'
  | 'Kodlama'
  | 'Genel Kültür';

export type InteractiveGameType =
  | 'math_challenge'
  | 'memory_match'
  | 'word_puzzle'
  | 'trivia_quiz'
  | 'external';

export interface EducationalGame {
  id: string;
  title: string;
  tagline: string;
  description: string;
  subject: GameSubject;
  grade: string;
  duration: string;
  playerCount: string;
  image?: string;
  interactiveType: InteractiveGameType;
  externalUrl?: string;
  learningOutcomes: string[];
  accentColor: string;
  isTeacherFavorite?: boolean;
}

export interface EducationalQuote {
  id: string;
  author: string;
  role: string;
  quote: string;
  era: string;
  bio: string;
  tags: string[];
  isCustom?: boolean;
  isFavorite?: boolean;
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  time?: string;
  type: 'exam' | 'lesson' | 'meeting' | 'note';
}
