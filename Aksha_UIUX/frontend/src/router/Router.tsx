import React from "react";
import Header from "../header/Header";
import { Routes, Route, Navigate } from "react-router-dom";
import Protected from "../component/common/protected";
import Monitor from "../container/monitor";
import Investigation from "../container/investigation";
import Insights from "../container/insights";
import CameraDirectory from "../container/cameraDirectory";
import Login from "../container/login";
import ForgotPassword from "../container/forgotPassword";
const Router = () => {
  let isLoggedIn: any = window.localStorage.getItem("isLoggedIn");

  return (
    <div>
      <Header />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/forgotPassword" element={<ForgotPassword />} />
        <Route
          path="/monitor"
          element={
            <Protected isLoggedIn={JSON.parse(isLoggedIn)}>
              <Monitor />
            </Protected>
          }
        />
        <Route
          path="/investigation"
          element={
            <Protected isLoggedIn={JSON.parse(isLoggedIn)}>
              <Investigation />
            </Protected>
          }
        />
        <Route
          path="/insights"
          element={
            <Protected isLoggedIn={JSON.parse(isLoggedIn)}>
              <Insights />
            </Protected>
          }
        />
        <Route
          path="/cameraDirectory"
          element={
            <Protected isLoggedIn={JSON.parse(isLoggedIn)}>
              <CameraDirectory />
            </Protected>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
};

export default Router;
