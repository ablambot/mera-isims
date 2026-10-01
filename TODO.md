# MERA ISIMS acceptance criteria

- Centralize the overview around clothing sales, finished-goods inventory, Job Orders, production progress, back jobs, and sewer productivity.
- Include sales analytics for monthly sales, with TikTok Shop and Shopee channel controls and a sales report action.
- Include finished-goods low-stock alerts and a review action that recommends a new Job Order without auto-creating or auto-submitting one.
- Include active Job Orders with product, quantity, owner, production stage, and timing information.
- Include production tracking across Cutting, Sewing, Trimming, Quality Control, and Finishing.
- Include QC back-job visibility for pending correction items.
- Include sewer productivity based on recorded output and back jobs; it is not a full employee-evaluation view.
- Include persistent navigation for Overview, Sales, Inventory, Job Orders, Production, Back Jobs, and Reports.
- Keep the visual system focused on black and white with restrained soft gradients, rounded corners, subtle glassmorphism, and compact operator-first information density.
- Preserve the MERA operational workflow cues from Job Order through finished inventory, informed by the supplied workflow reference.


## New workflow criteria

- The Production navigation opens a detailed Job Order tracking view with selectable orders, completion quantities, due dates, live status, operator notes, and a stage timeline from Cutting to Finishing.
- The Inventory action opens an interactive modal that lists finished-goods SKUs, variants, locations, current stock, minimum stock, and low-stock status.
- Inventory stock quantities can be edited directly in the modal and saved or canceled without leaving the dashboard.
- Inventory low-stock messaging recommends manual Job Order creation and does not auto-submit production.

## Authentication criteria

- Logged-out users see a MERA-only login screen with username and password fields.
- The initial MERA username and password are stored as protected runtime secrets, not in source code or browser storage.
- Credential checks occur server-side with constant-time comparisons and bounded login-attempt throttling.
- The application uses the required `webdev_app_session` cookie with cross-site Preview-compatible cookie attributes.
- The dashboard is hidden until `/api/auth/me` confirms an authenticated MERA identity.
- Authenticated users can sign out from the dashboard profile controls.
- The server deployment exposes an unauthenticated `/_app/health` success endpoint.
