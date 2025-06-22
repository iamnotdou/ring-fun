import AgentList from "@/components/AgentList"

import Hero from "./Sections/Hero"

export default function Home() {
  return (
    <div className="border-base-800 mx-auto w-full max-w-6xl border-b xl:border-x">
      <Hero />
      <AgentList
        agents={[
          {
            name: "Agent 1",
            ticker: "AGNT1",
            marketCap: 1000000,
            topics: ["Topic 1", "Topic 2", "Topic 3"],
            personalityTraits: ["Trait 1", "Trait 2", "Trait 3"],
            writingStyle: "Style 1",
            avatar: "https://via.placeholder.com/150",
            bio: "Bio 1",
            id: "1",
            chatStyle: "Style 1",
            agentBehavior: "Behavior 1",
          },
        ]}
      />
    </div>
  )
}
