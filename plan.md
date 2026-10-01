# PipelinePro — Implementation & Design Plan

## Product scope
PipelinePro is a compact sales tracking dashboard for visualizing revenue trends, deals in progress, and rep performance. The first screen includes KPI cards for Monthly Revenue, Win Rate, and Deals Closed; a sales funnel; revenue-over-time trends; an active-deals table; a rep leaderboard; and persistent sidebar navigation.

## Implementation approach
- Build a lightweight React + Vite single-page dashboard served on the managed runtime port 3000.
- Keep the dashboard data local and deterministic for this frontend prototype so operators can explore filtering, period switching, navigation, and export without a backend dependency.
- Keep route declarations in `public/manus-routes.json`; this implementation uses `/` as the only page route.
- Use CSS-only data visualizations (SVG for the line chart and CSS bars for the funnel) so the interface stays dependency-light and crisp at any viewport.
- Preserve a clear, named component structure in `src/main.tsx`: sidebar, topbar, KPI cards, trend chart, funnel, active deals, leaderboard, and workflow lens.

## Design direction
- **Design Movement:** Editorial Swiss grid meets monochrome fashion-tech dashboard; the user's Mera Integrated System Flow reference informs the sense of sequence, operational handoffs, and process stages.
- **Core Principles:** Dense but breathable; black/white hierarchy first; controls remain close to the data they affect; premium restraint over decoration.
- **Color Philosophy:** Black and off-white carry the brand, with graphite, smoke, and soft paper gray creating depth. Gradients are near-monochrome and used only to separate surfaces. One tiny chart accent, a cool gray, is allowed as a signal rather than a brand color.
- **Layout Paradigm:** Persistent left rail + offset content canvas with a narrow utility rail on the right. The main view is split into compact horizontal bands rather than oversized centered cards.
- **Signature Elements:** A square-line PipelinePro mark; glassy dark sidebar and topbar; numbered workflow chips echoing Job Order → Cutting → Sewing → QC → Inventory.
- **Interaction Philosophy:** Make the operator feel in control. Navigation, period tabs, search, stage filter, and export are always visible, produce immediate local feedback, and never move the main content unexpectedly.
- **Animation:** Use short 160–220ms ease-out transitions for surface hover, progress bars, navigation state, and toast feedback. Avoid continuous motion; use a single subtle shimmer on the active pipeline pulse.
- **Typography System:** Inter for utility and table density, with IBM Plex Mono for values, labels, and the wordmark. Numeric KPIs use tabular figures and strong weight; labels use uppercase 10–11px tracking.
- **Brand Essence:** “The control room for a sharper pipeline.” Personality: precise, composed, quietly premium.
- **Brand Voice:** Concise and operational. Examples: “Pipeline is moving.” and “Keep the handoff clean.”
- **Wordmark & Logo:** A compact PP monogram built from two stepped strokes, followed by a custom-spaced PIPELINEPRO wordmark.
- **Signature Brand Color:** Near-black `#111111`; its ownability comes from the material contrast between ink, paper, and reflective glass rather than a saturated hue.

## Project structure
- `index.html` — browser entry, metadata, and font loading.
- `public/manus-routes.json` — page route manifest for the managed preview/publish flow.
- `src/main.tsx` — React state, dashboard data, reusable view components, and lightweight interaction logic.
- `src/styles.css` — responsive layout, monochrome visual system, chart primitives, glass surfaces, and motion.
- `app.config.ts` — project logo metadata declaration.
- `package.json`, `tsconfig.json`, `vite.config.ts` — pinned frontend toolchain.

## Runtime and constraints
- No authentication or database is required for this dashboard prototype; the managed server/database features remain off.
- The layout must remain useful at desktop and tablet widths, collapsing the rail and table gracefully on small screens.
- Do not add decorative artwork beyond the supplied workflow reference cues; this is an internal tool and information density is the priority.

## PDF-driven scope revision — MERA ISIMS

The dashboard now follows the supplied MERA documentation rather than a generic CRM model. Navigation and terminology are centered on **Sales, Inventory, Job Orders, Production, Back Jobs, Reports, and role-aware management access**. The overview now prioritizes monthly sales from TikTok Shop and Shopee, low-stock alerts with a manual review action, active Job Orders, QC back jobs, production flow from Cutting through Finishing, Job Order timing, and sewer productivity based on recorded output and back jobs.

The low-stock action intentionally alerts and recommends review only; it does not automatically generate or submit a Job Order. The interface remains a monitoring and record-keeping surface for MERA staff, matching the PDF delimitations around manual production, no raw-material procurement, no purchasing automation, and no forecasting or AI features.

## Workflow expansion — production tracking and inventory editing

The Production navigation now reveals a detailed Job Order workspace with order selection, completion quantities, due dates, live status, operator notes, and a five-stage timeline covering Cutting, Sewing, Trimming, Quality Control, and Finishing. The Inventory action now opens a modal for finished-goods review, highlights items at or below minimum, allows direct stock-level edits, and saves or cancels changes locally. The modal keeps the PDF boundary intact: it recommends manual Job Order creation rather than auto-submitting production.

## Authentication — custom MERA credentials

MERA ISIMS now uses a MERA-only username/password provider. The initial username and password are held as protected Webdev runtime secrets and are never committed to source or exposed in chat. The server accepts credentials through a JSON POST, applies a bounded in-memory rate limit, compares values using constant-time hashes, signs a seven-day HS256 application session in the required `webdev_app_session` cookie, and exposes authenticated identity and logout routes. The browser renders the dashboard only after `/api/auth/me` confirms the custom MERA session. The project’s Webdev server capability is enabled and its Docker deployment health path is `/_app/health`.
