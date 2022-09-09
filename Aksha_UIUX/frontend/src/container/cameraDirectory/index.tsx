import React from "react";
import Tabs from "../../component/Tabs";
import List from "./List";

const CameraDirectory = () => {
  return (
    <div style={{ marginTop: 58 }}>
      <Tabs
        tabName={[
          {
            value: "one",
            label: "Camera Details",
          },
        ]}
        pages={[
          {
            value: "one",
            component: <List />,
          },
        ]}
      />
    </div>
  );
};

export default CameraDirectory;
