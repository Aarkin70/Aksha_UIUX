import React, { useState } from "react";
import ReactDOMServer from "react-dom/server";
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
    const image = (
      <svg 
        height="100%" 
        xmlns="http://www.w3.org/2000/svg"
        style={{maxWidth:640}}
      >
        <image href={data["base_url"]} width="100%"  />
        <polygon
          points={data["Results"]}
          style={{ fill: "transparent", stroke: "blue", strokeWidth: 4 }}
        />

        <polygon
          points={aIPolygen}
          style={{ fill: "transparent", stroke: "yellow", strokeWidth: 4 }}
        />
      </svg>
    );
    return (
      <img
        src={encodeSvg(image)}
        style={{width: "100%",borderRadius:3}}
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
