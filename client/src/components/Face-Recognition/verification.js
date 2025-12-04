import React, { useState, useEffect, useRef } from "react";
import * as faceapi from "face-api.js";
import "./Verification.css";
import { useNavigate } from "react-router-dom";
import { RingLoader } from "react-spinners";
import { css } from "@emotion/react";

const Verification = () => {
  const videoHeight = 480;
  const videoWidth = 640;
  const [initializing, setInitializing] = useState(true);
  const [message, setMessage] = useState("");
  const videoRef = useRef();
  const canvasRef = useRef();
  const navigate = useNavigate();

  const stopVideoStream = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
    }
  };

  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = "./models";
      try {
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
          faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
          faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
          faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
          faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL),
        ]);
        startVideo();
      } catch (error) {
        console.error("Error loading models:", error);
        setMessage("Failed to load face recognition models.");
        setInitializing(false);
      }
    };
    loadModels();

    return () => {
      stopVideoStream();
    };
  }, []);

  const startVideo = () => {
    navigator.mediaDevices
      .getUserMedia({ video: {} })
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      })
      .catch((err) => {
        console.error("Error accessing webcam:", err);
        setMessage("Failed to access webcam.");
        setInitializing(false);
      });
  };

  const handleVideoOnPlay = async () => {
    if (videoRef.current.readyState < 2) {
      videoRef.current.addEventListener("loadedmetadata", () => {
        startFaceDetection();
      });
      return;
    }
    startFaceDetection();
  };

  const startFaceDetection = async () => {
    const canvas = faceapi.createCanvasFromMedia(videoRef.current);
    canvasRef.current.innerHTML = "";
    canvasRef.current.appendChild(canvas);

    const displaySize = { width: videoWidth, height: videoHeight };
    faceapi.matchDimensions(canvas, displaySize);

    const labeledFaceDescriptors = await loadLabeledImages();
    if (!labeledFaceDescriptors) {
      setMessage(
        "Failed to load reference face. Please ensure a valid profile image is provided."
      );
      setInitializing(false);
      navigate("/login");
      return;
    }

    const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors, 0.6);

    const regInterval = setInterval(async () => {
      try {
        const detections = await faceapi
          .detectAllFaces(
            videoRef.current,
            new faceapi.TinyFaceDetectorOptions()
          )
          .withFaceLandmarks()
          .withFaceDescriptors()
          .withFaceExpressions();

        const resizedDetections = faceapi.resizeResults(
          detections,
          displaySize
        );

        const context = canvas.getContext("2d");
        context.clearRect(0, 0, videoWidth, videoHeight);

        faceapi.draw.drawDetections(canvas, resizedDetections);
        faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);

        const results = resizedDetections.map((d) =>
          faceMatcher.findBestMatch(d.descriptor)
        );

        results.forEach((result, i) => {
          const box = resizedDetections[i].detection.box;
          const drawBox = new faceapi.draw.DrawBox(box, {
            label: result.toString(),
          });
          drawBox.draw(canvas);
        });

        const expectedLabel = sessionStorage.getItem("name")?.split(" ")[0];
        if (results[0]?._label === expectedLabel) {
          setMessage("Face verified successfully.");
          stopVideoStream();
          clearInterval(regInterval);
          navigate("/voter/dashboard");
        } else {
          setMessage("Face could not be verified.");
          stopVideoStream();
          clearInterval(regInterval);

          setTimeout(() => {
            navigate("/login");
          }, 2000);
        }
      } catch (error) {
        console.error("Error during face detection:", error);
        setMessage("Error during face verification.");
        clearInterval(regInterval);
        stopVideoStream();
      }
    }, 2000);

    return () => clearInterval(regInterval);
  };

  const loadLabeledImages = async () => {
    const label = sessionStorage.getItem("name")?.split(" ")[0];
    const imageURL = sessionStorage.getItem("pictureURL");

    if (!label || !imageURL) {
      console.error("Missing sessionStorage data:", { label, imageURL });
      setMessage("User data not found. Please log in again.");
      return null;
    }

    try {
      const response = await fetch(imageURL, { method: "HEAD" });
      if (!response.ok) {
        console.error("Invalid image URL:", imageURL);
        setMessage("Profile image is inaccessible.");
        return null;
      }

      const img = await faceapi.fetchImage(imageURL);
      const detections = await faceapi
        .detectSingleFace(img, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceDescriptor();

      if (!detections) {
        console.error("No face detected in reference image:", imageURL);
        setMessage(
          "No face detected in the provided image. Please upload a clear face image."
        );
        return null;
      }

      return [
        new faceapi.LabeledFaceDescriptors(label, [detections.descriptor]),
      ];
    } catch (error) {
      console.error("Error loading labeled images:", error);
      setMessage(`Failed to load reference face: ${error.message}`);
      return null;
    }
  };

  const override = css`
    display: block;
    margin: 0 auto;
    border-color: red;
  `;
  const color = "#101C03";

  return (
    <div className="detection">
      <span>
        {initializing && (
          <RingLoader
            color={color}
            loading={initializing}
            css={override}
            size={100}
          />
        )}
        <span className="alert">{message}</span>
      </span>
      <div className="display-flex justify-content-center">
        <video
          ref={videoRef}
          autoPlay
          muted
          height={videoHeight}
          width={videoWidth}
          onPlay={handleVideoOnPlay}
        />
        <canvas ref={canvasRef} className="position-absolute" />
      </div>
    </div>
  );
};

export default Verification;
