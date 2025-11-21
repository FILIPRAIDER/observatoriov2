// Sistema de rate limiting simple en memoria
// Para producción considera usar Redis o Upstash

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

class RateLimiter {
  private requests: Map<string, RateLimitEntry> = new Map();
  private readonly maxRequests: number;
  private readonly windowMs: number;

  constructor(maxRequests: number = 5, windowMinutes: number = 15) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMinutes * 60 * 1000;
  }

  check(identifier: string): { allowed: boolean; remaining: number; resetTime: number } {
    const now = Date.now();
    const entry = this.requests.get(identifier);

    // Limpiar entradas expiradas periódicamente
    if (Math.random() < 0.01) {
      this.cleanup();
    }

    if (!entry || now > entry.resetTime) {
      // Nueva ventana o ventana expirada
      const resetTime = now + this.windowMs;
      this.requests.set(identifier, { count: 1, resetTime });
      return {
        allowed: true,
        remaining: this.maxRequests - 1,
        resetTime,
      };
    }

    if (entry.count >= this.maxRequests) {
      // Límite alcanzado
      return {
        allowed: false,
        remaining: 0,
        resetTime: entry.resetTime,
      };
    }

    // Incrementar contador
    entry.count++;
    this.requests.set(identifier, entry);
    return {
      allowed: true,
      remaining: this.maxRequests - entry.count,
      resetTime: entry.resetTime,
    };
  }

  private cleanup() {
    const now = Date.now();
    for (const [key, entry] of this.requests.entries()) {
      if (now > entry.resetTime) {
        this.requests.delete(key);
      }
    }
  }

  reset(identifier: string) {
    this.requests.delete(identifier);
  }
}

// Instancias para diferentes tipos de formularios
export const newsletterLimiter = new RateLimiter(3, 15); // 3 requests cada 15 minutos
export const contactLimiter = new RateLimiter(5, 30); // 5 requests cada 30 minutos

export function getRemainingTime(resetTime: number): string {
  const minutes = Math.ceil((resetTime - Date.now()) / 60000);
  if (minutes < 1) return "menos de 1 minuto";
  if (minutes === 1) return "1 minuto";
  return `${minutes} minutos`;
}
