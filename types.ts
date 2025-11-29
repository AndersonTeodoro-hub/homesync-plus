
export type Session = any;

export interface Message {
  id: number;
  role: 'user' | 'model';
  content: string;
  feedback?: 'positive' | 'negative';
}

export interface Contact {
  id: number;
  name: string;
  relationship: string;
  phone: string;
  whatsapp: string;
  email: string;
}

export type View =
  | 'home'
  | 'dashboard'
  | 'finances'
  | 'tasks'
  | 'shopping'
  | 'inventory'
  | 'text-chat'
  | 'essence'
  | 'learning'
  | 'english-course'
  | 'emergency'
  | 'family'
  | 'nutritionist'
  | 'personal-trainer';
