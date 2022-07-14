import { makeObserver } from './observer';
import { complie } from './complier';
export { Gray }

class Gray {
    $data: any;
    $methods: any;
    $el: Element | null;
    $env?: any;

    constructor(options: any, frag: Element) {
        this.$data = options.data;
        this.$methods = options.methods;
        if (frag) {
            this.$el = frag;
        } else {
            this.$el = document.querySelector(options.el);
        }
        this.$env = this;
        this._proxyData();
        this._proxyMethods();
        makeObserver(this);
        complie(this);
    }

    _proxyData() {
        Object.keys(this.$data).forEach(key => {
            Object.defineProperty(this, key, {
                set(newValue) {
                    this.$data[key] = newValue
                },
                get() {
                    return this.$data[key]
                }
            })
        });
    }

    _proxyMethods() {
        if (this.$methods && typeof this.$methods === 'object') {
            Object.keys(this.$methods).forEach(key => {
                this[key as keyof Gray] = this.$methods[key]
            })
        }
    }
};

(window as any).Gray = Gray;


