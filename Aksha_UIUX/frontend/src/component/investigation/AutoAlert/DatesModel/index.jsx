import { addDays,subMonths } from "date-fns";
import { useEffect, useState } from "react";
import { DateRangePicker } from "react-date-range";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file
import "./DatesModel.scss";
import moment from "moment";
const DatesModel = ({ setTabStore, tabStore, index,setStartDate,
  setEndDate, }) => {
  const [state, setState] = useState([
    {
      startDate: subMonths(new Date(), 1),
      endDate: subMonths(new Date(), 1),
      key: "selection",
    },
  ]);

  useEffect(() => {
    for (let i = 0; i < state.length; i++) {
      tabStore[index].text = `${moment(state[i].startDate).format(
        "D/M/YY"
      )} - ${moment(state[i].endDate).format("D/M/YY")}`;

      setTabStore(() => {
        return [...tabStore];
      });
    }
  }, [state]);

  return (
    <div className="range-picker-search-bar">
      <DateRangePicker
        onChange={(item) => {
          setState([item.selection]);
          setStartDate(moment(item.selection.startDate).format("YYYY-MM-DD"));
          setEndDate(moment(item.selection.endDate).format("YYYY-MM-DD"));
        }}
        showSelectionPreview={false}
        moveRangeOnFirstSelection={false}
        months={2}
        ranges={state}
        direction="horizontal"
        preventSnapRefocus={true}
        showDateDisplay={false}
        showMonthAndYearPickers={false}
        fixedHeight={true}
        maxDate={new Date()}
        // calendarFocus="backwards"
      />
    </div>
  );
};

export default DatesModel;
