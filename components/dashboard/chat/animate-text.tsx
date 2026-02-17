import { useAnimatedText } from "@/components/ui/animated-text";
import { Streamdown } from "streamdown";
import { code } from "@streamdown/code";
import { mermaid } from "@streamdown/mermaid";
import { math } from "@streamdown/math";
import { cjk } from "@streamdown/cjk";
import "katex/dist/katex.min.css";
import "streamdown/styles.css";

export function AnimatedText({
  text,
  animate,
}: {
  text: string;
  animate: boolean;
}) {
  const animated = useAnimatedText(animate ? text : "");
  return (
    <Streamdown
      plugins={{
        code: code,
        mermaid: mermaid,
        math: math,
        cjk: cjk,
      }}
      shikiTheme={["github-light", "github-dark"]}
    >
      {animate ? animated : text}
    </Streamdown>
  );
}
