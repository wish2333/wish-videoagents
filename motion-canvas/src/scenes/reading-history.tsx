import {makeScene2D} from '@motion-canvas/2d';
import {createRef, all, waitFor} from '@motion-canvas/core';
import {Rect, View2D} from '@motion-canvas/2d';
import {readingHistoryData} from '../data/reading-history';
import {CANVAS_WIDTH, CANVAS_HEIGHT} from '../lib/layout';
import {FADE_DURATION} from '../lib/animation';
import {
  renderTitleCard,
  renderTimelineMarker,
  renderNarrativeSlide,
  renderQuoteSlide,
  renderWorksShowcase,
  renderOutro,
} from '../lib/slide-renderers';

type RendererFn = (view: View2D, slide: any, skipBgFade?: boolean) => Generator;

const SLIDE_RENDERERS: Record<string, RendererFn> = {
  'title': renderTitleCard,
  'timeline-marker': renderTimelineMarker,
  'narrative': renderNarrativeSlide,
  'closing': renderNarrativeSlide,
  'quote': renderQuoteSlide,
  'works-grid': renderWorksShowcase,
  'outro': renderOutro,
};

function getSlideBgColor(slide: any): string {
  if (slide.type === 'quote') return '#272729';
  if (slide.type === 'closing') return '#f5f5f7';
  return '#ffffff';
}

export default makeScene2D(function* (view) {
  const slides = readingHistoryData.slides;
  let prevBg: Rect | null = null;
  let prevBgColor = '';

  for (let i = 0; i < slides.length; i++) {
    const slide = slides[i] as any;
    const renderer = SLIDE_RENDERERS[slide.type];
    if (!renderer) continue;

    const nextBgColor = getSlideBgColor(slide);
    const sameColor = nextBgColor === prevBgColor;

    if (sameColor) {
      // Same background: skip bg fade, background already visible
      yield* renderer(view, slide, true);
    } else {
      // Different background: crossfade
      if (prevBg) {
        // Add new bg on top at full opacity — covers old bg immediately
        const crossBgRef = createRef<Rect>();
        view.add(
          <Rect
            ref={crossBgRef}
            width={CANVAS_WIDTH}
            height={CANVAS_HEIGHT}
            fill={nextBgColor}
            opacity={0}
          />,
        );
        yield* crossBgRef().opacity(1, FADE_DURATION);
        // New bg fully opaque — old bg is now hidden behind it
        prevBg.remove();
        prevBg = crossBgRef();
      }

      // Run renderer with skipBgFade (crossfade bg already visible)
      yield* renderer(view, slide, true);
    }

    // Track the renderer's bg for next crossfade
    // It's the last Rect child added to the view by the renderer
    const viewChildren = view.children();
    for (let j = viewChildren.length - 1; j >= 0; j--) {
      if (viewChildren[j] instanceof Rect) {
        prevBg = viewChildren[j] as Rect;
        break;
      }
    }
    prevBgColor = nextBgColor;
  }
});
