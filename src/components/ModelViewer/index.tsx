import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Html, OrbitControls } from "@react-three/drei";
import GltfModel from "../GltfModel";
import "./style.scss";

const ModelViewer = ({
  modelPath,
  scale = 1,
  position = [0, 0, 0],
  ...restProps
}) => {
  const LoadingFallback = () => {
    return (
      <Html center>
        <div className="loader"></div>
      </Html>
    );
  };

  return (
    <Canvas
      {...restProps}
      onCreated={({ gl }) => {
        gl.setSize(restProps.width, restProps.height);
      }}
    >
      <ambientLight intensity={0.3} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
      <pointLight position={[-10, -10, -10]} />
      <Suspense fallback={<LoadingFallback />}>
        <GltfModel modelPath={modelPath} scale={scale} position={position} />
        <OrbitControls />
      </Suspense>
    </Canvas>
  );
};

export default ModelViewer;
