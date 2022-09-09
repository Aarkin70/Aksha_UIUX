import * as React from "react";
import Popover from "@mui/material/Popover";
import { dateType } from "./objectOfInterest.types";
import CanvasDraw from "../../common/canvasDraw";
import Typography from "@mui/material/Typography";
import { useSelector } from "react-redux";

function AreaOfInterest({
  heading,
  text,
  active,
  index,
  setTabStore,
  tabStore,
  setAIPolygen,
  mobile,
}: any) {
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );

  let areaOfInterestImage = useSelector(
    (state: any) => state.investigation.areaOfInterestImage
  );
  console.log('areaOfInterestImage',areaOfInterestImage);

  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  return (
    <div>
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
         //style={{
          // width: 500,
          // height: 360,
        // }}
        className="model-radius"
      >
        <Typography sx={{ p: 1 }}>
          {/* <img src="./aoi-xyz.png" style={{ objectFit:'cover',width:600 }} /> */}
          <CanvasDraw
            imageUrl={areaOfInterestImage}
            setAIPolygen={setAIPolygen}
            width={500}
            height={360}
          />
        </Typography>
      </Popover>
    </div>
  );
}

export default React.memo(AreaOfInterest);
