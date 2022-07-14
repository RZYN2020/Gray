export { Watcher }
import { Dep } from "./dep"

class Watcher {
    exp: string;
    env: any;
    callback: Function;
    constructor(exp: string, env: Object, callback: Function) {
        this.exp = exp
        this.env = env
        this.callback = callback
        this.update()
    }

    get() {
        Dep.target = this;
        let newValue = Watcher.computeExpression(this.exp, this.env);
        Dep.target = null;
        return newValue;
    }

    update() {
        let newValue = this.get();
        this.callback && this.callback(newValue);
    }

    static computeExpression(exp: string, env: any) {
        let fn = new Function('env', "with(env){return " + exp + "}");
        return fn(env);
    }
}