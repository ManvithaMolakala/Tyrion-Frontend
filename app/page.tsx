"use client"

import React, { useState, useEffect, useRef } from "react"
import { Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function ChatbotInterface() {
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState<{ role: "user" | "ai"; content: string }[]>([
    { role: "ai", content: "Hello! How can I help you learn about Starknet today?" },
  ])

  const messagesEndRef = useRef<HTMLDivElement | null>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMessage = input.trim()
    setMessages((prev) => [...prev, { role: "user", content: userMessage }])
    setInput("")

    try {
      const res = await fetch("http://127.0.0.1:5000/investment-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ statement: userMessage }),
      })

      const data = await res.json()

      if (res.ok && data.investment_plan) {
        const plan = JSON.stringify(data.investment_plan, null, 2)
        setMessages((prev) => [
          ...prev,
          { role: "ai", content: `Here is your investment plan:\n${plan}` },
        ])
      } else {
        setMessages((prev) => [
          ...prev,
          { role: "ai", content: `❌ Error from backend: ${data.error || "Unknown error"}` },
        ])
      }
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { role: "ai", content: "⚠️ Network error. Is the Flask server running on port 5000?" },
      ])
    }
  }

  // Extract structured plan from latest AI message
  const getLatestPlanObject = () => {
    const planMessage = [...messages].reverse().find((m) =>
      m.role === "ai" && m.content.startsWith("Here is your investment plan:")
    )
    if (!planMessage) return null

    const jsonString = planMessage.content.replace("Here is your investment plan:\n", "")
    try {
      return JSON.parse(jsonString)
    } catch {
      return null
    }
  }

  const latestPlan = getLatestPlanObject()

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 p-4 border-b bg-white">
        <div className="container mx-auto">
          <div className="flex items-center">
            <div className="text-2xl font-bold text-primary">TyrionAI</div>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 container mx-auto max-w-4xl px-4 flex flex-col">
        <div className="text-center mb-6 mt-4">
          <h1 className="text-xl font-medium text-gray-800">
            Welcome to TyrionAI&apos;s expertise on Starknet.
            <br />
            Learn about Starknet and investment options.
          </h1>
        </div>

        {/* Chat messages */}
        <div className="flex-1 overflow-y-auto mb-4 border rounded-lg p-4 bg-gray-50">
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 whitespace-pre-wrap ${
                    message.role === "user"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-800"
                  }`}
                >
                  <pre>{message.content}</pre>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Output cards */}
        {latestPlan && (
          <div className="grid gap-6 pb-4">
            {Object.entries(latestPlan).map(([asset, strategies]) => (
              <div
                key={asset}
                className="border rounded-xl shadow-md p-4 bg-white"
              >
                <h2 className="text-lg font-semibold mb-2 text-blue-600">{asset}</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {(strategies as any[]).map((strategy, idx) => (
                    <div
                      key={idx}
                      className="border rounded-lg p-4 bg-gray-50 shadow-sm"
                    >
                      {Object.entries(strategy).map(([k, v]) => (
                        <div key={k} className="mb-1 text-sm">
                          <span className="font-medium capitalize text-gray-600">{k}:</span>{" "}
                          <span className="text-gray-800">{String(v)}</span>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Sticky input box */}
        <div className="sticky bottom-4 bg-white border rounded-xl shadow-md p-3 z-40">
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
        </div>
      </main>

      {/* Footer */}
      <footer className="p-4 text-center text-sm text-gray-500 border-t">
        © 2025 TyrionAI. Built for Starknet education.
      </footer>
    </div>
  )
}
