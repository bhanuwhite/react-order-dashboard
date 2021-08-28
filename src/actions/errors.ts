import { isEqual } from 'lodash-es';
import { Store } from '@/store';
import { action, toJS } from 'mobx';
import { AnyError } from '@/store/view/errors';

export const dismissError = action((store: Store, index: number) => {
    store.view.errors.all.splice(index, 1);
});

export const pushError = action((store: Store, err: AnyError) => {
    const alreadyPresent = store.view.errors.all.find(e => areSame(e, err));
    if (alreadyPresent) {
        alreadyPresent.time = Date.now();
        alreadyPresent.count += 1;
    } else {
        store.view.errors.all.push({ ...err, time: Date.now(), count: 1 });
    }
});

function areSame(a: AnyError, b: AnyError) {
    switch (a.type) {
        case 'http':
            switch (b.type) {
                case 'http':
                    return a.endpoint === b.endpoint &&
                        a.method === b.method &&
                        a.statusCode === b.statusCode;
                default:
                    return false;
            }
        case 'schema':
            switch (b.type) {
                case 'schema':
                    return a.endpoint === b.endpoint &&
                        a.reason === b.reason &&
                        a.path === b.path;
                default:
                    return false;
            }
        case 'server':
            switch (b.type) {
                case 'server':
                    return a.message === b.message &&
                        isEqual(toJS(a.data), b.data);
                default:
                    return false;
            }
    default:
            throw new Error('bug found!');
    }
}