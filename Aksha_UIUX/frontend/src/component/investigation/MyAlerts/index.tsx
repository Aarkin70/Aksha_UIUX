import { useState, useEffect } from "react";
import SearchIcon from "@mui/icons-material/Search";
import { searchTabs } from "./searchStore";
import "./auto_alert.scss";
import DatePicker from "./DatePicker";
import TimePicker from "./TimePicker";
import Camera from "./Camera";
import NotFound from "../../common/notFound";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllCamerasName } from "../../../global_store/reducers/investigationReducer";
import ImageBox from "../../common/canvasFrames";
import pause from "../../../assets/images/icons/pause.png";
import Menu from "../../video_menu";
import { Button } from "@mui/material";
import { message, Spin } from "antd";
import { isMobile } from '../../../utils/common'

const MyAlerts = () => {
  const [tabStore, setTabStore] = useState(searchTabs);
  let dispatch = useDispatch();
  const [singleCameraName, setSingleCameraName] = useState({
    name: "",
    isCamera: false,
  });
  let { is_mobile: { is_mobile } } = useSelector((state: any) => state.isMobileDevice);
  const [starTime, setStartTime] = useState("00 am");
  const [endTime, setEndTime] = useState("00 am");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [loader, setLoader] = useState(false);

  const [aIFrames, setAIFrames] = useState([]);

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

  const getCameraList = () => {
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

  const getAlertList = () => {
    console.log('================================', `${process.env.REACT_APP_BASE_URL}${process.env.REACT_APP_MYALERTS}`);
    setLoader(true);
    axios
      .post(`${process.env.REACT_APP_BASE_URL}${process.env.REACT_APP_MYALERTS}`, {
        Camera_Name: singleCameraName.name,
        Start_Date: startDate,
        End_Date: endDate,
        Start_Time: Number(starTime) + ':00', //add 24 hrs moment,
        End_Time: Number(endTime) + ':00',
      })
      .then((response) => {
        console.log("===========+++==========", response)
        response.data.alert.forEach((e: any) => {
          if (e.image != null || e.image != '') {
            toDataUrl(e.image, async function (myBase64: any) {
              e.base_url = await myBase64;
              e.Results = e.Object_Area.flat(1);
            });
          }
        });
        setTimeout(() => {
          setAIFrames(response.data.alert);
          setLoader(false);
          console.log("---------------------", response.data.alert);
        }, 1000);
      },
        (error) => {
          console.log(error);
          message.warning(error.response.data.message);
          setLoader(false);
        }
      );
  };

  useEffect(() => {
    // console.log("singleCameraName ", singleCameraName);
    // console.log("startDate ", startDate);
    // console.log("endDate ", endDate);
    // console.log("starTime", Number(starTime));
    // console.log("endTime", Number(endTime));
    // console.log("starTime", starTime);
    // console.log("endTime", endTime);
  }, [starTime, endTime]);

  const setDefaultDropdownDetails = () => {
    tabStore[0].text = "  -  ";
    tabStore[1].text = "00 am" + " - " + "00 am";
    tabStore[2].text = "camera1";
    setTabStore(() => {
      return [...tabStore];
    });

    setSingleCameraName({
      name: "camera1",
      isCamera: false,
    });
  };

  useEffect(() => {
    getCameraList();
    setDefaultDropdownDetails();
  }, []);

  // useEffect(() => {
  //   console.log("===========isMobile.any()============")
  //   if (isMobile.any()) {
  //     //some code...
  //     console.log("===========mobile============")
  //     dispatch({ type: 'IS_MOBILE', is_mobile: true })
  //   } else {
  //     console.log("===========desktop============")
  //     dispatch({ type: 'IS_MOBILE', is_mobile: false })
  //   }
  // })

  // if (isMobile.any()) {
  //   //some code...
  //   console.log("===========mobile============")
  //   dispatch({ type: 'IS_MOBILE', is_mobile: true })
  // } else {
  //   console.log("===========desktop============")
  //   dispatch({ type: 'IS_MOBILE', is_mobile: false })
  // }

  console.log("===========deviceCheck==========", is_mobile)

  return (
    <div className="auto-alert autoalert-search-bar">
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
            }
          })}
        </div>

        <SearchIcon
          className="searchIcon"
          style={{ cursor: "pointer" }}
          onClick={getAlertList}
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
          }
        })}
        <button
          className="search-button"
          style={{ cursor: "pointer" }}
          onClick={getAlertList}
        >
          <i className='bx bx-search'></i>
          Search
        </button>
      </div>

      <div className="row mt-5 mx-0">
        <div className="my_alert_not_found">
          {aIFrames.length === 0 && <NotFound />}
        </div>

        <Spin spinning={loader}>
          {aIFrames.map((data: any, i) => {
            return (
              <div className="row mt-5 mx-0" style={{ marginTop: 30, textAlign: 'left' }}>
                <div
                  key={i}
                >
                  {data.images.map((image: any, index: any) =>
                    // <img src={image} style={{ maxWidth: is_mobile ? 360 : 473, padding: '0px 5px', marginBottom: 20 }} />
                    <img src={image} className="myAlertCss" />

                  )}
                </div>
              </div>
            )
          })}
        </Spin>
      </div>
    </div >
  );
};

export default MyAlerts;
