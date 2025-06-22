"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import AvatarUpload from "@/components/AvatarUpload"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import { zodResolver } from "@hookform/resolvers/zod"
import { ChevronLeft, ChevronRight, Loader2, Plus, X } from "lucide-react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import {
  CreateAgentForm,
  Step1Form,
  step1Schema,
  Step2Form,
  step2Schema,
  Step3Form,
  step3Schema,
} from "@/lib/schemas"
import { usePoolDeploy } from "@/hooks/usePoolFactory"

interface AgentCreationResponse {
  _id: string
  name: string
}

const STEPS = [
  { title: "Basic Info", description: "Avatar, name, and behavior" },
  { title: "Personality", description: "Bio, topics, and traits" },
  { title: "Writing Style", description: "Communication preferences" },
]

export default function CreateAgentPage() {
  const router = useRouter()
  const { deploy } = usePoolDeploy()
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState<Partial<CreateAgentForm>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const onDeploy = async () => {
    console.log("asd")
    const data = await deploy({
      name: "",
      symbol: "",
    })
    console.log(data)
  }

  // Step 1 Form
  const step1Form = useForm<Step1Form>({
    resolver: zodResolver(step1Schema),
    defaultValues: {
      avatar: formData.avatar || "",
      name: formData.name || "",
      ticker: formData.ticker || "",
      agentBehavior: formData.agentBehavior || "",
    },
  })

  // Step 2 Form
  const step2Form = useForm<Step2Form>({
    resolver: zodResolver(step2Schema),
    defaultValues: {
      bio: formData.bio || "",
      topics: formData.topics || [],
      personalityTraits: formData.personalityTraits || [],
    },
  })

  const step3Form = useForm<Step3Form>({
    resolver: zodResolver(step3Schema),
    defaultValues: {
      writingStyle: formData.writingStyle || "",
      chatStyle: formData.chatStyle || "",
    },
  })

  const getCurrentForm = () => {
    switch (currentStep) {
      case 0:
        return step1Form
      case 1:
        return step2Form
      case 2:
        return step3Form
      default:
        return step1Form
    }
  }

  const onNext = async () => {
    const form = getCurrentForm()
    const isValid = await form.trigger()

    if (isValid) {
      const stepData = form.getValues()
      setFormData((prev) => ({ ...prev, ...stepData }))

      if (currentStep < STEPS.length - 1) {
        setCurrentStep(currentStep + 1)
      } else {
        // Final submission
        const finalData = { ...formData, ...stepData }
        setIsSubmitting(true)

        const data = await deploy({
          name: finalData.name || "",
          symbol: finalData.ticker || "",
        })
        console.log(data)

        const promise = (): Promise<AgentCreationResponse> =>
          new Promise(async (resolve, reject) => {
            try {
              const response = await fetch("/api/agents", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(finalData),
              })

              const result = await response.json()
              if (response.ok) {
                resolve(result)
              } else {
                reject(result)
              }
            } catch (error) {
              reject(error)
            }
          })

        toast.promise(promise, {
          loading: "Creating your agent...",
          success: (data: AgentCreationResponse) => {
            setTimeout(() => {
              router.push(`/agents/${data._id}`)
            }, 1000)
            return `Agent "${data.name}" created successfully!`
          },
          error: (err) => {
            setIsSubmitting(false)
            return `Error: ${err.error || "Something went wrong."}`
          },
        })
      }
    }
  }

  const onBack = () => {
    if (currentStep > 0) {
      const stepData = getCurrentForm().getValues()
      setFormData((prev) => ({ ...prev, ...stepData }))
      setCurrentStep(currentStep - 1)
    }
  }

  const addArrayItem = (
    field: "topics" | "personalityTraits",
    value: string
  ) => {
    if (!value.trim()) return

    const currentValues = step2Form.getValues(field) || []
    if (!currentValues.includes(value.trim())) {
      step2Form.setValue(field, [...currentValues, value.trim()])
    }
  }

  const removeArrayItem = (
    field: "topics" | "personalityTraits",
    index: number
  ) => {
    const currentValues = step2Form.getValues(field) || []
    step2Form.setValue(
      field,
      currentValues.filter((_, i) => i !== index)
    )
  }

  const progress = ((currentStep + 1) / STEPS.length) * 100

  return (
    <div className="border-base-800 mx-auto w-full max-w-6xl border-b xl:border-x">
      <main>
        <div className="relative flex flex-col justify-between overflow-hidden">
          {/* Background Pattern */}

          <div className="relative mx-auto w-full max-w-2xl py-12 backdrop-blur-3xl md:px-8">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-lg font-medium tracking-tight text-white md:text-lg lg:text-xl">
                Create Your Agent
              </h1>
              <p className="text-muted-foreground max-w-xl text-base text-balance">
                Build an AI agent that reflects your unique style and
                personality
              </p>
            </div>

            <Button onClick={() => onDeploy()}>deploy</Button>
            {/* Progress */}
            <div className="mb-8">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-medium text-white">
                  {STEPS[currentStep].title}
                </span>
                <span className="text-base-400 text-sm font-medium">
                  {/* {Math.round(progress)}% Complete */}
                </span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
            <fieldset disabled={isSubmitting} className="space-y-6">
              {currentStep === 0 && (
                <Form {...step1Form}>
                  <form className="space-y-6">
                    {/* Avatar Upload */}
                    <FormField
                      control={step1Form.control}
                      name="avatar"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base-300">
                            Avatar Image
                          </FormLabel>
                          <FormControl>
                            <AvatarUpload
                              value={field.value}
                              onChange={field.onChange}
                            />
                          </FormControl>
                          <FormDescription className="text-base-500">
                            Upload an avatar image for your agent (optional)
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Name */}
                    <FormField
                      control={step1Form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base-300">
                            Agent Name
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter your agent's name"
                              className="border-base-600 placeholder:text-base-400 text-white"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription className="text-base-500">
                            Choose a memorable name for your agent
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Ticker */}
                    <FormField
                      control={step1Form.control}
                      name="ticker"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base-300">
                            Ticker Symbol
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter ticker (e.g., ALEX)"
                              className="border-base-600 placeholder:text-base-400 text-white uppercase"
                              {...field}
                              onChange={(e) =>
                                field.onChange(e.target.value.toUpperCase())
                              }
                            />
                          </FormControl>
                          <FormDescription className="text-base-500">
                            Unique ticker symbol for your agent (uppercase only)
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Agent Behavior */}
                    <FormField
                      control={step1Form.control}
                      name="agentBehavior"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base-300">
                            Agent Behavior
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Describe how your agent should behave and interact..."
                              className="bg-base-800 border-base-600 placeholder:text-base-400 min-h-[100px] text-white"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription className="text-base-500">
                            Define your agent&apos;s core behavior and
                            interaction style
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </form>
                </Form>
              )}

              {/* Step 2: Personality */}
              {currentStep === 1 && (
                <Form {...step2Form}>
                  <form className="space-y-6">
                    {/* Bio */}
                    <FormField
                      control={step2Form.control}
                      name="bio"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base-300">Bio</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Tell us about your agent's background and personality..."
                              className="bg-base-800 border-base-600 placeholder:text-base-400 min-h-[100px] text-white"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription className="text-base-500">
                            Provide a detailed biography for your agent
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Topics */}
                    <FormField
                      control={step2Form.control}
                      name="topics"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base-300">
                            Topics
                          </FormLabel>
                          <FormControl>
                            <div>
                              <div className="mb-2 flex gap-2">
                                <Input
                                  placeholder="Add a topic..."
                                  className="bg-base-800 border-base-600 placeholder:text-base-400 text-white"
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                      e.preventDefault()
                                      addArrayItem(
                                        "topics",
                                        e.currentTarget.value
                                      )
                                      e.currentTarget.value = ""
                                    }
                                  }}
                                />
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="icon"
                                  className="border-base-600 bg-base-800 hover:bg-base-700"
                                  onClick={(e) => {
                                    const input = e.currentTarget
                                      .previousElementSibling as HTMLInputElement
                                    addArrayItem("topics", input.value)
                                    input.value = ""
                                  }}
                                >
                                  <Plus className="h-4 w-4" />
                                </Button>
                              </div>
                              <div className="flex flex-wrap gap-2">
                                {field.value?.map((topic, index) => (
                                  <Badge
                                    key={index}
                                    variant="secondary"
                                    className="bg-accent-600/20 text-accent-300 border-accent-600/30"
                                  >
                                    {topic}
                                    <button
                                      type="button"
                                      onClick={() =>
                                        removeArrayItem("topics", index)
                                      }
                                      className="hover:text-accent-200 ml-1"
                                    >
                                      <X className="h-3 w-3" />
                                    </button>
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </FormControl>
                          <FormDescription className="text-base-500">
                            Add topics your agent is knowledgeable about (press
                            Enter to add)
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Personality Traits */}
                    <FormField
                      control={step2Form.control}
                      name="personalityTraits"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base-300">
                            Personality Traits
                          </FormLabel>
                          <FormControl>
                            <div>
                              <div className="mb-2 flex gap-2">
                                <Input
                                  placeholder="Add a personality trait..."
                                  className="bg-base-800 border-base-600 placeholder:text-base-400 text-white"
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                      e.preventDefault()
                                      addArrayItem(
                                        "personalityTraits",
                                        e.currentTarget.value
                                      )
                                      e.currentTarget.value = ""
                                    }
                                  }}
                                />
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="icon"
                                  className="border-base-600 bg-base-800 hover:bg-base-700"
                                  onClick={(e) => {
                                    const input = e.currentTarget
                                      .previousElementSibling as HTMLInputElement
                                    addArrayItem(
                                      "personalityTraits",
                                      input.value
                                    )
                                    input.value = ""
                                  }}
                                >
                                  <Plus className="h-4 w-4" />
                                </Button>
                              </div>
                              <div className="flex flex-wrap gap-2">
                                {field.value?.map((trait, index) => (
                                  <Badge
                                    key={index}
                                    variant="secondary"
                                    className="bg-accent-600/20 text-accent-300 border-accent-600/30"
                                  >
                                    {trait}
                                    <button
                                      type="button"
                                      onClick={() =>
                                        removeArrayItem(
                                          "personalityTraits",
                                          index
                                        )
                                      }
                                      className="hover:text-accent-200 ml-1"
                                    >
                                      <X className="h-3 w-3" />
                                    </button>
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </FormControl>
                          <FormDescription className="text-base-500">
                            Describe your agent&apos;s personality traits (press
                            Enter to add)
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </form>
                </Form>
              )}

              {/* Step 3: Writing Style */}
              {currentStep === 2 && (
                <Form {...step3Form}>
                  <form className="space-y-6">
                    {/* Writing Style */}
                    <FormField
                      control={step3Form.control}
                      name="writingStyle"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base-300">
                            Writing Style
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Describe your agent's writing style (formal, casual, technical, creative, etc.)..."
                              className="bg-base-800 border-base-600 placeholder:text-base-400 min-h-[100px] text-white"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription className="text-base-500">
                            Define how your agent should write and express ideas
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Chat Style */}
                    <FormField
                      control={step3Form.control}
                      name="chatStyle"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base-300">
                            Chat Style
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Describe your agent's conversational style (friendly, professional, witty, supportive, etc.)..."
                              className="bg-base-800 border-base-600 placeholder:text-base-400 min-h-[100px] text-white"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription className="text-base-500">
                            Define your agent&apos;s approach to conversations
                            and interactions
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </form>
                </Form>
              )}
            </fieldset>

            {/* Navigation Buttons */}
            <div className="mt-8 flex justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={onBack}
                disabled={currentStep === 0 || isSubmitting}
                className="border-base-600 bg-base-800 hover:bg-base-700 text-white"
              >
                <ChevronLeft className="mr-2 h-4 w-4" />
                Back
              </Button>

              <Button
                type="button"
                onClick={onNext}
                disabled={isSubmitting}
                className=""
              >
                {isSubmitting && currentStep === STEPS.length - 1 ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                {currentStep === STEPS.length - 1 ? "Create Agent" : "Next"}
                {currentStep < STEPS.length - 1 && !isSubmitting && (
                  <ChevronRight className="ml-2 h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
