import React, { useState, useEffect } from "react";
import { Stage, Layer, Group, Line, Rect, Image } from "react-konva";
import Konva from "konva";
import useImage from "use-image";
import { coordinatesSelected } from "../../../global_store/reducers/investigationReducer";
import { useDispatch } from "react-redux";

const CanvasDraw = ({ imageUrl, setAIPolygen, width, height }) => {
  let dispatch = useDispatch();
  const [points, setPoints] = useState([]);
  const [curMousePos, setCurMousePos] = useState([0, 0]);
  const [isMouseOverStartPoint, setIsMouseOverStartPoint] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const LionImage = () => {
    const [image] = useImage(imageUrl);
    return <Image image={image} x={0} y={0} width="750" height="400" />;
  };

  useEffect(() => {
    console.log(
      'imageUrl',imageUrl
    );
    // console.log("points", points);
    // console.log("curMousePos", curMousePos);
    // console.log("isMouseOverStartPoint", isMouseOverStartPoint);
    // console.log("isFinished", isFinished);
    if (isMouseOverStartPoint === true) {
      setAIPolygen(() => points);
    }

    // for (let i = 0; i < points.length; i++) {
    //   console.log("points", points[i]);
    // }
  }, [points, isMouseOverStartPoint]);

  const getMousePos = (stage) => {
    return [stage.getPointerPosition().x, stage.getPointerPosition().y];
  };

  const handleClick = (event) => {
    const stage = event.target.getStage();
    const mousePos = getMousePos(stage);
    // console.log("isMouseOverStartPoint");
    // console.log(isMouseOverStartPoint);
    dispatch(coordinatesSelected(isMouseOverStartPoint));
    if (isFinished) {
      return;
    }
    if (isMouseOverStartPoint && points.length >= 3) {
      setIsFinished(true);
    } else {
      setPoints([...points, mousePos]);
    }
  };

  const handleMouseMove = (event) => {
    const stage = event.target.getStage();
    const mousePos = getMousePos(stage);
    setCurMousePos(() => mousePos);
  };

  const handleMouseOverStartPoint = (event) => {
    if (isFinished || points.length < 3) return;
    event.target.scale({ x: 2, y: 2 });

    setIsMouseOverStartPoint(true);
  };

  const handleMouseOutStartPoint = (event) => {
    event.target.scale({ x: 1, y: 1 });
    setIsMouseOverStartPoint(false);
  };

  const handleDragStartPoint = (event) => {
    console.log("start", event);
  };

  const handleDragMovePoint = (event) => {
    const index = event.target.index - 1;
    console.log(event.target);
    const pos = [event.target.attrs.x, event.target.attrs.y];
    console.log("move", event);
    console.log(pos);
    setPoints([...points.slice(0, index), pos, ...points.slice(index + 1)]);
  };

  const handleDragOutPoint = (event) => {
    console.log("end", event);
  };

  const handleDragEndPoint = (event) => {
    console.log("end", event);
  };

  const flattenedPoints = points
    .concat(isFinished ? [] : curMousePos)
    .reduce((a, b) => a.concat(b), []);

  return (
    <>
      <Stage
        width={640}
        height={360}
        onMouseDown={handleClick}
        onMouseMove={handleMouseMove}
        style={{
          backgroundImage: `url(${imageUrl})`,
          backgroundSize: "640px 360px",
          backgroundRepeat: "no-repeat",
        }}
      >
        <Layer>
          {/* <LionImage /> */}
          <Line
            points={flattenedPoints}
            stroke="yellow"
            strokeWidth={5}
            closed={isFinished}
          />

          {points.map((point, index) => {
            const width = 6;
            const x = point[0] - width / 2;
            const y = point[1] - width / 2;
            const startPointAttr =
              index === 0
                ? {
                  hitStrokeWidth: 12,
                  onMouseOver: handleMouseOverStartPoint,
                  onMouseOut: handleMouseOutStartPoint,
                }
                : null;
            return (
              <Rect
                key={index}
                x={x}
                y={y}
                width={width}
                height={width}
                fill="white"
                stroke="yellow"
                strokeWidth={3}
                onDragStart={handleDragStartPoint}
                onDragMove={handleDragMovePoint}
                onDragEnd={handleDragEndPoint}
                draggable
                {...startPointAttr}
              />
            );
          })}
        </Layer>
      </Stage>
    </>
  );
};

export default React.memo(CanvasDraw);
