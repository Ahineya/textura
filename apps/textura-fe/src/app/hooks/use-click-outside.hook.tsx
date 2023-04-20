import {useEffect} from 'react';

export function useClickOutside<T>(ref: React.RefObject<T>, handler: (e: MouseEvent) => void) {
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (ref.current && !(ref.current as unknown as HTMLElement).contains(e.target as Node)) {
                handler(e);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [ref, handler]);
}
