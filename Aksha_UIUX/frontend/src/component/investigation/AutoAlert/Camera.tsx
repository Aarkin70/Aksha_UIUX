import * as React from "react";
import Popover from "@mui/material/Popover";
import { dateType } from "./myAlerts.types";
import CameraModel from "./CameraModel";
import Typography from "@mui/material/Typography";

export default function Camera({
  heading,
  text,
  active,
  index,
  setTabStore,
  tabStore,
  cameras,
  setCameraName,
  mobile
}: any) {
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );

  const [defaultval, setDefaultval] = React.useState("");

  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const setCamera = (value :any) => {
    setDefaultval(value);
    setCameraName(value);
  }


  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

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
        <Typography sx={{ p: 1 }}>
          <CameraModel
            setTabStore={setTabStore}
            tabStore={tabStore}
            index={index}
            close={handleClose}
            selectedOption={defaultval}
            setDefaultval={setCamera}
            cameralist={cameras}
          />
        </Typography>
      </Popover>
    </div>
  );
}
