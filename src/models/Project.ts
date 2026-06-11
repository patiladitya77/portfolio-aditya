import mongoose from "mongoose";

interface IProject extends Document {
  title: string;
  description: string;
  longDescription?: string; // Longer version for details
  technologies: string[];
  github?: string;
  live?: string;
  thumbnail: string; // Path or URL
  order: number;
  isFeatured: boolean;
  isVisible: boolean;
  category?: string; // e.g., "Full-Stack", "AI", "DevOps"
  status: "completed" | "in-progress" | "planned";
  createdAt: Date;
  updatedAt: Date;
}

const projectSchema = new mongoose.Schema<IProject>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200, // Short description for card
    },
    longDescription: {
      type: String,
      trim: true,
      default: null,
    },
    technologies: {
      type: [String],
      required: true,
      default: [],
    },
    github: {
      type: String,
      trim: true,
      default: null,
      match: /^https:\/\/github\.com\/.*|null/, // Optional GitHub URL validation
    },
    live: {
      type: String,
      trim: true,
      default: null,
      match: /^https:\/\/.*|null/, // Optional live URL validation
    },
    thumbnail: {
      type: String,
      required: true,
      trim: true,
    },
    order: {
      type: Number,
      default: 0,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isVisible: {
      type: Boolean,
      default: true,
    },
    category: {
      type: String,
      enum: [
        "Full-Stack",
        "Frontend",
        "Backend",
        "AI",
        "DevOps",
        "Mobile",
        "Other",
      ],
      default: "Full-Stack",
    },
    status: {
      type: String,
      enum: ["completed", "in-progress", "planned"],
      default: "completed",
    },
  },
  { timestamps: true },
);
const Project =
  mongoose.models.Project || mongoose.model("Project", projectSchema);
export default Project;
