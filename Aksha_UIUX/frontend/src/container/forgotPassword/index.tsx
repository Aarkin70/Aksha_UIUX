import React, { useState } from "react";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./forgotPassword.scss";
const ForgotPassword = () => {
  const [showPassword, setShowPassword] = useState(true);
  const [showCPassword, setShowCPassword] = useState(true);
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [cPassword, setCPassword] = useState("");
  let navigate = useNavigate();
  const submitLogin = () => {
    axios
      .post(
        `${ process.env.REACT_APP_UPDATE_PASSWORD }`,
        
        {
          Username: userName,
          Current_Password: password,
          New_Password: cPassword,
        }
      )
      .then(
        (response) => {
          console.log(response);
          navigate("/");
        },
        (error) => {
          console.log(error);
        }
      );
  };
  return (
    <div className="forgotPasswordC" style={{ marginTop: 58 }}>
      <div className="col-md-4">
        <h1 className="mb-4">Welcome back, Courtney!</h1>
        <p className="mid-head mb-5">
          Please enter your details to login to your account
        </p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            submitLogin();
          }}
        >
          <div className="input-container mt-4">
            <PersonOutlineIcon className="first-icon" />
            <input
              type="text"
              className="form-control"
              required
              value={userName}
              onChange={(e) => {
                setUserName(e.target.value);
              }}
            />
          </div>
          <div className="input-container mt-4">
            <LockOutlinedIcon className="first-icon" />
            <input
              type={showPassword ? "password" : "text"}
              className="form-control"
              required
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />

            {showPassword ? (
              <VisibilityOffOutlinedIcon
                className="last-icon"
                onClick={() => setShowPassword(false)}
              />
            ) : (
              <VisibilityOutlinedIcon
                className="last-icon"
                onClick={() => setShowPassword(true)}
              />
            )}
          </div>

          <div className="input-container mt-4">
            <LockOutlinedIcon className="first-icon" />
            <input
              type={showCPassword ? "password" : "text"}
              className="form-control"
              required
              value={cPassword}
              onChange={(e) => {
                setCPassword(e.target.value);
              }}
            />

            {showCPassword ? (
              <VisibilityOffOutlinedIcon
                className="last-icon"
                onClick={() => setShowCPassword(false)}
              />
            ) : (
              <VisibilityOutlinedIcon
                className="last-icon"
                onClick={() => setShowCPassword(true)}
              />
            )}
          </div>

          <br />

          <button className="btn btn-primary w-100" type="submit">
            Summit
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
