import { Page } from './types';

// Duration in milliseconds (1000 = 1 second)
export const DEFAULT_DURATION = 5000;

// Set to true/false to toggle the progress bar
export const SHOW_PROGRESS_BAR = true;

export const SLIDE_DURATIONS: Record<string, number> = {
    // --- Global Page Defaults ---
    [Page.Home]: 86400000, // 24 hours (effectively disabled)

    // --- Innovation Screen Slides ---
    // Format: "Page-SlideIndex"
    [`${Page.Innovation}-0`]: 10000, // Intro
    [`${Page.Innovation}-1`]: 15000, // RnD
    [`${Page.Innovation}-2`]: 15000, // Core Tech
    [`${Page.Innovation}-3`]: 15000, // HMI

    // --- Quality Screen Slides ---
    [`${Page.Quality}-0`]: 10000, // Slide 1

    // Quality Slide 2 has internal steps (0 to 3)
    // Format: "Page-SlideIndex-StepIndex"
    // Quality Slide 2 Step 0 has an internal timer of 4000ms. 
    // We set this to a high value to prevent the global auto-roll from interfering 
    // before the internal animation completes.
    [`${Page.Quality}-1-0`]: 60000,
    [`${Page.Quality}-1-1`]: 5000, // Group 2 active
    [`${Page.Quality}-1-2`]: 5000, // Group 1 active
    [`${Page.Quality}-1-3`]: 5000, // All active

    [`${Page.Quality}-2`]: 10000, // Scalable
    [`${Page.Quality}-3`]: 12000, // Diaply
    [`${Page.Quality}-4`]: 16000, // Global Network
    [`${Page.Quality}-5`]: 20000, // Slide 6

    // --- Unified Strength Screen Slides ---
    [`${Page.UnifiedStrength}-0`]: 10000, // Intro
    [`${Page.UnifiedStrength}-1`]: 15000, // Affiliates
    [`${Page.UnifiedStrength}-2`]: 15000, // Group
    [`${Page.UnifiedStrength}-3`]: 15000, // Product
    [`${Page.UnifiedStrength}-4`]: 600000, // Video (auto-advance via onEnded)
};

export const getSlideDuration = (page: Page, slideIndex?: number, stepIndex?: number): number => {
    let key = page;

    // Try most specific first: Page-Slide-Step
    if (slideIndex !== undefined && stepIndex !== undefined) {
        key = `${page}-${slideIndex}-${stepIndex}` as any;
        if (SLIDE_DURATIONS[key]) return SLIDE_DURATIONS[key];
    }

    // Try Page-Slide
    if (slideIndex !== undefined) {
        key = `${page}-${slideIndex}` as any;
        if (SLIDE_DURATIONS[key]) return SLIDE_DURATIONS[key];
    }

    // Try Page default
    if (SLIDE_DURATIONS[page]) return SLIDE_DURATIONS[page];

    return DEFAULT_DURATION;
};
