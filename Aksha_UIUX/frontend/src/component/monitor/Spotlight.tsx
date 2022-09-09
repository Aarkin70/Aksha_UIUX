import { Button } from "@mui/material";
import { useEffect, useState } from "react";
import pause from "../../assets/images/icons/pause.png";
// import play from "../../assets/images/icons/play.png";
import "./active.scss";
import Menu from "../video_menu";
import { useSelector } from "react-redux";
import ImageModel from "../common/imageModel";

type spotLightInfo = {
  _id: string;
  Timestamp: string;
  Results: [
    {
      label: string;
      x: number;
      y: number;
      w: number;
      h: number;
      confidence: string;
    }
  ];
  Frame_Anomaly: boolean;
  Object_Anomaly: boolean;
  camera_name: string;
  image: string;
}[];

const Spotlight = () => {
  const cameraDetails = useSelector<any>(
    (state) => state.monitor.spotLightCameras.info
  );

  const [spotLightCameras, setSpotLightCameras] = useState<spotLightInfo | []>(
    []
  );
  const [imageLoader, setImageLoader] = useState<boolean>(false);
  const [imgUrl, setImgUrl] = useState<string>("");

  const openImageLoader = () => {
    setImageLoader(true);
  };

  useEffect(() => {
    setSpotLightCameras(cameraDetails as any);

    // console.log("cameraDetails");
    // console.log(message);
    return () => {
      setSpotLightCameras([]);
    };
  }, [cameraDetails]);

  return (
    <div className="grayBack">
      <div className="rowstyle">
        {spotLightCameras && spotLightCameras.map((info, index) => (
          <div className="col-md-2 videoContainer mb-3 px-2" key={index}>
            <img
              src={`${info.image}?${new Date().getTime()}`}
              className="w-100 camera-image"
              alt="camera image"
              onClick={() => {
                setImgUrl(`${info.image}?${new Date().getTime()}`);
                openImageLoader();
              }}
            />

            <div className="flex-end">
              <Menu />
            </div>
            {info.Frame_Anomaly === true || info.Object_Anomaly === true ? (
              <div className="auto-alert">Auto Alert</div>
            ) : (
              ""
            )}

            <div className="bottom-content">
              <div className="bottomTextContainer">
                <p className="mb-0 parentText px-2">{info.camera_name}</p>
              </div>
            </div>

            <div className="middle">
              <Button>
                <img src={pause} alt="pause video" />
              </Button>
            </div>
          </div>
        ))}
      </div>
      {imgUrl && (
        <ImageModel
          open={imageLoader}
          setOpen={setImageLoader}
          imgUrl={imgUrl}
        />
      )}
    </div>
  );
};

export default Spotlight;
