// src/BackendMock.ts

export interface SimulatedTier2 {
  type: string;
  constants: {
    omega: number;
    amplitude_px: number;
    k: number;
    m: number;
  };
  objects: Array<{
    id: string;
    type: string;
    x?: number;
    y?: number;
    width?: number;
    height?: number;
    label?: string;
    fromId?: string;
    toId?: string;
  }>;
}

export const simulateTier2 = (aiMiniJson: {
  mass?: number;
  k?: number;
  amplitude?: number;
}): SimulatedTier2 => {
  // Lấy dữ liệu AI bóc được (Tier 1)
  const m = aiMiniJson.mass || 0.1;
  const k = aiMiniJson.k || 40;
  const A = aiMiniJson.amplitude || 0.05;

  // Backend tính toán phái sinh
  const omega = Math.sqrt(k / m);
  const amplitude_px = A * 1000;

  // Trả về Hợp đồng JSON (Scene Graph)
  return {
    type: "SPRING_OSCILLATION",
    constants: { omega, amplitude_px, k, m },
    objects: [
      {
        id: "wall_1",
        type: "static_wall",
        x: 20,
        y: 50,
        width: 20,
        height: 100,
      },
      {
        id: "block_1",
        type: "dynamic_block",
        x: 150,
        y: 70,
        width: 60,
        height: 60,
        label: `${m}kg`,
      },
      {
        id: "spring_1",
        type: "spring_line",
        fromId: "wall_1",
        toId: "block_1",
      },
    ],
  };
};
