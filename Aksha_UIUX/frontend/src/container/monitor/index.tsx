import Tabs from "../../component/Tabs";
import Active from "../../component/monitor/Active";
import Spotlight from "../../component/monitor/Spotlight";

const Monitor = () => {
  return (
    <div style={{ marginTop: 58 }}>
      <Tabs
        tabName={[
          {
            value: "one",
            label: "Live",
          },
          {
            value: "two",
            label: "Spotlight",
          },
        ]}
        pages={[
          {
            value: "one",
            component: <Active />,
          },
          {
            value: "two",
            component: <Spotlight />,
          },
        ]}
      />
    </div>
  );
};

export default Monitor;
