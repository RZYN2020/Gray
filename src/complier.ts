export { complie }
import { Watcher } from './watcher'

function complie(g: any) {
    if (g.$el) {
        let fragment = nodeToFragment(g.$el);
        let env = g.$env;
        complieNode(fragment, env);
        g.$el.appendChild(fragment);
    }
}

function nodeToFragment(node: Element): DocumentFragment {
    let fragment = document.createDocumentFragment()
    if (node.childNodes && node.childNodes.length) {
        node.childNodes.forEach(child => {
            if (!ignorable(child)) {
                fragment.appendChild(child)
            }
        })
    }
    return fragment
};

function ignorable(node: any) {
    const reg = /^[\t\n\r]+/;
    return (
        node.nodeType === 8 || (node.nodeType === 3 && reg.test(node.textContent))
    )
}


function complieNode(node: DocumentFragment, env: any) {
    if (node.childNodes && node.childNodes.length) {
        node.childNodes.forEach(child => {
            if (child.nodeType === 1) {
                compilerElementNode(child, env)
            } else if (child.nodeType === 3) {
                compilerTextNode(child, env)
            }
        })
    }
}

function compilerElementNode(node: any, env: any) {
    let attrs = [...node.attributes]
    attrs.forEach(attr => {
        let { name: attrName, value: attrValue } = attr
        if (attrName.indexOf('g-') === 0) {
            let dirName = attrName.slice(2)
            switch (dirName) {
                case 'text':
                    new Watcher(attrValue, env, (newValue: string) => {
                        node.textContent = newValue
                    })
                    break;
                case 'model':
                    new Watcher(attrValue, env, (newValue: string) => {
                        node.value = newValue
                    })
                    node.addEventListener('input', (e: any) => {
                        env[attrValue] = e.target.value
                    })
                    break;
            }
        }
        if (attrName.indexOf('@') === 0) {
            compilerMethods(env, node, attrName, attrValue)
        }
    })
    complieNode(node, env)
}

function compilerMethods(env : any, node : any, attrName : string, attrValue : string){
    let type = attrName.slice(1);
    let fn = env[attrValue];
    node.addEventListener(type, fn.bind(env));
}

function compilerTextNode(node: ChildNode, g: any) {
    let text = '';
    if (node.textContent != null) {
        text = node.textContent.trim()
    }
    if (text) {
        let exp = parseText(text)
        new Watcher(exp, g, (newValue: string) => {
            node.textContent = newValue
        })
    }
}

function parseText(text: string) {
    const reg = /\{\{(.+?)\}\}/g
    let pices = text.split(reg)
    let matches = text.match(reg)
    let tokens: string[] = []
    pices.forEach(item => {
        if (matches && matches.indexOf("{{" + item + "}}") > -1) {
            tokens.push("(" + item + ")")
        } else {
            tokens.push('`' + item + '`')
        }
    })
    return tokens.join('+')
}
