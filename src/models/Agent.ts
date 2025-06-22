import mongoose, { Document, Schema } from "mongoose"

export interface IAgent extends Document {
  name: string
  ticker: string
  avatar?: string
  marketCap: number
  bio: string
  topics: string[]
  personalityTraits: string[]
  writingStyle: string
  chatStyle: string
  agentBehavior: string
  createdAt: Date
  updatedAt: Date
}

const AgentSchema = new Schema<IAgent>(
  {
    name: {
      type: String,
      required: [true, "Agent name is required"],
      trim: true,
      maxlength: [50, "Name cannot be more than 50 characters"],
    },
    ticker: {
      type: String,
      required: [true, "Ticker is required"],
      trim: true,
      uppercase: true,
      maxlength: [10, "Ticker cannot be more than 10 characters"],
      unique: true,
      match: [
        /^[A-Z0-9]+$/,
        "Ticker must contain only uppercase letters and numbers",
      ],
    },
    avatar: {
      type: String,
      default: "",
    },
    marketCap: {
      type: Number,
      default: 1000000,
      min: [0, "Market cap must be positive"],
    },
    bio: {
      type: String,
      required: [true, "Bio is required"],
      minlength: [20, "Bio must be at least 20 characters"],
      maxlength: [500, "Bio cannot be more than 500 characters"],
    },
    topics: [
      {
        type: String,
        trim: true,
      },
    ],
    personalityTraits: [
      {
        type: String,
        trim: true,
      },
    ],
    writingStyle: {
      type: String,
      required: [true, "Writing style is required"],
      minlength: [10, "Writing style must be at least 10 characters"],
      maxlength: [300, "Writing style cannot be more than 300 characters"],
    },
    chatStyle: {
      type: String,
      required: [true, "Chat style is required"],
      minlength: [10, "Chat style must be at least 10 characters"],
      maxlength: [300, "Chat style cannot be more than 300 characters"],
    },
    agentBehavior: {
      type: String,
      required: [true, "Agent behavior is required"],
      minlength: [10, "Agent behavior must be at least 10 characters"],
      maxlength: [1000, "Agent behavior cannot be more than 1000 characters"],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
)

// Indexes for better query performance
AgentSchema.index({ ticker: 1 })
AgentSchema.index({ name: 1 })
AgentSchema.index({ marketCap: -1 })
AgentSchema.index({ createdAt: -1 })

export default mongoose.models.Agent ||
  mongoose.model<IAgent>("Agent", AgentSchema)
