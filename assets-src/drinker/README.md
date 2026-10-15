# Drinking Character — Web Animation Handoff

This package contains the **actual assets used by the existing HTML prototype**, plus its self-contained demo and timing metadata. Give the whole ZIP to Claude Code.

## Contents
- `demo.html`: working standalone demo, no server or dependencies; open in a browser.
- `assets/pose_00.png` through `pose_05.png`: six extracted pose images from the original generated sheet, exactly matching the embedded demo artwork.
- `assets/original_character_sheet.png`: original illustration sheet for reference and recutting.
- `animation.json`: pose order and per-step durations in milliseconds.
- `build_drink_original.py`: original extraction/build script, provided for provenance; it uses absolute `/mnt/data/` paths and should be adapted before running elsewhere.

## Playback
The demo uses pose indices `[0,1,2,3,2,4,0]` with durations `[500,330,480,800,330,650,500]` milliseconds (total **3.59 seconds at 1×**). Pose 05 is included but not used in the default sequence. Playback swaps PNG images and uses a subtle CSS body motion; it is **not skeletal animation**.

## How to use in the existing web app
1. Copy `assets/pose_00.png` … `pose_05.png` into your web app's public assets directory, e.g. `public/characters/drinker/`.
2. Render all frames at the same anchored position, only showing the active frame. For each frame, use the image's own aspect ratio and consistent bottom-center anchoring. Note that crops vary in dimensions; adjust sizing/alignment visually.
3. Play the sequence and durations from `animation.json`. Multiply each duration by `1 / playbackSpeed`.
4. Provide play, stop, optional loop, and an accessible reduced-motion mode. Trigger only on the desired app event.
5. Use `demo.html` as the behavioral reference; its image assets are embedded in the HTML, so it runs independently.

### Minimal vanilla JS playback
```js
const order = [0, 1, 2, 3, 2, 4, 0];
const durations = [500, 330, 480, 800, 330, 650, 500];
const images = Array.from({ length: 6 }, (_, i) =>
  `/characters/drinker/pose_${String(i).padStart(2, '0')}.png`
);
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

async function playDrink(imgElement, speed = 1) {
  for (let i = 0; i < order.length; i++) {
    imgElement.src = images[order[i]];
    await sleep(durations[i] / speed);
  }
}
```
For production, preload images to prevent flashes and implement cancellation/cleanup when unmounting or restarting.

## Known limitations
- The illustration sheet was AI-generated with a **checkerboard-looking background baked into the image**, not reliable native transparency. The extraction script removes near-neutral bright pixels heuristically, which can create holes in light-colored areas and rough edges.
- The first pose is a tall full-body crop, while others are bust/upper-body crops. This can cause jumps when played as a sequence.
- Character anatomy and arm/glass positions vary between drawings. Do not assume the crops are mechanically consistent or rig-ready.
- The current animation is a **prototype**, not a polished production animation. For best quality, redraw or regenerate consistent torso/head/upper-arm/forearm/glass layers and rig them.
- `demo.html` is fully self-contained; it does not load the extracted PNGs from disk.

## Claude Code implementation request
> Inspect my existing web app and integrate the included drinking-character prototype. Preserve existing app behavior. Use the provided PNGs and timing metadata. First reproduce the current standalone demo within the app, then improve alignment and transitions without pretending the inconsistent frames form a skeletal rig. Preload frames, add a cancellable animation controller, responsive positioning, reduced-motion behavior and accessible controls. Do not regenerate or replace the character artwork unless explicitly asked. Document how to trigger the animation from application events.
