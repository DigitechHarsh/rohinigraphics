'use client';

import React from 'react';
import Tilt from 'react-parallax-tilt';

export default function TiltWrapper({ children, className, style, scale = 1.02, glare = true }) {
  return (
    <Tilt
      className={className}
      style={style}
      tiltMaxAngleX={8}
      tiltMaxAngleY={8}
      perspective={1000}
      scale={scale}
      transitionSpeed={1500}
      glareEnable={glare}
      glareMaxOpacity={0.15}
      glarePosition="all"
      glareBorderRadius="var(--radius-md)"
    >
      {children}
    </Tilt>
  );
}
