import { KbDraw } from "@/modules/kbdraw/KbDraw";
import { cn } from "@/modules/ui/utils/cn";

export default function Home() {
  return (
    <main className={cn("w-screen h-screen", "flex flex-col")}>
      {" "}
      <KbDraw />
    </main>
  );
}
