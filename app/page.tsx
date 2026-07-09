"use client";

import { useState } from "react";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    setResponse("");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();
      
      if (data.error) {
        setResponse(`Error: ${data.error}`);
      } else {
        // If your API returns { response: "text" }, display it
        setResponse(data.response || JSON.stringify(data));
      }
    } catch (error) {
      setResponse("Failed to connect to the server backend.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ padding: "40px", fontFamily: "sans-serif", maxWidth: "600px", margin: "0 auto", color: "#333" }}>
      <h2 style={{ borderBottom: "2px solid #eaeaea", paddingBottom: "10px" }}>🤖 SQL AI Agent Dashboard</h2>
      
      <p style={{ color: "#666", fontSize: "14px" }}>Ask plain-English questions about your database tables, records, or counts.</p>
      
      <form onSubmit={handleSubmit} style={{ display: "flex", gap: "10px", marginTop: "20px", marginBottom: "25px" }}>
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g., How many records are in the database?"
          disabled={loading}
          style={{ flex: 1, padding: "12px", borderRadius: "6px", border: "1px solid #ccc", fontSize: "15px", outline: "none" }}
        />
        <button
          type="submit"
          disabled={loading}
          style={{ 
            padding: "12px 24px", 
            borderRadius: "6px", 
            border: "none", 
            backgroundColor: loading ? "#ccc" : "#0070f3", 
            color: "white", 
            fontSize: "15px", 
            fontWeight: "bold",
            cursor: loading ? "not-allowed" : "pointer" 
          }}
        >
          {loading ? "Thinking..." : "Ask Agent"}
        </button>
      </form>

      {response && (
        <div style={{ padding: "20px", borderRadius: "6px", backgroundColor: "#f9f9f9", border: "1px solid #e1e1e1" }}>
          <strong style={{ display: "block", marginBottom: "8px", color: "#0070f3" }}>Agent Output:</strong>
          <p style={{ margin: 0, whiteSpace: "pre-wrap", lineHeight: "1.5" }}>{response}</p>
        </div>
      )}
    </main>
  );
}