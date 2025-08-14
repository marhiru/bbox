import { useMemo } from 'react';

interface Rectangle {
    left: number;
    top: number;
    width: number;
    height: number;
}

export const useMaskGenerator = (
    entries: Rectangle[],
    width: number | undefined,
    height: number | undefined
) => {
    return useMemo(() => {
        if (!width || !height || !entries.length) return null;

        const rects = entries.map(entry => {
            const { left, top, width: w, height: h } = entry;
            return `<rect x="${left}" y="${top}" width="${w}" height="${h}" fill="white"/>`;
        }).join('');

        const svgContent = `
            <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <mask id="brightness-mask-${Date.now()}">
                        <rect width="100%" height="100%" fill="black"/>
                        ${rects}
                    </mask>
                </defs>
            </svg>
        `;

        return `data:image/svg+xml;base64,${btoa(svgContent)}`;
    }, [entries, width, height]);
};