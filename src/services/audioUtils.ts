export const getAudioDuration = (file: Blob): Promise<number> => {
    return new Promise((resolve, reject) => {
        const audio = document.createElement('audio');
        const url = URL.createObjectURL(file);

        audio.src = url;
        audio.onloadedmetadata = () => {
            // Return duration in seconds
            resolve(audio.duration);
            URL.revokeObjectURL(url);
        };
        audio.onerror = () => {
            reject(new Error('Could not load audio metadata'));
            URL.revokeObjectURL(url);
        };
    });
};

export const formatDuration = (seconds: number): string => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
};

export const suggestTags = (fileName: string): string[] => {
    const name = fileName.toLowerCase();
    const tags: string[] = [];

    if (name.includes('whoosh') || name.includes('swoosh') || name.includes('transition')) tags.push('transition');
    if (name.includes('hit') || name.includes('impact') || name.includes('boom') || name.includes('punch')) tags.push('impact');
    if (name.includes('ambient') || name.includes('atmosphere')) tags.push('ambience');
    if (name.includes('click') || name.includes('ui')) tags.push('ui');
    if (name.includes('funny') || name.includes('laugh')) tags.push('funny');

    return tags;
};
