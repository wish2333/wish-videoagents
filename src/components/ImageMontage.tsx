import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  Sequence,
} from "remotion";
import { useTheme } from "../styles";

interface ImageMontageProps {
  images: { src: string; durationInFrames: number }[];
  transitionDuration?: number;
}

const ImageSlide: React.FC<{
  src: string;
  durationInFrames: number;
  transitionDuration: number;
  index: number;
}> = ({ src, durationInFrames, transitionDuration, index }) => {
  const frame = useCurrentFrame();

  const progress = interpolate(
    frame,
    [0, transitionDuration, durationInFrames - transitionDuration, durationInFrames],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  const scale = interpolate(frame, [0, durationInFrames], [1, 1.08], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ opacity: progress }}>
      <img
        src={src}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: `scale(${scale})`,
        }}
      />
    </AbsoluteFill>
  );
};

export const ImageMontage: React.FC<ImageMontageProps> = ({
  images,
  transitionDuration = 8,
}) => {
  const theme = useTheme();
  let offset = 0;

  return (
    <AbsoluteFill style={{ backgroundColor: theme.colors.background }}>
      {images.map((image, index) => {
        const start = offset;
        offset += image.durationInFrames;
        return (
          <Sequence key={index} from={start} durationInFrames={image.durationInFrames}>
            <ImageSlide
              src={image.src}
              durationInFrames={image.durationInFrames}
              transitionDuration={transitionDuration}
              index={index}
            />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
