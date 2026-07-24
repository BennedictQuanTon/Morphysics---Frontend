// --- UTILITY TYPES ---
export type Nullable<T> = T | null;

// --- PHASE 1: PHYSICS PLANNER SCHEMAS ---
export interface PhysicsStateItem {
  key: string;
  label?: string;
  initial: number;
  unit?: string;
  range?: [number, number]; // [min, max] phục vụ render Slider điều khiển công cụ
}

export interface SnapshotValue {
  key: string;
  values: number; // Giá trị tương ứng với key trạng thái vật lý tại thời điểm snapshot
}

export interface Snapshot {
  label: string;
  values: SnapshotValue[];
}

export interface PhysicsPlan {
  summary: string;
  state: PhysicsStateItem[];
  equations: string[];
  snapshots?: Snapshot[];
}

export interface AnchorPoint {
  id: string;
  x: number; // Tọa độ tương đối từ 0 -> 1 theo chiều ngang component
  y: number; // Tọa độ tương đối từ 0 -> 1 theo chiều dọc component
}

export interface VisualElement {
  id?: string;
  type: 'rect' | 'circle' | 'path' | 'group' | 'defs' | 'linearGradient' | 'stop' | string;
  x?: number;
  y?: number;
  w?: number;
  h?: number;
  width?: number;
  height?: number;
  rx?: number;
  ry?: number;
  cx?: number;
  cy?: number;
  r?: number;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  opacity?: number;
  d?: string;          // Dành riêng cho đối tượng SVG Path
  offset?: string;     // Dành cho phần tử stop trong gradient
  color?: string;      // Dành cho phần tử stop trong gradient
  children?: VisualElement[];
}

export interface PhysicsComponent {
  id: string;
  name: string;
  base_size?: [number, number, number, number]; // Quy chuẩn định dạng [x, y, width, height] mặc định
  anchor_points: AnchorPoint[];
  visuals: VisualElement[];
  regions?: Record<string, any>[];
}

export interface Phase1Response {
  plan: PhysicsPlan;
  mapped_components: PhysicsComponent[];
}

// --- PHASE 2: SCENE COMPOSER SCHEMAS ---
export interface AbsolutePlacement {
  type: 'absolute';
  point?: {
    x: number;
    y: number;
  };
}

export interface RelativePlacement {
  type: 'relative';
  attach_to?: string;     // ID của thực thể cha (parent instance id)
  my_anchor?: string;     // ID điểm neo của linh kiện hiện tại
  target_anchor?: string; // ID điểm neo của linh kiện cha được gắn vào
}

export interface SceneInstance {
  instance_id: string;
  component_id: string;
  z_index?: number;
  placement: AbsolutePlacement | RelativePlacement;
}

export interface StateBinding {
  target_instance: string;
  visual_id: string;
  css_attribute: string;  // Chuỗi biểu thức biến đổi quy chuẩn, ví dụ: calc(state.p * 10) hoặc translate(...)
}

export interface Phase2Response {
  instances: SceneInstance[];
  state_bindings: StateBinding[];
}

// --- RESOLVED LAYOUT SCHEMAS (USED IN UI RENDER LAYER) ---
export interface ResolvedInstance extends SceneInstance {
  x: number;
  y: number;
  width: number;
  height: number;
}