import { useState, useEffect } from "react";
import SearchIcon from "@mui/icons-material/Search";
import { searchTabs } from "./searchStore";
import "./my_alerts.scss";
import DatePicker from "./DatePicker";
import TimePicker from "./TimePicker";
import Camera from "./Camera";
import NotFound from "../../common/notFound";
import axios from "axios";
import moment from "moment";
import { Spin, message } from "antd";
import ImageBox from "../../common/canvasFramesAuto";
import pause from "../../../assets/images/icons/pause.png";
import { Button } from "@mui/material";

const MyAlerts = () => {
  const [tabStore, setTabStore] = useState(searchTabs);
  const [cameraList, setCameraList] = useState([]);
  const [alertlist, setAlertlist] = useState([]);
  const [selectedCamera, setSelectedCamera] = useState("");
  const [selectedFromTime, setSelectedFromTime] = useState("00 am");
  const [selectedToTime, setSelectedToTime] = useState("00 am");
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [apiAlertResult, setApiAlertResult] = useState([]);

  const getcameralist = () => {
    setLoading(true);
    let url = `${process.env.REACT_APP_BASE_URL}${process.env.REACT_APP_CAMERAS_LIST}`;
    axios
      .get(url)
      .then(function (response) {
        // console.log('camera response',response.data.cameras);
        setLoading(false);
        setCameraList(response.data.cameras);
      })
      .catch(function (error) {
        setLoading(false);
        console.log(error);
      });
  };

  function toDataUrl(url: any, callback: any) {
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
      var reader = new FileReader();
      reader.onloadend = function () {
        callback(reader.result);
      };
      reader.readAsDataURL(xhr.response);
    };
    xhr.open("GET", url);
    xhr.responseType = "blob";
    xhr.send();
  }

  const searchforautoalert = () => {
    setLoading(true);

    if (!startDate) {
      message.warning("Please select the start date.");
      return;
    } else if (!endDate) {
      message.warning("Please select the end date.");
      return;
    } else if (!selectedFromTime) {
      message.warning("Please select the from time.");
      return;
    } else if (!selectedToTime) {
      message.warning("Please select the to time.");
      return;
    } else if (!selectedCamera) {
      message.warning("Please select the camera.");
      return;
    }

    // let params = {
    //   camera_name:"camera1",
    //   start_date: moment('2022-06-09').format("YYYY-MM-DD"),
    //   end_date: moment("2022-07-09").format("YYYY-MM-DD"),
    //   start_time: "20:00",
    //   end_time: "21:00",
    // }

    let from: number = 0;
    if (selectedFromTime.includes("AM")) {
      let splited = selectedFromTime.replace(" AM", "");
      from = Number(splited);
    } else if (selectedFromTime.includes("PM")) {
      let splited = selectedFromTime.replace(" PM", "");
      from = Number(splited) + 12;
    }

    let to: number = 0;
    if (selectedToTime.includes("AM")) {
      let splited = selectedToTime.replace(" AM", "");
      to = Number(splited);
    } else if (selectedToTime.includes("PM")) {
      let splited = selectedToTime.replace(" PM", "");
      to = Number(splited) + 12;
    }

    let params = {
      camera_name: selectedCamera,
      start_date: moment(startDate).format("YYYY-MM-DD"),
      end_date: moment(endDate).format("YYYY-MM-DD"),
      start_time: from,
      end_time: to,
    };

    const headers = {
      "Content-Type": "application/json; charset=utf-8",
    };

    let url = `${process.env.REACT_APP_BASE_URL}${process.env.REACT_APP_ALERTS}`;
    axios
      .post(url, params, {
        headers: headers,
      })
      .then((res) => {
        // console.log('auto alert post response',res);
        if (res.data.success == true) {
          console.log('result', res.data);
          // @ts-ignore
          setApiAlertResult(res.data.alert)
          let arr: any = [];
          for (let item of res.data.alert) {
            if (item.image == null || item.image == '') {
              console.log('null');
            } else {
              // @ts-ignore
              arr = [...arr, item];
            }
          }
          // @ts-ignore
          arr.forEach((e: any) => {
            // console.log('e',e);
            if (e.image != null || e.image != '') {
              toDataUrl(e.image, async function (myBase64: any) {
                e.base_url = await myBase64;
                e.Results =
                  e.Object_Anomaly == true || e.Frame_Anomaly === true
                    ? `${e.Results[0].x[0]} ${e.Results[0].x[1]},${e.Results[0].y[0]} ${e.Results[0].y[1]} ,${e.Results[0].w[0]} ${e.Results[0].w[1]},${e.Results[0].h[0]} ${e.Results[0].h[1]}`
                    : "00";
              });
            }
          });
          setTimeout(() => {
            // @ts-ignore
            setAlertlist(arr);
            setLoading(false);

            // console.log(arr);
          }, 1000);
        } else {
          message.warning(res.data.message);
          return;
        }
      })
      .catch(function (error) {
        // console.log('error',error);
        message.warning(error.response.data.message);
        setLoading(false);
      });
  };

  const setDefaultDropdownDetails = () => {
    tabStore[0].text = "  -  ";
    tabStore[1].text = "00 am" + " - " + "00 am";
    tabStore[2].text = "camera1";
    setTabStore(() => {
      return [...tabStore];
    });

    setSelectedCamera("camera1");
  };

  useEffect(() => {
    getcameralist();
    setDefaultDropdownDetails();
  }, []);

  return (
    <div className="my-alert autoalert-search-bar">
      {/* <NotFound /> */}
      <div className="search-bar desktop">
        <div className="main-content">
          {tabStore.map((tab: any, index: any) => {
            if (tab.heading === "Date*") {
              return (
                <DatePicker
                  heading={tab.heading}
                  text={tab.text}
                  active={tab.active}
                  index={index}
                  setTabStore={setTabStore}
                  tabStore={tabStore}
                  setStartDate={setStartDate}
                  setEndDate={setEndDate}
                  mobile={false}
                />
              );
            } else if (tab.heading === "Time*") {
              return (
                <TimePicker
                  heading={tab.heading}
                  text={tab.text}
                  active={tab.active}
                  index={index}
                  setTabStore={setTabStore}
                  tabStore={tabStore}
                  setftime={setSelectedFromTime}
                  setttime={setSelectedToTime}
                  mobile={false}
                />
              );
            } else if (tab.heading === "Camera*") {
              return (
                <Camera
                  heading={tab.heading}
                  text={tab.text}
                  active={tab.active}
                  index={index}
                  setTabStore={setTabStore}
                  tabStore={tabStore}
                  cameras={cameraList}
                  setCameraName={setSelectedCamera}
                  mobile={false}
                />
              );
            }
          })}
        </div>
        <SearchIcon
          className="searchIcon"
          style={{ cursor: "pointer" }}
          onClick={searchforautoalert}
        />
      </div>

      <div className='mobile-search'>
        {tabStore.map((tab: any, index: any) => {
          if (tab.heading === "Date*") {
            return (
              <div className="single_item">
                <label>Date <span style={{ color: '#f00' }}>*</span></label>
                <DatePicker
                  heading={tab.heading}
                  text={tab.text}
                  active={tab.active}
                  index={index}
                  setTabStore={setTabStore}
                  tabStore={tabStore}
                  setStartDate={setStartDate}
                  setEndDate={setEndDate}
                  mobile={true}
                />
              </div>
            );
          } else if (tab.heading === "Time*") {
            return (
              <div className="single_item">
                <label>Time <span style={{ color: '#f00' }}>*</span></label>
                <TimePicker
                  heading={tab.heading}
                  text={tab.text}
                  active={tab.active}
                  index={index}
                  setTabStore={setTabStore}
                  tabStore={tabStore}
                  setftime={setSelectedFromTime}
                  setttime={setSelectedToTime}
                  mobile={true}
                />
              </div>
            );
          } else if (tab.heading === "Camera*") {
            return (
              <div className="single_item">
                <label>Select Camera <span style={{ color: '#f00' }}>*</span></label>
                <Camera
                  heading={tab.heading}
                  text={tab.text}
                  active={tab.active}
                  index={index}
                  setTabStore={setTabStore}
                  tabStore={tabStore}
                  cameras={cameraList}
                  setCameraName={setSelectedCamera}
                  mobile={true}
                />
              </div>
            );
          }
        })}
        <button
          className="search-button"
          style={{ cursor: "pointer" }}
          onClick={searchforautoalert}
        >
          <i className='bx bx-search'></i>
          Search
        </button>
      </div>

      <Spin spinning={loading}>
        {apiAlertResult.length == 0 && <NotFound />}
        <div className="grayBack">
          {apiAlertResult &&
            apiAlertResult.map((data: any, i) => {
              return (
                <div className="row mt-5 mx-0" style={{ marginTop: 30, textAlign: 'left' }}>
                  <div
                    key={i}
                  >
                    {data.images.map((image: any, index: any) =>
                      <img src={image} style={{ width: 360, padding: '0px 5px', marginBottom: 20 }} />
                    )}
                  </div>
                </div>)
            })}
        </div>
        {/* {apiAlertResult.length == 0 && <NotFound />}

        <div className="grayBack">
          <div className="rowstyle" style={{ marginTop: 30 }}>
            {alertlist &&
              alertlist.map((data: any, i) => {
                let img = data.image
                  ? data.image
                  : `${process.env.REACT_APP_BASE_URL}/camera1/frame/2022-06-09%2020_20_18.jpg?${new Date().getTime()}`;
                data.image = img;
                return (
                  <div
                    className="col-md-2 col-lg-4 videoContainer mb-3 px-2"
                    key={i}
                  >
                    <ImageBox data={data} aIPolygen={data.Results[0]} />
                  </div>
                );
              })}
          </div>
        </div> */}
      </Spin>
    </div>
  );
};

export default MyAlerts;
