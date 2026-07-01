export type Category = 'work' | 'me' | 'friends' | 'love';

export interface Theme {
  bg: string;
  text: string;
  label: string;
}

export interface Question {
  id: string;
  text: string;
  category: Category;
  subtheme: string;
  theme: Theme;
}
