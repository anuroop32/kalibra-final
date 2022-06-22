const capitalizeFirstLetter = (str: string): string => {
  if (str && str.length > 0) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
  return '';
};

// uiHelper export functions
export const StringHelper = {
  capitalize: (text: string) => {
    return capitalizeFirstLetter(text);
  }
};
