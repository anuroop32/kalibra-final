import * as React from 'react';

export type LoginVariant = 'Log In' | 'Sign Up';
// export type TenantVariant = 'Kalibra' | 'One PT';
export type TenantTuple = {
  id: number;
  key: string;
  name: string;
};

export type TenantFeature = {
  id: string;
  key: string;
  name: string;
};

export type GlobalStateExtension = {
  themeTitle: string;
  setThemeTitle: React.Dispatch<React.SetStateAction<string>>;
  isMultiUserRole: boolean;
  setIsMultiUserRole: React.Dispatch<React.SetStateAction<boolean>>;
};
