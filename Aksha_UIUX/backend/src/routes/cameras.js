import express from "express";
import config from "../models/configSchema";
import path from "path";
import fs from "fs";
const router = express.Router();

router.post(process.env.CAMERA_CREATE, async (req, res) => {
  const { Camera_Name, Rtsp_Link, Priority, Feature, Description } = req.body;
  if (!Camera_Name || !Rtsp_Link || !Priority || !Feature)
    return res.status(400).json({
      success: false,
      message: "please fill the missing information",
    });

  try {
    await config.create({
      Rtsp_Link: Rtsp_Link,
      Camera_Name: Camera_Name,
      Description: Description,
      Feature: Feature,
      Priority: Priority,
      Status: "creating",
      Email_Auto_Alert: true,
      Display_Auto_Alert: true,
      Skip_Interval: 10,
      Alert: [],
      Active: true,
    });

    res.status(200).json({
      success: true,
      message: "camera creation successful",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error,
    });
  }
});

router.get(process.env.CAMERA_LIST, async (req, res) => {
  try {
    const cameras = await config.find();
    let filteredCameras = [];
    cameras.forEach((info) => {
      let joinPath = path.join(
        `${process.cwd()}/Aksha/Reference_images/${info.Camera_Name}.jpg`
      );
      let imageUrl = `${process.env.PROTOCOL}://${process.env.HOST}:${process.env.PORT}/Reference_images/${info.Camera_Name}.jpg`;
      let fileExist = fs.existsSync(joinPath);
      if (fileExist === true) {
        filteredCameras.push({
          _id: info._id,
          Rtsp_Link: info.Rtsp_Link,
          Camera_Name: info.Camera_Name,
          Description: info.Description,
          Feature: info.Feature,
          Priority: info.Priority,
          Status: info.Status,
          Email_Auto_Alert: info.Email_Auto_Alert,
          Display_Auto_Alert: info.Display_Auto_Alert,
          Skip_Interval: info.Skip_Interval,
          Alert: info.Alert,
          image: imageUrl,
          Active: info.Active,
        });
      } else {
        filteredCameras.push({
          _id: info._id,
          Rtsp_Link: info.Rtsp_Link,
          Camera_Name: info.Camera_Name,
          Description: info.Description,
          Feature: info.Feature,
          Priority: info.Priority,
          Status: info.Status,
          Email_Auto_Alert: info.Email_Auto_Alert,
          Display_Auto_Alert: info.Display_Auto_Alert,
          Skip_Interval: info.Skip_Interval,
          Alert: info.Alert,
          image: "",
          Active: info.Active,
        });
      }
    });

    res.status(200).json({
      success: true,
      message: "fetch camera successful",
      cameras: filteredCameras,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "unable to get cameras",
    });
  }
});

router.put(process.env.UPDATE_CAMERA, async (req, res) => {
  const {
    Rtsp_Link,
    Camera_Name,
    Description,
    Feature,
    Priority,
    Email_Auto_Alert,
    Display_Auto_Alert,
  } = req.body;

  if (
    !Camera_Name ||
    !Rtsp_Link ||
    !Priority ||
    !Feature ||
    !Email_Auto_Alert === "" ||
    !Display_Auto_Alert === ""
  )
    return res.status(400).json({
      success: false,
      message: "please fill the missing information",
    });

  try {
    await config.updateOne(
      { _id: req.params.id },
      {
        $set: {
          Rtsp_Link: Rtsp_Link,
          Camera_Name: Camera_Name,
          Description: Description,
          Feature: Feature,
          Priority: Priority,
          Email_Auto_Alert: Email_Auto_Alert,
          Display_Auto_Alert: Display_Auto_Alert,
        },
      }
    );
    res.status(200).json({
      success: true,
      message: "camera update successful",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "unable to update camera",
    });
  }
});

router.delete(process.env.DELETE_CAMERA, async (req, res) => {
  const _id = req.params.id;
  try {
    await config.findByIdAndUpdate(_id, { Active: false });
    res.status(200).json({
      success: true,
      message: "camera Inactive successful",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "unable to Inactive camera",
    });
  }
});

router.get(process.env.ACTIVATE_CAMERA, async (req, res) => {
  const _id = req.params.id;
  try {
    await config.findByIdAndUpdate(_id, { Active: true });
    res.status(200).json({
      success: true,
      message: "camera Activation successful",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "unable to Activation camera",
    });
  }
});

router.get(process.env.ACTIVE_EMAIL_ALERT, async (req, res) => {
  let isAlertActive = JSON.parse(req.query["alert"]);
  try {
    await config.updateMany(
      {
        Email_Auto_Alert: !isAlertActive,
      },
      { $set: { Email_Auto_Alert: isAlertActive } }
    );
    res.status(200).json({
      success: true,
      message: "all email alert are active",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "unable to make all email alert active",
    });
  }
});

router.get(process.env.ACTIVE_DISPLAY_ALERT, async (req, res) => {
  let isAlertActive = JSON.parse(req.query["alert"]);
  try {
    await config.updateMany(
      {
        Display_Auto_Alert: !isAlertActive,
      },
      {
        $set: {
          Display_Auto_Alert: isAlertActive,
        },
      }
    );
    res.status(200).json({
      success: true,
      message: "all display alert are active",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "unable to make all display alert active",
    });
  }
});

export default router;
