import mongoose from "mongoose";
import express from "express";
import { getIsPointInsidePolygon } from "../../utils/getInsidePolygon";
import moment from "moment";
import path from "path";
import fs from "fs";
const router = express.Router();

router.post(process.env.MY_ALERT, async (req, res) => {
  const { Start_Time, End_Time, Camera_Name, Start_Date, End_Date } = req.body;
  try {
    if (!Start_Time || !End_Time || !Camera_Name || !Start_Date || !End_Date) {
      return res.status(400).json({
        success: false,
        message: "please provide all detail",
      });
    }

    var result = fs.readdirSync(path.join(`${process.cwd()}/Aksha/`));

    let filterResult = result.filter((folderName) => {
      return folderName.toLocaleLowerCase().includes("camera");
    });

    let filterInfo = [];

    filterResult.forEach((cameraName) => {
      var images = fs.readdirSync(
        path.join(`${process.cwd()}/Aksha/${cameraName}/alerts`)
      );
      let filterTimeStamp = images.filter((image) => {
        return image.toLocaleLowerCase().includes("_alert.jpg");
      });
      let removeImageExt = filterTimeStamp.filter((image) => {
        let date = image
          .replace("_alert.jpg", "")
          .replace("_", ":")
          .replace("_", ":");
        return moment
          .utc(moment.utc(date).format("YYYY-MM-DD HH:mm"))
          .isBetween(
            `${moment.utc(Start_Date).format("YYYY-MM-DD")} ${Start_Time}`,
            `${moment.utc(End_Date).format("YYYY-MM-DD")} ${End_Time}`,
            undefined,
            "[]"
          );
      });

      if (removeImageExt.length > 0) {
        filterInfo.push({
          cameraName: cameraName,
          date: removeImageExt,
        });
      }
    });

    let filterAlert = filterInfo.map((data) => {
      if (data.cameraName === Camera_Name)
        return {
          cameraName: data.cameraName,
          images: data.date.map((info) => {
            return (
              `${process.env.PROTOCOL}://${process.env.HOST}:${process.env.PORT}/${data.cameraName}/alerts/` +
              `${info}`
            );
          }),
        };
      else return {};
    });

    res.status(200).json({
      success: true,
      message: "My Alerts are found successfully",
      alert: filterAlert,
    });
  } catch (error) {
    // console.log(error);
    res.status(400).json({
      success: false,
      message: error,
      alert: [],
    });
  }
});

router.post(process.env.AUTO_ALERT, async (req, res) => {
  const { camera_name, start_date, end_date, start_time, end_time } = req.body;

  if (!camera_name || !start_date || !end_date || !start_time || !end_time) {
    return res.status(400).json({
      success: false,
      message: "please provide proper data to find alert",
      alert: [],
    });
  }

  try {
    var result = fs.readdirSync(path.join(`${process.cwd()}/Aksha/`));

    let filterResult = result.filter((folderName) => {
      return folderName.toLocaleLowerCase().includes("camera");
    });

    let filterInfo = [];

    filterResult.forEach((cameraName) => {
      var images = fs.readdirSync(
        path.join(`${process.cwd()}/Aksha/${cameraName}/alerts`)
      );
      let filterTimeStamp = images.filter((image) => {
        return image.toLocaleLowerCase().includes("_autoalert.jpg");
      });
      let removeImageExt = filterTimeStamp.filter((image) => {
        let date = image
          .replace("_autoalert.jpg", "")
          .replace("_", ":")
          .replace("_", ":");
        return moment
          .utc(moment.utc(date).format("YYYY-MM-DD HH:mm"))
          .isBetween(
            `${moment.utc(start_date).format("YYYY-MM-DD")} ${start_time}`,
            `${moment.utc(end_date).format("YYYY-MM-DD")} ${end_time}`,
            undefined,
            "[]"
          );
      });

      if (removeImageExt.length > 0) {
        filterInfo.push({
          cameraName: cameraName,
          date: removeImageExt,
        });
      }
    });

    let filterAlert = filterInfo.map((data) => {
      if (data.cameraName === camera_name)
        return {
          cameraName: data.cameraName,
          images: data.date.map((info) => {
            return (
              `${process.env.PROTOCOL}://${process.env.HOST}:${process.env.PORT}/${data.cameraName}/alerts/` +
              `${info}`
            );
          }),
        };
      else return {};
    });

    res.status(200).json({
      success: true,
      message: "Auto Alerts are found successfully",
      alert: filterAlert,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error,
      alert: [],
    });
  }
});

router.get(process.env.RECENT_ALERT, async (req, res) => {
  try {
    var result = fs.readdirSync(path.join(`${process.cwd()}/Aksha/`));

    let filterResult = result.filter((folderName) => {
      return folderName.toLocaleLowerCase().includes("camera");
    });

    let filterInfo = [];

    filterResult.forEach((cameraName) => {
      var images = fs.readdirSync(
        path.join(`${process.cwd()}/Aksha/${cameraName}/alerts`)
      );
      let filterTimeStamp = images.filter((image) => {
        return image;
      });
      let removeImageExt = filterTimeStamp.filter((image) => {
        let date = image
          .replace("_autoalert.jpg", "")
          .replace("_alert.jpg", "")
          .replace("_", ":")
          .replace("_", ":");
        return (
          new Date(date) >=
          new Date(Date.now() - req.params.hours * 60 * 60 * 1000)
        );
      });

      if (removeImageExt.length > 0) {
        filterInfo.push({
          cameraName: cameraName,
          date: removeImageExt,
        });
      }
    });

    let filterAlert = filterInfo.map((data) => {
      return {
        cameraName: data.cameraName,
        images: data.date.map((info) => {
          return (
            `${process.env.PROTOCOL}://${process.env.HOST}:${process.env.PORT}/${data.cameraName}/alerts/` +
            `${info}`
          );
        }),
      };
    });

    res.status(200).json({
      success: true,
      message: "Recent Alerts are found successfully",
      alert: filterAlert,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      success: false,
      message: error,
      alert: [],
    });
  }
});

router.post(process.env.OBJECT_OF_INTEREST, async (req, res) => {
  const {
    camera_name,
    start_date,
    end_date,
    start_time,
    end_time,
    object_of_interest,
    area_of_interest,
  } = req.body;

  if (
    !camera_name ||
    !start_date ||
    !end_date ||
    !start_time ||
    !end_time ||
    !object_of_interest
  ) {
    return res.status(400).json({
      success: false,
      message: "Unable to found alert",
      alert: [],
    });
  }

  try {
    let collection = await mongoose.connection.db.listCollections().toArray();
    let allAlert = [];
    let metaCollection = collection.filter((data) => {
      return data["name"].toLocaleLowerCase().includes("meta_");
    });

    for (let i = 0; i < metaCollection.length; i++) {
      let coll = mongoose.connection.db.collection(metaCollection[i].name);

      let filterMeta = await coll.find().toArray();
      let imageUrl = "";
      filterMeta.forEach((data) => {
        let joinPath = path.join(
          `${process.cwd()}/Aksha/${metaCollection[i].name.split("_")[1]}/`
        );

        let fileExist = fs.existsSync(
          path.join(
            `${joinPath}/frame`,
            `${moment.utc(data.Timestamp).format("YYYY-MM-DD HH:mm:ss")}.jpg`
          )
        );

        if (fileExist === true) {
          imageUrl =
            `${process.env.PROTOCOL}://${process.env.HOST}:${
              process.env.PORT
            }/${metaCollection[i].name.split("_")[1]}/frame/` +
            `${moment.utc(data.Timestamp).format("YYYY-MM-DD HH:mm:ss")}.jpg`;
        }

        allAlert.push({
          _id: data._id,
          Timestamp: data.Timestamp,
          Results: data.Results.map((result, i) => {
            let x1 = [result.x, result.y];
            let x2 = [result.x + result.w, result.y];
            let x3 = [result.x + result.w, result.y + result.h];
            let x4 = [result.x, result.y + result.h];

            return {
              label: result.label,
              x: x1,
              y: x2,
              w: x3,
              h: x4,
            };
          }),
          Frame_Anomaly: data.Frame_Anomaly,
          Object_Anomaly: data.Object_Anomaly,
          camera_name: metaCollection[i].name.split("_")[1],
          image: imageUrl,
        });
      });
    }

    let filterOnTime = allAlert.filter((data) => {
      return (
        moment(moment.utc(data.Timestamp).format("YYYY-MM-DD HH:mm")).isBetween(
          `${moment.utc(start_date).format("YYYY-MM-DD")} ${start_time}`,
          `${moment.utc(end_date).format("YYYY-MM-DD")} ${end_time}`,
          undefined,
          "[]"
        ) && data.camera_name === camera_name
      );
    });

    let filterAlert = filterOnTime.map((data) => {
      return {
        _id: data._id,
        Timestamp: data.Timestamp,
        Results: data.Results.filter((resultVal) =>
          object_of_interest.includes(resultVal.label)
        ),
        Frame_Anomaly: data.Frame_Anomaly,
        Object_Anomaly: data.Object_Anomaly,
        camera_name: data.camera_name,
        image: data.image,
      };
    });

    if (area_of_interest.length === 0) {
      return res.status(200).json({
        success: true,
        message: "Data found successfully",
        alert: filterAlert,
      });
    }

    let newFilterAlert = [];

    filterAlert.forEach((data) => {
      let insiderPoints = data.Results.filter((Results) => {
        return ![
          getIsPointInsidePolygon(Results.x, area_of_interest),
          getIsPointInsidePolygon(Results.y, area_of_interest),
          getIsPointInsidePolygon(Results.w, area_of_interest),
          getIsPointInsidePolygon(Results.h, area_of_interest),
        ].includes(false);
      });

      if (insiderPoints.length > 0) {
        newFilterAlert.push({
          _id: data._id,
          Timestamp: data.Timestamp,
          Results: insiderPoints,
          Frame_Anomaly: data.Frame_Anomaly,
          Object_Anomaly: data.Object_Anomaly,
          camera_name: data.camera_name,
          image: data.image,
        });
      }
    });

    res.status(200).json({
      success: true,
      message: "Data found successfully",
      alert: newFilterAlert,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error,
      alert: [],
    });
    console.log(error);
  }
});
export default router;
