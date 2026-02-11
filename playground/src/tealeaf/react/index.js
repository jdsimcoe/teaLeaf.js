import { useTeaLeaf } from "./TeaLeafContext.jsx";
import { TeaLeafControls } from "./TeaLeafControls.jsx";
import { TeaLeafOutput } from "./TeaLeafOutput.jsx";
import { TeaLeafPng } from "./TeaLeafPng.jsx";
import { TeaLeafRoot } from "./TeaLeafRoot.jsx";
import { TeaLeafSvg } from "./TeaLeafSvg.jsx";

const TeaLeaf = {
  Root: TeaLeafRoot,
  Output: TeaLeafOutput,
  Png: TeaLeafPng,
  Svg: TeaLeafSvg,
  Controls: TeaLeafControls,
};

export { TeaLeaf, TeaLeafControls, TeaLeafOutput, TeaLeafPng, TeaLeafRoot, TeaLeafSvg, useTeaLeaf };
