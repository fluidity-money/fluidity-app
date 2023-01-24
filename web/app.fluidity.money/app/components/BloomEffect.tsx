import type { Property } from "csstype";

import { motion, Variants } from "framer-motion";
import { useMemo } from "react";
import color from "tinycolor2";

type BloomEffectProps = {
  color?: string;
  type: "static" | "pulsing";
  blendMode?: Property.MixBlendMode;
  width?: number;
};

const BloomEffect = (props: BloomEffectProps) => {
  const {
    color: colorStr = "#fff",
    type = "static",
    blendMode,
    width = 70,
  } = props;

  const [colorStart, colorEnd] = useMemo(() => {
    const _color = new color(colorStr);
    return [
      _color.setAlpha(0.8).toRgbString(),
      _color.setAlpha(0).toRgbString(),
    ];
  }, [colorStr]);

  const BloomEffectVariants: Variants = {
    initial: {
      background: `radial-gradient(circle, ${colorStart} 0%, ${colorEnd} 0%)`,
    },
    static: {
      background: `radial-gradient(circle, ${colorStart} 0%, ${colorEnd} ${width}%)`,
    },
    pulsing: {
      transition: {
        repeat: Infinity,
        ease: "easeInOut",
        duration: 2,
      },
      background: [
        `radial-gradient(circle, ${colorStart} 0%, ${colorEnd} ${width}%)`,
        `radial-gradient(circle, ${colorStart} 0%, ${colorEnd} ${width - 10}%)`,
        `radial-gradient(circle, ${colorStart} 0%, ${colorEnd} ${width}%)`,
      ],
    },
  };

  return (
    <motion.div
      style={{
        position: "absolute",
        inset: 0,
        mixBlendMode: blendMode,
      }}
      variants={BloomEffectVariants}
      initial="initial"
      animate={type}
    />
  );
};
export default BloomEffect;
