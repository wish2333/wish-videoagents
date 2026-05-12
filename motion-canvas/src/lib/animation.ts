import {all, chain, waitFor, easeOutBack, easeInOutCubic} from '@motion-canvas/core';

// Animation durations (seconds) — aligned with Remotion 8-frame fade at 30fps
export const FADE_DURATION = 0.267;

// Staggered element fade-in timings (converted from Remotion frame ranges at 30fps)
export const TITLE_STAGGER_DELAY = 0.667; // subtitle starts at frame 20
export const TIMELINE_YEAR_DELAY = 0.167; // year starts at frame 5
export const TIMELINE_LINE_DELAY = 0.333; // line starts at frame 10
export const TIMELINE_LABEL_DELAY = 0.667; // era label starts at frame 20
export const OUTRO_MSG_DELAY = 0.333; // message starts at frame 10
export const OUTRO_CHANNEL_DELAY = 0.833; // channel starts at frame 25
export const QUOTE_ATTR_DELAY = 0.833; // attribution starts at frame 25

// Content animation durations
export const ELEMENT_FADE_DURATION = 0.667; // 20 frames
export const CARD_SPRING_DURATION = 0.6;
export const TIMELINE_LINE_DURATION = 0.833; // 25 frames

export {all, chain, waitFor, easeOutBack, easeInOutCubic};
