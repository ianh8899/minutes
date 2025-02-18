"use client";

import { useState } from "react";

export default function AuthForm() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (response.ok) {
        setMessage("Magic link sent! Check your email.");
      } else {
        setMessage(data.error || "Something went wrong.");
      }
    } catch (error) {
      setMessage("Something went wrong.");
    }
  };

  return (
    <div className="flex flex-col items-center">
      <form onSubmit={handleSubmit} className="flex flex-col w-full max-w-md">
        <label htmlFor="email" className="mb-2">
          Email:
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="mb-4 p-2 border border-gray-300 rounded text-black"
        />
        <button
          type="submit"
          className="mb-4 p-2 bg-blue-500 text-white rounded"
        >
          Send Magic Link
        </button>
      </form>
      {message && <p className="mt-4">{message}</p>}
    </div>
  );
}
