import { addDays } from "date-fns";
import { useEffect, useState } from "react";
import { DateRangePicker } from "react-date-range";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file
import "./CameraModel.scss";
import moment from "moment";
const CameraModel = ({ setTabStore, tabStore, index, close, setDefaultval, selectedOption }) => {
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
      setDefaultval('Camera XYZ');
    }
    for (let i = 0; i < state.length; i++) {
      tabStore[index].text = selectedOption ? selectedOption : 'Camera XYZ';

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
        <li className={selectedOption=='Camera XYZ' ? 'active' : ''} 
        onClick={() => showSelected('Camera XYZ')}><p>Camera XYZ</p></li>
        <li className={selectedOption=='Camera ABC' ? 'active' : ''} 
        onClick={() => showSelected('Camera ABC')}><p>Camera ABC</p></li>
        <li className={selectedOption=='Camera DEF' ? 'active' : ''} 
        onClick={() => showSelected('Camera DEF')}><p>Camera DEF</p></li>
        <li className={selectedOption=='Camera GHI' ? 'active' : ''} 
        onClick={() => showSelected('Camera GHI')}><p>Camera GHI</p></li>
      </ul>
    </div>
  );
};

export default CameraModel;
