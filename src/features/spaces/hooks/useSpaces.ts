"use client";

import { useCallback, useEffect, useState } from "react";
import { spacesService } from "../services/spaces.service";
import type { CreateSpaceInput, Space, UpdateSpaceInput } from "../types";

export function useSpaces() {
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSpaces = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await spacesService.getAll();
      setSpaces(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al cargar los espacios",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const createSpace = useCallback(async (input: CreateSpaceInput) => {
    setLoading(true);
    setError(null);
    try {
      const newSpace = await spacesService.create(input);
      setSpaces((prev) => [newSpace, ...prev]);
      return newSpace;
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Error al crear espacio";
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateSpace = useCallback(
    async (id: string, input: UpdateSpaceInput) => {
      setLoading(true);
      setError(null);
      try {
        const updated = await spacesService.update(id, input);
        setSpaces((prev) => prev.map((s) => (s.id === id ? updated : s)));
        return updated;
      } catch (err) {
        const msg =
          err instanceof Error ? err.message : "Error al actualizar espacio";
        setError(msg);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    fetchSpaces();
  }, [fetchSpaces]);

  return {
    spaces,
    loading,
    error,
    fetchSpaces,
    createSpace,
    updateSpace,
  };
}
