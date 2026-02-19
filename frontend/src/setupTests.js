import "@testing-library/jest-dom";
import { vi } from "vitest";

// Mock react-hot-toast
vi.mock("react-hot-toast", () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
  },
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

// Mock react-router-dom
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useParams: vi.fn(() => ({ id: "123" })),
    useNavigate: vi.fn(() => vi.fn()),
  };
});

// Mock lucide-react icons to avoid rendering issues
vi.mock("lucide-react", () => ({
  User: () => null,
  Mail: () => null,
  Phone: () => null,
  Ruler: () => null,
  Weight: () => null,
  FileText: () => null,
  Calendar: () => null,
  Loader2: () => null,
  Download: () => null,
  Activity: () => null,
  Heart: () => null,
  Leaf: () => null,
  Search: () => null,
  Eye: () => null,
  Clock: () => null,
  ChevronDown: () => null,
  ChevronUp: () => null,
  CheckCircle: () => null,
  XCircle: () => null,
  AlertCircle: () => null,
  Stethoscope: () => null,
  Zap: () => null,
  SlidersHorizontal: () => null,
  Trash2: () => null,
  Ban: () => null,
}));

// Suppress console.log in tests
vi.spyOn(console, "log").mockImplementation(() => {});
