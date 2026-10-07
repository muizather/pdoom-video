// The edit: which scene plays when. Boundaries are anchored to lyric lines and snapped
// to the beat grid, so they follow the aligned data (data/lyrics.json, data/audio.json).
import type { TimelineEntry } from './engine/engine';
import type { SceneClass } from './engine/scene';
import type { Lyrics } from './engine/lyrics';
import type { AudioData } from './engine/audio';

// Scene modules are discovered lazily so a missing/broken scene never breaks the build.
const modules = import.meta.glob<{ default: SceneClass }>('./scenes/*.ts');
const scene = (name: string) => () => {
  const m = modules[`./scenes/${name}.ts`];
  return m ? m() : Promise.reject(new Error(`scene module not found: scenes/${name}.ts`));
};


export function makeTimeline(ly: Lyrics, au: AudioData): TimelineEntry[] {
  const E = (id: string, file: string, start: number, end: number, extra: Partial<TimelineEntry> = {}): TimelineEntry =>
    ({ id, load: scene(file), start, end, ...extra });

  // A generic timeline that evenly distributes the scenes since we replaced the song.
  const scenes = [
    'open', 'loss', 'prompt', 'hook', 'room', 'shoggoth', 'spacetime',
    'ascent', 'bureau', 'leftturn', 'paperclips', 'fuse', 'stack', 'dense',
    'loom', 'ilya', 'outro'
  ];

  const timeline = [];
  const duration = au.duration;
  const chunk = duration / scenes.length;

  for (let i = 0; i < scenes.length; i++) {
    const s = scenes[i];
    let params = {};
    if (s === 'prompt') params = { variant: 'chatgpt' };
    if (s === 'hook') params = { n: 1 };
    if (s === 'shoggoth') params = { maxSamples: 108 };

    timeline.push(E(s, s, i * chunk, (i + 1) * chunk, { params }));
  }

  return timeline;
}
