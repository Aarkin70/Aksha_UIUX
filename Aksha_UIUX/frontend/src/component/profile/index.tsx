import React, { useState, useEffect } from "react";
import PencilIcon from "@mui/icons-material/ModeEditOutlineOutlined";
import Dialog from "@mui/material/Dialog";
import profileImg from "../../assets/images/profileImg.png";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import CloseIcon from "@mui/icons-material/Close";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import AlternateEmailOutlinedIcon from "@mui/icons-material/AlternateEmailOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import CallOutlinedIcon from "@mui/icons-material/CallOutlined";
import "./profile.scss";
import axios from "axios";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

type profileProps = {
  children: React.ReactNode;
};

export default function Profile(props: profileProps) {
  const [open, setOpen] = React.useState(false);
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  // const [newPassword, setNewPassword] = useState("");
  // const [confirmPassword, setConfirmPassword] = useState("");
  let globalInfo = window.localStorage.getItem("userInfo");
  const [changeEmailText, setChangeEmailText] = useState("Save");

  useEffect(() => {
    let userInfo: any = JSON.parse(globalInfo as any);
    try {
      setUserName(userInfo["Client"]);
      setEmail(userInfo["Email"]);
    } catch (error) { }
  }, [globalInfo]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const changeEmail = () => {
    setChangeEmailText("Please Wait...");
    let userInfo: any = JSON.parse(globalInfo as any);
    axios
      .post(
        `${ process.env.REACT_APP_UPDATE_EMAIL }`,
        {
          Username: userInfo.Username,
          Password: userInfo.Password,
          New_Email: email,
        }
      )
      .then(
        (res) => {
          setChangeEmailText("Save");
        },
        (err) => {
          console.log(err);
          setChangeEmailText("Save");
        }
      );
  };

  return (
    <div>
      <div onClick={handleClickOpen}>{props.children}</div>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <div className="profile-model">
          <div className="profile-header">
            <div className="userInfo">
              <div className="flex-info">
                <img src={profileImg} alt="profile icon" />
                <div>
                  <h3 className="mb-0">Courtney Henry</h3>
                  <p className="mb-0">Pune, India</p>
                </div>
              </div>
              <CloseIcon className="close-icon" onClick={handleClose} />
            </div>
          </div>
          <div className="flex-main-info">
            <div className="information">
              <h2>User Information</h2>
              <div className="flex-input">
                <PersonOutlinedIcon className="lockIcon" />
                <input
                  type="text"
                  className="form-control"
                  placeholder="Full name"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                />
                <PencilIcon className="pencil-icon" />
              </div>

              <div className="flex-input">
                <AlternateEmailOutlinedIcon className="lockIcon" />
                <input
                  type="text"
                  className="form-control"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                />
                <PencilIcon className="pencil-icon" />
              </div>

              <div className="flex-input">
                <CallOutlinedIcon className="lockIcon" />
                <input
                  type="text"
                  className="form-control"
                  placeholder="9584651200"
                />
                <PencilIcon className="pencil-icon" />
              </div>
            </div>
            <div className="change-password">
              <h2>Change Password</h2>
              <div className="flex-input">
                <LockOutlinedIcon className="lockIcon" />
                <input
                  type="password"
                  className="form-control"
                  placeholder="Current password"
                />
                <VisibilityOffIcon className="pencil-icon" />
              </div>
              <div className="flex-input">
                <LockOutlinedIcon className="lockIcon" />
                <input
                  type="password"
                  className="form-control"
                  placeholder="New password"
                />
                <VisibilityOffIcon className="pencil-icon" />
              </div>

              <div className="flex-input">
                <LockOutlinedIcon className="lockIcon" />
                <input
                  type="password"
                  className="form-control"
                  placeholder="confirm password"
                />
                <VisibilityOffIcon className="pencil-icon" />
              </div>
            </div>
          </div>
          <div className="flex-btn-pass">
            <button className="btn btn-primary" onClick={changeEmail}>
              {changeEmailText}
            </button>
            <button className="btn btn-reset-pass">Reset password</button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
