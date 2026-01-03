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

export const suggestCategory = (fileName: string): string => {
    const name = fileName.toLowerCase();

    if (name.includes('whoosh') || name.includes('transition') || name.includes('swoosh')) return 'Transition';
    if (name.includes('hit') || name.includes('impact') || name.includes('boom')) return 'Impact';
    if (name.includes('ambient') || name.includes('atmosphere') || name.includes('bg')) return 'Ambience';
    if (name.includes('click') || name.includes('ui') || name.includes('button')) return 'UI';
    if (name.includes('foley') || name.includes('step')) return 'Foley';

    return 'Uncategorized';
};
