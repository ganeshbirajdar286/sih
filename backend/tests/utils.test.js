import { jest } from "@jest/globals";

const mockRedis = {
  get: jest.fn(),
  set: jest.fn(),
  setex: jest.fn(),
  del: jest.fn(),
  keys: jest.fn(),
};

jest.unstable_mockModule("../config/redis.config.js", () => ({
  default: mockRedis,
}));

const {
  getOrSetCache,
  setCache,
  getCache,
  deleteCache,
  deleteCachePattern,
  setSession,
  getSession,
  deleteSession,
  acquireLock,
  releaseLock,
} = await import("../utils/redis.utils.js");

describe("Redis Utils", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getOrSetCache", () => {
    it("should return parsed cached data on cache HIT without calling callback", async () => {
      const cachedData = { foo: "bar" };
      mockRedis.get.mockResolvedValue(JSON.stringify(cachedData));
      const callback = jest.fn();

      const result = await getOrSetCache("test_key", callback);

      expect(mockRedis.get).toHaveBeenCalledWith("test_key");
      expect(callback).not.toHaveBeenCalled();
      expect(result).toEqual(cachedData);
    });

    it("should execute callback, set cache and return fresh data on cache MISS", async () => {
      mockRedis.get.mockResolvedValue(null);
      const freshData = { hello: "world" };
      const callback = jest.fn().mockResolvedValue(freshData);
      mockRedis.setex.mockResolvedValue("OK");

      const result = await getOrSetCache("test_key", callback, 600);

      expect(mockRedis.get).toHaveBeenCalledWith("test_key");
      expect(callback).toHaveBeenCalled();
      expect(mockRedis.setex).toHaveBeenCalledWith(
        "test_key",
        600,
        JSON.stringify(freshData)
      );
      expect(result).toEqual(freshData);
    });

    it("should proceed to callback and set cache when redis.get throws error", async () => {
      mockRedis.get.mockRejectedValue(new Error("Redis connection error"));
      const freshData = [1, 2, 3];
      const callback = jest.fn().mockResolvedValue(freshData);

      const result = await getOrSetCache("err_key", callback);

      expect(callback).toHaveBeenCalled();
      expect(result).toEqual(freshData);
    });
  });

  describe("setCache", () => {
    it("should set key with TTL using setex", async () => {
      mockRedis.setex.mockResolvedValue("OK");

      await setCache("myKey", { val: 123 }, 100);

      expect(mockRedis.setex).toHaveBeenCalledWith(
        "myKey",
        100,
        JSON.stringify({ val: 123 })
      );
    });

    it("should handle redis.setex errors gracefully", async () => {
      mockRedis.setex.mockRejectedValue(new Error("Set error"));
      const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});

      await setCache("errKey", "data");

      expect(consoleSpy).toHaveBeenCalledWith("Redis SET error: Set error");
      consoleSpy.mockRestore();
    });
  });

  describe("getCache", () => {
    it("should return parsed JSON when key exists", async () => {
      mockRedis.get.mockResolvedValue(JSON.stringify({ item: "A" }));

      const result = await getCache("itemKey");

      expect(result).toEqual({ item: "A" });
    });

    it("should return null when key does not exist", async () => {
      mockRedis.get.mockResolvedValue(null);

      const result = await getCache("missingKey");

      expect(result).toBeNull();
    });

    it("should return null when redis.get throws error", async () => {
      mockRedis.get.mockRejectedValue(new Error("Fetch failed"));

      const result = await getCache("errorKey");

      expect(result).toBeNull();
    });
  });

  describe("deleteCache", () => {
    it("should call redis.del with the specified key", async () => {
      mockRedis.del.mockResolvedValue(1);

      await deleteCache("delKey");

      expect(mockRedis.del).toHaveBeenCalledWith("delKey");
    });

    it("should handle delete error gracefully", async () => {
      mockRedis.del.mockRejectedValue(new Error("Delete failed"));
      const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});

      await deleteCache("errKey");

      expect(consoleSpy).toHaveBeenCalledWith("Redis DEL error: Delete failed");
      consoleSpy.mockRestore();
    });
  });

  describe("deleteCachePattern", () => {
    it("should search pattern and delete found keys", async () => {
      mockRedis.keys.mockResolvedValue(["user:1", "user:2"]);
      mockRedis.del.mockResolvedValue(2);

      await deleteCachePattern("user:*");

      expect(mockRedis.keys).toHaveBeenCalledWith("user:*");
      expect(mockRedis.del).toHaveBeenCalledWith("user:1", "user:2");
    });

    it("should do nothing if no keys match pattern", async () => {
      mockRedis.keys.mockResolvedValue([]);

      await deleteCachePattern("empty:*");

      expect(mockRedis.keys).toHaveBeenCalledWith("empty:*");
      expect(mockRedis.del).not.toHaveBeenCalled();
    });

    it("should handle error in deleteCachePattern gracefully", async () => {
      mockRedis.keys.mockRejectedValue(new Error("Keys failed"));
      const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});

      await deleteCachePattern("pattern:*");

      expect(consoleSpy).toHaveBeenCalledWith(
        "Redis DEL pattern error: Keys failed"
      );
      consoleSpy.mockRestore();
    });
  });

  describe("Sessions (setSession, getSession, deleteSession)", () => {
    it("setSession should store session with default TTL 86400", async () => {
      mockRedis.setex.mockResolvedValue("OK");

      await setSession("usr123", { role: "admin" });

      expect(mockRedis.setex).toHaveBeenCalledWith(
        "session:usr123",
        86400,
        JSON.stringify({ role: "admin" })
      );
    });

    it("getSession should return parsed session data", async () => {
      mockRedis.get.mockResolvedValue(JSON.stringify({ role: "patient" }));

      const session = await getSession("usr456");

      expect(mockRedis.get).toHaveBeenCalledWith("session:usr456");
      expect(session).toEqual({ role: "patient" });
    });

    it("deleteSession should delete session key", async () => {
      mockRedis.del.mockResolvedValue(1);

      await deleteSession("usr789");

      expect(mockRedis.del).toHaveBeenCalledWith("session:usr789");
    });
  });

  describe("Locks (acquireLock, releaseLock)", () => {
    it("acquireLock should return true when redis returns OK", async () => {
      mockRedis.set.mockResolvedValue("OK");

      const acquired = await acquireLock("lock:resource", 15);

      expect(mockRedis.set).toHaveBeenCalledWith(
        "lock:resource",
        "1",
        "EX",
        15,
        "NX"
      );
      expect(acquired).toBe(true);
    });

    it("acquireLock should return false when redis returns null (lock held)", async () => {
      mockRedis.set.mockResolvedValue(null);

      const acquired = await acquireLock("lock:resource");

      expect(acquired).toBe(false);
    });

    it("acquireLock should return false on error", async () => {
      mockRedis.set.mockRejectedValue(new Error("Lock error"));

      const acquired = await acquireLock("lock:error");

      expect(acquired).toBe(false);
    });

    it("releaseLock should call redis.del for lock key", async () => {
      mockRedis.del.mockResolvedValue(1);

      await releaseLock("lock:resource");

      expect(mockRedis.del).toHaveBeenCalledWith("lock:resource");
    });
  });
});
