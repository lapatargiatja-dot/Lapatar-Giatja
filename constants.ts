import { Transaction } from './types';

export const CATEGORIES = {
  income: ['Menjahit', 'Las', 'Doorsmeer', 'Pangkas', 'Pertanian Luar Tembok', 'Hidroponik', 'Tenun', 'Miniatur', 'Lainnya'],
  expense: ['Menjahit', 'Las', 'Doorsmeer', 'Pangkas', 'Pertanian Luar Tembok', 'Hidroponik', 'Tenun', 'Miniatur', 'Operasional', 'Lainnya']
};

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: '1',
    date: '2023-10-01',
    description: 'Jasa Las Pagar Besi',
    amount: 3500000,
    type: 'income',
    category: 'Las'
  },
  {
    id: '2',
    date: '2023-10-02',
    description: 'Belanja Sabun & Wax Doorsmeer',
    amount: 450000,
    type: 'expense',
    category: 'Doorsmeer'
  },
  {
    id: '3',
    date: '2023-10-05',
    description: 'Pendapatan Harian Pangkas',
    amount: 350000,
    type: 'income',
    category: 'Pangkas'
  },
  {
    id: '4',
    date: '2023-10-10',
    description: 'Service Mesin Jahit',
    amount: 150000,
    type: 'expense',
    category: 'Menjahit'
  },
  {
    id: '5',
    date: '2023-10-15',
    description: 'Borongan Jahit Seragam',
    amount: 2500000,
    type: 'income',
    category: 'Menjahit'
  },
  {
    id: '6',
    date: '2023-10-18',
    description: 'Bayar Listrik Workshop',
    amount: 500000,
    type: 'expense',
    category: 'Operasional'
  }
];