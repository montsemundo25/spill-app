export type Category = 'royal-work' | 'lime-fun' | 'oxblood-deep' | 'lilac-all';

export interface Theme {
  bg: string;
  text: string;
  label: string;
}

export interface Question {
  id: string;
  text: string;
  category: 'royal-work' | 'lime-fun' | 'oxblood-deep';
  theme: Theme;
}
