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
  setStartTime?: (e: any) => void;
  setEndTime?: (e: any) => void;
  setSingleCameraName?: (e: any) => void;
  setStartDate?: (e: any) => void;
  setEndDate?: (e: any) => void;
};
