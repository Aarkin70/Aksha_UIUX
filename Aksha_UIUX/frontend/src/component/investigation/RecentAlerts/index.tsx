import { useEffect, useState } from "react";
import NotFound from "../../common/notFound";
import axios from "axios";
import { useSelector } from "react-redux";
import ImageBox from "../../common/canvasFrames";
import "./recentAlert.scss";
import { message, Spin } from "antd";

const RecentAlerts = () => {
  let durationTime = useSelector(
    (state: any) => state.investigation.durationTime
  );

  const [aIFrames, setAIFrames] = useState([]);
  const [allRecentAlertsList, setAllRecentAlertsList] = useState([]);
  const [loader, setLoader] = useState(false);

  function toDataUrl(url: any, callback: any) {
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
      var reader = new FileReader();
      reader.onloadend = function () {
        callback(reader.result);
      };
      reader.readAsDataURL(xhr.response);
    };
    xhr.open("GET", url);
    xhr.responseType = "blob";
    xhr.send();
  }

  const getAllAlert = () => {
    setLoader(true)
    axios
      .get(`${process.env.REACT_APP_BASE_URL}${process.env.REACT_APP_RECENT_ALERTS}${durationTime}`)
      .then(
        (response) => {
          response.data.alert.forEach((e: any) => {
            if (e.image != null && e.image != '') {
              toDataUrl(e.image, async function (myBase64: any) {
                e.base_url = await myBase64;
                e.Results = Array.isArray(e.Results)
                  ? e.Results.flat(1)
                  : `${e.Results[0].x[0]} ${e.Results[0].x[1]},${e.Results[0].y[0]} ${e.Results[0].y[1]} ,${e.Results[0].w[0]} ${e.Results[0].w[1]},${e.Results[0].h[0]} ${e.Results[0].h[1]}`;
              });
            }
          });

          // setTimeout(()=>{
          console.log('response.data.alert', response.data.alert);
          // },2000);

          setAllRecentAlertsList(response.data.alert)

          let mapData: any = [];

          for (let i = 0; i < response.data.alert.length; i++) {
            if (response.data.alert[i].image != null && response.data.alert[i].image != '') {
              let filteredData = response.data.alert.filter((data: any) => {
                return response.data.alert[i].camera_name === data.camera_name;
              });

              mapData.push({
                cameraName: response.data.alert[i].camera_name,
                cameraDetail: filteredData,
              });
            }
          }

          // @ts-ignore
          let arrayUniqueByKey: any = [
            // @ts-ignore
            ...new Map(
              mapData.map((item: any) => [item["cameraName"], item])
            ).values(),
          ];
          console.log("=====arrayUniqueByKey======", arrayUniqueByKey)



          setTimeout(() => {
            arrayUniqueByKey = arrayUniqueByKey.map((data: any) => {
              data.isShowFlag = false
              data.cameraDetail.map((detail: any) =>
                detail?.Results?.length > 0 ? data.isShowFlag = true : data.isShowFlag = false
              )
              return data
            })
            setAIFrames(arrayUniqueByKey);
            console.log(arrayUniqueByKey);
            setLoader(false)
          }, 1000);
        },
        (error) => {
          console.log(error);
          setLoader(false)
        }
      );
  };

  useEffect(() => {
    getAllAlert();
  }, [durationTime]);

  console.log("===========aIFrames========", aIFrames)
  return (
    <Spin spinning={loader} >
      <div className="recentAlert">
        {allRecentAlertsList.length === 0 && <NotFound />}

        {allRecentAlertsList.map((data: any, i) => {
          return (<div className="row mt-5 mx-0" style={{ marginTop: 30, textAlign: 'left' }}>
            <p style={{ marginLeft: 6, textTransform: 'capitalize', fontSize: 20 }}><b>{data.cameraName} </b></p>
            <div
              key={i}
            >
              {data.images.map((image: any, index: any) =>
                <img src={image} style={{ maxWidth: 400, padding: '0px 5px', marginBottom: 20 }} />
              )}
            </div>
          </div>);
        })}
        {/* <div className="mt-5 mx-0">
        {aIFrames.map((data: any, i) => {
          console.log(data);
          return (
            <div
              className="row mx-0"
              key={i}
              // style={{
              //   position: "relative",
              // }}
            >
              <h4>{data.cameraName}</h4>

              {data.alertInfo &&
                data.alertInfo.map((data: any, index: any) => {
                  console.log("image");
                  console.log(data);
                  return (
                    <div
                      className="col-md-3 mb-3 px-2"
                      key={index}
                      style={{
                        position: "relative",
                      }}
                    >
                      <ImageBox data={data} aIPolygen={""} />
                    </div>
                  );
                })}
            </div>
          );
        })}
      </div> */}


        <div className="row mt-5 mx-0">
          {/* {aIFrames &&
          aIFrames.map((data: any, i) => {
            return (
              <>
                {data?.isShowFlag && <div className="row mt-5 mx-0">

                  <h2>{data.cameraName}</h2>
                  {data.cameraDetail.map((detail: any, index: any) => (
                    <>{detail?.Results?.length > 0 && <div
                      className="col-md-3 mb-3 px-2"
                      key={index}
                      style={{
                        position: "relative",
                      }}
                    >
                      <ImageBox data={detail} aIPolygen={""} />

                      <div className="bottom-content">
                        <div className="bottomTextContainer">
                          <p className="mb-0 parentText px-2">
                            {detail.Frame_Anomaly === null &&
                              detail.Object_Anomaly === null &&
                              "Alert"}

                            {detail.Frame_Anomaly === true && "Auto Alert"}
                            {detail.Object_Anomaly === true && "Auto Alert"}
                          </p>
                        </div>
                      </div>
                    </div>}</>
                  ))}
                </div>}
              </>
            );
          })} */}
        </div>

      </div>
    </Spin>
  );
};

export default RecentAlerts;
