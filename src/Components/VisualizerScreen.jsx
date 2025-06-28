// import React, { useRef, useState, Suspense, useEffect } from "react";
// import { Canvas, useThree, useFrame, useLoader } from "@react-three/fiber";
// import { OrbitControls } from "@react-three/drei";
// import { useGLTF } from "@react-three/drei";
// import { OBJLoader } from "three-stdlib";
// import { useNavigate } from "react-router-dom";
// import * as THREE from "three";
// import filesApi from "../Services/fileroute";

// class ErrorBoundary extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = { hasError: false };
//   }
//   static getDerivedStateFromError(error) {
//     return { hasError: true };
//   }
//   componentDidCatch(error, info) {
//     console.error("Canvas Error:", error, info);
//   }
//   render() {
//     if (this.state.hasError) {
//       return <h2>Something went wrong while loading the 3D Canvas.</h2>;
//     }
//     return this.props.children;
//   }
// }

// const ModelViewer = ({ modelUrl, rotation, onLoaded }) => {
//   const extension = modelUrl.split(".").pop().toLowerCase();
//   let model;
//   if (extension === "glb" || extension === "gltf") {
//     model = useGLTF(modelUrl);
//   } else if (extension === "obj") {
//     model = useLoader(OBJLoader, modelUrl);
//   }

//   const modelRef = useRef();

//   useEffect(() => {
//     if (modelRef.current) {
//       modelRef.current.rotation.x = rotation.x;
//       modelRef.current.rotation.y = rotation.y;
//       modelRef.current.rotation.z = rotation.z;
//     }
//   }, [rotation]);

//   useEffect(() => {
//     if (onLoaded) onLoaded();
//   }, [model]);

//   return <primitive object={model.scene || model} ref={modelRef} />;
// };

// const CameraController = ({ position }) => {
//   const { camera } = useThree();
//   useFrame(() => {
//     camera.position.lerp(new THREE.Vector3(...position), 0.1);
//     camera.lookAt(0, 0, 0);
//   });
//   return null;
// };

// const VisualizerScreen = () => {
//   const navigate = useNavigate();
//   const inputRef = useRef();
//   const canvasRef = useRef();

//   const [modelUrl, setModelUrl] = useState(null);
//   const [cameraPos, setCameraPos] = useState([2, 2, 5]);
//   const [rotation, setRotation] = useState({ x: 0, y: 0, z: 0 });
//   const [pan, setPan] = useState({ x: 0, y: 0 });
//   const [zoom, setZoom] = useState(5);
//   const [libraryFiles, setLibraryFiles] = useState([]);
//   const [postObject, setPostObject] = useState(false);
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [selectedFileIndex, setSelectedFileIndex] = useState(null);
//   const [mode, setMode] = useState("");
//   const [isModelLoading, setIsModelLoading] = useState(false);

//   const fetchLibraryFiles = async () => {
//     try {
//       const userEmail = localStorage.getItem("userEmail");
//       const res = await filesApi.get(`/files/${userEmail}`);
//       setLibraryFiles(res.data.files || []);
//     } catch (err) {
//       console.error("Error fetching files:", err);
//     }
//   };

//   useEffect(() => {
//     fetchLibraryFiles();
//   }, []);

//   const handleFileUpload = async (event) => {
//     const file = event.target.files[0];
//     if (!file) return alert("No file selected.");

//     if (file.name.endsWith(".glb") || file.name.endsWith(".gltf") || file.name.endsWith(".obj")) {
//       setIsModelLoading(true);
//       const url = URL.createObjectURL(file);
//       setModelUrl(url);
//       setPostObject(true);
//       setMode("upload");
//       setSelectedFile(null);
//       setSelectedFileIndex(null);

//       try {
//         const userEmail = localStorage.getItem("userEmail");
//         const formData = new FormData();
//         formData.append("file", file);
//         formData.append(
//           "userinteraction",
//           JSON.stringify({
//             position: { x: "0", y: "0", z: "0" },
//             target: { x: "0", y: "0", z: "0" },
//             zoom: "5",
//             pan: { x: "0", y: "0" },
//           })
//         );

//         await filesApi.post(`/upload/${userEmail}`, formData, {
//           headers: { "Content-Type": "multipart/form-data" },
//         });
//         fetchLibraryFiles();
//         alert("File uploaded successfully.");
//       } catch (err) {
//         console.error("Upload Error:", err);
//       } finally {
//         setIsModelLoading(false);
//       }
//     } else {
//       alert("Please upload a .glb, .gltf, or .obj file only.");
//     }
//   };

//   const handleLibraryFileClick = (file, index) => {
//     setSelectedFile(file);
//     setSelectedFileIndex(index);
//     setPostObject(false);
//     setMode("library");
//     setIsModelLoading(true);
//     const fileUrl = `https://qul3dmodel.onrender.com${file.filepath}`;
//     setModelUrl(fileUrl);

//     if (file.user_interaction) {
//       try {
//         const interaction = file.user_interaction;
//         setCameraPos([
//           parseFloat(interaction.position.x),
//           parseFloat(interaction.position.y),
//           parseFloat(interaction.position.z),
//         ]);
//         setZoom(parseFloat(interaction.zoom));
//         setPan({
//           x: parseFloat(interaction.pan.x),
//           y: parseFloat(interaction.pan.y),
//         });
//         setRotation({
//           x: parseFloat(interaction.target.x),
//           y: parseFloat(interaction.target.y),
//           z: parseFloat(interaction.target.z),
//         });
//       } catch (err) {
//         console.error("Error parsing interaction:", err);
//         setCameraPos([2, 2, 5]);
//         setPan({ x: 0, y: 0 });
//         setZoom(5);
//         setRotation({ x: 0, y: 0, z: 0 });
//       }
//     } else {
//       setCameraPos([2, 2, 5]);
//       setPan({ x: 0, y: 0 });
//       setZoom(5);
//       setRotation({ x: 0, y: 0, z: 0 });
//     }
//   };

//   const handleCameraChange = (e) => {
//     const view = e.target.value;
//     if (view === "front") setCameraPos([0, 0, zoom]);
//     else if (view === "top") setCameraPos([0, zoom, 0]);
//     else if (view === "side") setCameraPos([zoom, 0, 0]);
//     else if (view === "pan") {
//       setPan((prev) => ({ x: prev.x + 1, y: prev.y }));
//     }
//   };

//   const rotateModel = (axis, angle) => {
//     setRotation((prev) => ({
//       ...prev,
//       [axis]: prev[axis] + angle,
//     }));
//   };

//   const zoomCamera = (type) => {
//     const delta = 0.5;
//     setZoom((prev) => {
//       const newZoom = type === "in" ? prev - delta : prev + delta;
//       setCameraPos((prevPos) => {
//         const newPos = [...prevPos];
//         newPos[2] += type === "in" ? -delta : delta;
//         return newPos;
//       });
//       return newZoom;
//     });
//   };

//   const handleModelLoaded = () => {
//     setIsModelLoading(false);
//   };

//   const handleSave = async () => {
//     const userEmail = localStorage.getItem("userEmail");
//     try {
//       if (mode === "upload") {
//         const fileInput = inputRef.current.files[0];
//         if (!fileInput) return alert("No file selected for upload.");

//         const formData = new FormData();
//         formData.append("file", fileInput);
//         formData.append(
//           "userinteraction",
//           JSON.stringify({
//             position: { x: cameraPos[0].toString(), y: cameraPos[1].toString(), z: cameraPos[2].toString() },
//             target: { x: rotation.x.toString(), y: rotation.y.toString(), z: rotation.z.toString() },
//             zoom: zoom.toString(),
//             pan: { x: pan.x.toString(), y: pan.y.toString() },
//           })
//         );

//         await filesApi.post(`/upload/${userEmail}`, formData, {
//           headers: { "Content-Type": "multipart/form-data" },
//         });
//         alert("File uploaded successfully.");
//         fetchLibraryFiles();
//       } else if (mode === "library" && selectedFile && selectedFileIndex !== null) {
//         const userInteraction = {
//           position: { x: cameraPos[0].toString(), y: cameraPos[1].toString(), z: cameraPos[2].toString() },
//           target: { x: rotation.x.toString(), y: rotation.y.toString(), z: rotation.z.toString() },
//           zoom: zoom.toString(),
//           pan: { x: pan.x.toString(), y: pan.y.toString() },
//         };

//         await filesApi.put(`/files/${userEmail}/${selectedFileIndex}`, {
//           user_interaction: JSON.stringify(userInteraction),
//         });

//         alert("Library file interaction saved.");
//         fetchLibraryFiles();
//       } else {
//         alert("No action to save.");
//       }
//     } catch (err) {
//       console.error("Save Error:", err);
//       alert("Error while saving.");
//     }
//   };

//   return (
//     <div className="w-full h-screen flex border border-gray-300">
//       <div className="w-[80%] h-full relative">
//         {isModelLoading && (
//           <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center text-white z-50">
//             <div className="loader mb-4 border-4 border-t-4 border-white rounded-full w-12 h-12 animate-spin"></div>
//             <p>Loading: {selectedFile ? selectedFile.filename : "Uploaded File"}</p>
//           </div>
//         )}

//         <ErrorBoundary>
//           <Canvas ref={canvasRef} camera={{ position: cameraPos }} style={{ background: "#A0A0A0" }}>
//             <ambientLight intensity={0.6} />
//             <directionalLight position={[5, 5, 5]} intensity={0.8} />
//             <gridHelper args={[10, 20, "#555555", "#888888"]} />
//             <axesHelper args={[2]} />
//             <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
//             <CameraController position={cameraPos} />
//             {modelUrl && (
//               <Suspense fallback={null}>
//                 <ModelViewer
//                   key={modelUrl + JSON.stringify(rotation)}
//                   modelUrl={modelUrl}
//                   rotation={rotation}
//                   onLoaded={handleModelLoaded}
//                 />
//               </Suspense>
//             )}
//           </Canvas>
//         </ErrorBoundary>

//         <input
//           ref={inputRef}
//           type="file"
//           accept=".glb,.gltf,.obj"
//           onChange={handleFileUpload}
//           className="absolute top-4 left-4 bg-gray-200 text-gray-800 rounded px-3 py-1 cursor-pointer"
//         />

//         <button
//           onClick={handleSave}
//           className="absolute top-20 left-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
//         >
//           Save
//         </button>

//         <select
//           onChange={handleCameraChange}
//           className="absolute top-4 right-4 bg-gray-200 text-gray-800 rounded px-2 py-1"
//         >
//           <option value="">Camera View</option>
//           <option value="front">Front View</option>
//           <option value="top">Top View</option>
//           <option value="side">Side View</option>
//           <option value="pan">Pan ➡️</option>
//         </select>

//         <div className="absolute bottom-4 left-4 space-x-2">
//           <button onClick={() => rotateModel("y", Math.PI / 4)} className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded">
//             Rotate Y +45°
//           </button>
//           <button onClick={() => rotateModel("x", Math.PI / 4)} className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded">
//             Rotate X +45°
//           </button>
//           <button onClick={() => rotateModel("z", Math.PI / 4)} className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded">
//             Rotate Z +45°
//           </button>
//         </div>

//         <div className="absolute bottom-36 left-4 space-x-2">
//           <button onClick={() => zoomCamera("in")} className="px-3 py-1 bg-green-300 hover:bg-green-400 rounded">
//             Zoom In ➕
//           </button>
//           <button onClick={() => zoomCamera("out")} className="px-3 py-1 bg-green-300 hover:bg-green-400 rounded">
//             Zoom Out ➖
//           </button>
//         </div>
//       </div>

//       <div className="w-[20%] h-full bg-gray-100 border-l border-gray-300 p-4 overflow-y-auto">
//         <h2 className="text-xl font-bold mb-4 text-center">Library</h2>
//         {libraryFiles.length > 0 ? (
//           <ul className="space-y-2">
//             {libraryFiles.map((file, index) => (
//               <li
//                 key={index}
//                 onClick={() => handleLibraryFileClick(file, index)}
//                 className="bg-white shadow rounded p-2 text-gray-800 cursor-pointer hover:bg-gray-100"
//               >
//                 <div><strong>{file.filename}</strong></div>
//                 <div className="text-sm text-gray-500">Last Updated: {new Date(file.updatedAt).toLocaleString()}</div>
//               </li>
//             ))}
//           </ul>
//         ) : (
//           <p>No files found.</p>
//         )}

//         <button
//           onClick={() => navigate("/logout")}
//           className="mt-6 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 w-full"
//         >
//           Logout
//         </button>
//       </div>
//     </div>
//   );
// };

// export default VisualizerScreen;
import React, { useRef, useState, Suspense, useEffect } from "react";
import { Canvas, useThree, useFrame, useLoader } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useGLTF } from "@react-three/drei";
import { OBJLoader } from "three-stdlib";
import { useNavigate } from "react-router-dom";
import * as THREE from "three";
import filesApi from "../Services/fileroute";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }
  componentDidCatch(error, info) {
    console.error("Canvas Error:", error, info);
  }
  render() {
    if (this.state.hasError) {
      return <h2>Something went wrong while loading the 3D Canvas.</h2>;
    }
    return this.props.children;
  }
}

const ModelViewer = ({ modelUrl, rotation, onLoaded }) => {
  const extension = modelUrl.split(".").pop().toLowerCase();
  let model;
  if (extension === "glb" || extension === "gltf") {
    model = useGLTF(modelUrl);
  } else if (extension === "obj") {
    model = useLoader(OBJLoader, modelUrl);
  }

  const modelRef = useRef();

  useEffect(() => {
    if (modelRef.current) {
      modelRef.current.rotation.x = rotation.x;
      modelRef.current.rotation.y = rotation.y;
      modelRef.current.rotation.z = rotation.z;
    }
  }, [rotation]);

  useEffect(() => {
    if (onLoaded) onLoaded();
  }, [model]);

  return <primitive object={model.scene || model} ref={modelRef} />;
};

const CameraController = ({ position }) => {
  const { camera } = useThree();
  useFrame(() => {
    camera.position.lerp(new THREE.Vector3(...position), 0.1);
    camera.lookAt(0, 0, 0);
  });
  return null;
};

const VisualizerScreen = () => {
  const navigate = useNavigate();
  const inputRef = useRef();
  const canvasRef = useRef();

  const [modelUrl, setModelUrl] = useState(null);
  const [cameraPos, setCameraPos] = useState([2, 2, 5]);
  const [rotation, setRotation] = useState({ x: 0, y: 0, z: 0 });
  const [pan, setPan] = useState({ x: 2, y: 2 });  // Initialize from initial cameraPos
  const [zoom, setZoom] = useState(5);
  const [libraryFiles, setLibraryFiles] = useState([]);
  const [postObject, setPostObject] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedFileIndex, setSelectedFileIndex] = useState(null);
  const [mode, setMode] = useState("");
  const [isModelLoading, setIsModelLoading] = useState(false);

  const fetchLibraryFiles = async () => {
    try {
      const userEmail = localStorage.getItem("userEmail");
      const res = await filesApi.get(`/files/${userEmail}`);
      setLibraryFiles(res.data.files || []);
    } catch (err) {
      console.error("Error fetching files:", err);
    }
  };

  useEffect(() => {
    fetchLibraryFiles();
  }, []);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return alert("No file selected.");

    if (file.name.endsWith(".glb") || file.name.endsWith(".gltf") || file.name.endsWith(".obj")) {
      setIsModelLoading(true);
      const url = URL.createObjectURL(file);
      setModelUrl(url);
      setPostObject(true);
      setMode("upload");
      setSelectedFile(null);
      setSelectedFileIndex(null);

      try {
        const userEmail = localStorage.getItem("userEmail");
        const formData = new FormData();
        formData.append("file", file);
        formData.append(
          "userinteraction",
          JSON.stringify({
            position: { x: "0", y: "0", z: "0" },
            target: { x: "0", y: "0", z: "0" },
            zoom: "5",
            pan: { x: "0", y: "0" },
          })
        );

        await filesApi.post(`/upload/${userEmail}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        fetchLibraryFiles();
        alert("File uploaded successfully.");
        window.location.reload(); // Reload to update the library
      } catch (err) {
        console.error("Upload Error:", err);
      } finally {
        setIsModelLoading(false);
      }
    } else {
      alert("Please upload a .glb, .gltf, or .obj file only.");
    }
  };

  const handleLibraryFileClick = (file, index) => {
    setSelectedFile(file);
    setSelectedFileIndex(index);
    setPostObject(false);
    setMode("library");
    setIsModelLoading(true);
    const fileUrl = `https://qul3dmodel.onrender.com${file.filepath}`;
    setModelUrl(fileUrl);

    if (file.user_interaction) {
      try {
        const interaction = file.user_interaction;
        const newCameraPos = [
          parseFloat(interaction.position.x),
          parseFloat(interaction.position.y),
          parseFloat(interaction.position.z),
        ];
        setCameraPos(newCameraPos);
        setPan({
          x: newCameraPos[0],
          y: newCameraPos[1],
        });
        setZoom(parseFloat(interaction.zoom));
        setRotation({
          x: parseFloat(interaction.target.x),
          y: parseFloat(interaction.target.y),
          z: parseFloat(interaction.target.z),
        });
      } catch (err) {
        console.error("Error parsing interaction:", err);
        setCameraPos([2, 2, 5]);
        setPan({ x: 2, y: 2 });
        setZoom(5);
        setRotation({ x: 0, y: 0, z: 0 });
      }
    } else {
      setCameraPos([2, 2, 5]);
      setPan({ x: 2, y: 2 });
      setZoom(5);
      setRotation({ x: 0, y: 0, z: 0 });
    }
  };

  const handleCameraChange = (e) => {
    const view = e.target.value;
    if (view === "front") {
      setCameraPos([0, 0, zoom]);
      setPan({ x: 0, y: 0 });
    } else if (view === "top") {
      setCameraPos([0, zoom, 0]);
      setPan({ x: 0, y: zoom });
    } else if (view === "side") {
      setCameraPos([zoom, 0, 0]);
      setPan({ x: zoom, y: 0 });
    } else if (view === "pan") {
      setPan((prev) => ({ x: prev.x + 1, y: prev.y }));
    }
  };

  const rotateModel = (axis, angle) => {
    setRotation((prev) => ({
      ...prev,
      [axis]: prev[axis] + angle,
    }));
  };

  const zoomCamera = (type) => {
    const delta = 0.5;
    setZoom((prev) => {
      const newZoom = type === "in" ? prev - delta : prev + delta;
      setCameraPos((prevPos) => {
        const newPos = [...prevPos];
        newPos[2] += type === "in" ? -delta : delta;
        setPan({ x: newPos[0], y: newPos[1] });
        return newPos;
      });
      return newZoom;
    });
  };

  const handleModelLoaded = () => {
    setIsModelLoading(false);
  };

  const handleSave = async () => {
    const userEmail = localStorage.getItem("userEmail");
    try {
      const userInteraction = {
        position: {
          x: cameraPos[0].toString(),
          y: cameraPos[1].toString(),
          z: cameraPos[2].toString(),
        },
        target: {
          x: rotation.x.toString(),
          y: rotation.y.toString(),
          z: rotation.z.toString(),
        },
        zoom: zoom.toString(),
        pan: {
          x: pan.x.toString(),
          y: pan.y.toString(),
        },
      };

      if (mode === "upload") {
        const fileInput = inputRef.current.files[0];
        if (!fileInput) return alert("No file selected for upload.");
        const formData = new FormData();
        formData.append("file", fileInput);
        formData.append("userinteraction", JSON.stringify(userInteraction));

        await filesApi.post(`/upload/${userEmail}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("File uploaded successfully.");
        fetchLibraryFiles();
      } else if (mode === "library" && selectedFile && selectedFileIndex !== null) {
        await filesApi.put(`/files/${userEmail}/${selectedFileIndex}`, {
          user_interaction: JSON.stringify(userInteraction),
        });
        alert("Library file interaction saved.");
        fetchLibraryFiles();
      } else {
        alert("No action to save.");
      }
    } catch (err) {
      console.error("Save Error:", err);
      alert("Error while saving.");
    }
  };

  return (
    <div className="w-full h-screen flex border border-gray-300">
      <div className="w-[80%] h-full relative">
        {isModelLoading && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center text-white z-50">
            <div className="loader mb-4 border-4 border-t-4 border-white rounded-full w-12 h-12 animate-spin"></div>
            <p>Loading: {selectedFile ? selectedFile.filename : "Uploaded File"}</p>
          </div>
        )}

        <ErrorBoundary>
          <Canvas ref={canvasRef} camera={{ position: cameraPos }} style={{ background: "#A0A0A0" }}>
            <ambientLight intensity={0.6} />
            <directionalLight position={[5, 5, 5]} intensity={0.8} />
            <gridHelper args={[10, 20, "#555555", "#888888"]} />
            <axesHelper args={[2]} />
            <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
            <CameraController position={cameraPos} />
            {modelUrl && (
              <Suspense fallback={null}>
                <ModelViewer
                  key={modelUrl + JSON.stringify(rotation)}
                  modelUrl={modelUrl}
                  rotation={rotation}
                  onLoaded={handleModelLoaded}
                />
              </Suspense>
            )}
          </Canvas>
        </ErrorBoundary>

        <input
          ref={inputRef}
          type="file"
          accept=".glb,.gltf,.obj"
          onChange={handleFileUpload}
          className="absolute top-4 left-4 bg-gray-200 text-gray-800 rounded px-3 py-1 cursor-pointer"
        />

        <button
          onClick={handleSave}
          className="absolute top-20 left-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Save
        </button>

        <select
          onChange={handleCameraChange}
          className="absolute top-4 right-4 bg-gray-200 text-gray-800 rounded px-2 py-1"
        >
          <option value="">Camera View</option>
          <option value="front">Front View</option>
          <option value="top">Top View</option>
          <option value="side">Side View</option>
          <option value="pan">Pan ➡️</option>
        </select>

        <div className="absolute bottom-4 left-4 space-x-2">
          <button onClick={() => rotateModel("y", Math.PI / 4)} className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded">
            Rotate Y +45°
          </button>
          <button onClick={() => rotateModel("x", Math.PI / 4)} className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded">
            Rotate X +45°
          </button>
          <button onClick={() => rotateModel("z", Math.PI / 4)} className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded">
            Rotate Z +45°
          </button>
        </div>

        <div className="absolute bottom-36 left-4 space-x-2">
          <button onClick={() => zoomCamera("in")} className="px-3 py-1 bg-green-300 hover:bg-green-400 rounded">
            Zoom In ➕
          </button>
          <button onClick={() => zoomCamera("out")} className="px-3 py-1 bg-green-300 hover:bg-green-400 rounded">
            Zoom Out ➖
          </button>
        </div>
      </div>

      <div className="w-[20%] h-full bg-gray-100 border-l border-gray-300 p-4 overflow-y-auto">
        <h2 className="text-xl font-bold mb-4 text-center">Library</h2>
        {libraryFiles.length > 0 ? (
          <ul className="space-y-2">
            {libraryFiles.map((file, index) => (
              <li
                key={index}
                onClick={() => handleLibraryFileClick(file, index)}
                className="bg-white shadow rounded p-2 text-gray-800 cursor-pointer hover:bg-gray-100"
              >
                <div><strong>{file.filename}</strong></div>
                <div className="text-sm text-gray-500">Last Updated: {new Date(file.updatedAt).toLocaleString()}</div>
              </li>
            ))}
          </ul>
        ) : (
          <p>No files found.</p>
        )}

        <button
          onClick={() =>{ navigate("/"); localStorage.removeItem("userEmail"); localStorage.removeItem("authToken")}}
          className="mt-6 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 w-full"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default VisualizerScreen;
