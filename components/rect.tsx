"use client";

import { JSX, useState } from "react";
import Test from "@/app/2k.jpg";
import { motion } from "motion/react";

export function Rectangle(): JSX.Element {
  const [isHovering, setIsHovering] = useState(false);

  const xText = [
    {
      x: 0,
      text: 0,
    },
    {
      x: 20,
      text: 20,
    },
    {
      x: 40,
      text: 40,
    },
    {
      x: 60,
      text: 60,
    },
    {
      x: 80,
      text: 80,
    },
    {
      x: 100,
      text: 100,
    },
  ];

  const yText = [
    {
      y: 0,
      text: 0,
    },
    {
      y: 20,
      text: 20,
    },
    {
      y: 40,
      text: 40,
    },
    {
      y: 60,
      text: 60,
    },
    {
      y: 80,
      text: 80,
    },
    {
      y: 100,
      text: 100,
    },
  ];

  return (
    <svg
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      viewBox="-8 -5 116 110"
      width="100%"
      className="group/rect"
    >
      <g
        className="font-mono text-muted-foreground hover:text-foreground"
        transform="translate(0 -2)"
      >
        {xText.map((i) => (
          <text
            key={`x-${i.x}`}
            className="font-sans hover:text-primary select-none"
            fill="currentColor"
            textAnchor="middle"
            fontSize="3.5"
            x={i.x}
          >
            {i.text}
          </text>
        ))}
      </g>

      <g
        className="font-mono text-muted-foreground"
        transform="translate(-2 0)"
      >
        {yText.map((i) => (
          <text
            key={`y-${i.y}`}
            className="font-sans hover:text-foreground pointer-events-none"
            fill="currentColor"
            textAnchor="end"
            fontSize="3.5"
            y={i.y}
          >
            {i.text}
          </text>
        ))}
      </g>
      {/* <defs>
        <pattern id=":r0:" patternUnits="userSpaceOnUse" width="10" height="10">
          <motion.path
            d="M 0 10 h 10 v -10"
            className="stroke-foreground/60 group-hover/rect:stroke-violet-400 stroke-morph-hover"
            fill="none"
            vectorEffect="non-scaling-stroke"
            style={{
              strokeDasharray: isHovering ? "0" : "4",
            }}
            transition={{
              strokeDasharray: {
                duration: 0.6,
                ease: "easeInOut",
              },
            }}
          />
        </pattern>
      </defs> */}

      {/* <rect width="100" height="100" fill="url(#:r0:)" /> */}
      <image href={Test.src} x="0" y="0" width="100" height="75" />
      <path
        className="stroke-muted-foreground"
        d="M 0 100 v -100 h 100"
        fill="none"
        strokeDasharray="4"
        vectorEffect="non-scaling-stroke"
      />
      {/* <path
        className="stroke-foreground/60"
        d="M 100 0 v 100 h -100"
        fill="none"
        strokeDasharray="4"
        vectorEffect="non-scaling-stroke"
      /> */}
    </svg>
  );
}
