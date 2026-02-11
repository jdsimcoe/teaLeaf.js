import { useTeaLeaf } from "./TeaLeafContext.jsx";
import { TeaLeafPng } from "./TeaLeafPng.jsx";
import { TeaLeafSvg } from "./TeaLeafSvg.jsx";

export function TeaLeafOutput(props) {
  const { state } = useTeaLeaf();
  return state.format === "svg" ? <TeaLeafSvg {...props} /> : <TeaLeafPng {...props} />;
}
