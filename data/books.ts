export type BookStatus = 'reading' | 'finished' | 'want';

export interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  status: BookStatus;
  featured?: boolean;
  rating?: number;
  notes?: string;
  blogPostUrl?: string;
  dateFinished?: string;
  spineColor: string;
}

export const books: Book[] = [
  {
    id: 'thinking-fast-slow',
    title: 'Thinking, Fast and Slow',
    author: 'Daniel Kahneman',
    isbn: '9780374533557',
    status: 'reading',
    notes: 'Halfway through. The stuff on cognitive bias is reshaping how I think about model assumptions and why box scores lie.',
    spineColor: '#2d4a6e',
  },
  {
    id: 'innovators-dilemma',
    title: "The Innovator's Dilemma",
    author: 'Clayton M. Christensen',
    isbn: '9780062060242',
    status: 'reading',
    spineColor: '#6b2737',
  },
  {
    id: 'moneyball',
    title: 'Moneyball',
    author: 'Michael Lewis',
    isbn: '9780393057651',
    status: 'finished',
    featured: true,
    rating: 5,
    notes: 'The book that set the direction for everything on this site. Oakland used data to compete with teams three times their budget. That energy is the whole point of Hoops Lab.',
    dateFinished: '2023-08-15',
    spineColor: '#4a5a2d',
  },
  {
    id: 'atomic-habits',
    title: 'Atomic Habits',
    author: 'James Clear',
    isbn: '9780735211292',
    status: 'finished',
    rating: 5,
    notes: "The 1% better every day framing is the only self-improvement idea I've actually applied consistently.",
    dateFinished: '2024-12-01',
    spineColor: '#2d5a3d',
  },
  {
    id: 'sapiens',
    title: 'Sapiens',
    author: 'Yuval Noah Harari',
    isbn: '9780062316097',
    status: 'finished',
    featured: true,
    rating: 5,
    notes: 'Humbling at a species level. Changed how I think about shared fictions — and why the stats we choose to care about in sports are just as constructed.',
    dateFinished: '2023-01-20',
    spineColor: '#7a1f2e',
  },
  {
    id: 'shoe-dog',
    title: 'Shoe Dog',
    author: 'Phil Knight',
    isbn: '9781501135910',
    status: 'finished',
    rating: 4,
    notes: "Unexpectedly raw. Phil Knight is not the hero you expect, and that's what makes it worth reading.",
    dateFinished: '2024-03-20',
    spineColor: '#4a2d6e',
  },
  {
    id: 'outliers',
    title: 'Outliers',
    author: 'Malcolm Gladwell',
    isbn: '9780316017930',
    status: 'finished',
    rating: 4,
    notes: 'Made me think differently about luck, timing, and the invisible advantages baked into birth years and birth places.',
    dateFinished: '2023-05-10',
    spineColor: '#6b4a2d',
  },
  {
    id: 'range',
    title: 'Range',
    author: 'David Epstein',
    isbn: '9780735214484',
    status: 'finished',
    rating: 4,
    notes: 'Great counter to the 10,000-hour rule. The argument for bringing outside thinking into narrow domains maps directly to sports analytics.',
    dateFinished: '2024-06-30',
    spineColor: '#2d5a6e',
  },
  {
    id: 'signal-noise',
    title: 'The Signal and the Noise',
    author: 'Nate Silver',
    isbn: '9780143125082',
    status: 'want',
    spineColor: '#5a3a1a',
  },
  {
    id: 'antifragile',
    title: 'Antifragile',
    author: 'Nassim Nicholas Taleb',
    isbn: '9780812979688',
    status: 'want',
    spineColor: '#3d2d6e',
  },
  {
    id: 'deep-work',
    title: 'Deep Work',
    author: 'Cal Newport',
    isbn: '9781455586691',
    status: 'want',
    spineColor: '#2d6b6b',
  },
  {
    id: 'almanack-naval',
    title: 'The Almanack of Naval Ravikant',
    author: 'Eric Jorgenson',
    isbn: '9781544514215',
    status: 'want',
    spineColor: '#1a3a4a',
  },
];
