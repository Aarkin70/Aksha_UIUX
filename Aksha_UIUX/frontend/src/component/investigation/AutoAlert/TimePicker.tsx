import * as React from "react";
import Popover from "@mui/material/Popover";
import { dateType } from "./myAlerts.types";
import TimeModel from "./TimeModel";
import Typography from "@mui/material/Typography";

export default function TimePicker1({
  heading,
  text,
  active,
  index,
  setTabStore,
  tabStore,
  setftime,
  setttime,
  mobile,
}: any) {
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );

  const [fromTime, setFromTime] = React.useState("");
  const [toTime, setToTime] = React.useState("");

  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const setfrom = (value :any) => {
    // console.log('from value',value);
    setFromTime(value);
    setftime(value);
  }

  const setto = (value :any) => {
    // console.log('to value',value);
    setToTime(value);
    setttime(value);
  }

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const [value, setValue] = React.useState<Date | null>(null);

  return (
    <div>
      <div
        className={`inner-content text-center ${
          active === true && "activeTab"
        }`}
        key={index}
        onClick={(e) => {
          for (let i = 0; i < tabStore.length; i++) {
            tabStore[i].active = false;
          }

          tabStore[index].active = true;

          setTabStore(() => {
            return [...tabStore];
          });

          handleClick(e);
        }}
      >
        {mobile==false&&<p className="heading mb-1">{heading}</p>}
        <p className="text-label mb-0">{text}</p>
      </div>

      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        className="model-radius"
      >
        <Typography sx={{ p: 2 }}>
          <TimeModel
            setTabStore={setTabStore}
            tabStore={tabStore}
            index={index}
            fromTime={fromTime}
            toTime={toTime}
            setFromTime={setfrom}
            setToTime={setto}
          />
        </Typography>
      </Popover>
    </div>
  );
}
