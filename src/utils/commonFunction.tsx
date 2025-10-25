
export function debounce<T extends (...args: any[]) => void>(func: T, delay: number) {
    let timeoutId: number | null = null;

    return (...args: Parameters<T>) => {
        // Clear previous timeout
        if (timeoutId) {
            clearTimeout(timeoutId);
        }

        // Set new timeout
        timeoutId = setTimeout(() => {
            func(...args);
        }, delay);
    };
}