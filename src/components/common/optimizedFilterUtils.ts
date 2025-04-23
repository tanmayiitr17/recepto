export interface Filters {
  location: Location[];
  scoreRange: ScoreRange | null;
}

export type ScoreRange = 'ge70' | 'lt70';
export type Location = 
  | 'india' 
  | 'uk' 
  | 'usa' 
  | 'saudi' 
  | 'singapore' 
  | 'taiwan' 
  | 'france' 
  | 'germany' 
  | 'china'
  | 'san_francisco_usa'
  | 'london_uk'
  | 'mumbai_india'
  | 'berlin_germany';

export interface FilterOption {
  id: Location | ScoreRange;
  name: string;
}

export interface FilterOptions {
  location: FilterOption[];
  scoreRange: FilterOption[];
}

export const filterOptions: FilterOptions = {
  location: [
    { id: 'india', name: 'India' },
    { id: 'uk', name: 'United Kingdom' },
    { id: 'usa', name: 'United States of America' },
    { id: 'saudi', name: 'Saudi Arabia' },
    { id: 'singapore', name: 'Singapore' },
    { id: 'taiwan', name: 'Taiwan' },
    { id: 'france', name: 'France' },
    { id: 'germany', name: 'Germany' },
    { id: 'china', name: 'China' },
    { id: 'san_francisco_usa', name: 'San Francisco, USA'}, 
    { id: 'london_uk', name: 'London, UK'}, 
    { id: 'mumbai_india', name: 'Mumbai, India'},
    { id: 'berlin_germany', name: 'Berlin, Germany'},
  ],
  scoreRange: [
    { id: 'ge70', name: '70+'}, 
    { id: 'lt70', name: '< 70'}, 
  ],
};

export const getFilterOptionById = (id: Location | ScoreRange): FilterOption | undefined => {
  const locationOption = filterOptions.location.find(option => option.id === id);
  if (locationOption) return locationOption;
  
  return filterOptions.scoreRange.find(option => option.id === id);
};

export const getFilterOptionsByType = (type: keyof FilterOptions): FilterOption[] => {
  return filterOptions[type];
};

export const isLocationFilter = (id: string): id is Location => {
  return filterOptions.location.some(option => option.id === id);
};

export const isScoreRangeFilter = (id: string): id is ScoreRange => {
  return filterOptions.scoreRange.some(option => option.id === id);
}; 