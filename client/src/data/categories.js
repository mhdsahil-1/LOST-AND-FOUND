export const CATEGORIES = [
  {
    id: '1',
    name: 'Electronics',
    icon: 'fa-solid fa-laptop',
    color: '#007AFF', // iOS System Blue
    bgLight: 'rgba(0, 122, 255, 0.1)',
    description: 'Phones, laptops, chargers, headphones'
  },
  {
    id: '2',
    name: 'Books & Stationery',
    icon: 'fa-solid fa-book-open',
    color: '#FF9500', // iOS System Orange
    bgLight: 'rgba(255, 149, 0, 0.1)',
    description: 'Notebooks, textbooks, pens, binders'
  },
  {
    id: '3',
    name: 'Clothing & Accessories',
    icon: 'fa-solid fa-shirt',
    color: '#AF52DE', // iOS System Purple
    bgLight: 'rgba(175, 82, 222, 0.1)',
    description: 'Jackets, hoodies, caps, scarves'
  },
  {
    id: '4',
    name: 'Bags & Luggage',
    icon: 'fa-solid fa-bag-shopping',
    color: '#5856D6', // iOS System Indigo
    bgLight: 'rgba(88, 86, 214, 0.1)',
    description: 'Backpacks, totes, pencil cases'
  },
  {
    id: '5',
    name: 'Keys & Cards',
    icon: 'fa-solid fa-key',
    color: '#34C759', // iOS System Green
    bgLight: 'rgba(52, 199, 89, 0.1)',
    description: 'ID cards, room keys, car keys, wallets'
  },
  {
    id: '6',
    name: 'Sports Equipment',
    icon: 'fa-solid fa-futbol',
    color: '#FF2D55', // iOS System Pink
    bgLight: 'rgba(255, 45, 85, 0.1)',
    description: 'Bottles, balls, rackets, gym gear'
  },
  {
    id: '7',
    name: 'Jewelry & Watches',
    icon: 'fa-solid fa-gem',
    color: '#FFCC00', // iOS System Yellow
    bgLight: 'rgba(255, 204, 0, 0.15)',
    description: 'Smartwatches, rings, chains, sunglasses'
  },
  {
    id: '8',
    name: 'Others',
    icon: 'fa-solid fa-box-archive',
    color: '#8E8E93', // iOS System Gray
    bgLight: 'rgba(142, 142, 147, 0.1)',
    description: 'Umbrellas, water bottles, miscellaneous'
  }
];

export const getCategoryById = (id) => {
  return CATEGORIES.find(cat => String(cat.id) === String(id)) || {
    id: 'other',
    name: 'Uncategorized',
    icon: 'fa-solid fa-box-open',
    color: '#8E8E93',
    bgLight: 'rgba(142, 142, 147, 0.1)'
  };
};
