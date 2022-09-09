import React from "react";
import Tabs from "../../component/Tabs";
import ActivityTracker from "../../component/insights/activityTracker";
const Insights = () => {
  return (
    <div style={{ marginTop: 58 }}>
      <Tabs
        tabName={[
          {
            value: "one",
            label: "Activity Tracker",
          },
        ]}
        pages={[
          {
            value: "one",
            component: <ActivityTracker />,
          },
        ]}
      />
    </div>
  );
};

export default Insights;
