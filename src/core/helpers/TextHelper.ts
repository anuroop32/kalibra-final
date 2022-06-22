import data from '../constants/Text.json';

const getText = (key: string): string => {
  return data[key];
};

// TextHelper export functions
export const TextHelper = {
  getText: (key: string) => {
    return getText(key);
  }
};
