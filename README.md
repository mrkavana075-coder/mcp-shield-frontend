# MCP Shield — Runtime Defence frontend

A React + Vite + TypeScript demo frontend for an MCP runtime security gateway. It is designed to make the MCP request/response flow visible while keeping simulated events separate from live backend records.

## Requirements

- Node.js LTS (includes npm)
- A modern browser
- VS Code recommended

## Run locally

Open a terminal in this project folder:

```bash
npm install
```

Create your local environment file:

**Windows PowerShell**
```powershell
Copy-Item .env.example .env
```

Start the development server:

```bash
npm run dev
```

Open the local URL printed by Vite (commonly `http://localhost:5173`).

Build for production:

```bash
npm run build
npm run preview
```

## Demo mode and live mode

This project intentionally starts in demo mode. The events, metrics, chart, tool inventory, and policy statuses are illustrative. They must not be presented as real gateway activity.

- Demo events use `source: "demo"`.
- Audit Logs filters to demo events in this build.
- No backend endpoint paths are guessed.
- `VITE_ENABLE_LIVE_API` defaults to `false`.
- A base URL alone does not prove that the backend is connected.

To enable live integration, first get the confirmed API contract from the backend developer. Then implement the actual calls in `src/services/api.ts`, map the backend schemas into `src/types/security.ts`, and update the pages to show live data only when those calls succeed. Keep live audit entries separate from demo entries.

After editing `.env`, restart Vite for changes to take effect.

## Environment variables

See `.env.example`:

- `VITE_API_BASE_URL`: backend base URL provided by your teammate.
- `VITE_ENABLE_LIVE_API`: stays `false` until the real routes and response schemas are known.

Do not commit `.env` or secrets. Vite exposes `VITE_*` variables to browser code, so never place private credentials in them.

## Frontend features

- Overview with metrics, request/response flow illustration, activity chart, and latest decision.
- Runtime Monitor with search, tool/decision/risk filters, and an event detail drawer.
- Tool Security policy cards and example tool inventory.
- Threat Events view with scope caveat.
- Audit Logs with filters and CSV export of visible demo records.
- Settings view for API configuration and refresh behaviour.
- Responsive sidebar, status indicators, refresh controls, and safe/ threat demo simulation.
- Sanitized summaries only; no raw tool arguments or secret values.

## Backend API contract required

Please ask the backend teammate for the actual route names and JSON schemas before implementing calls. These are the *data concepts* needed, not assumed endpoint paths:

1. **Health / gateway status**: whether the gateway is reachable and ready; optional version and timestamp.
2. **Metrics**: total tool calls, allowed, blocked, flagged/sanitized responses, known tools.
3. **Events / audit records**: request ID, timestamp, tool name, sanitized summary, risk category/severity, decision, reason, processing status.
4. **Tool inventory**: tool name, server/name or category, availability/status.
5. **Policy configuration**: policy ID/name, description, enabled state, and whether that state comes from actual backend configuration.
6. **Request inspection / demo trigger**, if the backend supports it: request schema and authoritative decision response. The UI must display the backend decision and must never make the security decision itself.

Also confirm:
- HTTP methods and pagination/filter query parameters.
- CORS allows the frontend origin, for example `http://localhost:5173`, during local development.
- Authentication requirements and error response shape.
- Whether response inspection / sanitization is implemented and how it is represented.

## Suggested source structure

```text
src/
  components/   reusable UI components
  data/         explicitly labelled demo fixtures
  pages/        overview, runtime monitor, tool security, threats, audit, settings
  services/     API integration layer
  types/        TypeScript data contracts
```

## Security notes

- The frontend is a presentation layer, not a policy enforcement point.
- Do not trust browser-side state to enforce policy.
- Never expose raw secrets, credentials, or sensitive tool response contents.
- Do not claim a control is enabled unless backend configuration confirms it.
- Demo mode is not evidence that the MCP gateway is intercepting actual tool calls.
