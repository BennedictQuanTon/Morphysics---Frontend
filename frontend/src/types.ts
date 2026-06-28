// src/types.ts

export interface VisualData {
  svg_path?: string;
  stroke?: string;
  fill?: string;
  viewBox?: string;
  width?: string;
  height?: string;
}

export interface PhysicsComponent {
  id: string;
  name: string;
  description: string;
  visual_data: VisualData;
  ports?: Record<string, { x: string; y: string }>;
}

export interface Connection {
  source_id: string;
  source_port: string;
  target_id: string;
  target_port: string;
}

export interface VisualBinding {
  component_id: string;
  value_from_formula: string;
  css_variable: string;
  value_template?: string;
  unit?: string;
}

export interface Formulas {
  constants?: Record<string, number>;
  [key: string]: any; // Allow other dynamic string math formulas
}

export interface LabEngine {
  formulas?: Formulas;
  visualBindings?: VisualBinding[];
  connections?: Connection[];
}

export interface StateControlsResponse {
  state: Record<string, number>;
  selected_control_ids: string[];
  engine: LabEngine;
}

export interface SuggestionResponse {
  physics_model_id: string;
  suggested_components: PhysicsComponent[];
}
