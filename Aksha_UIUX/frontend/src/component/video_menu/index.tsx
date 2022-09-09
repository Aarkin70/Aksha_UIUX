import * as React from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import dotsCircle from "../../assets/images/icons/DotsThreeCircle.png";
import PhotoCameraOutlinedIcon from "@mui/icons-material/PhotoCameraOutlined";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import StopCircleOutlinedIcon from "@mui/icons-material/StopCircleOutlined";
export default function MenuOverlay() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <Button
        id="basic-button"
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
      >
        <img
          src={dotsCircle}
          alt="three dots icon"
          style={{
            width: "38px",
            height: "38px",
          }}
        />
      </Button>

      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        <MenuItem onClick={handleClose}>
          <PhotoCameraOutlinedIcon className="pe-1" />
          Edit Camera
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <ErrorOutlineOutlinedIcon className="pe-1" />
          My Alerts
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <StopCircleOutlinedIcon className="pe-1" />
          Stop
        </MenuItem>
      </Menu>
    </div>
  );
}
