import { addDays } from "date-fns";
import { useEffect, useState } from "react";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file
import "./TruckModel.scss";
import { useSelector } from "react-redux";
const TruckModel = ({
  setTabStore,
  tabStore,
  index,
  close,
  setDefaultval,
  selectedOption,
  setOILable,
}) => {
  const [state, setState] = useState([
    {
      startDate: new Date(),
      endDate: addDays(null, 0),
      key: "selection",
    },
  ]);

  console.log("=======selectedOption=======", selectedOption)
  let [selectedValue, setSelectedValue] = useState(selectedOption.length > 0 ? selectedOption : [selectedOption]);
  let objectOfInterestLabels = useSelector(
    (state) => state.investigation.allObjectOfInterestLabels
  );

  useEffect(() => {
    let data
    if (selectedOption.length > 0) {
      data = [...selectedOption]
    } else {
      data = objectOfInterestLabels.length>0 ? [objectOfInterestLabels[0].replace(/(?:\\[rn])+/g, "")] : [""];
    }
    sessionStorage.setItem('OBI', JSON.stringify(data))
  }, [])

  useEffect(() => {
    if (!selectedOption) {
      setDefaultval(
        objectOfInterestLabels.length > 0 ? objectOfInterestLabels[0] : ""
      );
    }
    for (let i = 0; i < state.length; i++) {
      tabStore[index].text = selectedOption
        ? selectedOption
        : objectOfInterestLabels.length > 0
          ? objectOfInterestLabels[0]
          : "";

      setTabStore(() => {
        return [...tabStore];
      });
    }
    sessionStorage.setItem('OBI', JSON.stringify(selectedOption.length > 0 ? [...selectedOption] : [objectOfInterestLabels.length>0 && objectOfInterestLabels[0].replace(/(?:\\[rn])+/g, "")]))
  }, [state]);

  const showSelected = (val) => {
    setOILable(val);
    let final = []
    if (JSON.parse(sessionStorage.getItem('OBI')) && JSON.parse(sessionStorage.getItem('OBI')).length > 0) {
      let arr = JSON.parse(sessionStorage.getItem('OBI'))
      arr = typeof text === 'string' ? [arr] : arr
      if (arr.includes(val)) {
        let newArr = []
        arr.map((item, pos) => {
          if (item !== val) {
            console.log("----===-------", item, val)
            newArr.push(item)
          }
        })
        console.log("===newArr========", newArr)
        arr = newArr
      } else {
        arr.push(val.replace(/(?:\\[rn])+/g, ""))
      }
      setOILable(arr);
      sessionStorage.setItem('OBI', JSON.stringify(arr))
      final = arr
    } else {
      sessionStorage.setItem('OBI', JSON.stringify([val.replace(/(?:\\[rn])+/g, "")]))
      final = [val.replace(/(?:\\[rn])+/g, "")]
    }
    setSelectedValue(final);
    setDefaultval(final);
    for (let i = 0; i < state.length; i++) {
      tabStore[index].text = final;
      setTabStore(() => {
        return [...tabStore];
      });
    }
    close();
  };

  return (
    <div className="object-of-interest-outer-wrapper">
      <ul>
        {objectOfInterestLabels.map((label) => {
          return (
            <li
              key={index}
              className={selectedValue.includes(`${label}`) ? "active" : ""}
              onClick={() => showSelected(label)}
            >
              <p>{label}</p>
            </li>
          )
        })}
      </ul>
    </div>
  );
};

export default TruckModel;
