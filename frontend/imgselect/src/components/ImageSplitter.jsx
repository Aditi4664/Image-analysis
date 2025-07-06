import React, { useRef, useState, useEffect } from "react";
import { Button } from "@mui/material";
import { UploadFile, Refresh } from "@mui/icons-material";
import { analyzeImageParts } from "../apiClient"; // Adjust path if necessary
import { CircularProgress, Paper, Typography } from "@mui/material";



const ImageSplitter = () => {
  const [imageSrc, setImageSrc] = useState(null);
  const [clicks, setClicks] = useState([]);
  const imageRef = useRef(null);
  const canvasRef = useRef(null);
  const [splitImages, setSplitImages] = useState({ left: null, right: null });
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [clearpage, setClearpage] = useState(false);


    const handleSubmit = async () => {
    if (!splitImages.left || !splitImages.right || !prompt.trim()) {
      console.log("Either of the images or prompt missing");
      return;
    }

    setLoading(true);
    setResponse(null);
    setClearpage(false);

    try {
      const result = await analyzeImageParts({
        leftImage: splitImages.left,
        rightImage: splitImages.right,
        prompt: prompt.trim(),
      });
      setResponse(result);  // Save response to show in UI
      console.log("API response:", result);
    } catch (err) {
      console.error("Failed to analyze image:", err);
      setResponse({ error: "Failed to analyze image. Please try again." });
    } finally {
      setLoading(false);
    }
    };


  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImageSrc(url);
      setClicks([]);
      setSplitImages({ left: null, right: null });
    }
  };

 const handleCanvasClick = (e) => {
  if (!imageRef.current || !canvasRef.current) return;

  const canvas = canvasRef.current;
  const rect = canvas.getBoundingClientRect();

  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;

  const x = (e.clientX - rect.left) * scaleX;
  const y = (e.clientY - rect.top) * scaleY;

  const newClicks = [...clicks, { x, y }];
  setClicks(newClicks);

  if (newClicks.length === 2) {
    drawOverlay(newClicks);
    splitImage(newClicks);
  } else {
    drawOverlay(newClicks);
  }
};


  const drawImage = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const img = imageRef.current;

    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);
  };

  const extendLineToImageBorders = (p1, p2, width, height) => {
  if (!p1 || !p2) {
    // If either point is missing, return just the existing point(s)
    // or some fallback to avoid errors.
    // For example, if only p1 exists, return p1 twice (no line extension)
    if (p1) return [p1, p1];
    // if p1 is also undefined (shouldn't happen), return empty array or something safe
    return [];
  }

  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;

  if (dx === 0) {
    // vertical line
    return [
      { x: p1.x, y: 0 },
      { x: p1.x, y: height },
    ];
  }

  const slope = dy / dx;
  const intercept = p1.y - slope * p1.x;

  const points = [];

  // Left border (x = 0)
  let yAtLeft = intercept;
  if (yAtLeft >= 0 && yAtLeft <= height) points.push({ x: 0, y: yAtLeft });

  // Right border (x = width)
  let yAtRight = slope * width + intercept;
  if (yAtRight >= 0 && yAtRight <= height) points.push({ x: width, y: yAtRight });

  // Top border (y = 0)
  let xAtTop = -intercept / slope;
  if (xAtTop >= 0 && xAtTop <= width) points.push({ x: xAtTop, y: 0 });

  // Bottom border (y = height)
  let xAtBottom = (height - intercept) / slope;
  if (xAtBottom >= 0 && xAtBottom <= width) points.push({ x: xAtBottom, y: height });

  if (points.length >= 2) {
    return [points[0], points[1]];
  } else {
    return [p1, p2]; // fallback
  }
};


  // const drawOverlay = ([p1, p2]) => {
  //   const canvas = canvasRef.current;
  //   const ctx = canvas.getContext("2d");
  //   const img = imageRef.current;

  //   ctx.clearRect(0, 0, canvas.width, canvas.height);
  //   ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

  //   // Draw points
  //   [p1, p2].forEach((pt) => {
  //     ctx.beginPath();
  //     ctx.arc(pt.x, pt.y, 5, 0, 2 * Math.PI);
  //     ctx.fillStyle = "red";
  //     ctx.fill();
  //   });

  //   // Extend line and draw
  //   const [ext1, ext2] = extendLineToImageBorders(p1, p2, canvas.width, canvas.height);

  //   ctx.beginPath();
  //   ctx.moveTo(ext1.x, ext1.y);
  //   ctx.lineTo(ext2.x, ext2.y);
  //   ctx.strokeStyle = "red";
  //   ctx.lineWidth = 2;
  //   ctx.stroke();
  // };

  const drawOverlay = (points) => {
  const canvas = canvasRef.current;
  const ctx = canvas.getContext("2d");
  const img = imageRef.current;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

  // Draw all available points safely
  points.forEach((pt) => {
    if (!pt) return;
    ctx.beginPath();
    ctx.arc(pt.x, pt.y, 5, 0, 2 * Math.PI);
    ctx.fillStyle = "red";
    ctx.fill();
  });

  // Only draw extended line if we have 2 points
  if (points.length === 2) {
    const [p1, p2] = points;
    const [ext1, ext2] = extendLineToImageBorders(p1, p2, canvas.width, canvas.height);

    ctx.beginPath();
    ctx.moveTo(ext1.x, ext1.y);
    ctx.lineTo(ext2.x, ext2.y);
    ctx.strokeStyle = "red";
    ctx.lineWidth = 2;
    ctx.stroke();
  }
};

  const splitImage = ([p1, p2]) => {
  const img = imageRef.current;
  const width = img.width;
  const height = img.height;

  const canvasLeft = document.createElement("canvas");
  const canvasRight = document.createElement("canvas");
  canvasLeft.width = width;
  canvasLeft.height = height;
  canvasRight.width = width;
  canvasRight.height = height;

  const ctxLeft = canvasLeft.getContext("2d");
  const ctxRight = canvasRight.getContext("2d");

  const [ext1, ext2] = extendLineToImageBorders(p1, p2, width, height);

  const allCorners = [
    { x: 0, y: 0 },
    { x: width, y: 0 },
    { x: width, y: height },
    { x: 0, y: height },
  ];

  const side = (pt) =>
    (ext2.x - ext1.x) * (pt.y - ext1.y) - (ext2.y - ext1.y) * (pt.x - ext1.x);

  const leftPolygon = [ext1];
  const rightPolygon = [ext1];

  for (let i = 0; i < allCorners.length; i++) {
    const pt = allCorners[i];
    if (side(pt) < 0) {
      leftPolygon.push(pt);
    } else {
      rightPolygon.push(pt);
    }
  }

  leftPolygon.push(ext2);
  rightPolygon.push(ext2);

  // Draw left half
  ctxLeft.save();
  ctxLeft.beginPath();
  ctxLeft.moveTo(leftPolygon[0].x, leftPolygon[0].y);
  leftPolygon.forEach((pt) => ctxLeft.lineTo(pt.x, pt.y));
  ctxLeft.closePath();
  ctxLeft.clip();
  ctxLeft.drawImage(img, 0, 0);
  ctxLeft.restore();

  // Draw right half
  ctxRight.save();
  ctxRight.beginPath();
  ctxRight.moveTo(rightPolygon[0].x, rightPolygon[0].y);
  rightPolygon.forEach((pt) => ctxRight.lineTo(pt.x, pt.y));
  ctxRight.closePath();
  ctxRight.clip();
  ctxRight.drawImage(img, 0, 0);
  ctxRight.restore();

  setSplitImages({
    left: canvasLeft.toDataURL(),
    right: canvasRight.toDataURL(),
  });
};

const clearSelection = () => {
  setImageSrc(null);
  setClearpage(true);
  setSplitImages({ left: null, right: null });
  if (canvasRef.current) {
    const ctx = canvasRef.current.getContext("2d");
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
  }
};

 return (
  <div className="space-y-6">
    <div>
      <label className="block mb-2 font-medium">Select image for analyzing: </label>
      <Button
        variant="outlined"
        component="label"
        startIcon={<UploadFile />}
        >
        Select Image for Analyzing
        <input type="file" accept="image/*" hidden onChange={handleImageUpload} />
      </Button>&nbsp; &nbsp;
      {imageSrc && (
            <Button
              variant="outlined"
              color="error"
              startIcon={<Refresh />}
              onClick={clearSelection}
            >
              Clear Selection
            </Button>
          )}
    </div>
    <br/>

    {imageSrc && (
      <div className="mt-4 text-center">
        <img
          src={imageSrc}
          alt="original"
          ref={imageRef}
          onLoad={drawImage}
          style={{ display: "none" }}
        />
        <canvas
          ref={canvasRef}
          onClick={handleCanvasClick}
          style={{
            border: "2px solid black",
            cursor: "crosshair",
            maxWidth: "100%",
            height: "auto",
            width: "500px",
          }}
        />
      </div>
    )}

    {splitImages.left && (
      <div className="flex flex-col gap-4 items-center">
        <div className="text-center">
          <p className="font-semibold mb-1">1st Half</p>
          <img
            src={splitImages.left}
            alt="1st-half"
            style={{
              border: "2px solid black",
              maxWidth: "100%",
              width: "500px",
              height: "auto",
            }}
          />
        </div>
        <div className="text-center">
          <p className="font-semibold mb-1">2nd Half</p>
          <img
            src={splitImages.right}
            alt="2nd-half"
            style={{
              border: "2px solid black",
              maxWidth: "100%",
              width: "500px",
              height: "auto",
            }}
          />
        </div>

        <div className="w-full max-w-[500px] mt-4">
          <br/>
          <label className="block mb-2 font-medium">Enter your query about the image parts:</label>
          <br/>
          <br/>
           <textarea
              className="w-100 h-36 border border-gray-300 rounded px-3 py-2 resize-none"
              placeholder="e.g. What is the difference between the two sections?"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
           />
          </div>
            <button
            onClick={handleSubmit}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
            Analyze
            </button>
          </div> 
          
    )}
        <div className="w-full text-center space-y-4">
      {loading && (
        <div>
          <CircularProgress color="primary" />
          <Typography variant="body2" color="textSecondary">
            Analyzing the image, please wait...
          </Typography>
        </div>
      )}

      {!loading && response && !clearpage && (
        <Paper elevation={3} className="p-4 max-w-xl mx-auto">
          <Typography variant="h6">Response from API:</Typography>
          <pre style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
            {typeof response === "string"
              ? response
              : JSON.stringify(response, null, 2)}
          </pre>
        </Paper>
      )}
    </div>

  </div>
  
);

};

export default ImageSplitter;
