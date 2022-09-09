import React, { useState } from "react";
import "./activity_tracker.scss";
import { searchTabs } from "./searchStore";
import SearchIcon from "@mui/icons-material/Search";
import NotFound from "../../common/notFound";
import DatePicker from "./DatePicker";
import TimePicker from "./TimePicker";
import Camera from "./Camera";
const ActivityTracker = () => {
  const [tabStore, setTabStore] = useState(searchTabs);
  return (
    <div className="activity-tracker autoalert-search-bar">
      
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
                  mobile={false}
                />
              );
            }
          })}
        </div>

        <SearchIcon className="searchIcon" />
      </div>

      <div className='mobile-search'>
          {tabStore.map((tab: any, index: any) => {
            if (tab.heading === "Date*") {
              return (
                <div className="single_item">
                  <label>Date <span style={{color:'#f00'}}>*</span></label>
                  <DatePicker
                    heading={tab.heading}
                    text={tab.text}
                    active={tab.active}
                    index={index}
                    setTabStore={setTabStore}
                    tabStore={tabStore}
                    mobile={true}
                  />
                </div>
              );
            } else if (tab.heading === "Time*") {
              return (
                <div className="single_item">
                  <label>Time <span style={{color:'#f00'}}>*</span></label>
                  <TimePicker
                    heading={tab.heading}
                    text={tab.text}
                    active={tab.active}
                    index={index}
                    setTabStore={setTabStore}
                    tabStore={tabStore}
                    mobile={true}
                  />
                </div>
              );
            } else if (tab.heading === "Camera*") {
              return (
                <div className="single_item">
                  <label>Select Camera <span style={{color:'#f00'}}>*</span></label>
                  <Camera
                    heading={tab.heading}
                    text={tab.text}
                    active={tab.active}
                    index={index}
                    setTabStore={setTabStore}
                    tabStore={tabStore}
                    mobile={true}
                  />
                </div>
              );
            }
          })}
          <button 
            className="search-button"
            style={{cursor:"pointer"}}
            // onClick={searchforautoalert}
          >
            <i className='bx bx-search'></i>
            Search
          </button>
      </div>
      <div className="my_alert_not_found">
        <NotFound/>
      </div>
    </div>
  );
};

export default ActivityTracker;
