import { makeStyles, useTheme } from "@/theme";
import React from "react";
import { View } from "react-native";
import Svg, {
  Circle,
  Defs,
  G,
  Line,
  LinearGradient,
  Path,
  RadialGradient,
  Rect,
  Stop,
} from "react-native-svg";

interface EmptySearchIllustrationProps {
  size?: number;
}

export default function EmptySearchIllustration({
  size = 220,
}: EmptySearchIllustrationProps) {
  const { colors } = useTheme();
  const styles = useStyles();
  const cx = size / 2;
  const cy = size / 2;

  // Scattered "result card" positions — loosely rotated, faded, drifting away
  const cards = [
    {
      x: cx - size * 0.32,
      y: cy + size * 0.06,
      rot: -14,
      scale: 0.85,
      opacity: 0.5,
    },
    {
      x: cx + size * 0.2,
      y: cy - size * 0.26,
      rot: 10,
      scale: 0.7,
      opacity: 0.35,
    },
    {
      x: cx + size * 0.28,
      y: cy + size * 0.18,
      rot: -8,
      scale: 0.6,
      opacity: 0.25,
    },
  ];

  const glassR = size * 0.16;
  const glassCx = cx - size * 0.03;
  const glassCy = cy - size * 0.04;

  return (
    <View style={styles.container}>
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <Defs>
          <RadialGradient id="bgGlow" cx="50%" cy="45%" r="60%">
            <Stop
              offset="0%"
              stopColor={colors.background.surfaceAlt}
              stopOpacity="1"
            />
            <Stop
              offset="100%"
              stopColor={colors.background.surface}
              stopOpacity="1"
            />
          </RadialGradient>

          <LinearGradient id="cardGrad" x1="0" y1="0" x2="0" y2="1">
            <Stop
              offset="0%"
              stopColor={colors.background.surface}
              stopOpacity="1"
            />
            <Stop
              offset="100%"
              stopColor={colors.background.surfaceAlt}
              stopOpacity="1"
            />
          </LinearGradient>

          <RadialGradient id="lensFill" cx="35%" cy="30%" r="75%">
            <Stop
              offset="0%"
              stopColor={colors.primary.main}
              stopOpacity="0.18"
            />
            <Stop
              offset="100%"
              stopColor={colors.primary.main}
              stopOpacity="0.04"
            />
          </RadialGradient>

          <LinearGradient id="handleGrad" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0%" stopColor={colors.primary.main} />
            <Stop
              offset="100%"
              stopColor={colors.primary.main}
              stopOpacity="0.7"
            />
          </LinearGradient>
        </Defs>

        {/* Background */}
        <Rect
          x={0}
          y={0}
          width={size}
          height={size}
          fill="url(#bgGlow)"
          rx={20}
        />

        {/* Floating dust/particles for depth */}
        <Circle
          cx={cx - size * 0.36}
          cy={cy - size * 0.3}
          r={2.5}
          fill={colors.text.muted}
          opacity={0.4}
        />
        <Circle
          cx={cx + size * 0.38}
          cy={cy - size * 0.02}
          r={2}
          fill={colors.text.muted}
          opacity={0.3}
        />
        <Circle
          cx={cx - size * 0.4}
          cy={cy + size * 0.28}
          r={1.8}
          fill={colors.text.muted}
          opacity={0.3}
        />
        <Circle
          cx={cx + size * 0.32}
          cy={cy + size * 0.34}
          r={2.2}
          fill={colors.text.muted}
          opacity={0.35}
        />

        {/* Scattered faded result cards */}
        {cards.map((c, i) => {
          const w = size * 0.34 * c.scale;
          const h = size * 0.24 * c.scale;
          return (
            <G
              key={i}
              transform={`translate(${c.x}, ${c.y}) rotate(${c.rot})`}
              opacity={c.opacity}
            >
              <Rect
                x={-w / 2}
                y={-h / 2}
                width={w}
                height={h}
                rx={8}
                fill="url(#cardGrad)"
                stroke={colors.border.default}
                strokeWidth={1}
              />
              <Rect
                x={-w / 2 + w * 0.15}
                y={-h / 2 + h * 0.22}
                width={w * 0.5}
                height={h * 0.14}
                rx={3}
                fill={colors.text.muted}
              />
              <Rect
                x={-w / 2 + w * 0.15}
                y={-h / 2 + h * 0.48}
                width={w * 0.3}
                height={h * 0.14}
                rx={3}
                fill={colors.text.muted}
              />
            </G>
          );
        })}

        {/* Magnifying glass — hero element */}
        <G>
          {/* Soft glow behind lens */}
          <Circle
            cx={glassCx}
            cy={glassCy}
            r={glassR + 8}
            fill={colors.primary.main}
            opacity={0.08}
          />

          {/* Handle (drawn first so it sits behind the lens rim) */}
          <Line
            x1={glassCx + glassR * 0.72}
            y1={glassCy + glassR * 0.72}
            x2={glassCx + glassR * 1.55}
            y2={glassCy + glassR * 1.55}
            stroke="url(#handleGrad)"
            strokeWidth={size * 0.032}
            strokeLinecap="round"
          />

          {/* Lens */}
          <Circle cx={glassCx} cy={glassCy} r={glassR} fill="url(#lensFill)" />
          <Circle
            cx={glassCx}
            cy={glassCy}
            r={glassR}
            fill="none"
            stroke={colors.primary.main}
            strokeWidth={size * 0.02}
          />

          {/* Lens glass highlight */}
          <Path
            d={`M ${glassCx - glassR * 0.5} ${glassCy - glassR * 0.55} A ${glassR * 0.8} ${glassR * 0.8} 0 0 1 ${glassCx + glassR * 0.3} ${glassCy - glassR * 0.75}`}
            fill="none"
            stroke={colors.background.surface}
            strokeOpacity={0.6}
            strokeWidth={size * 0.015}
            strokeLinecap="round"
          />

          {/* "Nothing found" mark inside lens */}
          <Line
            x1={glassCx - glassR * 0.32}
            y1={glassCy - glassR * 0.32}
            x2={glassCx + glassR * 0.32}
            y2={glassCy + glassR * 0.32}
            stroke={colors.text.muted}
            strokeWidth={size * 0.016}
            strokeLinecap="round"
          />
          <Line
            x1={glassCx + glassR * 0.32}
            y1={glassCy - glassR * 0.32}
            x2={glassCx - glassR * 0.32}
            y2={glassCy + glassR * 0.32}
            stroke={colors.text.muted}
            strokeWidth={size * 0.016}
            strokeLinecap="round"
          />
        </G>
      </Svg>
    </View>
  );
}

// ─── Theme‑aware styles (at the very bottom) ────────────────────────────────

const useStyles = makeStyles(({ colors, spacing }) => ({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
}));
