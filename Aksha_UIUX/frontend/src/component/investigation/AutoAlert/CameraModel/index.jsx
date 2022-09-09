import { addDays } from "date-fns";
import { useEffect, useState } from "react";
import { DateRangePicker } from "react-date-range";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file
import "./CameraModel.scss";
import moment from "moment";
const CameraModel = ({ setTabStore, tabStore, index, close, setDefaultval, 
  selectedOption, cameralist }) => {
  const [state, setState] = useState([
    {
      startDate: new Date(),
      endDate: addDays(null, 0),
      key: "selection",
    },
  ]);

  const [selectedValue, setSelectedValue] = useState('');
  

  useEffect(() => {
    if(!selectedOption) {
      setDefaultval('camera1');
    }
    for (let i = 0; i < state.length; i++) {
      tabStore[index].text = selectedOption ? selectedOption : 'camera1';

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
  }

  

  return (
    <div className="time-picker-outer-wrapper">
      <ul>
        {cameralist && cameralist.map((item,index) => {
          return(
            <li key={index} className={selectedOption==item.Camera_Name ? 'active' : ''} 
            onClick={() => showSelected(item.Camera_Name)}><p>{item.Camera_Name}</p></li>
          )
        })}
      </ul>
    </div>
  );
};

export default CameraModel;
