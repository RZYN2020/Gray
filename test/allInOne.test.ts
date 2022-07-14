import { Gray } from '../src/index'

let app = document.createElement('div');
let childNode = document.createElement('input');
childNode.setAttribute('g-model', 'val');
app.appendChild(childNode);
let gray = new Gray({
  data: {
    val: "hello",
  },
}, app);



test('intial render success', () => {
  expect(gray.$data.val).toBe(childNode.value);
});


test('model ==> view', () => {
  gray.$data.val = "sky";
  expect(gray.$data.val).toBe(childNode.value);
});


test('view ==> model', () => {
  childNode.value = "sea";
  childNode.dispatchEvent(new window.Event('input'));
  expect(gray.$data.val).toBe(childNode.value);
});