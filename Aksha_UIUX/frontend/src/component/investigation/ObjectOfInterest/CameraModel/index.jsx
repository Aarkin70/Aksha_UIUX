import { addDays } from "date-fns";
import React, { useEffect, useState } from "react";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file
import { useSelector } from "react-redux";
import "./CameraModel.scss";

const CameraModel = ({
  setTabStore,
  tabStore,
  index,
  close,
  setDefaultval,
  selectedOption,
  setSingleCameraName,
}) => {
  const [state, setState] = useState([
    {
      startDate: new Date(),
      endDate: addDays(null, 0),
      key: "selection",
    },
  ]);

  const [selectedValue, setSelectedValue] = useState("");

  let cameraName = useSelector((state) => state.investigation.allCameraNames);

  useEffect(() => {
    if (!selectedOption) {
      setDefaultval(cameraName.length > 0 ? cameraName[0].Camera_Name : "");
    }
    for (let i = 0; i < state.length; i++) {
      tabStore[index].text = selectedOption
        ? selectedOption
        : cameraName.length > 0
        ? cameraName[0].Camera_Name
        : "";

      setTabStore(() => {
        return [...tabStore];
      });
    }
  }, [state]);

  const showSelected = (val) => {
    setSelectedValue(val);
    setDefaultval(val);
    for (let i = 0; i < state.length; i++) {
      tabStore[index].text = val;

      setTabStore(() => {
        return [...tabStore];
      });
    }
    close();
  };

  return (
    <div className="time-picker-outer-wrapper">
      <ul>
        {cameraName.map((data, index) => (
          <li
            key={index}
            className={selectedOption == data.Camera_Name ? "active" : ""}
            onClick={() => {
              showSelected(data.Camera_Name);
              setSingleCameraName({
                name: data.Camera_Name,
                isCamera: true,
              });
            }}
          >
            <p>{data.Camera_Name}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default React.memo(CameraModel);
