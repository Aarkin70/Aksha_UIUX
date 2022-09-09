import express from "express";
import config from "../models/configSchema";
import fs from "fs";
import path from "path";
const router = express.Router();

router.get(process.env.CAMERA_NAMES, async (req, res) => {
  try {
    const cameras = await config.find(
      {},
      {
        Rtsp_Link: 0,
        Description: 0,
        Feature: 0,
        Priority: 0,
        Status: 0,
        Email_Auto_Alert: 0,
        Display_Auto_Alert: 0,
        Skip_Interval: 0,
      }
    );

    res.status(200).json({
      success: true,
      message: "Fetch All Camera Name Successfully",
      cameras: cameras,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error,
      cameras: [],
    });
  }
});

router.get(process.env.OBJECT_OF_INTEREST_LABELS, (req, res) => {
  try {
    let joinPath = path.join(`${process.cwd()}/Aksha/labels.txt`);

    let labels = fs.readFileSync(joinPath, "utf-8").split("\n");

    res.status(200).json({
      success: true,
      message: "Fetch All Labels Successfully",
      labels: labels,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error,
      labels: [],
    });
  }
});

router.get(process.env.REFERENCE_IMAGE, (req, res) => {
  try {
    let imageUrl = `${process.env.PROTOCOL}://${process.env.HOST}:${process.env.PORT}/Reference_images/${req.params.camera_name}.jpg`;

    let joinPath = path.join(
      `${process.cwd()}/Aksha/Reference_images/${req.params.camera_name}.jpg`
    );

    let fileExist = fs.existsSync(path.join(joinPath));

    if (fileExist === true) {
      return res.status(200).json({
        success: true,
        message: "Fetch Reference Image Successfully",
        image: imageUrl,
      });
    }

    res.status(200).json({
      success: true,
      message: "Fetch Reference Image Successfully",
      image: null,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error,
      image: null,
    });
  }
});

export default router;
