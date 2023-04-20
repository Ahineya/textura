import {useCallback, useRef} from 'react';

export const useDebouncedCallback = (func: Function, wait: number) => {
    const timeout = useRef<number>();

    return useCallback(
        (...args) => {
            const later = () => {
                clearTimeout(timeout.current);
                func(...args);
            };

            clearTimeout(timeout.current);
            timeout.current = setTimeout(later, wait) as unknown as number;
        },
        [func, wait],
    );
};
