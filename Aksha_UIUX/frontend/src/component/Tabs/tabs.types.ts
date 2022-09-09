import React from "react";
export type TabProps = {
  tabName: {
    value: string;
    label: string;
  }[];
  pages: {
    value: string;
    component: any;
  }[];
};
