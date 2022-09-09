import { addDays } from "date-fns";
import React, { useEffect, useState } from "react";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file
import "./TimeModel.scss";

const TImeModel = ({
  setTabStore,
  tabStore,
  index,
  fromTime,
  toTime,
  setFromTime,
  setToTime,
  setStartTime,
  setEndTime,
}) => {
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
    if (!fromTime) {
      setFromTime("00 am");
    }
    if (!toTime) {
      setToTime("00 am");
    }
    for (let i = 0; i < state.length; i++) {
      tabStore[index].text =
        (fromTime ? fromTime : "00 am") + " - " + (toTime ? toTime : "00 am");
      setTabStore(() => {
        return [...tabStore];
      });
    }
  }, [state]);

  const selectTime = (val) => {
    setSelectedTime(val);
    setFromTime(val);
    for (let i = 0; i < state.length; i++) {
      tabStore[index].text = val + " - " + (toTime ? toTime : "9:00 pm");
      setTabStore(() => {
        return [...tabStore];
      });
    }
    console.log('index',index);
    setActivetab1(false);
  };

  const showactive1 = () => {
    let status = activetab1 == true ? false : true;
    setActivetab1(status);
  };

  const showactive2 = () => {
    let status = activetab2 == true ? false : true;
    setActivetab2(status);
  };

  const selectToTime = (val) => {
    setToTime(val);
    for (let i = 0; i < state.length; i++) {
      tabStore[index].text = (fromTime ? fromTime : "9:00 pm") + " - " + val;
      setTabStore(() => {
        return [...tabStore];
      });
    }
    setActivetab2(false);
  };

  return (
    <div className="time-picker-outer-wrapper">
      <div className="times-selectors">
        <div className="item">
          <div className="single-time-picker" onClick={showactive1}>
            <i class="bx bx-time-five"></i>
            <div className="time-val">
              <span>From</span>
              <p>{fromTime ? fromTime : "00 am"}</p>
            </div>
            <i class="bx bx-chevron-down"></i>
          </div>
          {activetab1 == true && (
            <div className="time-dropdown-options">
              <div
                className={fromTime === "01 am" ? "para active" : "para"}
                onClick={() => {
                  selectTime("01 am");
                  setStartTime("01:00");
                }}
              >
                <p>01 am</p>
              </div>
              <div
                className={fromTime === "02 am" ? "para active" : "para"}
                onClick={() => {
                  selectTime("02 am");
                  setStartTime("02:00");
                }}
              >
                <p>02 am</p>
              </div>
              <div
                className={fromTime === "03 am" ? "para active" : "para"}
                onClick={() => {
                  selectTime("03 am");
                  setStartTime("03:00");
                }}
              >
                <p>03 am</p>
              </div>
              <div
                className={fromTime === "04 am" ? "para active" : "para"}
                onClick={() => {
                  selectTime("04 am");
                  setStartTime("04:00");
                }}
              >
                <p>04 am</p>
              </div>

              <div
                className={fromTime === "05 am" ? "para active" : "para"}
                onClick={() => {
                  selectTime("05 am");
                  setStartTime("05:00");
                }}
              >
                <p>05 am</p>
              </div>

              <div
                className={fromTime === "06 am" ? "para active" : "para"}
                onClick={() => {
                  selectTime("06 am");
                  setStartTime("06:00");
                }}
              >
                <p>06 am</p>
              </div>

              <div
                className={fromTime === "07 am" ? "para active" : "para"}
                onClick={() => {
                  selectTime("07 am");
                  setStartTime("07:00");
                }}
              >
                <p>07 am</p>
              </div>

              <div
                className={fromTime === "08 am" ? "para active" : "para"}
                onClick={() => {
                  selectTime("08 am");
                  setStartTime("08:00");
                }}
              >
                <p>08 am</p>
              </div>

              <div
                className={fromTime === "09 am" ? "para active" : "para"}
                onClick={() => {
                  selectTime("09 am");
                  setStartTime("09:00");
                }}
              >
                <p>09 am</p>
              </div>

              <div
                className={fromTime === "10 am" ? "para active" : "para"}
                onClick={() => {
                  selectTime("10 am");
                  setStartTime("10:00");
                }}
              >
                <p>10 am</p>
              </div>

              <div
                className={fromTime === "11 am" ? "para active" : "para"}
                onClick={() => {
                  selectTime("11 am");
                  setStartTime("11:00");
                }}
              >
                <p>11 am</p>
              </div>

              <div
                className={fromTime === "12 pm" ? "para active" : "para"}
                onClick={() => {
                  selectTime("12 pm");
                  setStartTime("12:00");
                }}
              >
                <p>12 pm</p>
              </div>

              <div
                className={fromTime === "01 pm" ? "para active" : "para"}
                onClick={() => {
                  selectTime("01 pm");
                  setStartTime("13:00");
                }}
              >
                <p>01 pm</p>
              </div>

              <div
                className={fromTime === "02 pm" ? "para active" : "para"}
                onClick={() => {
                  selectTime("02 pm");
                  setStartTime("14:00");
                }}
              >
                <p>02 pm</p>
              </div>

              <div
                className={fromTime === "03 pm" ? "para active" : "para"}
                onClick={() => {
                  selectTime("03 pm");
                  setStartTime("15:00");
                }}
              >
                <p>03 pm</p>
              </div>

              <div
                className={fromTime === "04 pm" ? "para active" : "para"}
                onClick={() => {
                  selectTime("04 pm");
                  setStartTime("16:00");
                }}
              >
                <p>04 pm</p>
              </div>

              <div
                className={fromTime === "05 pm" ? "para active" : "para"}
                onClick={() => {
                  selectTime("05 pm");
                  setStartTime("17:00");
                }}
              >
                <p>05 pm</p>
              </div>

              <div
                className={fromTime === "06 pm" ? "para active" : "para"}
                onClick={() => {
                  selectTime("06 pm");
                  setStartTime("18:00");
                }}
              >
                <p>06 pm</p>
              </div>

              <div
                className={fromTime === "07 pm" ? "para active" : "para"}
                onClick={() => {
                  selectTime("07 pm");
                  setStartTime("19:00");
                }}
              >
                <p>07 pm</p>
              </div>

              <div
                className={fromTime === "08 pm" ? "para active" : "para"}
                onClick={() => {
                  selectTime("08 pm");
                  setStartTime("20:00");
                }}
              >
                <p>08 pm</p>
              </div>

              <div
                className={fromTime === "09 pm" ? "para active" : "para"}
                onClick={() => {
                  selectTime("09 pm");
                  setStartTime("21:00");
                }}
              >
                <p>09 pm</p>
              </div>

              <div
                className={fromTime === "10 pm" ? "para active" : "para"}
                onClick={() => {
                  selectTime("10 pm");
                  setStartTime("22:00");
                }}
              >
                <p>10 pm</p>
              </div>

              <div
                className={fromTime === "11 pm" ? "para active" : "para"}
                onClick={() => {
                  selectTime("11 pm");
                  setStartTime("23:00");
                }}
              >
                <p>11 pm</p>
              </div>
            </div>
          )}
        </div>
        <div className="item">
          <div className="single-time-picker" onClick={showactive2}>
            <i class="bx bx-time-five"></i>
            <div className="time-val">
              <span>To</span>
              <p>{toTime ? toTime : "00 am"}</p>
            </div>
            <i class="bx bx-chevron-down"></i>
          </div>
          {activetab2 == true && (
            <div className="time-dropdown-options">
              <div
                className="para"
                onClick={() => {
                  selectToTime("01 am");
                  setEndTime("01:00");
                }}
              >
                <p>01 am</p>
              </div>
              <div
                className="para"
                onClick={() => {
                  selectToTime("02 am");
                  setEndTime("02:00");
                }}
              >
                <p>02 am</p>
              </div>
              <div
                className="para"
                onClick={() => {
                  selectToTime("03 am");
                  setEndTime("03:00");
                }}
              >
                <p>03 am</p>
              </div>
              <div
                className="para"
                onClick={() => {
                  selectToTime("04 am");
                  setEndTime("04:00");
                }}
              >
                <p>04 am</p>
              </div>

              <div
                className="para"
                onClick={() => {
                  selectToTime("05 am");
                  setEndTime("05:00");
                }}
              >
                <p>05 am</p>
              </div>

              <div
                className="para"
                onClick={() => {
                  selectToTime("06 am");
                  setEndTime("06:00");
                }}
              >
                <p>06 am</p>
              </div>

              <div
                className="para"
                onClick={() => {
                  selectToTime("07 am");
                  setEndTime("07:00");
                }}
              >
                <p>07 am</p>
              </div>

              <div
                className="para"
                onClick={() => {
                  selectToTime("08 am");
                  setEndTime("08:00");
                }}
              >
                <p>08 am</p>
              </div>

              <div
                className="para"
                onClick={() => {
                  selectToTime("09 am");
                  setEndTime("09:00");
                }}
              >
                <p>09 am</p>
              </div>

              <div
                className="para"
                onClick={() => {
                  selectToTime("10 am");
                  setEndTime("10:00");
                }}
              >
                <p>10 am</p>
              </div>

              <div
                className="para"
                onClick={() => {
                  selectToTime("11 am");
                  setEndTime("11:00");
                }}
              >
                <p>11 am</p>
              </div>

              <div
                className="para"
                onClick={() => {
                  selectToTime("12 pm");
                  setEndTime("12:00");
                }}
              >
                <p>12 pm</p>
              </div>

              <div
                className="para"
                onClick={() => {
                  selectToTime("01 pm");
                  setEndTime("13:00");
                }}
              >
                <p>01 pm</p>
              </div>

              <div
                className="para"
                onClick={() => {
                  selectToTime("02 pm");
                  setEndTime("14:00");
                }}
              >
                <p>02 pm</p>
              </div>

              <div
                className="para"
                onClick={() => {
                  selectToTime("03 pm");
                  setEndTime("15:00");
                }}
              >
                <p>03 pm</p>
              </div>

              <div
                className="para"
                onClick={() => {
                  selectToTime("04 pm");
                  setEndTime("16:00");
                }}
              >
                <p>04 pm</p>
              </div>

              <div
                className="para"
                onClick={() => {
                  selectToTime("05 pm");
                  setEndTime("17:00");
                }}
              >
                <p>05 pm</p>
              </div>

              <div
                className="para"
                onClick={() => {
                  selectToTime("06 pm");
                  setEndTime("18:00");
                }}
              >
                <p>06 pm</p>
              </div>

              <div
                className="para"
                onClick={() => {
                  selectToTime("07 pm");
                  setEndTime("19:00");
                }}
              >
                <p>07 pm</p>
              </div>

              <div
                className="para"
                onClick={() => {
                  selectToTime("08 pm");
                  setEndTime("20:00");
                }}
              >
                <p>08 pm</p>
              </div>

              <div
                className="para"
                onClick={() => {
                  selectToTime("09 pm");
                  setEndTime("21:00");
                }}
              >
                <p>09 pm</p>
              </div>

              <div
                className="para"
                onClick={() => {
                  selectToTime("10 pm");
                  setEndTime("22:00");
                }}
              >
                <p>10 pm</p>
              </div>

              <div
                className="para"
                onClick={() => {
                  selectToTime("11 pm");
                  setEndTime("23:00");
                }}
              >
                <p>11 pm</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TImeModel;
