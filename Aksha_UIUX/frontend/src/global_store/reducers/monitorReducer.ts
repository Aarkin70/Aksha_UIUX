import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cameraDetails: {
    info: [],
    message: "",
  },
  spotLightCameras: {
    info: [],
    message: "",
  },
};

const monitorReducer = createSlice({
  name: "monitor",
  initialState,
  reducers: {
    fetchUser: (state, action) => {
      state.cameraDetails = action.payload;
    },
    getAllSpotLight: (state, action) => {
      state.spotLightCameras = action.payload;
    },
  },
});

const { actions, reducer } = monitorReducer;
export const { fetchUser, getAllSpotLight } = actions;

export default reducer;
