import { describe, expect, it } from 'vite-plus/test';
import { layoutDocument } from '@superdoc/layout-engine';
import type { Line, ParagraphBlock, ParagraphMeasure } from '@superdoc/contracts';
import { createTestPainter } from './_test-utils.js';

describe('negative-indent paragraph layout and paint', () => {
  it('centers text in the expanded paragraph box without absolutely positioning its run', () => {
    const block: ParagraphBlock = {
      kind: 'paragraph',
      id: 'negative-indent-center',
      runs: [{ text: 'Centered', fontFamily: 'Arial', fontSize: 12 }],
      attrs: { alignment: 'center', indent: { left: -38 } },
    };
    const line: Line = {
      fromRun: 0,
      fromChar: 0,
      toRun: 0,
      toChar: 8,
      width: 80,
      ascent: 16,
      descent: 4,
      lineHeight: 20,
      maxWidth: 238,
    };
    const measure: ParagraphMeasure = { kind: 'paragraph', lines: [line], totalHeight: 20 };
    const layout = layoutDocument([block], [measure], {
      pageSize: { w: 300, h: 400 },
      margins: { left: 50, right: 50, top: 50, bottom: 50 },
      remeasureParagraph: (_block, maxWidth, _firstLineIndent, lineRegions) => ({
        kind: 'paragraph',
        lines: [
          {
            ...line,
            maxWidth,
            segments: [{ runIndex: 0, fromChar: 0, toChar: 8, width: 80, x: lineRegions?.[0]?.[0]?.offsetX }],
          },
        ],
        totalHeight: 20,
      }),
    });
    const mount = document.createElement('div');
    createTestPainter({ blocks: [block], measures: [measure] }).paint(layout, mount);

    const fragment = mount.querySelector<HTMLElement>('.superdoc-fragment');
    const paintedLine = mount.querySelector<HTMLElement>('.superdoc-line');
    const run = mount.querySelector<HTMLElement>('.superdoc-text-run');
    expect(paintedLine?.style.textAlign).toBe('center');
    expect(run?.style.position).toBe('');
    expect(fragment?.style.left).toBe('12px');
    expect(fragment?.style.width).toBe('238px');
  });
});
