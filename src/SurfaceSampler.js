import { useFrame } from "@react-three/fiber";
import { useMemo } from "react";
import { useRef } from "react";
import * as THREE from "three";
import { MeshSurfaceSampler } from "three/examples/jsm/math/MeshSurfaceSampler";
export default function SurfaceSampler() {
  const spheres = useRef();
  const pointsCount = 15000;
  const vertices = [];

  const geometry = new THREE.TorusKnotGeometry(4, 1.3, 100, 16);
  const torus = new THREE.Mesh(geometry);

  const sampler = new MeshSurfaceSampler(torus).build();

  const tempPosition = new THREE.Vector3();

  for (let i = 0; i < pointsCount; i++) {
    sampler.sample(tempPosition);
    vertices.push(tempPosition.x, tempPosition.y, tempPosition.z);
  }

  const positions = useMemo(() => {
    return new THREE.Float32BufferAttribute(vertices, 3);
  }, [vertices]);
  useFrame((state) => {
    if (spheres.current)
      spheres.current.rotation.y = state.clock.elapsedTime * 0.5;
    spheres.current.rotation.x = state.clock.elapsedTime * 0.7;
  });
  return (
    <>
      <points scale={0.3} ref={spheres}>
        <bufferGeometry>
          <bufferAttribute
            onUpdate={(self) => (self.needsUpdate = true)}
            attach="attributes-position"
            array={positions.array}
            itemSize={3}
            count={pointsCount}
          />
        </bufferGeometry>
        <pointsMaterial color="red" size={0.03} />
      </points>
    </>
  );
}
