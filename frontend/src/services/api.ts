// src/services/api.ts
import type {
  SuggestionResponse,
  StateControlsResponse,
  PhysicsComponent,
} from "../types";

const API_BASE_URL = "http://localhost:8000/api/scene";

export const apiService = {
  async generateArchitecture(prompt: string): Promise<SuggestionResponse> {
    const response = await fetch(`${API_BASE_URL}/architecture/suggest`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });
    if (!response.ok)
      throw new Error("Failed to generate architecture suggestions");
    return response.json();
  },

  async generateNewComponent(
    prompt: string,
    physics_model_id: string,
  ): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/components/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt, physics_model_id }),
    });
    if (!response.ok) throw new Error("Failed to generate new component");
    return response.json();
  },

  async generateStateAndControls(
    prompt: string,
    physics_model_id: string,
    confirmed_components: PhysicsComponent[],
  ): Promise<StateControlsResponse> {
    const url = `${API_BASE_URL}/state-controls/generate`;

    const payload = {
      prompt,
      physics_model_id,
      confirmed_components,
    };

    console.log("[API] Request -> /state-controls/generate");
    console.log("[API] Payload:", payload);

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const text = await response.text();
      console.log("[API] Raw response text:", text);

      let data: any;
      try {
        data = JSON.parse(text);
      } catch (parseError) {
        console.error("[API] JSON parse error:", parseError);
        throw new Error("Response is not valid JSON");
      }

      if (!response.ok) {
        console.error("[API] Error response:", data);
        throw new Error(
          data?.detail || "Failed to generate state and controls",
        );
      }

      console.log("[API] Parsed data:", data);

      return {
        state: data.state || {},
        selected_control_ids: data.selected_control_ids || [],
        engine: {
          formulas: data.engine?.formulas || {},
          visualBindings: data.engine?.visualBindings || [],
          connections: data.engine?.connections || [],
        },
      };
    } catch (error) {
      console.error("[API] Exception:", error);
      throw error;
    }
  },
};
