import mongoose from "mongoose";

interface IPortfolioMetadata extends Document {
  about: string;
  bio: string;
  email: string;
  phone?: string;
  //   location: string;
  socialLinks: {
    github?: string;
    linkedin?: string;
    twitter?: string;
    portfolio?: string;
  };
  skills: string[];
  updatedAt: Date;
}

const MetaDataSchema = new mongoose.Schema<IPortfolioMetadata>(
  {
    about: {
      type: String,
      default: "",
    },
    bio: {
      type: String,
      default: "",
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      default: null,
    },
    // location: {
    //   type: String,
    //   default: '',
    // },
    socialLinks: {
      github: String,
      linkedin: String,
      twitter: String,
      portfolio: String,
    },
    skills: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true },
);

const MetaData = mongoose.model("MetaData", MetaDataSchema);
export default MetaData;
