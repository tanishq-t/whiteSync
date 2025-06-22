/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import rough from "roughjs";
import { useContext, useEffect, useState } from "react";
import { EraserSizeContext } from "../../context/EraserSize";
// import { useNavigate } from "react-router-dom";

function isMobileDevice() {
  const regex =
    /Mobi|Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
  return regex.test(navigator.userAgent);
}

export const WhiteBoard = ({
  canvasRef,
  ctxRef,
  elements,
  setElements,
  tool,
  color,
  socket,
  user,
}) => {
  // const navigate = useNavigate();

  user = user?.roomId
    ? user
    : JSON.parse(localStorage.getItem("socketUserData"));

  const { eraserSize } = useContext(EraserSizeContext);
  const [isDrawing, setIsdrawing] = useState(false);
  const [isMobile, setIsMobile] = useState(isMobileDevice());
  const [isConnected, setIsConnected] = useState(false);

  // Checking for Mobile Device
  useEffect(() => {
    console.log(isMobile);
    setIsMobile(isMobileDevice());
  }, [navigator.userAgent]);

  // Socket connection status
  useEffect(() => {
    if (socket) {
      socket.on("connect", () => setIsConnected(true));
      socket.on("disconnect", () => setIsConnected(false));
      setIsConnected(socket.connected);
    }
  }, [socket]);

  //getting the canvas referance and context on component Mount
  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.height = window.innerHeight * 0.89;
    canvas.width = window.innerWidth - 60; // Account for margins
    const ctx = canvas.getContext("2d");

    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.lineCap = "round";

    ctxRef.current = ctx;
  }, []);

  useEffect(() => {
    const roughCanvas = rough.canvas(canvasRef.current);
    console.log("whiteboard");

    socket.on("onDrawPencil", ({ path, strokeColor }) => {
      console.log("onDrawPencil called");
      roughCanvas.linearPath(path, {
        roughness: 0,
        stroke: strokeColor,
        strokeWidth: 1,
      });
    });

    socket.on("onDrawLine", ({ x1, y1, x2, y2, strokeColor }) => {
      console.log("onDrawLine called");
      roughCanvas.line(x1, y1, x2, y2, {
        roughness: 0,
        stroke: strokeColor,
        strokeWidth: 1,
      });
    });

    socket.on("onDrawRect", ({ x1, y1, x2, y2, strokeColor }) => {
      console.log("onDrawRect called");
      roughCanvas.rectangle(x1, y1, x2, y2, {
        roughness: 0,
        stroke: strokeColor,
        strokeWidth: 1,
      });
    });

    socket.on("onErase", ({ x1, y1, x2, y2 }) => {
      console.log("onErase called");

      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");

      ctx.clearRect(x1, y1, x2, y2);
    });
  }, [elements, socket]);

  useEffect(() => {
    // Check if this is the first load by seeing if our object exists in local storage
    if (localStorage.getItem("firstLoadDone") === null) {
      // If it's the first load, set the flag in local storage to true and reload the page
      localStorage.setItem("firstLoadDone", 1);
    } else {
      localStorage.removeItem("firstLoadDone");
      // navigate("/form/leave");
    }
  }, []);

  // Touch Events for Mobile
  const handleTouchStart = (e) => {
    if (isMobile) {
      e.preventDefault(); // Prevent scrolling
      const touch = e.touches[0];
      const rect = canvasRef.current.getBoundingClientRect();
      handleMouseDown(touch.clientX - rect.left, touch.clientY - rect.top);
    }
  };

  const handleTouchMove = (e) => {
    if (isMobile) {
      e.preventDefault(); // Prevent scrolling
      const touch = e.touches[0];
      const rect = canvasRef.current.getBoundingClientRect();
      handleMouseMove(touch.clientX - rect.left, touch.clientY - rect.top);
    }
  };

  const handleTouchEnd = (e) => {
    if (isMobile) {
      e.preventDefault(); // Prevent scrolling
      const touch = e.changedTouches[0];
      const rect = canvasRef.current.getBoundingClientRect();
      handleMouseUp(touch.clientX - rect.left, touch.clientY - rect.top);
    }
  };

  //<----------Mouse events handles starts here---------- !>

  //< *MouseDown event / start of drawing event  !>
  const handleMouseDown = (offsetX, offsetY) => {
    //<----------------------- Pencil -------------------------------->
    if (tool === "pencil") {
      console.log("mouse down" + "(" + offsetX + "," + offsetY + ")");
      setElements((prevElem) => [
        ...prevElem,
        {
          type: "pencil",
          offsetX,
          offsetY,
          path: [[offsetX, offsetY]],
          strokeColor: color,
        },
      ]);
    }

    //<------------------------- Line -------------------------------->
    if (tool === "line") {
      console.log("mouse down" + "(" + offsetX + "," + offsetY + ")");
      setElements((prevElem) => [
        ...prevElem,
        {
          type: "line",
          offsetX,
          offsetY,
          strokeWidth: undefined,
          strokeHeight: undefined,
          strokeColor: color,
        },
      ]);
    }

    //<---------------------------- Rectangle -------------------------------->
    if (tool === "rect") {
      console.log("mouse down" + "(" + offsetX + "," + offsetY + ")");
      setElements((prevElem) => [
        ...prevElem,
        {
          type: "rect",
          offsetX,
          offsetY,
          strokeColor: color,
        },
      ]);
    }
    setIsdrawing(true);
  };

  // MouseMove event / Drawing is on progress --------------------------------
  const handleMouseMove = (offsetX, offsetY) => {
    if (isDrawing) {
      const roughCanvas = rough.canvas(canvasRef.current);
      //---Pencil---
      if (tool === "pencil") {
        //getting the path of the recent element
        const path = elements[elements.length - 1].path;
        const newPath = [...path, [offsetX, offsetY]];
        const strokeColor = elements[elements.length - 1].strokeColor;

        //update the recent path
        setElements((prevElm) => {
          return prevElm.map((element, index) => {
            if (index === elements.length - 1) {
              return {
                ...element,
                path: newPath,
              };
            } else {
              return element;
            }
          });
        });

        socket.emit("drawPencil", {
          path: newPath,
          strokeColor: strokeColor,
          roomId: user?.roomId,
        });

        //draw the path
        roughCanvas.linearPath(newPath, {
          roughness: 0,
          stroke: color,
          strokeWidth: 1,
        });
      }
      // Eraser
      if (tool === "eraser") {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        const newPath = [
          offsetX - eraserSize / 2,
          offsetY - eraserSize / 2,
          eraserSize,
          eraserSize,
        ];

        socket.emit("erase", { path: newPath, roomId: user?.roomId });

        ctx.clearRect(
          offsetX - eraserSize / 2,
          offsetY - eraserSize / 2,
          eraserSize,
          eraserSize
        );
      }
    }
  };

  //MouseUp event / End of drawing event
  const handleMouseUp = (offsetX, offsetY) => {
    const roughCanvas = rough.canvas(canvasRef.current);

    console.log("mouse up" + "(" + offsetX + "," + offsetY + ")");

    //---Line---
    if (tool === "line") {
      const lastOffsetX = elements[elements.length - 1].offsetX;
      const lastOffsetY = elements[elements.length - 1].offsetY;
      const newPath = [lastOffsetX, lastOffsetY, offsetX, offsetY];
      console.log("mouse move" + "(" + offsetX + "," + offsetY + ")");

      const strokeColor = elements[elements.length - 1].strokeColor;

      //ref - line (x1, y1, x2, y2 [, options]) || setting the x2 and y2 as current positions
      setElements((prevElm) => {
        return prevElm.map((element, index) => {
          if (index === elements.length - 1) {
            return {
              ...element,
              strokeWidth: offsetX,
              strokeHeight: offsetY,
            };
          } else {
            return element;
          }
        });
      });
      socket.emit("drawLine", {
        path: newPath,
        strokeColor: strokeColor,
        roomId: user?.roomId,
      });
      roughCanvas.line(lastOffsetX, lastOffsetY, offsetX, offsetY, {
        roughness: 0,
        stroke: color,
        strokeWidth: 1,
      });
    }

    //Rectangle
    if (tool === "rect") {
      const lastOffsetX = elements[elements.length - 1].offsetX;
      const lastOffsetY = elements[elements.length - 1].offsetY;
      const newPath = [
        lastOffsetX,
        lastOffsetY,
        offsetX - lastOffsetX,
        offsetY - lastOffsetY,
      ];
      console.log("mouse move" + "(" + offsetX + "," + offsetY + ")");

      const strokeColor = elements[elements.length - 1].strokeColor;

      //ref - rectangle (x1, y1, x2, y2 [, options]) || setting the x2 and y2 as current positions
      setElements((prevElm) => {
        return prevElm.map((element, index) => {
          if (index === elements.length - 1) {
            return {
              ...element,
              strokeWidth: offsetX,
              strokeHeight: offsetY,
            };
          } else {
            return element;
          }
        });
      });
      socket.emit("drawRect", {
        path: newPath,
        strokeColor: strokeColor,
        roomId: user?.roomId,
      });
      roughCanvas.rectangle(
        lastOffsetX,
        lastOffsetY,
        offsetX - lastOffsetX,
        offsetY - lastOffsetY,
        { roughness: 0, stroke: color, strokeWidth: 1 }
      );
    }

    setIsdrawing(false);
  };

  //<----------Mouse events handles ends here---------- !>
  return (
    <div className="relative w-full h-full bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Connection Status Indicator */}
      <div className={`absolute top-3 right-3 z-50 px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider backdrop-blur-sm border shadow-lg transition-all duration-300 ${
        isConnected 
          ? 'bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border-emerald-500/30 text-emerald-600 shadow-emerald-500/20' 
          : 'bg-gradient-to-r from-amber-500/20 to-orange-500/20 border-amber-500/30 text-amber-600 shadow-amber-500/20 animate-pulse'
      }`}>
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${
            isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500 animate-ping'
          }`}></div>
          {isConnected ? "Connected" : "Connecting..."}
        </div>
      </div>

      {/* Canvas/Whiteboard */}
      <div
        className={`relative w-full h-full rounded-xl overflow-hidden bg-gradient-to-br from-white via-slate-50 to-blue-50 shadow-inner border-2 border-slate-200/50 ${
          tool === 'pencil' ? 'cursor-crosshair' :
          tool === 'line' ? 'cursor-crosshair' :
          tool === 'rect' ? 'cursor-crosshair' :
          tool === 'eraser' ? 'cursor-pointer' : 'cursor-default'
        }`}
        data-tool={tool}
        onMouseDown={(e) =>
          handleMouseDown(e.nativeEvent.offsetX, e.nativeEvent.offsetY)
        }
        onMouseMove={(e) =>
          handleMouseMove(e.nativeEvent.offsetX, e.nativeEvent.offsetY)
        }
        onMouseUp={(e) =>
          handleMouseUp(e.nativeEvent.offsetX, e.nativeEvent.offsetY)
        }
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-30 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/30 via-transparent to-purple-50/30"></div>
          <div className="absolute top-10 right-10 w-32 h-32 bg-gradient-to-br from-blue-200/20 to-indigo-200/20 rounded-full blur-2xl"></div>
          <div className="absolute bottom-10 left-10 w-24 h-24 bg-gradient-to-br from-purple-200/20 to-pink-200/20 rounded-full blur-xl"></div>
        </div>

        {/* Canvas Element */}
        <canvas 
          ref={canvasRef} 
          className="relative z-10"
        />

        {/* Tool Indicator */}
        <div className="absolute bottom-3 left-3 z-30 px-3 py-2 bg-gradient-to-r from-slate-800/80 to-slate-900/80 backdrop-blur-sm border border-slate-600/50 rounded-lg shadow-lg">
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${
              tool === 'pencil' ? 'bg-blue-500' :
              tool === 'line' ? 'bg-green-500' :
              tool === 'rect' ? 'bg-purple-500' :
              tool === 'eraser' ? 'bg-red-500' : 'bg-slate-500'
            }`}></div>
            <span className="text-slate-300 text-sm font-medium capitalize">
              {tool}
            </span>
            {tool === 'eraser' && (
              <span className="text-slate-400 text-xs">
                ({eraserSize}px)
              </span>
            )}
          </div>
        </div>

        {/* Color Indicator */}
        <div className="absolute bottom-3 right-3 z-30 px-3 py-2 bg-gradient-to-r from-slate-800/80 to-slate-900/80 backdrop-blur-sm border border-slate-600/50 rounded-lg shadow-lg">
          <div className="flex items-center gap-2">
            <div 
              className="w-4 h-4 rounded-full border-2 border-slate-400 shadow-sm"
              style={{ backgroundColor: color }}
            ></div>
            <span className="text-slate-300 text-sm font-medium">
              {color}
            </span>
          </div>
        </div>
      </div>

      {/* For debugging purpose */}
      {/* {JSON.stringify(elements)} */}
    </div>
  );
};