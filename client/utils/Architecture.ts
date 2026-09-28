export interface UserCanvasPosition {
  x: number;
  y: number;
  zoom: number;
}

export class ArchitectureFuctions {
  private static STORAGE_KEY = 'user_canvas_position';

  /**
   * Saves the user's last screen position / viewport on the canvas.
   * @param position - Canvas screen position containing x, y, and zoom level
   * @param key - Optional custom key or project ID to save position per project
   */
  public static updateUserPosition(
    position: { x: number; y: number; zoom?: number },
    key?: string
  ): void {
    if (typeof window === 'undefined') return;

    try {
      const dataToSave: UserCanvasPosition = {
        x: typeof position.x === 'number' && !isNaN(position.x) ? position.x : 0,
        y: typeof position.y === 'number' && !isNaN(position.y) ? position.y : 0,
        zoom: typeof position.zoom === 'number' && !isNaN(position.zoom) && position.zoom > 0 ? position.zoom : 1,
      };
      const serialized = JSON.stringify(dataToSave);
      if (key) {
        localStorage.setItem(`${ArchitectureFuctions.STORAGE_KEY}_${key}`, serialized);
      }
      localStorage.setItem(ArchitectureFuctions.STORAGE_KEY, serialized);
    } catch (error) {
      console.error('Failed to save user position on canvas:', error);
    }
  }

  /**
   * Saves the user's last screen position / viewport on the canvas (instance method wrapper).
   */
  public updateUserPosition(
    position: { x: number; y: number; zoom?: number },
    key?: string
  ): void {
    ArchitectureFuctions.updateUserPosition(position, key);
  }

  /**
   * Retrieves the saved user screen position / viewport on the canvas.
   * @param key - Optional custom key or project ID
   */
  public static getUserPosition(key?: string): UserCanvasPosition | null {
    if (typeof window === 'undefined') return null;

    try {
      const storageKey = key ? `${ArchitectureFuctions.STORAGE_KEY}_${key}` : ArchitectureFuctions.STORAGE_KEY;
      let saved = localStorage.getItem(storageKey);
      if (!saved && key) {
        saved = localStorage.getItem(ArchitectureFuctions.STORAGE_KEY);
      }
      if (saved) {
        const parsed = JSON.parse(saved);
        if (
          typeof parsed?.x === 'number' && !isNaN(parsed.x) &&
          typeof parsed?.y === 'number' && !isNaN(parsed.y)
        ) {
          return {
            x: parsed.x,
            y: parsed.y,
            zoom: typeof parsed.zoom === 'number' && !isNaN(parsed.zoom) && parsed.zoom > 0 ? parsed.zoom : 1,
          };
        }
      }
    } catch (error) {
      console.error('Failed to get user position from storage:', error);
    }
    return null;
  }

  /**
   * Retrieves the saved user screen position / viewport on the canvas (instance method wrapper).
   */
  public getUserPosition(key?: string): UserCanvasPosition | null {
    return ArchitectureFuctions.getUserPosition(key);
  }
}

// Aliases for compatibility
export const ArchitectureFunctions = ArchitectureFuctions;
export const architectureUtils = new ArchitectureFuctions();
export default ArchitectureFuctions;
