import socketIo from "socket.io";
import path from "path";
import fs from "fs";
import watch from "node-watch";
import config from "../src/models/configSchema";
import mongoose from "mongoose";
import moment from "moment";

const observer = (server, app) => {
  const io = socketIo(server, {
    cors: {
      origin: "http://localhost:3000",
    },
  });

  let meta_cameras = [];

  mongoose.connection.on("open", function (ref) {
    mongoose.connection.db
      .listCollections()
      .toArray(async function (err, collectionName) {
        let metaCollection = collectionName.filter((data) => {
          return data["name"].toLocaleLowerCase().includes("meta_");
        });

        for (let i = 0; i < metaCollection.length; i++) {
          const metaSchema = new mongoose.Schema(
            {},
            { collection: metaCollection[i].name, strict: false }
          );

          let metaModel = mongoose.model(metaCollection[i].name, metaSchema);
          // meta_cameras = metaModel;

          let filterMeta = await metaModel
            .find()
            .sort({ Timestamp: -1 })
            .limit(1);
          filterMeta.forEach((data) => {
            meta_cameras.push({
              _id: data.id,
              Timestamp: data.Timestamp,
              Results: data.Results,
              Frame_Anomaly: data.Frame_Anomaly,
              Object_Anomaly: data.Object_Anomaly,
              camera_name: metaCollection[i].name.split("_")[1],
            });
          });
        }
      });
  });

  // Time stamp clearification
  const fetchMetaCameras = async (socket, app) => {
    var result = fs.readdirSync(path.join(`${process.cwd()}/Aksha/`));

    let filterResult = result.filter((folderName) => {
      return folderName.toLocaleLowerCase().includes("camera");
    });

    let filterInfo = [];

    filterResult.forEach((cameraName) => {
      let fileExists = fs.existsSync(
        path.join(
          `${process.cwd()}/Aksha/${cameraName}/spotlight/spotlight.jpg`
        )
      );
      if (fileExists) {
        filterInfo.push({
          camera_name: cameraName,
          image:
            `${process.env.PROTOCOL}://${process.env.HOST}:${process.env.PORT}/${cameraName}/spotlight/` +
            "spotlight.jpg",
        });
      }
    });

    filterResult.forEach((cameraName) => {
      let joinPath = path.join(
        `${process.cwd()}/Aksha/${cameraName}/spotlight`
      );
      let fileExists = fs.existsSync(
        path.join(
          `${process.cwd()}/Aksha/${cameraName}/spotlight/spotlight.jpg`
        )
      );

      if (fileExists == true) {
        watch(joinPath, { recursive: true }, function (evt, name) {
          if (evt === "update")
            socket.emit("meta_cameras", {
              success: true,
              message: "file Updated",
              info: filterInfo,
            });
        });
      }
    });

    return filterInfo;

    // if (meta_cameras.length > 0) {
    //   let filterMeta = meta_cameras;

    //   let newFilterMeta = filterMeta.map((data) => {
    //     let joinPath = path.join(
    //       `${process.cwd()}/Aksha/${data.camera_name}/frame`
    //     );
    //     return {
    //       _id: data._id,
    //       Timestamp: data.Timestamp,
    //       Results: data.Results,
    //       Frame_Anomaly: data.Frame_Anomaly,
    //       Object_Anomaly: data.Object_Anomaly,
    //       camera_name: data.camera_name,
    //       image: fs.existsSync(
    //         path.join(
    //           joinPath,
    //           `${moment.utc(data.Timestamp).format("YYYY-MM-DD HH_mm_ss")}.jpg`
    //         )
    //       )
    //         ? `${process.env.PROTOCOL}://${process.env.HOST}:${process.env.PORT}/${data.camera_name}/frame/` +
    //           `${moment.utc(data.Timestamp).format("YYYY-MM-DD HH_mm_ss")}.jpg`
    //         : null,
    //     };
    //   });

    //   for (let i = 0; i < newFilterMeta.length; i++) {
    //     let joinPath = path.join(
    //       `${process.cwd()}/Aksha/${newFilterMeta[i].camera_name}/frame`
    //     );

    //     let fileExists = fs.existsSync(
    //       path.join(
    //         joinPath,
    //         `${moment
    //           .utc(newFilterMeta[i].Timestamp)
    //           .format("YYYY-MM-DD HH_mm_ss")}.jpg`
    //       )
    //     );

    //     if (fileExists == true)
    //       watch(joinPath, { recursive: true }, function (evt, name) {
    //         // console.log("%s changed.", name);
    //         // console.log(evt);
    //         // console.log(evt === "update");
    //         if (evt === "update")
    //           socket.emit("meta_cameras", {
    //             success: true,
    //             message: "file Updated",
    //             info: newFilterMeta,
    //           });
    //       });
    //   }

    //   return newFilterMeta;
    // }
  };

  const getCameraName = async (socket, app) => {
    const cameraDetail = await config.find();

    let newCameraDetail = cameraDetail.map((data) => {
      let joinPath = path.join(
        `${process.cwd()}/Aksha/${data.Camera_Name}/live`
      );

      return {
        _id: data._id,
        Rtsp_Link: data.Rtsp_Link,
        Camera_Name: data.Camera_Name,
        Description: data.Description,
        Feature: data.Feature,
        Priority: data.Priority,
        Status: data.Status,
        Email_Auto_Alert: data.Email_Auto_Alert,
        Display_Auto_Alert: data.Display_Auto_Alert,
        Skip_Interval: data.Skip_Interval,
        image: fs.existsSync(path.join(joinPath, "latest.jpg"))
          ? `${process.env.PROTOCOL}://${process.env.HOST}:${process.env.PORT}/${data.Camera_Name}/live/` +
            "latest.jpg"
          : null,
      };
    });

    for (let i = 0; i < newCameraDetail.length; i++) {
      let joinPath = path.join(
        `${process.cwd()}/Aksha/${newCameraDetail[i].Camera_Name}/live`
      );
      let fileExists = fs.existsSync(path.join(joinPath, "latest.jpg"));

      if (fileExists == true)
        watch(joinPath, { recursive: true }, function (evt, name) {
          // console.log("%s changed.", name);
          // console.log(evt);
          // console.log(evt === "update");
          if (evt === "update")
            socket.emit("cameraImages", {
              success: true,
              message: "file Updated",
              info: newCameraDetail,
            });
        });
    }

    return newCameraDetail;
  };

  // const getSpotLightData = () => {};

  io.on("connection", async (socket) => {
    console.log("New client connected");
    let cameraDetail = await getCameraName(socket, app);
    let metaCameraDetail = await fetchMetaCameras(socket, app);

    socket.emit("cameraImages", {
      success: true,
      message: "success",
      info: cameraDetail,
    });

    // console.log("meta_store");
    // console.log(metaCameraDetail);

    socket.emit("meta_cameras", {
      success: true,
      message: "success",
      info: metaCameraDetail,
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected");
      socket.emit("cameraImages", {
        success: false,
        message: "disconnected",
        info: [],
      });

      socket.emit("meta_cameras", {
        success: true,
        message: "disconnected",
        info: [],
      });
    });
  });

  return server;
};

export default observer;
