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
  setSingleCameraName?: (e: { name: string; isCamera: boolean }) => void;
  setStartDate?: (e: any) => void;
  setEndDate?: (e: any) => void;
  setStartTime?: (e: any) => void;
  setEndTime?: (e: any) => void;
  setOILable?: (e: any) => void;
  setAIPolygen?: (e: any) => void;
};
