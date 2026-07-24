import type { Nullable, Phase1Response, Phase2Response } from './schema';

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL?: string;
}

declare global {
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
}

const BASE_URL = import.meta.env?.VITE_API_BASE_URL || 'https://api.morphysics.io/v1';

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let errorMessage = `Yêu cầu thất bại với trạng thái ${response.status}`;
    let errorDetails: any = null;
    
    try {
      // Đọc body lỗi để lấy chi tiết validation (Cực kỳ quan trọng với lỗi 422)
      errorDetails = await response.json();
      
      if (errorDetails?.message || errorDetails?.error) {
        errorMessage = errorDetails.message || errorDetails.error;
      } else if (errorDetails?.detail) {
        // Cấu trúc lỗi chi tiết thường gặp ở các framework như FastAPI (mảng các lỗi validation)
        errorMessage = typeof errorDetails.detail === 'string' 
          ? errorDetails.detail 
          : JSON.stringify(errorDetails.detail, null, 2);
      }
    } catch {
      try {
        const textError = await response.text();
        errorMessage += ` - Raw Text: ${textError}`;
      } catch {}
    }

    // In toàn bộ thông tin lỗi ra console để debug trực quan
    console.error(`❌ [API Error] Status ${response.status}:`, {
      url: response.url,
      status: response.status,
      message: errorMessage,
      rawDetails: errorDetails
    });

    throw new Error(errorMessage);
  }
  return response.json() as Promise<T>;
}

export const apiService = {
  /**
   * Phase 1: Physics physics_logicner
   */
  async runPhase1(user_prompt: string, filePayload: Nullable<string>): Promise<Phase1Response> {
    // Log payload trước khi gửi (Tránh in chuỗi base64 quá dài làm sập console log)
    console.log('📡 [API Request] Phase 1 Payload:', {
      user_prompt,
      file: filePayload ? `${filePayload.slice(0, 100)}... (truncated)` : null
    });

    const response = await fetch(`${BASE_URL}/ai/phase1`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_prompt,
        file: filePayload,
      }),
    });

    return handleResponse<Phase1Response>(response);
  },

  /**
   * Phase 2: Scene Composer
   */
  async runPhase2(
    canvasSize: [number, number],
    physics_logic: {
      summary: string;
      state: Array<{ key: string; label?: string; initial: number; unit?: string; range?: [number, number] }>;
      equations: string[];
    },
    mapped_components: Array<{
      id: string;
      base_size?: [number, number, number, number];
      visuals: Record<string, any>[];
      anchor_points: string[];
      regions?: Record<string, any>[];
    }>,
    filePayload: Nullable<string>
  ): Promise<Phase2Response> {
    
    // Log cấu trúc chi tiết dữ liệu Phase 2 gửi lên để so sánh với Model/Schema của Backend
    console.log('📡 [API Request] Phase 2 Payload:', {
      canvas_size: canvasSize,
      physics_logic,
      mapped_components,
      file: filePayload ? `${filePayload.slice(0, 100)}... (truncated)` : null
    });

    const response = await fetch(`${BASE_URL}/ai/phase2`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        canvas_size: canvasSize,
        physics_logic,
        mapped_components,
        file: filePayload,
      }),
    });

    return handleResponse<Phase2Response>(response);
  },
};