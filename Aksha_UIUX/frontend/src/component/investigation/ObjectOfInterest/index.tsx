import React, { useState, useEffect, Suspense } from "react";
import SearchIcon from "@mui/icons-material/Search";
import { searchTabs } from "./searchStore";
import "./interestObject.scss";
import DatePicker from "./DatePicker";
import TimePicker from "./TimePicker";
import Camera from "./Camera";
import Truck from "./Truck";
import AreaOfInterest from "./AreaOfInterest";
import NotFound from "../../common/notFound";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllCamerasName,
  fetchAllObjectOfInterestLabels,
  fetchAreaOfInterestImage,
  coordinatesSelected,
} from "../../../global_store/reducers/investigationReducer";
import { showToast } from "../../../global_store/reducers/snackBarReducer";

import pause from "../../../assets/images/icons/pause.png";
import Menu from "../../video_menu";
import { Button } from "@mui/material";
import ReactDOMServer from "react-dom/server";
import { message, Spin } from "antd";

const ImageBox = React.lazy(() => import("../../common/canvasFramesObj"));

const ObjectOfInterest = () => {
  const [tabStore, setTabStore] = useState(searchTabs);
  let dispatch = useDispatch();
  const [singleCameraName, setSingleCameraName] = useState({
    name: "",
    isCamera: false,
  });
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [loader, setLoader] = useState(false);
  const [starTime, setStartTime] = useState("00 am");
  const [endTime, setEndTime] = useState("00 am");

  const [oILable, setOILable] = useState("");

  const [aIPolygen, setAIPolygen] = useState("");

  const [aIFrames, setAIFrames] = useState([]);
  const [responseCoordinates, setResponseCoordinates] = useState<any>([]);

  let isCoordinatesSelected = useSelector(
    (state: any) => state.investigation.isCoordinatesSelected
  );

  React.useEffect(() => {
    dispatch(coordinatesSelected(null));
  }, []);

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

  useEffect(() => {
    setLoader(true)
    let getReferenceImage = () => {
      axios
        .get(
          `${process.env.REACT_APP_BASE_URL}${process.env.REACT_APP_AREA_OF_INTERESET}${singleCameraName.name}`
        )
        .then(
          (response) => {
            dispatch(fetchAreaOfInterestImage(response.data.image));
            setLoader(false)
          },
          (error) => {
            console.log(error);
            setLoader(false)
          }
        );
    };

    if (singleCameraName.isCamera === true) {
      getReferenceImage();
    }
  }, [singleCameraName]);

  const getcamerlist = () => {
    setLoader(true)
    axios.get(`${process.env.REACT_APP_BASE_URL}${process.env.REACT_APP_CAMERAS_LIST}`).then(
      (response) => {
        dispatch(fetchAllCamerasName(response.data.cameras));
        if (response.data.cameras.length > 0) {
          tabStore[2].text = response.data.cameras[0].Camera_Name;
          setTabStore(() => {
            return [...tabStore];
          });

          setSingleCameraName({
            name: response.data.cameras[0].Camera_Name,
            isCamera: true,
          });
          setLoader(false)
        }
      },
      (error) => {
        console.log(error);
        setLoader(false)
      }
    );
  };
  const objectOfInterestList = () => {
    setLoader(true)

    axios
      .get(`${process.env.REACT_APP_BASE_URL}${process.env.REACT_APP_OBJECT_OF_INTEREST_LABELS}`)
      .then(
        (response) => {
          dispatch(fetchAllObjectOfInterestLabels(response.data.labels));
          if (response.data.labels.length > 0) {
            tabStore[3].text = response.data.labels.length > 1 ? [response.data.labels[0]] : response.data.labels;
            setTabStore(() => {
              return [...tabStore];
            });
            setLoader(false)
          }
        },
        (error) => {
          console.log("error", error);
          setLoader(false)
        }
      );
  };

  const setDefaultDropdownDetails = () => {
    tabStore[0].text = "" + " - " + "";
    tabStore[1].text = "00 am" + " - " + "00 am";
    setTabStore(() => {
      return [...tabStore];
    });
  };

  useEffect(() => {
    getcamerlist();
    objectOfInterestList();
    setDefaultDropdownDetails();
  }, []);

  const submitAlert = () => {
    // console.log("aIPolygen");
    // console.log(aIPolygen);
    setLoader(true)
    let arr: any[] = [];
    if(oILable.length>0){
      for (let item of oILable) {
        let text = item.includes('\r') ? item.replace('\r', "") : item;
        arr = [...arr, text];
      }
    }

    let params = {
      camera_name: singleCameraName.name,
      start_date: startDate,
      end_date: endDate,
      start_time: starTime, //add 24 hrs moment,
      end_time: endTime,
      object_of_interest: arr.length>0 ? arr : ['person'],
      area_of_interest: aIPolygen,
      // [oILable.replace('\r', "")]
    }
    // console.log('oILable', oILable);
    // console.log('params', params);
    // return;
    if (isCoordinatesSelected === false) {
      dispatch(
        showToast({
          show: true,
          indicator: "error",
          message: "you have not selected correct coordinates",
        })
      );
      setTimeout(() => {
        dispatch(
          showToast({
            show: false,
            indicator: "error",
            message: "",
          })
        );
      }, 2000);
      setLoader(false)
    } else
      axios
        .post(`${process.env.REACT_APP_BASE_URL}${process.env.REACT_APP_OBJECT_OF_INTEREST}`, params)
        .then(
          (response) => {
            response.data.alert.forEach((e: any) => {
              toDataUrl(e.image, async function (myBase64: any) {
                e.base_url = await myBase64;
              });
            });
            setTimeout(async () => {
              // @ts-ignore
              let arr = response.data.alert.filter((data: any) => {
                return data.image != '';
              });
              setAIFrames(arr);
              setResponseCoordinates(aIPolygen);
              setLoader(false)
            }, 3000);
          },
          (error) => {
            console.log(error);

            dispatch(
              showToast({
                show: true,
                indicator: "error",
                message: error.response.data.message,
              })
            );

            setTimeout(() => {
              dispatch(
                showToast({
                  show: false,
                  indicator: "error",
                  message: "",
                })
              );
              setLoader(false)

            }, 2000);
          }
        );
  };

  return (
    <div className="objectOfInterest autoalert-search-bar">
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
                  setStartTime={setStartTime}
                  setEndTime={setEndTime}
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
                  setSingleCameraName={setSingleCameraName}
                  mobile={false}
                />
              );
            } else if (tab.heading === "Object of Interest*") {
              return (
                <Truck
                  heading={tab.heading}
                  text={tab.text}
                  active={tab.active}
                  index={index}
                  setTabStore={setTabStore}
                  tabStore={tabStore}
                  setOILable={setOILable}
                  mobile={false}
                />
              );
            } else if (tab.heading === "Area of Interest") {
              return (
                <AreaOfInterest
                  heading={tab.heading}
                  text={tab.text}
                  active={tab.active}
                  index={index}
                  setTabStore={setTabStore}
                  tabStore={tabStore}
                  setAIPolygen={setAIPolygen}
                  mobile={false}
                />
              );
            } else {
              return (
                <div
                  className={`inner-content text-center ${tab.active === true && "activeTab"
                    }`}
                  key={index}
                  onClick={() => {
                    for (let i = 0; i < tabStore.length; i++) {
                      tabStore[i].active = false;
                    }

                    tabStore[index].active = true;

                    setTabStore(() => {
                      return [...tabStore];
                    });
                  }}
                >
                  <p className="heading mb-1">{tab.heading}</p>
                  <p className="text-label mb-0">{tab.text}</p>
                </div>
              );
            }
          })}
        </div>

        <SearchIcon
          className="searchIcon"
          onClick={submitAlert}
          style={{ cursor: "pointer" }}
        />
      </div>

      <div className='mobile-search'>
        {tabStore.map((tab: any, index: any) => {
          console.log("====tab.text=======", tab.text)
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
                  setStartTime={setStartTime}
                  setEndTime={setEndTime}
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
                  setSingleCameraName={setSingleCameraName}
                  mobile={true}
                />
              </div>
            );
          } else if (tab.heading === "Object of Interest*") {
            return (
              <div className="single_item">
                <label>Select  <span style={{ color: '#f00' }}>*</span></label>
                <Truck
                  heading={tab.heading}
                  text={tab.text}
                  active={tab.active}
                  index={index}
                  setTabStore={setTabStore}
                  tabStore={tabStore}
                  setOILable={setOILable}
                  mobile={true}
                />
              </div>
            );
          } else if (tab.heading === "Area of Interest") {
            return (
              <div className="single_item">
                <label>Select Area Of Interest <span style={{ color: '#f00' }}>*</span></label>
                <AreaOfInterest
                  heading={tab.heading}
                  text={tab.text}
                  active={tab.active}
                  index={index}
                  setTabStore={setTabStore}
                  tabStore={tabStore}
                  setAIPolygen={setAIPolygen}
                  mobile={true}
                />
              </div>
            );
          } else {
            return (
              <div
                className={`inner-content text-center ${tab.active === true && "activeTab"
                  }`}
                key={index}
                onClick={() => {
                  for (let i = 0; i < tabStore.length; i++) {
                    tabStore[i].active = false;
                  }

                  tabStore[index].active = true;

                  setTabStore(() => {
                    return [...tabStore];
                  });
                }}
              >
                <p className="heading mb-1">{tab.heading}</p>
                <p className="text-label mb-0">{tab.text}</p>
              </div>
            );
          }
        })}
        <button
          className="search-button"
          style={{ cursor: "pointer" }}
          onClick={submitAlert}
        >
          <i className='bx bx-search'></i>
          Search
        </button>
      </div>

      <div className="row mt-5 mx-0">

        <div className="my_alert_not_found">
          {aIFrames.length === 0 && <NotFound />}
        </div>
        <Spin spinning={loader} />
        {!loader && aIFrames &&
          aIFrames.map((data: any, i) => {
            console.log("===1234567890======", aIFrames, data.Results, responseCoordinates)
            return (
              <>{data.image && <div
                className="col-md-3 mb-3 px-2"
                key={i}
                style={{
                  position: "relative",
                }}
              >
                <Suspense fallback={<div>Loading</div>}>
                  <ImageBox data={data} aIPolygen={responseCoordinates} />
                </Suspense>
              </div>}
              </>
            );
          })}
      </div>
    </div>
  );
};

export default ObjectOfInterest;
