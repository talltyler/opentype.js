import parse from '../parse';
import glyphset from '../glyphset';

// Parse the `SVG` table which contains glyph shapes as svg images
// https://www.microsoft.com/typography/otspec/svg.htm
function parseSVGTable(data, start, font) {
    const glyphs = new glyphset.GlyphSet(font);
    const p = new parse.Parser(data, start);
    const tableVersion = p.parseUShort();
    const offsetToSVGDocIndex = p.parseFixed();
    const reserved = p.parseULong();
    const numEntries = p.parseUShort();
    let currentOffset = p.relativeOffset;
    let objects = {};
    for (let i = 0; i < numEntries; i++) {
        p.relativeOffset = currentOffset;
        const startGlyphID = p.parseUShort();
        const endGlyphID = p.parseUShort();
        const svgDocOffset = p.parseULong();
        const svgDocLength = p.parseULong();
        currentOffset = p.relativeOffset;
        p.relativeOffset = svgDocOffset+10;
        for (let glyphID = startGlyphID; glyphID <= endGlyphID; glyphID++) {
            objects[glyphID] = p.parseString(svgDocLength);
        }
    }
    return objects;
}

export default { parse: parseSVGTable };
