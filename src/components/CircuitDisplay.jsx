const GATE_W = 72
const GATE_H = 48
const NODE_R = 18

function InputNode({ x, y, value }) {
  return (
    <g>
      <circle
        cx={x} cy={y} r={NODE_R}
        fill={value === 1 ? '#1a1a1a' : '#fff'}
        stroke="#1a1a1a" strokeWidth="1.5"
      />
      <text
        x={x} y={y + 1}
        textAnchor="middle" dominantBaseline="middle"
        fontSize="13" fontWeight="500"
        fill={value === 1 ? '#fff' : '#1a1a1a'}
        fontFamily="'DM Mono', monospace"
      >
        {value}
      </text>
    </g>
  )
}

function GateBox({ x, y, type }) {
  return (
    <g>
      <rect
        x={x} y={y} width={GATE_W} height={GATE_H} rx="8"
        fill="#fff" stroke="#1a1a1a" strokeWidth="1.5"
      />
      <text
        x={x + GATE_W / 2} y={y + GATE_H / 2 + 1}
        textAnchor="middle" dominantBaseline="middle"
        fontSize="12" fontWeight="500" fill="#1a1a1a"
        fontFamily="'DM Mono', monospace"
      >
        {type}
      </text>
    </g>
  )
}

function OutputNode({ x, y }) {
  return (
    <g>
      <circle
        cx={x} cy={y} r={NODE_R}
        fill="#fff" stroke="#1a1a1a" strokeWidth="1.5"
        strokeDasharray="4 3"
      />
      <text
        x={x} y={y + 1}
        textAnchor="middle" dominantBaseline="middle"
        fontSize="14" fontWeight="500" fill="#1a1a1a"
        fontFamily="'DM Mono', monospace"
      >
        ?
      </text>
    </g>
  )
}

function wire(x1, y1, x2, y2) {
  const mx = (x1 + x2) / 2
  return `M ${x1} ${y1} C ${mx} ${y1}, ${mx} ${y2}, ${x2} ${y2}`
}

// 레벨 1~2: 입력 2개, 게이트 1개
// 노드 간격을 충분히 벌려서 뭉개지지 않게
function Level12({ puzzle }) {
  const SVG_W = 380
  const SVG_H = 180
  const inAY = 56          // 상단 노드
  const inBY = 124         // 하단 노드 (간격 68px)
  const midY = (inAY + inBY) / 2
  const inX = 44
  const gateX = 160
  const gateY = midY - GATE_H / 2
  const outX = SVG_W - 44

  return (
    <svg viewBox={`0 0 ${SVG_W} ${SVG_H}`} width="100%" style={{ maxWidth: SVG_W }}>
      <InputNode x={inX} y={inAY} value={puzzle.inputs.A} />
      <InputNode x={inX} y={inBY} value={puzzle.inputs.B} />

      <path d={wire(inX + NODE_R, inAY, gateX, gateY + 14)} fill="none" stroke="#1a1a1a" strokeWidth="1.5" />
      <path d={wire(inX + NODE_R, inBY, gateX, gateY + GATE_H - 14)} fill="none" stroke="#1a1a1a" strokeWidth="1.5" />

      <GateBox x={gateX} y={gateY} type={puzzle.gates[0].type} />

      <path d={wire(gateX + GATE_W, midY, outX - NODE_R, midY)} fill="none" stroke="#1a1a1a" strokeWidth="1.5" />
      <OutputNode x={outX} y={midY} />
    </svg>
  )
}

// 레벨 3: 입력 3개, 게이트 2개 (직렬)
function Level3({ puzzle }) {
  const SVG_W = 460
  const SVG_H = 220
  const inX = 40

  // Gate1: A, B → X
  const inAY = 60
  const inBY = 113
  const g1MidY = (inAY + inBY) / 2
  const g1X = 110
  const g1Y = g1MidY - GATE_H / 2
  const g1OutX = g1X + GATE_W

  // Gate2: X, C → Final
  const inCY = 168
  const g2MidY = (g1MidY + inCY) / 2
  const g2X = 270
  const g2Y = g2MidY - GATE_H / 2
  const g2OutX = g2X + GATE_W

  const outX = SVG_W - 40

  return (
    <svg viewBox={`0 0 ${SVG_W} ${SVG_H}`} width="100%" style={{ maxWidth: SVG_W }}>
      <InputNode x={inX} y={inAY} value={puzzle.inputs.A} />
      <InputNode x={inX} y={inBY} value={puzzle.inputs.B} />
      <InputNode x={inX} y={inCY} value={puzzle.inputs.C} />

      <path d={wire(inX + NODE_R, inAY, g1X, g1Y + 14)} fill="none" stroke="#1a1a1a" strokeWidth="1.5" />
      <path d={wire(inX + NODE_R, inBY, g1X, g1Y + GATE_H - 14)} fill="none" stroke="#1a1a1a" strokeWidth="1.5" />
      <GateBox x={g1X} y={g1Y} type={puzzle.gates[0].type} />

      <path d={wire(g1OutX, g1MidY, g2X, g2Y + 14)} fill="none" stroke="#1a1a1a" strokeWidth="1.5" />
      <path d={wire(inX + NODE_R, inCY, g2X, g2Y + GATE_H - 14)} fill="none" stroke="#1a1a1a" strokeWidth="1.5" />
      <GateBox x={g2X} y={g2Y} type={puzzle.gates[1].type} />

      <path d={wire(g2OutX, g2MidY, outX - NODE_R, g2MidY)} fill="none" stroke="#1a1a1a" strokeWidth="1.5" />
      <OutputNode x={outX} y={g2MidY} />
    </svg>
  )
}

// 레벨 4: 입력 4개, 게이트 3개 (병렬 2개 → 최종 1개)
function Level4({ puzzle }) {
  const SVG_W = 500
  const SVG_H = 260
  const inX = 40

  // Gate1 위쪽 쌍: A(y=52), B(y=116)
  const inAY = 52
  const inBY = 106
  const g1MidY = (inAY + inBY) / 2
  const g1X = 120
  const g1Y = g1MidY - GATE_H / 2

  // Gate2 아래쪽 쌍: C(y=152), D(y=216)
  const inCY = 162
  const inDY = 216
  const g2MidY = (inCY + inDY) / 2
  const g2X = 120
  const g2Y = g2MidY - GATE_H / 2

  // Gate3 중간: X, Y → Final
  const g3MidY = (g1MidY + g2MidY) / 2
  const g3X = 300
  const g3Y = g3MidY - GATE_H / 2
  const g3OutX = g3X + GATE_W

  const outX = SVG_W - 40

  return (
    <svg viewBox={`0 0 ${SVG_W} ${SVG_H}`} width="100%" style={{ maxWidth: SVG_W }}>
      <InputNode x={inX} y={inAY} value={puzzle.inputs.A} />
      <InputNode x={inX} y={inBY} value={puzzle.inputs.B} />
      <InputNode x={inX} y={inCY} value={puzzle.inputs.C} />
      <InputNode x={inX} y={inDY} value={puzzle.inputs.D} />

      <path d={wire(inX + NODE_R, inAY, g1X, g1Y + 14)} fill="none" stroke="#1a1a1a" strokeWidth="1.5" />
      <path d={wire(inX + NODE_R, inBY, g1X, g1Y + GATE_H - 14)} fill="none" stroke="#1a1a1a" strokeWidth="1.5" />
      <GateBox x={g1X} y={g1Y} type={puzzle.gates[0].type} />

      <path d={wire(inX + NODE_R, inCY, g2X, g2Y + 14)} fill="none" stroke="#1a1a1a" strokeWidth="1.5" />
      <path d={wire(inX + NODE_R, inDY, g2X, g2Y + GATE_H - 14)} fill="none" stroke="#1a1a1a" strokeWidth="1.5" />
      <GateBox x={g2X} y={g2Y} type={puzzle.gates[1].type} />

      <path d={wire(g1X + GATE_W, g1MidY, g3X, g3Y + 14)} fill="none" stroke="#1a1a1a" strokeWidth="1.5" />
      <path d={wire(g2X + GATE_W, g2MidY, g3X, g3Y + GATE_H - 14)} fill="none" stroke="#1a1a1a" strokeWidth="1.5" />
      <GateBox x={g3X} y={g3Y} type={puzzle.gates[2].type} />

      <path d={wire(g3OutX, g3MidY, outX - NODE_R, g3MidY)} fill="none" stroke="#1a1a1a" strokeWidth="1.5" />
      <OutputNode x={outX} y={g3MidY} />
    </svg>
  )
}

export default function CircuitDisplay({ puzzle }) {
  return (
    <div className="circuit-display">
      {puzzle.level <= 2 && <Level12 puzzle={puzzle} />}
      {puzzle.level === 3 && <Level3 puzzle={puzzle} />}
      {puzzle.level === 4 && <Level4 puzzle={puzzle} />}
    </div>
  )
}