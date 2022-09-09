export type tab = {
  heading: string;
  text: string;
  active: boolean;
}[];

export type dateType = {
  heading: string;
  text: string;
  active: boolean;
  index: number;
  setTabStore: (e: any) => void;
  tabStore: tab;
};
