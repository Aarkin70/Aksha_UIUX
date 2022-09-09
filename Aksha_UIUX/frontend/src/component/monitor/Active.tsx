import { Button } from "@mui/material";
import { useEffect, useState } from "react";
import pause from "../../assets/images/icons/pause.png";
// import play from "../../assets/images/icons/play.png";
import "./active.scss";
import Menu from "../video_menu";
import { useSelector } from "react-redux";
import ImageModel from "../common/imageModel";

type cameraDetailsType = {
  _id: string;
  rtsp_link: string;
  Camera_Name: string;
  skip_interval: number;
  status: boolean;
  image: string;
}[];

const Active = () => {
  const cameraDetails = useSelector<any>(
    (state) => state.monitor.cameraDetails.info
  );

  const [updateCamera, setUpdateCamera] = useState<cameraDetailsType | []>([]);
  const [imageLoader, setImageLoader] = useState<boolean>(false);
  const [imgUrl, setImgUrl] = useState<string>("");

  const openImageLoader = () => {
    setImageLoader(true);
  };

  useEffect(() => {
    setUpdateCamera(cameraDetails as any);

    // console.log("cameraDetails");
    // console.log(message);
    return () => {
      setUpdateCamera([]);
    };
  }, [cameraDetails]);

  return (
    <div className="grayBack">
      {/* @ts-ignore */}
      <div className="rowstyle">
        {(updateCamera as cameraDetailsType).map((info, index) => (
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

            <div className="bottom-content">
              <div className="bottomTextContainer">
                <p className="mb-0 parentText px-2">{info.Camera_Name}</p>
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

export default Active;
