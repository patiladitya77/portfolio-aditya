import mongoose from "mongoose";

interface IExperience extends Document {
  role: string;
  company: string;
  workLocation: string;
  startDate: string; // "2025-12" format (YYYY-MM)
  endDate: string | null; // null for current role
  description: string[];
  isCurrent: boolean;
  skills: string[]; // Technologies used
  order: number; // For sorting
  isVisible: boolean;
  createdAt: Date;
  updatedAt: Date;
}
const experienceSchema = new mongoose.Schema<IExperience>(
  {
    role: {
      type: String,
      required: true,
      trim: true,
    },
    company: {
      type: String,
      required: true,
      trim: true,
    },
    workLocation: {
      type: String,
      required: true,
      trim: true,
    },
    startDate: {
      type: String,
      required: true,
      match: /^\d{4}-\d{2}$/, // YYYY-MM format
    },
    endDate: {
      type: String,
      default: null,
      match: /^\d{4}-\d{2}$|null/, // YYYY-MM format or null
    },
    description: {
      type: [String],
      required: true,
      default: [],
    },
    isCurrent: {
      type: Boolean,
      default: false,
    },
    skills: {
      type: [String],
      default: [],
    },
    order: {
      type: Number,
      default: 0, // Ascending order (0, 1, 2...)
    },
    isVisible: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

const Experience =
  mongoose.models.Experience || mongoose.model("Experience", experienceSchema);
export default Experience;
