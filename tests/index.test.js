import { createLocalVue, mount } from '@vue/test-utils';
import VueComponentStyle from '../dist/vue-component-style.esm';

const $beforeEach = beforeEach; // eslint-disable-line no-undef
const $test = test; // eslint-disable-line no-undef, no-console,
const $expect = expect; // eslint-disable-line no-undef, no-console

// reset document before each tests
let Vue;
$beforeEach(() => {
  document.head.innerHTML = '';
  document.body.innerHTML = '';
  Vue = createLocalVue();
  Vue.use(VueComponentStyle);
});

// util function to mount component to document
function mountComponent(component, options = {}) {
  return mount(component, {
    attachToDocument: true,
    localVue: Vue,
    ...options,
  });
}


$test('Test bundles as module', () => {
  const cjs = require('../dist/vue-component-style.cjs'); // eslint-disable-line global-require
  const umd = require('../dist/vue-component-style'); // eslint-disable-line global-require

  $expect(VueComponentStyle).toHaveProperty('install');
  $expect(cjs).toHaveProperty('install');
  $expect(umd).toHaveProperty('install');
});

$test('Test if can apply static style', () => {
  const wrapper = mountComponent({
    template: '<div :class="$style.a"></div>',
    style() {
      return {
        a: {
          color: 'red',
        },
      };
    },
  });
  $expect(window.getComputedStyle(wrapper.element).color).toEqual('red');
});

$test('Test if can apply dynamic style', () => {
  const component = {
    props: ['color'],
    template: '<div :class="$style.$b"></div>',
    style() {
      return {
        $b: {
          backgroundColor: this.color,
        },
      };
    },
  };
  const wrapper1 = mountComponent(component, {
    propsData: {
      color: 'blue',
    },
  });
  const wrapper2 = mountComponent(component, {
    propsData: {
      color: 'red',
    },
  });

  $expect(window.getComputedStyle(wrapper1.element).backgroundColor).toEqual('blue');
  $expect(window.getComputedStyle(wrapper2.element).backgroundColor).toEqual('red');
});


$test('Test if can handle changes durring runtime', () => {
  const wrapper = mountComponent({
    props: ['color'],
    template: '<div :class="$style.a"></div>',
    style() {
      return {
        a: {
          backgroundColor: this.color,
        },
      };
    },
  }, {
    propsData: {
      color: 'blue',
    },
  });

  wrapper.setProps({
    color: 'cyan',
  });

  return new Promise((resolve) => {
    wrapper.vm.$on('styleChange', () => {
      $expect(window.getComputedStyle(wrapper.element).backgroundColor).toEqual('cyan');
      resolve();
    });
  });
});

$test('Test if can map already generated style to new element', () => {
  const wrapper1 = mountComponent({
    template: '<h1 :class="$style.a">H1</h1>',
    style() {
      return {
        a: {
          color: 'red',
        },
      };
    },
  });
  const wrapper2 = mountComponent({
    template: '<h2 :class="$style.a">H2</h2>',
    style() {
      return {
        a: {
          color: 'red',
        },
      };
    },
  });
  $expect(wrapper1.element.className).toEqual(wrapper2.element.className);
});
