import React, { useState } from "react";
import ReactDOMServer from "react-dom/server";
import pointInPolygon from 'point-in-polygon';
// import data from "../data";

const ImageBox = ({ data, aIPolygen }) => {
  const [list, setList] = useState([]);

  function encodeSvg(reactElement) {
    return (
      "data:image/svg+xml," +
      escape(ReactDOMServer.renderToStaticMarkup(reactElement))
    );
  }
  const getImage = (data) => {
    let arr=[
      [158, 18],
      [300, 20],
      [500, 251],
      [154, 210],
      [147, 114]
    ];
    // console.log('results',data["Results"]);
    // console.log('results 2 x',data["Results"][0].x);
    const image = (
      <svg 
        xmlns="http://www.w3.org/2000/svg"
        width={640}
        height={360}
      >
        <image href={data["base_url"]} width="100%"  />
        {data["Results"].map((Results,index) => {
          // let arr2=[
          //   [Results.h[0],Results.h[1]],
          //   [Results.w[0],Results.w[1]],
          //   [Results.x[0],Results.x[1]],
          //   [Results.y[0],Results.y[1]],
          // ];
          let arr2=[
            [Results.h],
            [Results.w],
            [Results.x],
            [Results.y],
          ];
          console.log('arr2',arr2);
          let status=pointInPolygon(aIPolygen,arr2);
          return(
            <>
              <polygon
                key={index}
                points={`${Results.x[0]} ${Results.x[1]},${Results.y[0]} ${Results.y[1]} ,${Results.w[0]} ${Results.w[1]},${Results.h[0]} ${Results.h[1]}`}
                style={{ fill: "transparent", stroke: "blue", strokeWidth: 4 }}
              />
              <text 
                textAnchor="middle" 
                fontSize={35} 
                x={Number(Results.x[0]+40)} 
                y={Number(Results.x[1]-20)} 
                fill="blue"
                style={{textTransform:'capitalize'}}
              >{Results.label}</text>
            </>
          )})}
          {/* <polygon
            points={arr}
            style={{fill:"transparent",stroke:"green",strokeWidth:4}}
          /> */}
          <polygon
            points={aIPolygen}
            style={{ fill: "transparent", stroke: "yellow", strokeWidth: 4 }}
          />
      </svg>
    );
    return (
      <img
        src={encodeSvg(image)}
        style={{width:'100%',borderRadius:3}}
      />
    );
  };

  return (
    <div>
      <div>{getImage(data)}</div>
    </div>
  );
};

export default ImageBox;
