"use client";
import axios from "axios";
import { getCookie } from "@/lib/cookies";

export const client = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:3000",
});

client.interceptors.request.use((config) => {
  const authHeader = config.headers["x-auth-not-required"];
  if (authHeader) return config;

  const token = getCookie("token")?.value;
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }

  return config;
});
