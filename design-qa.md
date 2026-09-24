# Design QA — Portfolio home and project handoff

- Source visual truth: `C:\Users\loop\AppData\Local\Temp\codex-clipboard-07c4d9df-ef7f-4558-893a-0d4d6ae8f1ee.png` (negative reference: the process block requested for removal), plus the user's written product-thinking brief.
- Implementation screenshots: `qa/portfolio-home-desktop.png`, `qa/portfolio-home-mobile.png`.
- Viewports: desktop 1440 × 1000 CSS px; mobile 390 × 844 CSS px.
- Pixel density: deviceScaleFactor 1; full-page screenshots captured at native CSS width with no density normalization.
- State: home route at default scroll position; both project entry buttons exercised; recruitment project route checked after navigation.

## Findings

No actionable P0/P1/P2 findings remain.

- Typography: the existing Inter/PingFang SC/Microsoft YaHei stack, display weights, line heights and hierarchy remain consistent. The hero statement is dominant; supporting process and evidence copy stays secondary and readable.
- Spacing and layout: the five-stage method uses a continuous grid on desktop and a single-column sequence on mobile. Both project narratives align with their product preview; neither viewport has horizontal overflow.
- Colors and tokens: the existing paper, ink, muted gray and lime accent system is retained. No new semantic color conflicts were introduced.
- Images and assets: all company marks and club assets rendered with zero broken images in the tested states. Existing raster assets were retained rather than approximated.
- Copy and content: the removed “从问题到可运行产品” template is absent. The home page now names 需求分析、方案产出、数据分析、推进落地、反馈迭代 and ties them to project evidence. The recruitment preview uses computed values from the current dataset.

## Full-view comparison evidence

The desktop and mobile captures show the new product-method section before the projects, followed by two project evidence chains and interactive previews. The negative-reference module does not appear on the recruitment project route.

## Focused region evidence

No additional crop was required: the full desktop capture renders the hero, five-stage method, both project evidence blocks, preview cards, metrics and footer at a legible scale. The mobile capture verifies stacking order and responsive rhythm.

## Comparison history

1. P2 — the recruitment preview still displayed stale placeholder totals (128 roles / 37 priorities / 84% match), while the evidence block stated 30 roles / 15 companies.
2. Fix — preview totals now derive from `jobs.length`, unique company count and the highest current match score.
3. Post-fix evidence — `qa/portfolio-home-desktop.png` and `qa/portfolio-home-mobile.png`; browser checks report 0 broken images, no desktop or mobile overflow, both project routes working, and no runtime exceptions.

## Primary interactions tested

- Home → 招聘情报中心.
- Home → Football Data Lab.
- Recruitment page has no legacy process module.
- Responsive rendering at 1440 px and 390 px.
- Console runtime exceptions checked: none.

## Implementation checklist

- [x] Remove the low-value legacy process block.
- [x] Add product/solution thinking to the portfolio home.
- [x] Tie every process claim to project evidence and measurable scope.
- [x] Verify desktop and mobile layouts.
- [x] Verify both project navigation paths and image loading.

final result: passed
