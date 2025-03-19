"use client"

import type React from "react"

import { useState } from "react"
import { Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function ChatbotInterface() {
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState<{ role: "user" | "ai"; content: string }[]>([
    { role: "ai", content: "Hello! How can I help you learn about Starknet today?" },
  ])

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    // Add user message
    setMessages((prev) => [...prev, { role: "user", content: input }])

    // Simulate AI response (in a real app, this would be an API call)
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          content:
            "This is a simulated response about Starknet. In a real implementation, this would come from your AI backend.",
        },
      ])
    }, 1000)

    setInput("")
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header with logo */}
      <header className="p-4 border-b">
        <div className="container mx-auto">
          <div className="flex items-center">
            <div className="text-2xl font-bold text-primary">TyrionAI</div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 container mx-auto max-w-4xl p-4 flex flex-col">
        {/* Welcome message */}
        <div className="text-center mb-6 mt-4">
          <h1 className="text-xl font-medium text-gray-800">
            Welcome to TyrionAI&apos;s expertise on Starknet.
            <br />
            Learn about Starknet and investment options.
          </h1>
        </div>

        {/* Chat container */}
        <div className="flex-1 overflow-y-auto mb-4 border rounded-lg p-4 bg-gray-50">
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.role === "user" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Input area */}
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message here..."
            className="flex-1"
          />
          <Button type="submit">
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </main>
    </div>
  )
}

