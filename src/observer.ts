import { Dep, $deps} from "./dep"
export { makeObserver }

function makeObserver(g: any) {
    g.$data = makeProxy(g.$data);
}

function makeProxy(ele: any) {
    if ((typeof ele) === "object") {
        Object.keys(ele).forEach(key => {
            ele[key] = makeProxy(ele[key]);
        });
        ele = new Proxy(ele, new Handler());
    }
    return ele;
}

class Handler implements ProxyHandler<any>{
    get?(target: any, p: string | symbol, receiver: any): any {
        console.log("get", p, "of ", target);
        if ($deps.get(p) === undefined) {
            $deps.set(p, new Dep());
        }
        Dep.target && $deps.get(p)?.addSub(Dep.target);
        return Reflect.get(target, p, receiver);
    }

    set?(target: any, p: string | symbol, value: any, receiver: any): boolean {
        console.log("set", p, "of ", target, " to ", value);
        let ret = Reflect.set(target, p, value, receiver);
        $deps.get(p)?.notify()
        return ret;
    }
}