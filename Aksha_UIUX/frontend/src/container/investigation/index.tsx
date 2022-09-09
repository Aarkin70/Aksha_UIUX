import Tabs from "../../component/Tabs";
import ObjectOfInterest from "../../component/investigation/ObjectOfInterest";
import RecentAlerts from "../../component/investigation/RecentAlerts";
import MyAlerts from "../../component/investigation/MyAlerts";
import AutoAlert from "../../component/investigation/AutoAlert";
const Investigation = () => {
  return (
    <div style={{ marginTop: 58 }}>
      <Tabs
        tabName={[
          {
            value: "one",
            label: "Object of Interest",
          },
          {
            value: "two",
            label: "Recent Alerts",
          },
          {
            value: "three",
            label: "My Alerts",
          },
          {
            value: "four",
            label: "Auto Alerts",
          },
        ]}
        pages={[
          {
            value: "one",
            component: <ObjectOfInterest />,
          },
          {
            value: "two",
            component: <RecentAlerts />,
          },
          {
            value: "three",
            component: <MyAlerts />,
          },
          {
            value: "four",
            component: <AutoAlert />,
          },
        ]}
      />
    </div>
  );
};

export default Investigation;
