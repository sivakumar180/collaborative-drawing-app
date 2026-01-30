
## Architecture Overview

Server is the single source of truth.

- Drawing events streamed via WebSockets
- Cursor positions broadcast separately
- Undo handled by server-side history

This ensures consistency across users.
