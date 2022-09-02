import { ReactNode } from "react";
interface IContinuousCarousel {
    direction: "right" | "left" | "up";
    children: ReactNode;
}
declare const ContinuousCarousel: ({ direction, children }: IContinuousCarousel) => JSX.Element;
export default ContinuousCarousel;
