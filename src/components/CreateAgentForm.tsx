"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import {
  avatarSchema,
  basicInfoSchema,
  createAgentSchema,
  personalitySchema,
  writingStyleSchema,
  type AvatarForm,
  type BasicInfoForm,
  type CreateAgentForm,
  type PersonalityForm,
  type WritingStyleForm,
} from "@/lib/schemas"

import { Badge } from "./ui/badge"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Textarea } from "./ui/textarea"

const STEPS = [
  {
    id: 1,
    title: "Basic Info",
    description: "Define your agent's core identity",
  },
  { id: 2, title: "Personality", description: "Shape your agent's character" },
  {
    id: 3,
    title: "Writing Style",
    description: "Define how your agent communicates",
  },
  {
    id: 4,
    title: "Avatar",
    description: "Choose your agent's visual identity",
  },
]

export default function CreateAgentForm() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<Partial<CreateAgentForm>>({})
  const [newTopic, setNewTopic] = useState("")
  const [newAdjective, setNewAdjective] = useState("")

  // Step 1 Form
  const step1Form = useForm<BasicInfoForm>({
    resolver: zodResolver(basicInfoSchema),
    defaultValues: {
      name: formData.name || "",
      ticker: formData.ticker || "",
      system: formData.system || "",
    },
  })

  // Step 2 Form
  const step2Form = useForm<PersonalityForm>({
    resolver: zodResolver(personalitySchema),
    defaultValues: {
      bio: formData.bio || "",
      topics: formData.topics || [],
      adjectives: formData.adjectives || [],
    },
  })

  // Step 3 Form
  const step3Form = useForm<WritingStyleForm>({
    resolver: zodResolver(writingStyleSchema),
    defaultValues: {
      writingStyle: formData.writingStyle || "",
      chatStyle: formData.chatStyle || "",
    },
  })

  // Step 4 Form
  const step4Form = useForm<AvatarForm>({
    resolver: zodResolver(avatarSchema),
    defaultValues: {
      avatar: formData.avatar || "",
    },
  })

  const handleNext = async () => {
    let isValid = false
    let stepData = {}

    switch (currentStep) {
      case 1:
        isValid = await step1Form.trigger()
        if (isValid) {
          stepData = step1Form.getValues()
        }
        break
      case 2:
        isValid = await step2Form.trigger()
        if (isValid) {
          stepData = step2Form.getValues()
        }
        break
      case 3:
        isValid = await step3Form.trigger()
        if (isValid) {
          stepData = step3Form.getValues()
        }
        break
      case 4:
        isValid = await step4Form.trigger()
        if (isValid) {
          stepData = step4Form.getValues()
        }
        break
    }

    if (isValid) {
      setFormData((prev) => ({ ...prev, ...stepData }))
      if (currentStep < STEPS.length) {
        setCurrentStep(currentStep + 1)
      }
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async () => {
    const isValid = await step4Form.trigger()
    if (isValid) {
      const finalData = { ...formData, ...step4Form.getValues() }

      // Validate the complete form
      const result = createAgentSchema.safeParse(finalData)
      if (result.success) {
        console.log("Creating agent:", result.data)
        // Here you would typically send the data to your API
        alert("Agent created successfully!")
      } else {
        console.error("Validation errors:", result.error)
      }
    }
  }

  const addTopic = () => {
    if (newTopic.trim() && formData.topics && formData.topics.length < 10) {
      const updatedTopics = [...(formData.topics || []), newTopic.trim()]
      setFormData((prev) => ({ ...prev, topics: updatedTopics }))
      step2Form.setValue("topics", updatedTopics)
      setNewTopic("")
    }
  }

  const removeTopic = (index: number) => {
    const updatedTopics = (formData.topics || []).filter((_, i) => i !== index)
    setFormData((prev) => ({ ...prev, topics: updatedTopics }))
    step2Form.setValue("topics", updatedTopics)
  }

  const addAdjective = () => {
    if (
      newAdjective.trim() &&
      formData.adjectives &&
      formData.adjectives.length < 8
    ) {
      const updatedAdjectives = [
        ...(formData.adjectives || []),
        newAdjective.trim(),
      ]
      setFormData((prev) => ({ ...prev, adjectives: updatedAdjectives }))
      step2Form.setValue("adjectives", updatedAdjectives)
      setNewAdjective("")
    }
  }

  const removeAdjective = (index: number) => {
    const updatedAdjectives = (formData.adjectives || []).filter(
      (_, i) => i !== index
    )
    setFormData((prev) => ({ ...prev, adjectives: updatedAdjectives }))
    step2Form.setValue("adjectives", updatedAdjectives)
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <form className="space-y-4">
            <div className="w-full">
              <div className="mb-1 flex items-baseline justify-between">
                <label
                  htmlFor="name"
                  className="text-sm font-medium text-gray-400"
                >
                  Agent Name
                </label>
              </div>
              <div className="relative z-0 focus-within:z-10">
                <Input
                  {...step1Form.register("name")}
                  id="name"
                  type="text"
                  placeholder="e.g., Virtual Assistant Alex"
                  className="block h-9 w-full rounded-md border border-transparent bg-gray-900 px-4 py-2 align-middle text-xs leading-tight text-gray-400 placeholder-gray-500 shadow-sm ring-1 ring-gray-800 transition duration-300 ease-in-out focus:z-10 focus:border-blue-500 focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
                {step1Form.formState.errors.name && (
                  <p className="mt-1 text-xs text-red-400">
                    {step1Form.formState.errors.name.message}
                  </p>
                )}
              </div>
            </div>

            <div className="w-full">
              <div className="mb-1 flex items-baseline justify-between">
                <label
                  htmlFor="ticker"
                  className="text-sm font-medium text-gray-400"
                >
                  Ticker Symbol
                </label>
              </div>
              <div className="relative z-0 focus-within:z-10">
                <Input
                  {...step1Form.register("ticker")}
                  id="ticker"
                  type="text"
                  placeholder="e.g., ALEX"
                  className="block h-9 w-full rounded-md border border-transparent bg-gray-900 px-4 py-2 align-middle text-xs leading-tight text-gray-400 placeholder-gray-500 shadow-sm ring-1 ring-gray-800 transition duration-300 ease-in-out focus:z-10 focus:border-blue-500 focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
                {step1Form.formState.errors.ticker && (
                  <p className="mt-1 text-xs text-red-400">
                    {step1Form.formState.errors.ticker.message}
                  </p>
                )}
              </div>
            </div>

            <div className="w-full">
              <div className="mb-1 flex items-baseline justify-between">
                <label
                  htmlFor="system"
                  className="text-sm font-medium text-gray-400"
                >
                  System Prompt
                </label>
              </div>
              <div className="relative z-0 focus-within:z-10">
                <Textarea
                  {...step1Form.register("system")}
                  id="system"
                  rows={4}
                  placeholder="Define how your agent should behave and respond..."
                  className="block w-full rounded-md border border-transparent bg-gray-900 px-4 py-2 align-middle text-xs leading-tight text-gray-400 placeholder-gray-500 shadow-sm ring-1 ring-gray-800 transition duration-300 ease-in-out focus:z-10 focus:border-blue-500 focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
                {step1Form.formState.errors.system && (
                  <p className="mt-1 text-xs text-red-400">
                    {step1Form.formState.errors.system.message}
                  </p>
                )}
              </div>
            </div>
          </form>
        )

      case 2:
        return (
          <form className="space-y-4">
            <div className="w-full">
              <div className="mb-1 flex items-baseline justify-between">
                <label
                  htmlFor="bio"
                  className="text-sm font-medium text-gray-400"
                >
                  Agent Bio
                </label>
              </div>
              <div className="relative z-0 focus-within:z-10">
                <Textarea
                  {...step2Form.register("bio")}
                  id="bio"
                  rows={4}
                  placeholder="Tell us about your agent's background and personality..."
                  className="block w-full rounded-md border border-transparent bg-gray-900 px-4 py-2 align-middle text-xs leading-tight text-gray-400 placeholder-gray-500 shadow-sm ring-1 ring-gray-800 transition duration-300 ease-in-out focus:z-10 focus:border-blue-500 focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
                {step2Form.formState.errors.bio && (
                  <p className="mt-1 text-xs text-red-400">
                    {step2Form.formState.errors.bio.message}
                  </p>
                )}
              </div>
            </div>

            <div className="w-full">
              <div className="mb-1 flex items-baseline justify-between">
                <label className="text-sm font-medium text-gray-400">
                  Topics ({(formData.topics || []).length}/10)
                </label>
              </div>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Input
                    value={newTopic}
                    onChange={(e) => setNewTopic(e.target.value)}
                    placeholder="Add a topic..."
                    className="flex-1 bg-gray-900 px-4 py-2 text-xs text-gray-400 placeholder-gray-500 ring-1 ring-gray-800 focus:border-blue-500 focus:ring-blue-600"
                    onKeyPress={(e) =>
                      e.key === "Enter" && (e.preventDefault(), addTopic())
                    }
                  />
                  <Button
                    type="button"
                    onClick={addTopic}
                    variant="outline"
                    size="sm"
                  >
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {(formData.topics || []).map((topic, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="flex items-center gap-1"
                    >
                      {topic}
                      <button
                        type="button"
                        onClick={() => removeTopic(index)}
                        className="ml-1 text-xs hover:text-red-400"
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
                {step2Form.formState.errors.topics && (
                  <p className="text-xs text-red-400">
                    {step2Form.formState.errors.topics.message}
                  </p>
                )}
              </div>
            </div>

            <div className="w-full">
              <div className="mb-1 flex items-baseline justify-between">
                <label className="text-sm font-medium text-gray-400">
                  Personality Traits ({(formData.adjectives || []).length}/8)
                </label>
              </div>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Input
                    value={newAdjective}
                    onChange={(e) => setNewAdjective(e.target.value)}
                    placeholder="Add a personality trait..."
                    className="flex-1 bg-gray-900 px-4 py-2 text-xs text-gray-400 placeholder-gray-500 ring-1 ring-gray-800 focus:border-blue-500 focus:ring-blue-600"
                    onKeyPress={(e) =>
                      e.key === "Enter" && (e.preventDefault(), addAdjective())
                    }
                  />
                  <Button
                    type="button"
                    onClick={addAdjective}
                    variant="outline"
                    size="sm"
                  >
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {(formData.adjectives || []).map((adjective, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="flex items-center gap-1"
                    >
                      {adjective}
                      <button
                        type="button"
                        onClick={() => removeAdjective(index)}
                        className="ml-1 text-xs hover:text-red-400"
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
                {step2Form.formState.errors.adjectives && (
                  <p className="text-xs text-red-400">
                    {step2Form.formState.errors.adjectives.message}
                  </p>
                )}
              </div>
            </div>
          </form>
        )

      case 3:
        return (
          <form className="space-y-4">
            <div className="w-full">
              <div className="mb-1 flex items-baseline justify-between">
                <label
                  htmlFor="writingStyle"
                  className="text-sm font-medium text-gray-400"
                >
                  Writing Style
                </label>
              </div>
              <div className="relative z-0 focus-within:z-10">
                <Textarea
                  {...step3Form.register("writingStyle")}
                  id="writingStyle"
                  rows={4}
                  placeholder="Describe how your agent writes content (formal, casual, creative, etc.)..."
                  className="block w-full rounded-md border border-transparent bg-gray-900 px-4 py-2 align-middle text-xs leading-tight text-gray-400 placeholder-gray-500 shadow-sm ring-1 ring-gray-800 transition duration-300 ease-in-out focus:z-10 focus:border-blue-500 focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
                {step3Form.formState.errors.writingStyle && (
                  <p className="mt-1 text-xs text-red-400">
                    {step3Form.formState.errors.writingStyle.message}
                  </p>
                )}
              </div>
            </div>

            <div className="w-full">
              <div className="mb-1 flex items-baseline justify-between">
                <label
                  htmlFor="chatStyle"
                  className="text-sm font-medium text-gray-400"
                >
                  Chat Style
                </label>
              </div>
              <div className="relative z-0 focus-within:z-10">
                <Textarea
                  {...step3Form.register("chatStyle")}
                  id="chatStyle"
                  rows={4}
                  placeholder="Describe how your agent communicates in conversations..."
                  className="block w-full rounded-md border border-transparent bg-gray-900 px-4 py-2 align-middle text-xs leading-tight text-gray-400 placeholder-gray-500 shadow-sm ring-1 ring-gray-800 transition duration-300 ease-in-out focus:z-10 focus:border-blue-500 focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
                {step3Form.formState.errors.chatStyle && (
                  <p className="mt-1 text-xs text-red-400">
                    {step3Form.formState.errors.chatStyle.message}
                  </p>
                )}
              </div>
            </div>
          </form>
        )

      case 4:
        return (
          <form className="space-y-4">
            <div className="w-full">
              <div className="mb-1 flex items-baseline justify-between">
                <label
                  htmlFor="avatar"
                  className="text-sm font-medium text-gray-400"
                >
                  Avatar URL (Optional)
                </label>
              </div>
              <div className="relative z-0 focus-within:z-10">
                <Input
                  {...step4Form.register("avatar")}
                  id="avatar"
                  type="url"
                  placeholder="https://example.com/avatar.jpg"
                  className="block h-9 w-full rounded-md border border-transparent bg-gray-900 px-4 py-2 align-middle text-xs leading-tight text-gray-400 placeholder-gray-500 shadow-sm ring-1 ring-gray-800 transition duration-300 ease-in-out focus:z-10 focus:border-blue-500 focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
                {step4Form.formState.errors.avatar && (
                  <p className="mt-1 text-xs text-red-400">
                    {step4Form.formState.errors.avatar.message}
                  </p>
                )}
              </div>
            </div>

            {/* Preview Section */}
            <div className="w-full rounded-md bg-gray-800 p-4">
              <h3 className="mb-3 text-sm font-medium text-gray-300">
                Agent Preview
              </h3>
              <div className="space-y-2 text-xs text-gray-400">
                <p>
                  <span className="text-gray-300">Name:</span>{" "}
                  {formData.name || "Not set"}
                </p>
                <p>
                  <span className="text-gray-300">Ticker:</span>{" "}
                  {formData.ticker || "Not set"}
                </p>
                <p>
                  <span className="text-gray-300">Topics:</span>{" "}
                  {(formData.topics || []).join(", ") || "None added"}
                </p>
                <p>
                  <span className="text-gray-300">Traits:</span>{" "}
                  {(formData.adjectives || []).join(", ") || "None added"}
                </p>
              </div>
            </div>
          </form>
        )

      default:
        return null
    }
  }

  return (
    <div className="text-center">
      <h1 className="text-2xl font-medium tracking-tight text-white sm:text-2xl md:text-3xl lg:text-4xl">
        Create Your AI Agent
      </h1>
      <p className="mx-auto mt-4 max-w-xl text-base text-balance text-gray-400">
        Build a unique AI agent with custom personality, knowledge, and style.
      </p>

      {/* Progress Indicator */}
      <div className="mt-8 mb-8 flex justify-center">
        <div className="flex items-center space-x-2">
          {STEPS.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium ${
                  currentStep >= step.id
                    ? "bg-blue-600 text-white"
                    : "bg-gray-700 text-gray-400"
                }`}
              >
                {step.id}
              </div>
              {index < STEPS.length - 1 && (
                <div
                  className={`mx-2 h-0.5 w-8 ${
                    currentStep > step.id ? "bg-blue-600" : "bg-gray-700"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step Info */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-white">
          {STEPS[currentStep - 1].title}
        </h2>
        <p className="mt-1 text-sm text-gray-400">
          {STEPS[currentStep - 1].description}
        </p>
      </div>

      {/* Form Content */}
      <div className="mt-10">{renderStepContent()}</div>

      {/* Navigation Buttons */}
      <div className="mt-8 flex justify-between gap-4">
        <Button
          type="button"
          onClick={handleBack}
          disabled={currentStep === 1}
          variant="outline"
          className="max-w-32 flex-1"
        >
          Back
        </Button>

        {currentStep < STEPS.length ? (
          <Button
            type="button"
            onClick={handleNext}
            className="outline-inset flex h-11 flex-1 items-center justify-center gap-4 rounded-full bg-blue-600 px-8 py-4 text-center text-base font-medium text-white transition-colors duration-500 ease-in-out hover:bg-blue-700 focus:outline focus:outline-2 focus:outline-blue-700"
          >
            Next Step
          </Button>
        ) : (
          <Button
            type="button"
            onClick={handleSubmit}
            className="outline-inset flex h-11 flex-1 items-center justify-center gap-4 rounded-full bg-green-600 px-8 py-4 text-center text-base font-medium text-white transition-colors duration-500 ease-in-out hover:bg-green-700 focus:outline focus:outline-2 focus:outline-green-700"
          >
            Create Agent
          </Button>
        )}
      </div>
    </div>
  )
}
