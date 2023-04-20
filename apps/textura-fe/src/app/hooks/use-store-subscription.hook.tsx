import {useEffect, useState} from 'react';
import {BehaviorSubject, map, Observable} from 'rxjs';
import {distinctUntilChanged} from 'rxjs/operators';
import fastDeepEqual from "fast-deep-equal";

export function useStoreSubscribe<T>(bs: BehaviorSubject<T>, initialState?: T, deps: any[] = []) {
    const [data, setData] = useState<T>(initialState ?? bs.getValue());

    useEffect(() => {
        const subscription = bs.subscribe(setData);

        return () => {
            subscription.unsubscribe();
        };
    }, [bs, ...deps]);

    return data;
}

export function useStoreSubscribeObservable<T>(bs: Observable<T>, performDeepEqual = false, initialState?: T, deps: any[] = []) {
    const [data, setData] = useState<T | null>(initialState ?? null);

    useEffect(() => {
        const subscription = bs.subscribe(newData => {
            setData((oldData) => {
                if (!performDeepEqual) {
                    return newData;
                }

                if (!fastDeepEqual(oldData, newData)) {
                    return newData;
                }

                return oldData;
            });
        });

        return () => {
            subscription.unsubscribe();
        };
    }, [bs, ...deps]);

    return data;
}

export function useStoreSubscribeToField<T extends object, K extends keyof T>(
    bs: BehaviorSubject<T>,
    storeItem: K,
    initialState?: T[K],
    deps: any[] = []
) {
    const [data, setData] = useState<T[K]>(initialState ?? bs.getValue()[storeItem]);

    useEffect(() => {
        const subscription = bs.pipe(
            map((state) => state[storeItem]),
            distinctUntilChanged()
        ).subscribe(d => {
            setData(d);
        });

        return () => {
            subscription.unsubscribe();
        };
    }, [bs, storeItem, ...deps]);

    return data;
}
