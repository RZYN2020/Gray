import { Watcher } from './watcher';
export { Dep, $deps }
let $deps = new Map<string | symbol, Dep>;
class Dep {
    subs = new Set<Watcher>();
    static target: Watcher | null;
    constructor() {
    }

    addSub(target: Watcher) {
        this.subs.add(target);
    }

    notify() {
        this.subs.forEach(target => {target.update()});
    }
}