import * as React from "react";
import Popover from "@mui/material/Popover";
import { dateType } from "./objectOfInterest.types";
import TruckModel from "./TruckModel";
import Typography from "@mui/material/Typography";

export default function Truck({
  heading,
  text,
  active,
  index,
  setTabStore,
  tabStore,
  setOILable,
  mobile,
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

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;
  console.log("============", anchorEl, defaultval)
  text = typeof text === 'string' ? [text] : text
  text = text && text.filter((item: any, pos: any) => text.indexOf(item) == pos)
  return (
    <div id="objectOfInterestCls">
      <div
        className={`inner-content text-center ${active === true && "activeTab"
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
        {mobile == false && <p className="heading mb-1">{heading}</p>}
        <p className="text-label mb-0 paragah">
          {text && text.map((ele: any, idx: any) => <span >{`${ele}${text.length !== idx + 1 ? ',' : ''}`}</span>)}
        </p>

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
        className="model-radius_1"
      >
        <Typography sx={{ p: 1 }}>
          <TruckModel
            setTabStore={setTabStore}
            tabStore={tabStore}
            index={index}
            close={handleClose}
            selectedOption={defaultval}
            setDefaultval={setDefaultval}
            setOILable={setOILable}
          />
        </Typography>
      </Popover>
    </div>
  );
}
