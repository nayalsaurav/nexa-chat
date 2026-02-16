import { useAnimatedText } from "@/components/ui/animated-text";

export function AnimatedText({
  text,
  animate,
}: {
  text: string;
  animate: boolean;
}) {
  const animated = useAnimatedText(animate ? text : "");
  return <div>{animate ? animated : text}</div>;
}
