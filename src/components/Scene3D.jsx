import { useRef, useMemo, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Stars } from '@react-three/drei'
import * as THREE from 'three'

/* ---- Optimized Heart geometry ---- */
const heartGeometry = new THREE.ShapeGeometry(
    new function () {
        const shape = new THREE.Shape()
        const s = 0.5
        shape.moveTo(0, s * 0.3)
        shape.bezierCurveTo(-s * 0.5, s * 0.8, -s, s * 0.4, -s, 0)
        shape.bezierCurveTo(-s, -s * 0.6, 0, -s * 0.8, 0, -s)
        shape.bezierCurveTo(0, -s * 0.8, s, -s * 0.6, s, 0)
        shape.bezierCurveTo(s, s * 0.4, s * 0.5, s * 0.8, 0, s * 0.3)
        return shape
    }()
)

/* ---- Instanced Balloons for Better Performance ---- */
function BalloonInstances({ count = 20 }) {
    const ref = useRef()
    const dummy = useMemo(() => new THREE.Object3D(), [])
    const [popped, setPopped] = useState(() => new Array(count).fill(false))

    const particles = useMemo(() => {
        const temp = []
        for (let i = 0; i < count; i++) {
            const t = Math.random() * 100
            const factor = 0.2 + Math.random() * 0.5
            const speed = 0.01 + Math.random() / 200
            const xFactor = -10 + Math.random() * 20
            const yFactor = -5 + Math.random() * 10
            const zFactor = -15 + Math.random() * 20
            temp.push({ t, factor, speed, xFactor, yFactor, zFactor })
        }
        return temp
    }, [count])

    const colors = useMemo(() => {
        const palette = [
            new THREE.Color('#38bdf8'), // Sky blue
            new THREE.Color('#0ea5e9'), // Deep Blue
            new THREE.Color('#f472b6'), // Blush pink
            new THREE.Color('#fbcfe8'), // Light pink
        ]
        const array = new Float32Array(count * 3)
        for (let i = 0; i < count; i++) {
            const color = palette[Math.floor(Math.random() * palette.length)]
            color.toArray(array, i * 3)
        }
        return array
    }, [count])

    const geometry = useMemo(() => new THREE.SphereGeometry(0.3, 16, 16), [])
    const material = useMemo(() => new THREE.MeshStandardMaterial({
        roughness: 0.1,
        metalness: 0.2,
        emissiveIntensity: 0.2,
        transparent: true,
        opacity: 0.9,
    }), [])

    useFrame((state) => {
        particles.forEach((particle, i) => {
            if (popped[i]) {
                dummy.scale.set(0, 0, 0)
                dummy.updateMatrix()
                ref.current.setMatrixAt(i, dummy.matrix)
                return
            }

            let { t, factor, speed, xFactor, yFactor, zFactor } = particle
            t = particle.t += speed / 2
            const s = Math.cos(t)

            dummy.position.set(
                xFactor + Math.cos((t / 10) * factor),
                yFactor + Math.sin((t / 10) * factor),
                zFactor + Math.cos((t / 10) * factor)
            )

            dummy.rotation.set(s * 5, s * 5, s * 5)
            dummy.scale.set(1, 1.2, 1)
            dummy.updateMatrix()

            ref.current.setMatrixAt(i, dummy.matrix)
        })

        for (let i = 0; i < count; i++) {
            ref.current.setColorAt(i, new THREE.Color().fromArray(colors, i * 3))
        }

        ref.current.instanceMatrix.needsUpdate = true
        if (ref.current.instanceColor) ref.current.instanceColor.needsUpdate = true
    })

    const handlePointerDown = (e) => {
        e.stopPropagation()
        if (e.instanceId !== undefined) {
            setPopped(prev => {
                const arr = [...prev]
                arr[e.instanceId] = true
                return arr
            })
        }
    }

    return (
        <instancedMesh
            ref={ref}
            args={[geometry, material, count]}
            onPointerDown={handlePointerDown}
            onPointerOver={(e) => { e.stopPropagation(); document.body.style.cursor = 'pointer' }}
            onPointerOut={(e) => { document.body.style.cursor = 'auto' }}
        >
            <instancedBufferAttribute attach="instanceColor" args={[colors, 3]} />
        </instancedMesh>
    )
}

function StreetLight({ position }) {
    const lightRef = useRef()
    useFrame((state) => {
        if (lightRef.current) {
            lightRef.current.intensity = 1.2 + Math.sin(state.clock.elapsedTime * 2 + position[0]) * 0.2
        }
    })

    return (
        <group position={position}>
            <mesh>
                <cylinderGeometry args={[0.02, 0.03, 1.5, 6]} />
                <meshStandardMaterial color="#213770" metalness={0.6} roughness={0.4} />
            </mesh>
            <mesh position={[0, 0.85, 0]}>
                <sphereGeometry args={[0.08, 8, 8]} />
                <meshBasicMaterial color="#fcd34d" />
            </mesh>
            <pointLight ref={lightRef} position={[0, 0.9, 0]} color="#fbbf24" intensity={1.5} distance={4} />
        </group>
    )
}

function HeartBuilding({ position, scale = 1, color = '#f472b6' }) {
    const meshRef = useRef()
    useFrame((state) => {
        if (meshRef.current) {
            const pulse = 1 + Math.sin(state.clock.elapsedTime * 0.5 + position[0]) * 0.02
            meshRef.current.scale.set(scale * pulse, scale * pulse, scale * pulse)
        }
    })

    return (
        <group position={position}>
            <mesh ref={meshRef} geometry={heartGeometry}>
                <meshStandardMaterial
                    color={color}
                    emissive={color}
                    emissiveIntensity={0.15}
                    metalness={0.2}
                    roughness={0.7}
                    side={THREE.DoubleSide}
                />
            </mesh>
        </group>
    )
}

function CityScene({ scrollProgress }) {
    const groupRef = useRef()

    useFrame((state) => {
        if (groupRef.current) {
            // Base scrolling transforms
            const targetRotationY = scrollProgress * Math.PI * 0.2 + (state.pointer.x * 0.3)
            const targetRotationX = -(state.pointer.y * 0.15)
            const targetPositionY = -scrollProgress * 2 + (state.pointer.y * 0.5)
            const targetPositionZ = scrollProgress * -2

            // Smooth interpolation
            groupRef.current.rotation.y += (targetRotationY - groupRef.current.rotation.y) * 0.05
            groupRef.current.rotation.x += (targetRotationX - groupRef.current.rotation.x) * 0.05
            groupRef.current.position.y += (targetPositionY - groupRef.current.position.y) * 0.05
            groupRef.current.position.z += (targetPositionZ - groupRef.current.position.z) * 0.05
        }
    })

    return (
        <group ref={groupRef}>
            <BalloonInstances count={40} />

            {/* Buildings using Blue/Pink theme colors */}
            <HeartBuilding position={[-3, -1.5, -4]} scale={1.5} color="#38bdf8" />
            <HeartBuilding position={[2.5, -1, -5]} scale={2} color="#ec4899" />
            <HeartBuilding position={[-1, -1.2, -3]} scale={1} color="#7dd3fc" />
            <HeartBuilding position={[4, -1.8, -6]} scale={1.8} color="#0284c7" />
            <HeartBuilding position={[-4.5, -1.6, -5.5]} scale={1.3} color="#fbcfe8" />

            <StreetLight position={[-2, -2, -2]} />
            <StreetLight position={[1.5, -2, -2.5]} />
            <StreetLight position={[4, -2, -3]} />

            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.1, -4]}>
                <planeGeometry args={[40, 40]} />
                <meshStandardMaterial
                    color="#070b19"
                    emissive="#121e42"
                    emissiveIntensity={0.4}
                    roughness={1}
                />
            </mesh>
        </group>
    )
}

export default function Scene3D({ scrollProgress }) {
    return (
        <div className="three-canvas">
            <Canvas camera={{ position: [0, 1, 5], fov: 60 }} dpr={1} performance={{ min: 0.5 }}>
                <ambientLight intensity={0.5} color="#ffffff" />
                <directionalLight position={[5, 10, 5]} intensity={0.8} color="#bae6fd" />
                <pointLight position={[0, 4, 1]} intensity={1.0} color="#f472b6" distance={15} />

                <fog attach="fog" args={['#070b19', 5, 20]} />

                <Stars radius={50} depth={40} count={1000} factor={3} saturation={1} speed={0.5} color="#ffffff" />

                <CityScene scrollProgress={scrollProgress} />
            </Canvas>
        </div>
    )
}
