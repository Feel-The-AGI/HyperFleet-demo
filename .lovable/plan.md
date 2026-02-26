
# HyperFleet — Interactive Prototype Plan

## Overview
An enterprise SaaS-style interactive prototype of an AI-native fleet intelligence platform for West African logistics. Built with mock data to showcase the full product vision — no backend required at this stage.

## Design Direction
- **Enterprise SaaS aesthetic**: Professional sidebar navigation, structured layouts, data-dense but well-organized
- **Dark/light mode support** leaning toward a clean, professional look
- **Color palette**: Deep navy/slate primary, amber/orange for alerts, green for healthy status, red for critical
- **Typography**: Clean sans-serif, clear hierarchy for data-heavy screens

---

## Pages & Features

### 1. Sidebar Navigation
Persistent sidebar with icon + label navigation organized into sections:
- **Operations**: Dashboard, Fleet Map, Trips, Dispatch Board
- **Management**: Vehicles, Drivers, Fuel, Maintenance
- **Intelligence**: AI Insights, Agent Queue, Anomalies
- **Reports**: Analytics, Compliance, Cost Breakdown
- Collapsible to icon-only mini mode

### 2. Dashboard (Home)
Single-screen operational overview:
- **KPI Cards**: Total vehicles (active/idle/offline), active trips, fuel spend this month, pending alerts, fleet health score
- **Mini Map**: Small interactive map showing vehicle cluster locations
- **Recent AI Proposals**: Top 3-4 agent recommendations with confidence scores and approve/dismiss buttons
- **Activity Feed**: Latest events (trip completed, incident reported, geofence breach)
- **Charts**: Fuel consumption trend (7-day), trip completion rate, driver score distribution

### 3. Fleet Map
Full-screen interactive map (using a map component with mock vehicle markers):
- Vehicle markers color-coded by status (moving = green, idle = amber, stopped = red, offline = gray)
- Click a vehicle → side panel with vehicle details, current driver, trip info, speed, heading
- Geofence boundaries shown as colored overlays
- Filter by status, vehicle type, or region
- Vehicle count summary bar at top

### 4. Trip & Dispatch Management
**Trip List View**:
- Table of all trips (active, scheduled, completed) with status badges
- Columns: Trip ID, origin → destination, driver, vehicle, status, ETA, progress bar
- Filter/search by status, date range, driver

**Dispatch Board**:
- Kanban-style board with columns: Scheduled → In Progress → Completed
- Drag-style cards showing trip summary
- Click card → trip detail modal with route info, timeline, delivery status

**Trip Detail**:
- Route visualization on map
- Timeline of events (departed, checkpoint, fuel stop, arrived)
- Delivery confirmation section with mock photo and signature

### 5. AI Agent Dashboard (Intelligence Hub)
**Agent Proposal Queue**:
- List of AI-generated proposals with: agent name (Fuel, Maintenance, Route, Behavior), confidence score (visual bar), plain-language explanation, timestamp
- Action buttons: Approve, Reject, Defer
- Filter by agent type, confidence level, urgency

**Agent Cards** (one per agent):
- **Fuel Anomaly Agent**: Recent anomaly flags with vehicle, deviation %, theft probability score, and explanation text
- **Predictive Maintenance Agent**: Vehicle health scores (0-100), failure probability by category, recommended maintenance windows
- **Route Intelligence Agent**: Route optimization suggestions, ETA improvements, cross-border advisories
- **Driver Behavior Agent**: Driver narrative profiles, coaching prompts, peer benchmarking charts
- **Compliance Agent**: Expiring documents timeline, hours-of-service warnings, pre-trip compliance checks

### 6. Vehicle Management
- Vehicle list table with: registration, make/model, status badge, health score, assigned driver, last location
- Click → Vehicle detail page:
  - Vehicle profile info
  - Health score gauge with breakdown (engine, tyres, brakes, transmission)
  - Maintenance history timeline
  - Fuel consumption chart
  - Assigned trip history

### 7. Driver Management
- Driver list with: name, photo avatar, license status, behavior score, assigned vehicle, active trip status
- Click → Driver detail page:
  - Profile information and document status
  - Behavior score trend chart (30-day)
  - AI-generated narrative summary (mock text)
  - Coaching recommendations
  - Trip history
  - Hours-of-service tracker (daily/weekly bar chart)

### 8. Fuel Management
- Fuel log table: date, vehicle, driver, litres, cost, station, location
- Fleet fuel consumption chart (daily/weekly)
- Budget vs actual spend comparison
- Price variance by region/country (Ghana vs Togo vs Nigeria)

### 9. Maintenance
- Upcoming maintenance schedule (calendar or list view)
- Overdue items highlighted in red
- Maintenance history log
- Parts inventory summary with low-stock alerts

### 10. Alerts Center
- Unified alert inbox with urgency badges (critical/warning/info)
- Categories: Geofence breach, fuel anomaly, maintenance due, document expiry, hours violation
- Click through to related record
- Mark as acknowledged/resolved

### 11. Reports & Analytics
- Pre-built report cards: Fuel Summary, Trip Performance, Driver Behavior, Fleet Health, Cost Breakdown
- Click a report → detail view with charts and mock data tables
- Export buttons (mock — shows toast "Report downloaded")

---

## Mock Data
All data will be realistic West African fleet data:
- ~25 vehicles with Ghanaian registrations
- ~15 drivers with West African names
- Routes along ECOWAS corridor (Accra, Tema, Kumasi, Lomé, Cotonou, Lagos)
- Realistic fuel prices, distances, and trip durations
- AI agent outputs with confidence scores and natural language explanations

## Interactions
- Sidebar navigation between all pages
- Click-through from summary views to detail pages
- Approve/reject/defer AI proposals
- Filter and search across tables
- Map interactions (click markers, toggle layers)
- Responsive layout (desktop-first, functional on tablet)
