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
const mockIcon = () => null;
vi.mock("lucide-react", () => ({
  User: mockIcon,
  Mail: mockIcon,
  Phone: mockIcon,
  Ruler: mockIcon,
  Weight: mockIcon,
  FileText: mockIcon,
  Calendar: mockIcon,
  Loader2: mockIcon,
  Download: mockIcon,
  Activity: mockIcon,
  Heart: mockIcon,
  Leaf: mockIcon,
  Search: mockIcon,
  Eye: mockIcon,
  Clock: mockIcon,
  ChevronDown: mockIcon,
  ChevronUp: mockIcon,
  CheckCircle: mockIcon,
  XCircle: mockIcon,
  AlertCircle: mockIcon,
  Stethoscope: mockIcon,
  Zap: mockIcon,
  SlidersHorizontal: mockIcon,
  Trash2: mockIcon,
  Ban: mockIcon,
  UploadCloud: mockIcon,
  Plus: mockIcon,
  X: mockIcon,
  File: mockIcon,
  Check: mockIcon,
  Upload: mockIcon,
  ChevronRight: mockIcon,
  ExternalLink: mockIcon,
  TrendingUp: mockIcon,
  Layers: mockIcon,
  FolderOpen: mockIcon,
  Filter: mockIcon,
  CheckCircle2: mockIcon,
  AlertTriangle: mockIcon,
}));

// Suppress console.log in tests
vi.spyOn(console, "log").mockImplementation(() => {});
