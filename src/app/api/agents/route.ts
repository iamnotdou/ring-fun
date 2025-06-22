import { NextRequest, NextResponse } from "next/server"
import Agent from "@/models/Agent"

import dbConnect from "@/lib/mongodb"

// GET /api/agents - Fetch all agents
export async function GET(request: NextRequest) {
  try {
    await dbConnect()

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "10")
    const sortBy = searchParams.get("sortBy") || "createdAt"
    const sortOrder = searchParams.get("sortOrder") || "desc"
    const search = searchParams.get("search") || ""

    const skip = (page - 1) * limit

    // Build search query
    let query = {}
    if (search) {
      query = {
        $or: [
          { name: { $regex: search, $options: "i" } },
          { ticker: { $regex: search, $options: "i" } },
          { topics: { $elemMatch: { $regex: search, $options: "i" } } },
        ],
      }
    }

    // Build sort object
    const sort: Record<string, 1 | -1> = {}
    sort[sortBy] = sortOrder === "desc" ? -1 : 1

    const agents = await Agent.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean()

    const total = await Agent.countDocuments(query)

    return NextResponse.json({
      agents,
      pagination: {
        current: page,
        total: Math.ceil(total / limit),
        count: agents.length,
        totalCount: total,
      },
    })
  } catch (error) {
    console.error("Error fetching agents:", error)
    return NextResponse.json(
      { error: "Failed to fetch agents" },
      { status: 500 }
    )
  }
}

// POST /api/agents - Create a new agent
export async function POST(request: NextRequest) {
  try {
    await dbConnect()

    const body = await request.json()

    // Validate required fields
    const requiredFields = [
      "name",
      "ticker",
      "bio",
      "topics",
      "personalityTraits",
      "writingStyle",
      "chatStyle",
      "agentBehavior",
    ]
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `${field} is required` },
          { status: 400 }
        )
      }
    }

    // Generate a random market cap between 100K and 100M if not provided
    if (!body.marketCap) {
      body.marketCap = Math.floor(Math.random() * (100000000 - 100000) + 100000)
    }

    // Ensure ticker is uppercase
    body.ticker = body.ticker.toUpperCase()

    // Check if ticker already exists
    const existingAgent = await Agent.findOne({ ticker: body.ticker })
    if (existingAgent) {
      return NextResponse.json(
        { error: "Ticker already exists" },
        { status: 409 }
      )
    }

    const agent = new Agent(body)
    await agent.save()

    return NextResponse.json(agent, { status: 201 })
  } catch (error: any) {
    console.error("Error creating agent:", error)

    // Handle validation errors
    if (error.name === "ValidationError") {
      const validationErrors = Object.values(error.errors).map(
        (err: any) => err.message
      )
      return NextResponse.json(
        { error: "Validation failed", details: validationErrors },
        { status: 400 }
      )
    }

    // Handle duplicate key error (ticker)
    if (error.code === 11000) {
      return NextResponse.json(
        { error: "Ticker already exists" },
        { status: 409 }
      )
    }

    return NextResponse.json(
      { error: "Failed to create agent" },
      { status: 500 }
    )
  }
}
