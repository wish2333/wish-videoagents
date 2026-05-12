import {Rect, Txt, Layout, Node, View2D} from '@motion-canvas/2d';
import {createRef, all, waitFor} from '@motion-canvas/core';
import {DISPLAY_FONT, BODY_FONT, QUOTE_FONT} from './fonts';
import {COLORS, CARD_DIMENSIONS, SPACING, CANVAS_WIDTH, CANVAS_HEIGHT} from './layout';
import {
  FADE_DURATION,
  TITLE_STAGGER_DELAY,
  TIMELINE_YEAR_DELAY,
  TIMELINE_LINE_DELAY,
  TIMELINE_LABEL_DELAY,
  OUTRO_MSG_DELAY,
  OUTRO_CHANNEL_DELAY,
  QUOTE_ATTR_DELAY,
  ELEMENT_FADE_DURATION,
  CARD_SPRING_DURATION,
  TIMELINE_LINE_DURATION,
  easeOutBack,
} from './animation';

// --- Slide type definitions ---

interface ReferencedWork {
  title: string;
  author?: string;
  mediaType: string;
  year?: string;
  imageSrc: string;
}

interface BaseSlide {
  id: string;
  type: string;
  sectionIndex: number;
  sectionTitle: string;
  durationSeconds: number;
}

interface TitleSlide extends BaseSlide {
  type: 'title';
  title: string;
  subtitle?: string;
}

interface TimelineMarkerSlide extends BaseSlide {
  type: 'timeline-marker';
  year: string;
  eraLabel?: string;
}

interface NarrativeSlide extends BaseSlide {
  type: 'narrative' | 'closing';
  text: string;
  year?: string;
  works?: ReferencedWork[];
}

interface QuoteSlide extends BaseSlide {
  type: 'quote';
  text: string;
  attribution?: string;
}

interface WorksGridSlide extends BaseSlide {
  type: 'works-grid';
  title?: string;
  works: ReferencedWork[];
}

interface OutroSlide extends BaseSlide {
  type: 'outro';
  channelName?: string;
  message?: string;
}

type Slide = TitleSlide | TimelineMarkerSlide | NarrativeSlide | QuoteSlide | WorksGridSlide | OutroSlide;

// --- Timing pattern ---
// Phase 1: fadeGroup  — bg + first content element fade in (concurrent)
// Phase 2: staggerGroup — remaining elements with stagger delays (concurrent)
// Phase 3: hold — wait for remaining duration
// Total = slide.durationSeconds (exact)
// Background never fades to black — scene loop handles crossfade between slides.

// --- Title Card ---

export function* renderTitleCard(view: View2D, slide: TitleSlide, skipBgFade = false) {
  const bg = createRef<Rect>();
  const titleNode = createRef<Txt>();
  const subtitleNode = createRef<Txt>();

  view.add(
    <Rect
      ref={bg}
      width={CANVAS_WIDTH}
      height={CANVAS_HEIGHT}
      fill={COLORS.titleBackground}
      opacity={skipBgFade ? 1 : 0}
    >
      <Layout
        layout
        direction="column"
        alignItems="center"
        justifyContent="center"
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        padding={[80, 160]}
      >
        <Txt
          ref={titleNode}
          text={slide.title}
          fill={COLORS.titleText}
          fontSize={80}
          fontWeight={600}
          fontFamily={DISPLAY_FONT}
          textWrap
          textAlign="center"
          opacity={0}
          lineHeight={'107%'}
          letterSpacing={-0.28}
        />
        {slide.subtitle && (
          <Txt
            ref={subtitleNode}
            text={slide.subtitle}
            fill={COLORS.subtitleText}
            fontSize={30}
            fontWeight={400}
            fontFamily={DISPLAY_FONT}
            textWrap
            textAlign="center"
            opacity={0}
            marginTop={32}
            lineHeight={'114%'}
            letterSpacing={0.196}
          />
        )}
      </Layout>
    </Rect>,
  );

  // Phase 1: bg + title fade in concurrently
  const bgFade = skipBgFade ? waitFor(0) : bg().opacity(1, ELEMENT_FADE_DURATION);
  yield* all(bgFade, titleNode().opacity(1, ELEMENT_FADE_DURATION));

  // Phase 2: subtitle with delay
  if (subtitleNode()) {
    yield* all(
      waitFor(TITLE_STAGGER_DELAY),
      subtitleNode().opacity(1, ELEMENT_FADE_DURATION),
    );
  }

  // Phase 3: hold
  const elapsed = ELEMENT_FADE_DURATION + (subtitleNode() ? TITLE_STAGGER_DELAY : 0);
  yield* waitFor(Math.max(0, slide.durationSeconds - elapsed));
}

// --- Timeline Marker ---

export function* renderTimelineMarker(view: View2D, slide: TimelineMarkerSlide, skipBgFade = false) {
  const bg = createRef<Rect>();
  const yearNode = createRef<Txt>();
  const lineNode = createRef<Rect>();
  const labelNode = createRef<Txt>();

  view.add(
    <Rect
      ref={bg}
      width={CANVAS_WIDTH}
      height={CANVAS_HEIGHT}
      fill={COLORS.background}
      opacity={skipBgFade ? 1 : 0}
    >
      <Layout
        layout
        direction="column"
        alignItems="center"
        justifyContent="center"
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        gap={24}
      >
        <Txt
          ref={yearNode}
          text={slide.year}
          fill={COLORS.titleText}
          fontSize={240}
          fontWeight={600}
          fontFamily={DISPLAY_FONT}
          opacity={0}
          lineHeight={'107%'}
          letterSpacing={-4}
        />
        <Rect
          ref={lineNode}
          width={0}
          height={2}
          fill={COLORS.timelineLine}
          radius={1}
        />
        {slide.eraLabel && (
          <Txt
            ref={labelNode}
            text={slide.eraLabel}
            fill={COLORS.sectionTitle}
            fontSize={28}
            fontWeight={400}
            fontFamily={DISPLAY_FONT}
            opacity={0}
            marginTop={8}
            lineHeight={'114%'}
            letterSpacing={0.196}
          />
        )}
      </Layout>
    </Rect>,
  );

  // Phase 1: bg + year fade in
  const bgFade = skipBgFade ? waitFor(0) : bg().opacity(1, ELEMENT_FADE_DURATION);
  yield* all(bgFade, yearNode().opacity(1, ELEMENT_FADE_DURATION));

  // Phase 2: line + label concurrently with delays
  yield* all(
    waitFor(TIMELINE_LINE_DELAY),
    lineNode().width(CANVAS_WIDTH * 0.6, TIMELINE_LINE_DURATION),
    labelNode()
      ? all(waitFor(TIMELINE_LABEL_DELAY), labelNode().opacity(1, ELEMENT_FADE_DURATION))
      : waitFor(0),
  );

  // Phase 3: hold
  const elapsed = Math.max(
    TIMELINE_LINE_DELAY + TIMELINE_LINE_DURATION,
    slide.eraLabel ? TIMELINE_LABEL_DELAY + ELEMENT_FADE_DURATION : 0,
  );
  yield* waitFor(Math.max(0, slide.durationSeconds - elapsed));
}

// --- Narrative Slide ---

export function* renderNarrativeSlide(view: View2D, slide: NarrativeSlide, skipBgFade = false) {
  const isClosing = slide.type === 'closing';
  const bgColor = isClosing ? COLORS.closingBackground : COLORS.background;
  const textColor = isClosing ? COLORS.closingText : COLORS.bodyText;
  const fontSize = isClosing ? 40 : 44;

  const bg = createRef<Rect>();
  const textNode = createRef<Txt>();
  const yearBadge = createRef<Rect>();
  const worksContainer = createRef<Layout>();

  const hasWorks = slide.works && slide.works.length > 0;
  const workCount = hasWorks ? slide.works!.length : 0;
  const isSideLayout = workCount >= 1 && workCount <= 2;

  const textWidth = hasWorks
    ? isSideLayout
      ? CANVAS_WIDTH * 0.5 - SPACING.narrativePadding - SPACING.textGap / 2
      : CANVAS_WIDTH - SPACING.narrativePadding * 2
    : 1400;

  view.add(
    <Rect
      ref={bg}
      width={CANVAS_WIDTH}
      height={CANVAS_HEIGHT}
      fill={bgColor}
      opacity={skipBgFade ? 1 : 0}
    >
      <Layout
        layout
        direction={isSideLayout ? 'row' : 'column'}
        alignItems="center"
        justifyContent="center"
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        padding={SPACING.narrativePadding}
        gap={SPACING.textGap}
      >
        <Txt
          ref={textNode}
          text={slide.text}
          fill={textColor}
          fontSize={fontSize}
          fontWeight={400}
          fontFamily={BODY_FONT}
          textWrap
          textAlign="left"
          opacity={0}
          width={textWidth}
          lineHeight={'147%'}
          letterSpacing={-0.374}
        />
        {hasWorks && (
          <Layout
            ref={worksContainer}
            layout
            direction={isSideLayout ? 'column' : 'row'}
            gap={SPACING.cardGap}
            alignItems="center"
            justifyContent="center"
            width={isSideLayout ? CANVAS_WIDTH * 0.35 : CANVAS_WIDTH - SPACING.narrativePadding * 2}
          >
            {slide.works!.map((work, i) => (
              <WorkCardNode
                key={work.title}
                work={work}
                index={i}
                workCount={workCount}
              />
            ))}
          </Layout>
        )}
      </Layout>
    </Rect>,
  );

  if (slide.year) {
    bg().add(
      <Rect
        ref={yearBadge}
        width={120}
        height={36}
        fill={COLORS.accent}
        radius={8}
        opacity={0}
        position={[CANVAS_WIDTH / 2 - 80 - 60, -(CANVAS_HEIGHT / 2 - 48 - 18)]}
      >
        <Layout layout alignItems="center" justifyContent="center" width={120} height={36}>
          <Txt
            text={slide.year}
            fill={'#ffffff'}
            fontSize={17}
            fontWeight={600}
            fontFamily={BODY_FONT}
            lineHeight={'124%'}
            letterSpacing={-0.374}
          />
        </Layout>
      </Rect>,
    );
  }

  // Phase 1: bg + text fade in
  const bgFade = skipBgFade ? waitFor(0) : bg().opacity(1, ELEMENT_FADE_DURATION);
  yield* all(bgFade, textNode().opacity(1, ELEMENT_FADE_DURATION));

  // Phase 2: year badge + cards concurrently (cards staggered)
  const yearAnim = yearBadge() ? yearBadge().opacity(1, ELEMENT_FADE_DURATION) : waitFor(0);
  const cardAnims: Generator[] = [];
  if (hasWorks && worksContainer()) {
    const children = worksContainer().children();
    for (let i = 0; i < children.length; i++) {
      const child = children[i];
      child.opacity(0);
      child.scale(0.8);
      cardAnims.push(
        all(
          waitFor(i * 0.2),
          child.opacity(1, CARD_SPRING_DURATION),
          child.scale(1, CARD_SPRING_DURATION, easeOutBack),
        ),
      );
    }
  }
  yield* all(yearAnim, ...cardAnims);

  // Phase 3: hold
  const cardElapsed = hasWorks ? (workCount - 1) * 0.2 + CARD_SPRING_DURATION : 0;
  const elapsed = Math.max(
    yearBadge() ? ELEMENT_FADE_DURATION : 0,
    cardElapsed,
  );
  yield* waitFor(Math.max(0, slide.durationSeconds - elapsed));
}

// --- Work Card Node ---

function WorkCardNode({work, index, workCount}: {work: ReferencedWork; index: number; workCount: number}) {
  const dims = workCount === 1
    ? CARD_DIMENSIONS.SINGLE
    : workCount === 2
      ? CARD_DIMENSIONS.DUAL
      : CARD_DIMENSIONS.MANY;

  const hasImage = work.imageSrc && work.imageSrc.length > 0;

  return (
    <Rect
      width={dims.width}
      height={dims.height}
      fill={hasImage ? '#000000' : COLORS.cardBackground}
      radius={18}
      opacity={0}
      scale={0.8}
      shadowColor={COLORS.cardShadow}
      shadowBlur={30}
      shadowOffset={[3, 5]}
      clip
    >
      {hasImage ? (
        <Layout
          layout
          direction="column"
          justifyContent="flex-end"
          width={dims.width}
          height={dims.height}
          padding={18}
        >
          <Txt
            text={work.title}
            fill={COLORS.cardOverlayTitle}
            fontSize={17}
            fontWeight={600}
            fontFamily={BODY_FONT}
            textWrap
            textAlign="left"
            width={dims.width - 36}
            lineHeight={'124%'}
            letterSpacing={-0.374}
          />
          {work.author && (
            <Txt
              text={work.author}
              fill={COLORS.cardOverlayAuthor}
              fontSize={13}
              fontWeight={400}
              fontFamily={BODY_FONT}
              marginTop={2}
            />
          )}
        </Layout>
      ) : (
        <Layout
          layout
          direction="column"
          alignItems="center"
          justifyContent="center"
          width={dims.width}
          height={dims.height}
          padding={18}
          gap={8}
        >
          <Txt
            text={work.title}
            fill={COLORS.titleText}
            fontSize={19}
            fontWeight={600}
            fontFamily={BODY_FONT}
            textWrap
            textAlign="center"
            width={dims.width - 36}
            lineHeight={'124%'}
            letterSpacing={-0.374}
          />
          {work.author && (
            <Txt
              text={work.author}
              fill={COLORS.sectionTitle}
              fontSize={14}
              fontWeight={400}
              fontFamily={BODY_FONT}
            />
          )}
          <Rect
            fill={COLORS.cardPillBackground}
            radius={9999}
            padding={[6, 14]}
            layout
            alignItems="center"
            justifyContent="center"
          >
            <Txt
              text={work.mediaType}
              fill={COLORS.accent}
              fontSize={12}
              fontWeight={400}
              fontFamily={BODY_FONT}
              lineHeight={'100%'}
              letterSpacing={-0.12}
            />
          </Rect>
        </Layout>
      )}
    </Rect>
  );
}

// --- Quote Slide ---

export function* renderQuoteSlide(view: View2D, slide: QuoteSlide, skipBgFade = false) {
  const bg = createRef<Rect>();
  const quoteMark = createRef<Txt>();
  const textNode = createRef<Txt>();
  const attrNode = createRef<Txt>();

  const textWidth = CANVAS_WIDTH - SPACING.quotePaddingH * 2;

  view.add(
    <Rect
      ref={bg}
      width={CANVAS_WIDTH}
      height={CANVAS_HEIGHT}
      fill={COLORS.quoteBackground}
      opacity={skipBgFade ? 1 : 0}
    >
      <Txt
        ref={quoteMark}
        text={'“'}
        fill={COLORS.quoteMark}
        fontSize={200}
        fontFamily={QUOTE_FONT}
        opacity={0}
        offset={[-1, -1]}
        position={[
          -(CANVAS_WIDTH / 2) + CANVAS_WIDTH * 0.12,
          -(CANVAS_HEIGHT / 2) + CANVAS_HEIGHT * 0.06,
        ]}
      />
      <Layout
        layout
        direction="column"
        alignItems="center"
        justifyContent="center"
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        padding={[CANVAS_HEIGHT * 0.2, SPACING.quotePaddingH]}
        gap={24}
      >
        <Txt
          ref={textNode}
          text={slide.text}
          fill={COLORS.quoteText}
          fontSize={48}
          fontWeight={600}
          fontFamily={BODY_FONT}
          textWrap
          textAlign="center"
          opacity={0}
          width={textWidth}
          lineHeight={'110%'}
          letterSpacing={-0.28}
        />
        {slide.attribution && (
          <Txt
            ref={attrNode}
            text={`—— ${slide.attribution}`}
            fill={COLORS.quoteAttribution}
            fontSize={22}
            fontWeight={600}
            fontFamily={BODY_FONT}
            opacity={0}
            marginTop={16}
            lineHeight={'119%'}
            letterSpacing={0.231}
          />
        )}
      </Layout>
    </Rect>,
  );

  // Phase 1: bg + quote mark + text fade in
  const bgFade = skipBgFade ? waitFor(0) : bg().opacity(1, ELEMENT_FADE_DURATION);
  yield* all(bgFade, quoteMark().opacity(1, ELEMENT_FADE_DURATION), textNode().opacity(1, ELEMENT_FADE_DURATION));

  // Phase 2: attribution with delay
  if (attrNode()) {
    yield* all(
      waitFor(QUOTE_ATTR_DELAY),
      attrNode().opacity(1, ELEMENT_FADE_DURATION),
    );
  }

  // Phase 3: hold
  const elapsed = slide.attribution ? QUOTE_ATTR_DELAY : 0;
  yield* waitFor(Math.max(0, slide.durationSeconds - elapsed));
}

// --- Works Showcase ---

export function* renderWorksShowcase(view: View2D, slide: WorksGridSlide, skipBgFade = false) {
  const bg = createRef<Rect>();
  const titleNode = createRef<Txt>();
  const gridContainer = createRef<Layout>();

  view.add(
    <Rect
      ref={bg}
      width={CANVAS_WIDTH}
      height={CANVAS_HEIGHT}
      fill={COLORS.background}
      opacity={skipBgFade ? 1 : 0}
    >
      <Layout
        layout
        direction="column"
        alignItems="center"
        justifyContent="center"
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        padding={SPACING.slidePadding}
        gap={SPACING.textGap}
      >
        {slide.title && (
          <Txt
            ref={titleNode}
            text={slide.title}
            fill={COLORS.sectionTitle}
            fontSize={21}
            fontWeight={600}
            fontFamily={BODY_FONT}
            opacity={0}
            lineHeight={'119%'}
            letterSpacing={0.231}
          />
        )}
        <Layout
          ref={gridContainer}
          layout
          direction="row"
          wrap="wrap"
          gap={SPACING.cardGap}
          alignItems="center"
          justifyContent="center"
          width={CANVAS_WIDTH - SPACING.slidePadding * 2}
        >
          {slide.works.slice(0, 6).map((work, i) => (
            <WorkCardNode
              key={work.title}
              work={work}
              index={i}
              workCount={Math.min(slide.works.length, 6)}
            />
          ))}
        </Layout>
      </Layout>
    </Rect>,
  );

  // Phase 1: bg + title fade in
  const bgFade = skipBgFade ? waitFor(0) : bg().opacity(1, ELEMENT_FADE_DURATION);
  const titleAnim = titleNode() ? titleNode().opacity(1, ELEMENT_FADE_DURATION) : waitFor(0);
  yield* all(bgFade, titleAnim);

  // Phase 2: cards with stagger
  const children = gridContainer().children();
  const cardAnims: Generator[] = [];
  for (let i = 0; i < children.length; i++) {
    const child = children[i];
    child.opacity(0);
    child.scale(0.8);
    cardAnims.push(
      all(
        waitFor(i * 0.2),
        child.opacity(1, CARD_SPRING_DURATION),
        child.scale(1, CARD_SPRING_DURATION, easeOutBack),
      ),
    );
  }
  yield* all(...cardAnims);

  // Phase 3: hold
  const elapsed = children.length > 0 ? (children.length - 1) * 0.2 + CARD_SPRING_DURATION : 0;
  yield* waitFor(Math.max(0, slide.durationSeconds - elapsed));
}

// --- Outro ---

export function* renderOutro(view: View2D, slide: OutroSlide, skipBgFade = false) {
  const bg = createRef<Rect>();
  const channelNode = createRef<Txt>();
  const messageNode = createRef<Txt>();

  view.add(
    <Rect
      ref={bg}
      width={CANVAS_WIDTH}
      height={CANVAS_HEIGHT}
      fill={COLORS.background}
      opacity={skipBgFade ? 1 : 0}
    >
      <Layout
        layout
        direction="column"
        alignItems="center"
        justifyContent="center"
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        gap={24}
      >
        {slide.message && (
          <Txt
            ref={messageNode}
            text={slide.message}
            fill={COLORS.titleText}
            fontSize={52}
            fontWeight={600}
            fontFamily={DISPLAY_FONT}
            opacity={0}
            textWrap
            textAlign="center"
            width={1200}
            lineHeight={'115%'}
            letterSpacing={-0.28}
          />
        )}
        {slide.channelName && (
          <Txt
            ref={channelNode}
            text={`@ ${slide.channelName}`}
            fill={COLORS.subtitleText}
            fontSize={30}
            fontWeight={400}
            fontFamily={DISPLAY_FONT}
            opacity={0}
            lineHeight={'114%'}
            letterSpacing={0.196}
          />
        )}
      </Layout>
    </Rect>,
  );

  // Phase 1: bg + message fade in
  const bgFade = skipBgFade ? waitFor(0) : bg().opacity(1, ELEMENT_FADE_DURATION);
  const msgAnim = messageNode() ? all(waitFor(OUTRO_MSG_DELAY), messageNode().opacity(1, ELEMENT_FADE_DURATION)) : waitFor(0);
  yield* all(bgFade, msgAnim);

  // Phase 2: channel with delay
  if (channelNode()) {
    yield* all(
      waitFor(OUTRO_CHANNEL_DELAY),
      channelNode().opacity(1, ELEMENT_FADE_DURATION),
    );
  }

  // Phase 3: hold
  const elapsed = Math.max(
    messageNode() ? OUTRO_MSG_DELAY + ELEMENT_FADE_DURATION : 0,
    channelNode() ? OUTRO_CHANNEL_DELAY + ELEMENT_FADE_DURATION : 0,
  );
  yield* waitFor(Math.max(0, slide.durationSeconds - elapsed));
}
