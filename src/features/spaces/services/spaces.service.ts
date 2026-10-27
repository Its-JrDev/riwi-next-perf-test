import type {
  CreateSpaceInput,
  Space,
  SpacesResponse,
  UpdateSpaceInput,
} from "../types";

const BASE_URL = "/api/spaces";

export const spacesService = {
  /**
   * Obtiene todos los espacios activos (Catálogo público)
   */
  async getAll(): Promise<Space[]> {
    const response = await fetch(BASE_URL, { cache: "no-store" });
    const result: SpacesResponse<Space[]> = await response.json();
    if (!response.ok || !result.success || !result.data) {
      throw new Error(result.error || "Error al obtener los espacios");
    }
    return result.data;
  },

  /**
   * Crea un nuevo espacio (Solo ADMIN)
   */
  async create(data: CreateSpaceInput): Promise<Space> {
    const response = await fetch(BASE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result: SpacesResponse<Space> = await response.json();
    if (!response.ok || !result.success || !result.data) {
      throw new Error(result.error || "Error al crear el espacio");
    }
    return result.data;
  },

  /**
   * Actualiza o desactiva un espacio por ID (Solo ADMIN)
   */
  async update(id: string, data: UpdateSpaceInput): Promise<Space> {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result: SpacesResponse<Space> = await response.json();
    if (!response.ok || !result.success || !result.data) {
      throw new Error(result.error || "Error al actualizar el espacio");
    }
    return result.data;
  },
};
