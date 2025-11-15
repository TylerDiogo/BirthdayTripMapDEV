# # Birthday Trip Map — SPEC.md

This document defines the specification for the **BirthdayTripMapDEV** project: a static, frontend-only globe visualization of my 30th birthday around-the-world trip.

It is intended to be read by:
- Me (Tyler), as the human owner of the project.
- LLMs (Codex/local models), as the source of truth for behavior and structure.

---

## 1. Overview

BirthdayTripMapDEV is a **React + Vite + TypeScript** web application that:

- Displays an interactive 3D-style globe.
- Plots my trip stops as markers.
- Draws 3D-style flight arcs between each leg of the trip.
- Provides a sidebar timeline and simple search over my stops.
- Is entirely frontend-only and deployable as static assets.

Trip data is stored in a single `trip-data.json` file in the repository and is loaded at runtime.

---

## 2. Data Model — Trip Stops

Trip data lives in `trip-data.json` as an array of objects. Each object represents one **stop**:

```jsonc
{
  "id": "tokyo-hnd",
  "order": 5,
  "city": "Tokyo",
  "country": "Japan",
  "lat": 35.5494,
  "lng": 139.7798,
  "date": "Feb 14–21",
  "note": "Singapore Air SIN → HND, Premium Select"
}

