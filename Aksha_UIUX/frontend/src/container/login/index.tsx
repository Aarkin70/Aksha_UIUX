import React, { useEffect, useState } from "react";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { showToast } from "../../global_store/reducers/snackBarReducer";
import { useDispatch } from "react-redux";
import "./login.scss";
const Login = () => {
  const [showPassword, setShowPassword] = useState(true);
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [loginText, setLoginText] = useState("Login");
  const dispatch = useDispatch();

  let navigate = useNavigate();
  let isLoggedIn = window.localStorage.getItem("isLoggedIn");

  useEffect(() => {
    if (isLoggedIn === "true") {
      console.log(isLoggedIn);
      navigate("/monitor");
    }
  }, [isLoggedIn]);

  const submitLogin = () => {
    setLoginText("Please Wait...");
    axios
      .post(
        `${ process.env.REACT_APP_USER_LOGIN }`,
        {
          Username: userName,
          Password: password,
        }
      )
      .then(
        (res) => {
          console.log(res);
          if (res.data.statusCode === 200) {
            window.localStorage.setItem("isLoggedIn", "true");
            window.localStorage.setItem(
              "userInfo",
              JSON.stringify({
                Client: res.data.Client,
                Email: res.data.Email,
                Username: userName,
                Password: password,
              })
            );
            dispatch(
              showToast({
                show: true,
                indicator: "success",
                message: res.data.message,
              })
            );
            setTimeout(() => {
              dispatch(
                showToast({
                  show: false,
                  indicator: "success",
                  message: res.data.message,
                })
              );
              setLoginText("Login");
              navigate("/monitor");
            }, 1000);
          } else {
            dispatch(
              showToast({
                show: true,
                indicator: "error",
                message: res.data.message,
              })
            );
            setTimeout(() => {
              dispatch(
                showToast({
                  show: false,
                  indicator: "error",
                  message: res.data.message,
                })
              );
              setLoginText("Login");
            }, 1000);
          }
        },
        (error) => {
          console.log(error);
          setLoginText("Login");
        }
      );
  };
  return (
    <div className="loginC" style={{ marginTop: 58 }}>
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

          <div className="d-flex justify-content-between align-items-center mt-3 mb-2">
            <div className="form-check">
              <input className="form-check-input" type="checkbox" value="" />
              <label className="form-check-label" htmlFor="flexCheckDefault">
                Remember me
              </label>
            </div>
            <p
              className="forgot-pass"
              onClick={() => navigate("/forgotPassword")}
            >
              Forgot password?
            </p>
          </div>

          <button className="btn btn-primary w-100" type="submit">
            {loginText}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
