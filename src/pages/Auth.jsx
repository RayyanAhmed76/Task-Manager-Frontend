import React, { useState } from "react";
import { api } from "../api/client";

export default function Auth({ onAuthed }) {
  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Basic validation helper
  const validateInputs = () => {
    if (mode === "register" && name.trim().length < 3) {
      setError("Name must be at least 3 characters long");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return false;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return false;
    }

    // Optional: check for strong password
    if (mode === "register" && !/[A-Z]/.test(password)) {
      setError("Password must contain at least one uppercase letter");
      return false;
    }

    if (mode === "register" && !/[0-9]/.test(password)) {
      setError("Password must contain at least one number");
      return false;
    }

    return true;
  };

  async function submit(e) {
    e.preventDefault();
    setError("");
    if (!validateInputs()) return;

    setLoading(true);
    try {
      const data =
        mode === "login"
          ? await api.login({ email, password })
          : await api.register({ name, email, password });

      if (data.user) {
        onAuthed(data.user);
      } else {
        // Handle API error messages
        if (data.message?.toLowerCase().includes("password"))
          setError("Incorrect password. Please try again.");
        else if (data.message?.toLowerCase().includes("email"))
          setError("Email not found or already in use.");
        else setError(data.message || data.error || "Authentication failed.");
      }
    } catch (err) {
      setError("Network error. Please try again later.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100 p-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6 sm:p-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-gray-800">
          {mode === "login" ? "Welcome Back" : "Create Account"}
        </h1>

        {error && (
          <div className="text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2 text-sm mb-4">
            {error}
          </div>
        )}

        <form onSubmit={submit} className="space-y-4">
          {mode === "register" && (
            <input
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          )}
          <input
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            disabled={loading}
            className={`w-full ${
              loading ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
            } text-white font-semibold rounded-lg py-3 transition-colors duration-200`}
          >
            {loading
              ? "Please wait..."
              : mode === "login"
              ? "Sign In"
              : "Create Account"}
          </button>
        </form>

        <div className="text-sm mt-6 text-center">
          {mode === "login" ? (
            <button
              className="text-blue-600 hover:text-blue-700 font-medium"
              onClick={() => {
                setError("");
                setMode("register");
              }}
            >
              Don’t have an account? <span className="underline">Register</span>
            </button>
          ) : (
            <button
              className="text-blue-600 hover:text-blue-700 font-medium"
              onClick={() => {
                setError("");
                setMode("login");
              }}
            >
              Already have an account?{" "}
              <span className="underline">Sign In</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
