# TeaLeaf.js

Deterministic TeaLeaf renderer with PNG/SVG output, color/background controls, and width/height sizing.

## Install

```bash
npm install tealeaf-js
```

## Query Params

- `format=png|svg` (default: `png`)
- `variant=pixel|triangle` (default: `pixel`)
- `triangleSize=<number>` triangle side in grid units (triangle variant only; default `max(2, round(gridSize / 24))`)
- `width=<number>`
- `height=<number>`
- `color=<hex>` (example: `3b7a57`)
- `bg=<hex|transparent>`
- Seed is derived from all non-control query params (same behavior as before).

Example:

```text
?hello&format=svg&width=640&height=360&color=3b7a57&bg=f1ead9
```

## Browser API

```js
import { renderTeaLeafFromLocation } from "tealeaf-js/browser";

const target = document.getElementById("output");
renderTeaLeafFromLocation(target, window.location);
```

## React API (compound components)

```jsx
import { TeaLeaf } from "tealeaf-js/react";

export function Example() {
  return (
    <TeaLeaf.Root seedText="tealeaf::?hello" options={{ width: 500, height: 500 }}>
      <TeaLeaf.Controls />
      <TeaLeaf.Output />
    </TeaLeaf.Root>
  );
}
```

Explicit variants:

```jsx
<TeaLeaf.Root seedText="tealeaf::?hello" options={{ format: "svg" }}>
  <TeaLeaf.Svg />
</TeaLeaf.Root>
```

## Variants

- `pixel` (default): the original renderer — the thresholded field drawn as pixel runs.
- `triangle`: the same field sampled onto an equilateral triangle lattice; each triangle is filled when the field at its centroid is above the threshold. Same seed, same shape, triangle primitives instead of pixels.

```jsx
<TeaLeaf.Root seedText="tealeaf::?hello" variant="triangle" triangleSize={14}>
  <TeaLeaf.Svg />
</TeaLeaf.Root>
```

Core API:

```js
import { createTeaLeafSvg, generateTeaLeafField } from "tealeaf-js/core";

const field = generateTeaLeafField({ seedText: "tealeaf::?hello", gridSize: 64 });
const svg = createTeaLeafSvg({ field, variant: "triangle", triangleSize: 3 });
```

`TeaLeaf.Root` can also read URL params directly:

```jsx
<TeaLeaf.Root querySearch={window.location.search} seedText="tealeaf::?hello">
  <TeaLeaf.Output />
</TeaLeaf.Root>
```

## Local React Playground

```bash
cd /Users/jdsimcoe/Developer/teaLeaf.js
npm run playground:install
npm run playground:dev
```

Then open `http://localhost:5173`.

Build test:

```bash
cd /Users/jdsimcoe/Developer/teaLeaf.js
npm run playground:build
```

## Package Build

```bash
cd /Users/jdsimcoe/Developer/teaLeaf.js
npm run build
```

Build output is written to `dist/` with:
- `tealeaf-js` (root entry)
- `tealeaf-js/core`
- `tealeaf-js/browser`
- `tealeaf-js/react`

## Publish Checklist

```bash
cd /Users/jdsimcoe/Developer/teaLeaf.js
npm login
npm run build
npm pack --dry-run --cache /tmp/tealeaf-npm-cache
npm publish --access public
```
