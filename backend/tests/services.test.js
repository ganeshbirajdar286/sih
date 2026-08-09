import { jest } from "@jest/globals";

// Mock socket.io Server and socketMiddleware
const mockIo = {
  use: jest.fn(),
  on: jest.fn(),
  emit: jest.fn(),
  to: jest.fn().mockReturnThis(),
  sockets: {
    sockets: {
      get: jest.fn(),
    },
  },
};

const MockServer = jest.fn().mockImplementation(() => mockIo);

jest.unstable_mockModule("socket.io", () => ({
  Server: MockServer,
}));

jest.unstable_mockModule("../middleware/socket.middleware.js", () => ({
  socketMiddleware: jest.fn(),
}));

const initializeSocket = (await import("../services/video-call-services.js")).default;

describe("Video Call Services (initializeSocket)", () => {
  let mockHttpServer;
  let connectionHandler;

  beforeEach(() => {
    jest.clearAllMocks();
    mockHttpServer = {};
    process.env.FRONTEND_URL = "http://localhost:3000";

    initializeSocket(mockHttpServer);
    connectionHandler = mockIo.on.mock.calls.find(
      (call) => call[0] === "connection"
    )[1];
  });

  it("should initialize Socket.IO server and register socketMiddleware", () => {
    expect(MockServer).toHaveBeenCalledWith(
      mockHttpServer,
      expect.objectContaining({
        cors: expect.objectContaining({
          credentials: true,
        }),
        pingTimeout: 60000,
      })
    );
    expect(mockIo.use).toHaveBeenCalled();
  });

  describe("Socket Event Handlers", () => {
    let mockSocket;
    let eventCallbacks;

    beforeEach(() => {
      eventCallbacks = {};
      mockSocket = {
        id: "socket_123",
        emit: jest.fn(),
        on: jest.fn((event, cb) => {
          eventCallbacks[event] = cb;
        }),
      };

      // Trigger connection
      connectionHandler(mockSocket);
    });

    it("should register user and broadcast online users on 'register'", () => {
      eventCallbacks["register"]({ userId: "user_abc" });

      expect(mockIo.emit).toHaveBeenCalledWith("online-users", {
        user_abc: "socket_123",
      });
    });

    it("should ignore 'register' if userId is missing", () => {
      eventCallbacks["register"]({});

      expect(mockIo.emit).not.toHaveBeenCalledWith(
        "online-users",
        expect.anything()
      );
    });

    it("should emit 'user-offline' on 'call-user' if target socket does not exist", () => {
      mockIo.sockets.sockets.get.mockReturnValue(null);

      eventCallbacks["call-user"]({
        to: "target_socket_999",
        from: "socket_123",
        name: "Alice",
        signal: {},
        fromUserId: "user_abc",
      });

      expect(mockSocket.emit).toHaveBeenCalledWith("user-offline");
    });

    it("should forward 'incoming-call' on 'call-user' if target socket exists", () => {
      const targetSocketMock = { id: "target_socket_999" };
      mockIo.sockets.sockets.get.mockReturnValue(targetSocketMock);

      eventCallbacks["call-user"]({
        to: "target_socket_999",
        from: "socket_123",
        name: "Alice",
        signal: { type: "offer" },
        fromUserId: "user_abc",
      });

      expect(mockIo.to).toHaveBeenCalledWith("target_socket_999");
      expect(mockIo.emit).toHaveBeenCalledWith("incoming-call", {
        from: "socket_123",
        fromUserId: "user_abc",
        name: "Alice",
        signal: { type: "offer" },
      });
    });

    it("should forward signal on 'answer-call'", () => {
      eventCallbacks["answer-call"]({
        to: "caller_socket_111",
        signal: { type: "answer" },
      });

      expect(mockIo.to).toHaveBeenCalledWith("caller_socket_111");
      expect(mockIo.emit).toHaveBeenCalledWith("call-accepted", {
        signal: { type: "answer" },
      });
    });

    it("should forward ICE candidate to paired peer on 'ice-candidate'", () => {
      // Pair socket_123 and target_socket_999 first
      mockIo.sockets.sockets.get.mockReturnValue({});
      eventCallbacks["call-user"]({
        to: "target_socket_999",
        from: "socket_123",
        name: "Alice",
        signal: {},
        fromUserId: "user_abc",
      });

      eventCallbacks["ice-candidate"]({ candidate: { sdp: "cand" } });

      expect(mockIo.to).toHaveBeenCalledWith("target_socket_999");
      expect(mockIo.emit).toHaveBeenCalledWith("ice-candidate", {
        candidate: { sdp: "cand" },
      });
    });

    it("should notify peer and clean up on 'end-call'", () => {
      // Pair socket_123 and target_socket_999 first
      mockIo.sockets.sockets.get.mockReturnValue({});
      eventCallbacks["call-user"]({
        to: "target_socket_999",
        from: "socket_123",
        name: "Alice",
        signal: {},
        fromUserId: "user_abc",
      });

      eventCallbacks["end-call"]();

      expect(mockIo.to).toHaveBeenCalledWith("target_socket_999");
      expect(mockIo.emit).toHaveBeenCalledWith("call-ended");
      expect(mockIo.emit).toHaveBeenCalledWith("online-users", expect.anything());
    });

    it("should clean user map and call pair on 'disconnect'", () => {
      // Register user first
      eventCallbacks["register"]({ userId: "user_abc" });

      // Pair call
      mockIo.sockets.sockets.get.mockReturnValue({});
      eventCallbacks["call-user"]({
        to: "target_socket_999",
        from: "socket_123",
        name: "Alice",
        signal: {},
        fromUserId: "user_abc",
      });

      // Trigger disconnect
      eventCallbacks["disconnect"]();

      expect(mockIo.to).toHaveBeenCalledWith("target_socket_999");
      expect(mockIo.emit).toHaveBeenCalledWith("call-ended");
      expect(mockIo.emit).toHaveBeenCalledWith("online-users", {});
    });
  });
});
