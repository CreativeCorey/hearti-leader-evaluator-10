

## Fix: TypeScript build error in tsconfig.node.json

**Problem**: The build error `Referenced project may not disable emit` occurs because `tsconfig.node.json` has `composite: true` but no explicit `noEmit: false`. Since the main `tsconfig.json` sets `noEmit: true`, TypeScript infers emit is disabled for the referenced project too, which conflicts with `composite`.

**Fix** (1 file):

**tsconfig.node.json** — Add `"noEmit": false` to `compilerOptions` to explicitly allow emit for the referenced project. This resolves the TS6310 error.

