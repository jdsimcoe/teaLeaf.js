import { useTeaLeaf } from "./TeaLeafContext.jsx";

export function TeaLeafControls({ className, style }) {
  const { state, setFormat, setVariant, setColor, setBackground, setWidth, setHeight } = useTeaLeaf();

  return (
    <div
      className={className}
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
        gap: "12px",
        ...(style || {}),
      }}
    >
      <label>
        Format
        <select
          value={state.format}
          onChange={(event) => setFormat(event.target.value)}
        >
          <option value="png">PNG</option>
          <option value="svg">SVG</option>
        </select>
      </label>

      <label>
        Variant
        <select
          value={state.variant}
          onChange={(event) => setVariant(event.target.value)}
        >
          <option value="pixel">Pixel</option>
          <option value="triangle">Triangle</option>
        </select>
      </label>

      <label>
        Foreground
        <input
          type="color"
          value={state.color}
          onChange={(event) => setColor(event.target.value)}
        />
      </label>

      <label>
        Background
        <input
          type="color"
          value={state.bg || "#ffffff"}
          onChange={(event) => setBackground(event.target.value)}
        />
      </label>

      <label>
        Width
        <input
          type="number"
          min={1}
          value={state.width}
          onChange={(event) => setWidth(event.target.value)}
        />
      </label>

      <label>
        Height
        <input
          type="number"
          min={1}
          value={state.height}
          onChange={(event) => setHeight(event.target.value)}
        />
      </label>

      <label>
        Transparent BG
        <input
          type="checkbox"
          checked={state.bg == null}
          onChange={(event) => {
            if (event.target.checked) {
              setBackground(null);
            }
          }}
        />
      </label>
    </div>
  );
}
