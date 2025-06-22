import { z } from "zod"

// Step 1: Basic Info (Avatar, Name, Ticker, Agent Behavior)
export const step1Schema = z.object({
  avatar: z
    .string()
    .url("Avatar must be a valid URL")
    .optional()
    .or(z.literal("")),
  avatarFile: z.instanceof(File).optional(),
  name: z
    .string()
    .min(1, "Name is required")
    .max(50, "Name must be less than 50 characters"),
  ticker: z
    .string()
    .min(1, "Ticker is required")
    .max(10, "Ticker must be less than 10 characters")
    .regex(
      /^[A-Z0-9]+$/,
      "Ticker must contain only uppercase letters and numbers"
    ),
  agentBehavior: z
    .string()
    .min(10, "Agent behavior must be at least 10 characters")
    .max(1000, "Agent behavior must be less than 1000 characters"),
})

// Step 2: Personality (Bio, Topics, Personality Traits)
export const step2Schema = z.object({
  bio: z
    .string()
    .min(20, "Bio must be at least 20 characters")
    .max(500, "Bio must be less than 500 characters"),
  topics: z
    .array(z.string().min(1))
    .min(1, "At least one topic is required")
    .max(10, "Maximum 10 topics allowed"),
  personalityTraits: z
    .array(z.string().min(1))
    .min(1, "At least one personality trait is required")
    .max(8, "Maximum 8 personality traits allowed"),
})

// Step 3: Writing Style (Writing Style, Chat Style)
export const step3Schema = z.object({
  writingStyle: z
    .string()
    .min(10, "Writing style description must be at least 10 characters")
    .max(300, "Writing style must be less than 300 characters"),
  chatStyle: z
    .string()
    .min(10, "Chat style description must be at least 10 characters")
    .max(300, "Chat style must be less than 300 characters"),
})

// Combined schema for the entire form
export const createAgentSchema = z.object({
  ...step1Schema.shape,
  ...step2Schema.shape,
  ...step3Schema.shape,
  marketCap: z
    .number()
    .min(0, "Market cap must be a positive number")
    .default(1000000), // Default to 1M
})

// Legacy schemas for backward compatibility
export const basicInfoSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(50, "Name must be less than 50 characters"),
  ticker: z
    .string()
    .min(1, "Ticker is required")
    .max(10, "Ticker must be less than 10 characters")
    .regex(
      /^[A-Z0-9]+$/,
      "Ticker must contain only uppercase letters and numbers"
    ),
  system: z
    .string()
    .min(10, "System prompt must be at least 10 characters")
    .max(1000, "System prompt must be less than 1000 characters"),
})

export const personalitySchema = z.object({
  bio: z
    .string()
    .min(20, "Bio must be at least 20 characters")
    .max(500, "Bio must be less than 500 characters"),
  topics: z
    .array(z.string().min(1))
    .min(1, "At least one topic is required")
    .max(10, "Maximum 10 topics allowed"),
  adjectives: z
    .array(z.string().min(1))
    .min(1, "At least one adjective is required")
    .max(8, "Maximum 8 adjectives allowed"),
})

export const writingStyleSchema = z.object({
  writingStyle: z
    .string()
    .min(10, "Writing style description must be at least 10 characters")
    .max(300, "Writing style must be less than 300 characters"),
  chatStyle: z
    .string()
    .min(10, "Chat style description must be at least 10 characters")
    .max(300, "Chat style must be less than 300 characters"),
})

export const avatarSchema = z.object({
  avatar: z
    .string()
    .url("Avatar must be a valid URL")
    .optional()
    .or(z.literal("")),
  avatarFile: z.instanceof(File).optional(),
})

export type Step1Form = z.infer<typeof step1Schema>
export type Step2Form = z.infer<typeof step2Schema>
export type Step3Form = z.infer<typeof step3Schema>
export type CreateAgentForm = z.infer<typeof createAgentSchema>

// Legacy types
export type BasicInfoForm = z.infer<typeof basicInfoSchema>
export type PersonalityForm = z.infer<typeof personalitySchema>
export type WritingStyleForm = z.infer<typeof writingStyleSchema>
export type AvatarForm = z.infer<typeof avatarSchema>
