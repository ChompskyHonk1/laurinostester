"use client";

import { Component, Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  ContactShadows,
  Environment,
  Lightformer,
  OrbitControls,
  RoundedBox,
  useTexture,
} from "@react-three/drei";
import * as THREE from "three";

/* ------------------------------------------------------------------ *
 * Dimensions (arbitrary units; width = X, depth = Z).                 *
 * ------------------------------------------------------------------ */
const FULL_W = 6.4; // full-size chafer (X)
const HALF_W = 3.9; // half-size chafer (X)
const PAN_D = 4.6; // depth (Z)
const WALL_H = 0.55;

const INS = {
  half: { w: 3.0, d: 3.9 },
  full: { w: 5.85, d: 3.9 },
};
const SLOT_X2 = [-1.55, 1.55]; // two half inserts inside a full chafer

const PAN_FLOOR_H = 0.16;
const FOOD_MIN_H = 0.12;
const FOOD_MAX_H = 0.64;

const CHAFER_GAP = 0.9;

// Soda pitchers along the front table edge.
const PITCHER_SPACING = 1.7;
const PITCHER_DIA = 1.6;

const CAM_DIR = new THREE.Vector3(0.2, 0.66, 1).normalize();

const STEEL = "#c3c8cc";
const STEEL_LIGHT = "#e4e8eb";
const STEEL_DARK = "#878d92";
const WATER = "#25353d";
const FOOD_SIDE = "#7a8085";

// Table surface colours (matches the tablecloth picker on the page).
const CLOTH_COLORS = {
  wood: "#8a5a33",
  black: "#1b1b1d",
  white: "#efece4",
  navy: "#3A5666",
};

/* ------------------------------------------------------------------ *
 * Quantity -> trays. Each item has its own full-tray capacity; a half *
 * tray holds half of it. Remainders round to a half or full tray.      *
 * ------------------------------------------------------------------ */
const DEFAULT_PER_TRAY = 8;
const MIN_FILL = 0.35; // a non-empty tray always shows some food

const fillOf = (qty, cap) => Math.max(MIN_FILL, Math.min(1, qty / cap));

function tiersFor(qty, perTray) {
  if (qty <= 0) return [];
  const full = Math.max(1, (perTray && perTray.full) || DEFAULT_PER_TRAY);
  const half = Math.max(0.5, (perTray && perTray.half) || full / 2);
  if (qty <= half) return [{ size: "half", fill: fillOf(qty, half) }];
  if (qty <= full) return [{ size: "full", fill: fillOf(qty, full) }];
  const out = [];
  const fulls = Math.floor(qty / full);
  for (let i = 0; i < fulls; i++) out.push({ size: "full", fill: 1 });
  const rem = qty - fulls * full;
  if (rem > 0) {
    out.push(rem <= half ? { size: "half", fill: fillOf(rem, half) } : { size: "full", fill: fillOf(rem, full) });
  }
  return out;
}

function buildTrays(items) {
  const trays = [];
  for (const it of items) {
    tiersFor(it.qty, it.perTray).forEach((t, i) =>
      trays.push({ key: `${it.id}-m${i}`, image: it.image, size: t.size, fill: t.fill })
    );
    // Large orders of an entrée with a side get the side in its own tray.
    if (it.side && it.qty >= 2) {
      tiersFor(it.qty, it.perTray).forEach((t, i) =>
        trays.push({ key: `${it.id}-s${i}`, image: it.side.image, size: t.size, fill: t.fill })
      );
    }
  }
  return trays;
}

// Full trays each take a full chafer; half trays pack two per full chafer.
function packChafers(trays) {
  const chafers = [];
  const halves = [];
  const flush = () => {
    while (halves.length >= 2) chafers.push({ size: "full", trays: [halves.shift(), halves.shift()] });
  };
  for (const t of trays) {
    if (t.size === "full") chafers.push({ size: "full", trays: [t] });
    else {
      halves.push(t);
      flush();
    }
  }
  flush();
  if (halves.length === 1) chafers.push({ size: "half", trays: [halves.shift()] });
  return chafers;
}

/* ------------------------------------------------------------------ *
 * A tray: metal pan + food that fills to the quantity's level.        *
 * ------------------------------------------------------------------ */
function trayMaterials(texture) {
  return [
    <meshStandardMaterial key="0" attach="material-0" color={FOOD_SIDE} roughness={0.95} metalness={0.02} />,
    <meshStandardMaterial key="1" attach="material-1" color={FOOD_SIDE} roughness={0.95} metalness={0.02} />,
    <meshStandardMaterial key="2" attach="material-2" map={texture} roughness={0.88} metalness={0.02} />,
    <meshStandardMaterial key="3" attach="material-3" color="#3f3a33" roughness={1} metalness={0} />,
    <meshStandardMaterial key="4" attach="material-4" color={FOOD_SIDE} roughness={0.95} metalness={0.02} />,
    <meshStandardMaterial key="5" attach="material-5" color={FOOD_SIDE} roughness={0.95} metalness={0.02} />,
  ];
}

function TrayPan({ w, d }) {
  const steel = <meshStandardMaterial color={STEEL_LIGHT} metalness={0.95} roughness={0.22} envMapIntensity={1.3} />;
  return (
    <group position={[0, PAN_FLOOR_H, 0]}>
      <mesh position={[0, 0, d / 2]}>
        <boxGeometry args={[w, 0.14, 0.1]} />
        {steel}
      </mesh>
      <mesh position={[0, 0, -d / 2]}>
        <boxGeometry args={[w, 0.14, 0.1]} />
        {steel}
      </mesh>
      <mesh position={[w / 2, 0, 0]}>
        <boxGeometry args={[0.1, 0.14, d]} />
        {steel}
      </mesh>
      <mesh position={[-w / 2, 0, 0]}>
        <boxGeometry args={[0.1, 0.14, d]} />
        {steel}
      </mesh>
      <mesh position={[0, 0.02, d / 2 - 0.16]}>
        <boxGeometry args={[w * 0.42, 0.06, 0.14]} />
        {steel}
      </mesh>
    </group>
  );
}

function TrayBase({ x, z = 0, size }) {
  const { w, d } = INS[size];
  return (
    <group position={[x, 0, z]}>
      <mesh position={[0, PAN_FLOOR_H / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[w, PAN_FLOOR_H, d]} />
        <meshStandardMaterial color={STEEL_DARK} metalness={0.85} roughness={0.35} />
      </mesh>
      <TrayPan w={w} d={d} />
    </group>
  );
}

function TrayInner({ tray, x, z = 0, size }) {
  const { w, d } = INS[size];
  const texture = useTexture(tray.image);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 16;
  // Zoom into the centre of the dish photo so the pan top reads as food,
  // not a framed photo of a plate.
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.repeat.set(0.72, 0.72);
  texture.offset.set(0.14, 0.14);

  const targetH = FOOD_MIN_H + tray.fill * (FOOD_MAX_H - FOOD_MIN_H);
  const food = useRef(null);
  const grp = useRef(null);
  const h = useRef(0.02);
  const started = useRef(null);

  useFrame((state, delta) => {
    if (started.current == null) started.current = state.clock.elapsedTime;
    const t = Math.min(1, (state.clock.elapsedTime - started.current) / 0.7);
    const ease = 1 - Math.pow(1 - t, 3);
    if (grp.current) grp.current.position.y = (1 - ease) * 2.6;
    h.current += (targetH - h.current) * Math.min(1, delta * 3.5);
    if (food.current) {
      food.current.scale.y = Math.max(0.02, h.current);
      food.current.position.y = PAN_FLOOR_H + h.current / 2;
    }
  });

  return (
    <group ref={grp}>
      <mesh position={[0, PAN_FLOOR_H / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[w, PAN_FLOOR_H, d]} />
        <meshStandardMaterial color={STEEL_DARK} metalness={0.85} roughness={0.35} />
      </mesh>
      <mesh ref={food} castShadow>
        <boxGeometry args={[w - 0.1, 1, d - 0.1]} />
        {trayMaterials(texture)}
      </mesh>
      <TrayPan w={w} d={d} />
    </group>
  );
}

function Tray({ tray, x, size }) {
  return (
    <Suspense fallback={<TrayBase x={x} size={size} />}>
      <TrayInner tray={tray} x={x} size={size} />
    </Suspense>
  );
}

function EmptySlot({ x, size }) {
  const { w, d } = INS[size];
  return (
    <group position={[x, PAN_FLOOR_H + 0.02, 0]}>
      <mesh>
        <boxGeometry args={[w - 0.2, 0.06, d - 0.2]} />
        <meshStandardMaterial color="#525a60" metalness={0.5} roughness={0.6} />
      </mesh>
    </group>
  );
}

/* ------------------------------------------------------------------ *
 * Chafing dish shell + its slot layout.                               *
 * ------------------------------------------------------------------ */
function ChaferShell({ w }) {
  return (
    <>
      <RoundedBox
        args={[w, WALL_H, PAN_D]}
        radius={0.12}
        smoothness={4}
        position={[0, -WALL_H / 2, 0]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial color={STEEL} metalness={0.92} roughness={0.3} envMapIntensity={1.25} />
      </RoundedBox>
      <mesh position={[0, 0.015, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[w - 0.62, PAN_D - 0.62]} />
        <meshStandardMaterial color={WATER} metalness={0.15} roughness={0.12} />
      </mesh>
      {[
        [0, PAN_D / 2 + 0.17, 0.16, 0.16, w + 0.34, 0.16],
        [0, -PAN_D / 2 - 0.17, 0.16, 0.16, w + 0.34, 0.16],
        [w / 2 + 0.17, 0, 0.16, 0.16, 0.16, PAN_D + 0.34],
        [-w / 2 - 0.17, 0, 0.16, 0.16, 0.16, PAN_D + 0.34],
      ].map((r, i) => (
        <mesh key={i} position={[r[0], 0.05, r[1]]}>
          <boxGeometry args={[r[4], r[3], r[5]]} />
          <meshStandardMaterial color={STEEL_LIGHT} metalness={0.95} roughness={0.22} envMapIntensity={1.3} />
        </mesh>
      ))}
      {[-1, 1].map((s) => (
        <mesh key={s} position={[s * (w / 2 + 0.24), 0.04, 0]} castShadow>
          <boxGeometry args={[0.22, 0.1, 1.05]} />
          <meshStandardMaterial color={STEEL_LIGHT} metalness={0.95} roughness={0.25} envMapIntensity={1.2} />
        </mesh>
      ))}
    </>
  );
}

function Chafer({ chafer }) {
  const w = chafer.size === "full" ? FULL_W : HALF_W;
  const trays = chafer.trays;

  let slots;
  if (trays.length === 1 && trays[0].size === "full") {
    slots = [{ key: trays[0].key, tray: trays[0], x: 0, size: "full" }];
  } else if (trays.length === 0) {
    const xs = chafer.size === "full" ? SLOT_X2 : [0];
    slots = xs.map((x, i) => ({ key: `empty-${i}`, empty: true, x, size: "half" }));
  } else {
    const xs = trays.length === 2 ? SLOT_X2 : [0];
    slots = trays.map((t, i) => ({ key: t.key, tray: t, x: xs[i], size: t.size }));
  }

  return (
    <group>
      <ChaferShell w={w} />
      {slots.map((s) =>
        s.empty ? <EmptySlot key={s.key} x={s.x} size={s.size} /> : <Tray key={s.key} tray={s.tray} x={s.x} size={s.size} />
      )}
    </group>
  );
}

/* ------------------------------------------------------------------ *
 * Soda pitcher: a stylized glass jug sitting on the table edge.       *
 * Only sodas are modeled — no alcohol is rendered.                    *
 * ------------------------------------------------------------------ */
const PITCHER_GLASS = "#dff0f4";
const PITCHER_SODA = "#b9762a";

// Lathe profile (radius, height) gives the jug silhouette: wide base, a taper
// up to the neck, then a small flared lip so the open top reads as a pitcher.
const PITCHER_PROFILE = [
  [0.0, 0.02],
  [0.55, 0.02],
  [0.7, 0.08],
  [0.68, 0.35],
  [0.6, 0.8],
  [0.5, 1.2],
  [0.44, 1.5],
  [0.42, 1.64],
  [0.5, 1.72],
  [0.44, 1.75],
].map(([r, y]) => new THREE.Vector2(r, y));

function Pitcher({ x, z, color = PITCHER_SODA }) {
  const glass = (
    <meshStandardMaterial
      color={PITCHER_GLASS}
      roughness={0.07}
      metalness={0.2}
      envMapIntensity={1.6}
      transparent
      opacity={0.42}
      side={THREE.DoubleSide}
    />
  );
  const trim = (
    <meshStandardMaterial color="#ffffff" roughness={0.06} metalness={0.25} transparent opacity={0.7} />
  );
  return (
    <group position={[x, -WALL_H, z]}>
      <mesh castShadow>
        <latheGeometry args={[PITCHER_PROFILE, 40]} />
        {glass}
      </mesh>
      <mesh position={[0, 0.6, 0]} castShadow>
        <cylinderGeometry args={[0.42, 0.62, 1.15, 28]} />
        <meshStandardMaterial color={color} roughness={0.22} metalness={0.03} />
      </mesh>
      <mesh position={[0, 1.175, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.42, 28]} />
        <meshStandardMaterial color={color} roughness={0.16} metalness={0.05} />
      </mesh>
      <mesh position={[0, 1.74, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.5, 0.035, 12, 40]} />
        {trim}
      </mesh>
      <mesh position={[-0.5, 1.82, 0]} rotation={[0, 0, 0.7]}>
        <coneGeometry args={[0.17, 0.3, 18]} />
        {trim}
      </mesh>
      <mesh position={[0.6, 0.9, 0]}>
        <torusGeometry args={[0.32, 0.075, 14, 40]} />
        {trim}
      </mesh>
    </group>
  );
}

/* ------------------------------------------------------------------ *
 * Scene, camera fitting, lighting, controls.                          *
 * ------------------------------------------------------------------ */
function Scene({ chafers, scale, clothColor, tableW, tableD, showTable, pitchers = [] }) {
  const count = pitchers.length;
  return (
    <group scale={scale}>
      {/* table / tablecloth the chafing dishes sit on (hidden for to-go) */}
      {showTable && (
        <mesh position={[0, -WALL_H - 0.09, 0]} receiveShadow>
          <boxGeometry args={[tableW, 0.18, tableD]} />
          <meshStandardMaterial color={clothColor} roughness={0.92} metalness={0.02} />
        </mesh>
      )}
      {chafers.map((c, i) => (
        <group key={i} position={[c.cx, 0, c.cz]}>
          <Chafer chafer={c} />
        </group>
      ))}
      {showTable &&
        pitchers.map((color, i) => (
          <Pitcher
            key={`p${i}`}
            color={color}
            x={(i - (count - 1) / 2) * PITCHER_SPACING}
            z={tableD / 2 - 0.9}
          />
        ))}
    </group>
  );
}

function FitCamera({ width, depth }) {
  const { camera, size } = useThree();
  useEffect(() => {
    const aspect = size.width / Math.max(1, size.height);
    const vFov = (camera.fov * Math.PI) / 180;
    const fitH = width / 2 / (Math.tan(vFov / 2) * aspect);
    const fitV = depth / 2 / Math.tan(vFov / 2);
    const dist = Math.max(fitH, fitV) * 1.0 + 1.2;
    camera.position.copy(CAM_DIR.clone().multiplyScalar(dist));
    camera.lookAt(0, 0.12, 0);
    camera.updateProjectionMatrix();
  }, [camera, size.width, size.height, width, depth]);
  return null;
}

function Lighting() {
  return (
    <>
      <ambientLight intensity={0.45} />
      <directionalLight
        position={[7, 11, 7]}
        intensity={1.15}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <directionalLight position={[-9, 6, -5]} intensity={0.4} />
      <Environment resolution={256}>
        <Lightformer intensity={2.2} position={[0, 6, -8]} scale={[12, 8, 1]} />
        <Lightformer intensity={1.5} position={[-8, 4, 5]} scale={[8, 8, 1]} />
        <Lightformer intensity={1.2} position={[8, 4, 5]} scale={[8, 8, 1]} />
        <Lightformer intensity={0.7} position={[0, -5, 0]} scale={[14, 14, 1]} rotation={[Math.PI / 2, 0, 0]} />
      </Environment>
      <ContactShadows position={[0, -WALL_H + 0.01, 0]} opacity={0.34} scale={40} blur={2.6} far={7} />
    </>
  );
}

function Controls() {
  const [auto, setAuto] = useState(true);
  const timer = useRef(null);
  useEffect(() => () => clearTimeout(timer.current), []);
  return (
    <OrbitControls
      makeDefault
      target={[0, 0.12, 0]}
      autoRotate={auto}
      autoRotateSpeed={0.5}
      enablePan={false}
      enableDamping
      dampingFactor={0.08}
      minDistance={4}
      maxDistance={52}
      minPolarAngle={0.35}
      maxPolarAngle={Math.PI / 2.15}
      onStart={() => {
        clearTimeout(timer.current);
        setAuto(false);
      }}
      onEnd={() => {
        clearTimeout(timer.current);
        timer.current = setTimeout(() => setAuto(true), 2500);
      }}
    />
  );
}

class GLBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { failed: false };
  }
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {}
  render() {
    if (this.state.failed) return <div className="chafer-fallback">3D preview unavailable on this device.</div>;
    return this.props.children;
  }
}

export default function ChaferViewer({ items = [], tablecloth = "wood", pitchers = [] }) {
  const showTable = Boolean(tablecloth && tablecloth !== "none");
  const clothColor = showTable ? CLOTH_COLORS[tablecloth] || CLOTH_COLORS.wood : null;
  const pitcherCount = Array.isArray(pitchers) ? pitchers.length : 0;

  const { chafers, sceneW, sceneD, tableW, tableD } = useMemo(() => {
    const trays = buildTrays(items);
    const packed = packChafers(trays);
    const list = packed.length ? packed : [{ size: "full", trays: [] }];

    // Wrap into a grid so bigger orders keep their trays large instead of
    // shrinking into one long row.
    const cols = Math.max(1, Math.ceil(Math.sqrt(list.length)));
    const rows = [];
    for (let i = 0; i < list.length; i += cols) rows.push(list.slice(i, i + cols));

    const rowW = rows.map(
      (r) => r.reduce((a, c) => a + (c.size === "full" ? FULL_W : HALF_W), 0) + CHAFER_GAP * (r.length - 1)
    );
    const maxRowW = Math.max(...rowW);

    const rowD = PAN_D + 1.0;
    const totalD = rowD * rows.length;
    const placed = [];
    rows.forEach((row, ri) => {
      let x = -rowW[ri] / 2;
      const cz = -totalD / 2 + rowD * ri + rowD / 2;
      row.forEach((c) => {
        const w = c.size === "full" ? FULL_W : HALF_W;
        placed.push({ ...c, cx: x + w / 2, cz });
        x += w + CHAFER_GAP;
      });
    });
    // Table has a fixed minimum size so scale stays consistent: a lone half
    // tray looks small on the same table a full spread would fill. Widen it
    // when a long row of pitchers needs the room.
    const pitcherW = pitcherCount > 0 ? (pitcherCount - 1) * PITCHER_SPACING + PITCHER_DIA : 0;
    const REF_W = 2 * FULL_W + CHAFER_GAP;
    const REF_D = PAN_D + 1.0;
    const tableW = Math.max(REF_W, maxRowW, pitcherW) + 2.4;
    const tableD = Math.max(REF_D, totalD) + 2.4;
    return { chafers: placed, sceneW: tableW, sceneD: tableD, tableW, tableD };
  }, [items, pitcherCount]);

  return (
    <GLBoundary>
      <Canvas
        dpr={[1, 2]}
        shadows
        camera={{ position: [2, 8.5, 13.5], fov: 38, near: 0.1, far: 220 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.05;
        }}
      >
        <Suspense fallback={null}>
          <Lighting />
          <Scene
            chafers={chafers}
            scale={1}
            clothColor={clothColor}
            tableW={tableW}
            tableD={tableD}
            showTable={showTable}
            pitchers={pitchers}
          />
        </Suspense>
        <FitCamera width={sceneW} depth={sceneD} />
        <Controls />
      </Canvas>
    </GLBoundary>
  );
}
