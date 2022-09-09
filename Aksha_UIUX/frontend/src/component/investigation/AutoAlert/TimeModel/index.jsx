
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
  const [timeList, setTimeList] = React.useState([
    { time:'00 AM'},
    { time:'01 AM'},
    { time:'02 AM'},
    { time:'03 AM'},
    { time:'04 AM'},
    { time:'05 AM'},
    { time:'06 AM'},
    { time:'07 AM'},
    { time:'08 AM'},
    { time:'09 AM'},
    { time:'10 AM'},
    { time:'11 AM'},
    { time:'12 PM'},
    { time:'01 PM'},
    { time:'02 PM'},
    { time:'03 PM'},
    { time:'04 PM'},
    { time:'05 PM'},
    { time:'06 PM'},
    { time:'07 PM'},
    { time:'08 PM'},
    { time:'09 PM'},
    { time:'10 PM'},
    { time:'11 PM'},
  ]);


  useEffect(() => {
    if(!fromTime) {
      setFromTime('00 am');
    }
    if(!toTime) {
      setToTime('00 am');
    }
    for (let i = 0; i < state.length; i++) {
      tabStore[index].text = (fromTime ? fromTime : '00 am') + ' - ' + (toTime ? toTime : '00 am');
      setTabStore(() => {
        return [...tabStore];
      });
    }
  }, [state]);

  const selectTime = (val) => {
    setSelectedTime(val);
    setFromTime(val);
    for (let i = 0; i < state.length; i++) {
      tabStore[index].text = val + ' - ' + (toTime ? toTime : '00 am') ;
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
      tabStore[index].text = (fromTime ? fromTime : '00 am') + ' - ' +  val;
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
              <p>{fromTime ? fromTime : '00 am'}</p>
            </div>
            <i class='bx bx-chevron-down'></i>
          </div>
          {activetab1==true && (
            <div className="time-dropdown-options">
              {timeList && timeList.map((item,index) => {
                return (
                  <div
                    key={index} 
                    className={fromTime==item.time ? 'para active' : 'para'}
                    onClick={() => selectTime(item.time)}
                  >
                    <p>{item.time}</p>
                  </div>
                )
              })}
            </div>
          )}
        </div>
        <div className="item">
          <div className="single-time-picker" onClick={showactive2}>
            <i class='bx bx-time-five'></i>
            <div className="time-val">
              <span>To</span>
              <p>{toTime ? toTime : '00 am'}</p>
            </div>
            <i class='bx bx-chevron-down'></i>
          </div>
          {activetab2==true && (
            <div className="time-dropdown-options">
              {timeList && timeList.map((item,index) => {
                return (
                  <div 
                    key={index}
                    className={toTime==item.time ? 'para active' : 'para'}
                    onClick={() => selectToTime(item.time)}
                  >
                    <p>{item.time}</p>
                  </div>
                )
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default TImeModel;
