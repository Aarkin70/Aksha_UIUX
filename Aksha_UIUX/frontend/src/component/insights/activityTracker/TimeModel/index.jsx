
import { addDays } from "date-fns";
import React, { useEffect, useState } from "react";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file
import "./TimeModel.scss";

const TImeModel = ({ setTabStore, tabStore, index, fromTime,toTime,setFromTime,setToTime  }) => {
  const [state, setState] = useState([
    {
      startDate: new Date(),
      endDate: addDays(null, 0),
      key: "selection",
    },
  ]);

  const [selectedTime, setSelectedTime] = React.useState(new Date());
  const [activetab1, setActivetab1] = React.useState(false);
  const [activetab2, setActivetab2] = React.useState(false);

  useEffect(() => {
    if(!fromTime) {
      setFromTime('9:00 pm');
    }
    if(!toTime) {
      setToTime('11:45 pm');
    }
    for (let i = 0; i < state.length; i++) {
      tabStore[index].text = (fromTime ? fromTime : '9:00 pm') + ' - ' + (toTime ? toTime : '11:45 pm');
      setTabStore(() => {
        return [...tabStore];
      });
    }
  }, [state]);

  const selectTime = (val) => {
    setSelectedTime(val);
    setFromTime(val);
    for (let i = 0; i < state.length; i++) {
      tabStore[index].text = val + ' - ' + (toTime ? toTime : '9:00 pm') ;
      setTabStore(() => {
        return [...tabStore];
      });
    }
    setActivetab1(false);
  }

  const showactive1 = () => {
    let status = activetab1 == true ? false : true;
    setActivetab1(status);
  }

  const showactive2 = () => {
    let status = activetab2 == true ? false : true;
    setActivetab2(status);
  }

  const selectToTime = (val) => {
    setToTime(val);
    for (let i = 0; i < state.length; i++) {
      tabStore[index].text = (fromTime ? fromTime : '9:00 pm') + ' - ' +  val;
      setTabStore(() => {
        return [...tabStore];
      });
    }
    setActivetab2(false);
  }


  return (
    <div className="time-picker-outer-wrapper">
      <div className="times-selectors">
        <div className="item">
          <div className="single-time-picker" onClick={showactive1}>
            <i class='bx bx-time-five'></i>
            <div className="time-val">
              <span>From</span>
              <p>{fromTime ? fromTime : '9:00 pm'}</p>
            </div>
            <i class='bx bx-chevron-down'></i>
          </div>
          {activetab1==true && (
            <div className="time-dropdown-options">
              <div 
                className={fromTime=='8:15 pm' ? 'para active' : 'para'}
                onClick={() => selectTime('8:15 pm')}
              >
                <p>8:15 pm</p>
              </div>
              <div 
                className={fromTime=='8:30 pm' ? 'para active' : 'para'}
                onClick={() => selectTime('8:30 pm')}
              >
                <p>8:30 pm</p>
              </div>
              <div 
                className={fromTime=='8:45 pm' ? 'para active' : 'para'}
                onClick={() => selectTime('8:45 pm')}
              >
                <p>8:45 pm</p>
              </div>
              <div 
                className={fromTime=='9:00 pm' ? 'para active' : 'para'}
                onClick={() => selectTime('9:00 pm')}
              >
                <p>9:00 pm</p>
              </div>
            </div>
          )}
        </div>
        <div className="item">
          <div className="single-time-picker" onClick={showactive2}>
            <i class='bx bx-time-five'></i>
            <div className="time-val">
              <span>To</span>
              <p>{toTime ? toTime : '9:00 pm'}</p>
            </div>
            <i class='bx bx-chevron-down'></i>
          </div>
          {activetab2==true && (
            <div className="time-dropdown-options">
              <div 
                className={fromTime=='8:15 pm' ? 'para active' : 'para'}
                onClick={() => selectToTime('8:15 pm')}
              >
                <p>8:15 pm</p>
              </div>
              <div 
                className={fromTime=='8:30 pm' ? 'para active' : 'para'}
                onClick={() => selectToTime('8:30 pm')}
              >
                <p>8:30 pm</p>
              </div>
              <div 
                className="para"
                onClick={() => selectToTime('8:45 pm')}
              >
                <p>8:45 pm</p>
              </div>
              <div 
                className="para"
                onClick={() => selectToTime('9:00 pm')}
              >
                <p>9:00 pm</p>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default TImeModel;
