# Vue Component Style
![npm](https://img.shields.io/npm/dm/vue-component-style)
![npm](https://img.shields.io/npm/v/vue-component-style)
![NPM](https://img.shields.io/npm/l/vue-component-style)

A `Vue` mixin to add `style` section to components.

## Features

- Zero Dependency
- Tiny (~1kb gzipped)
- Simple Setup and Usage
- Nested Support
- Pseudo Selector Support
- SSR Support
- Scoped to Component

## Install

```bash
npm i vue-component-style
```

## Setup

### Vue App

```javascript
// Vue 2.x
import Vue from 'vue';
import VueComponentStyle from 'vue-component-style';

Vue.use(VueComponentStyle);

// Vue 3.x (added support in >=1.1.0)
import { createApp } from 'vue';
import VueComponentStyle from 'vue-component-style';

const theApp = createApp(/*...*/);
theApp.use(VueComponentStyle);
```
Note that You should use version >= 1.1.0 to use in Vue 3.
### Nuxt App

_nuxt.config.js_:
```javascript
module.exports = {
  modules: [
    'vue-component-style/nuxt'
  ],
}
```

Note that You don't need to do anything else with your webpack config or whatever.

## Usage

_component.vue_:
```html
<template>
  <div>
    <h1 :class="$style.title"> Title </h1>
    <div :class="$style.content">
      Content <a> Link </a>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    size: {
      type: Number,
      default: 8
    },
    color: {
      type: String,
      default: 'red'
    }
  },
  style({ className }) {
    return [
      className('title', {
        color: this.color,
        fontWeight: 'bold',
      }),
      className('content', {
        color: 'gray',
        marginBottom: `${this.size}px`,
        '& > a': {
          color: this.color,
          '&:visited': {
            textDecoration: 'underline',
          },
        },
      }),
    ];
  }
}
</script>
```

---

## API Documentions

### 1 - Define Style

    Function this.style(helper)

After activating **VueComponentStyle**, all components can have their js **style** section. Just like **data** section, you have to pass normal function that returning an Array. This function will invoke automatically with [`helper`](#helper) util object as first argument.

### 2 - Use Defined Styles

    Object this.$style

After you defining **style** prop in your component, all your classes defined by [`style()`](#1-define-style)s are accessable with **$style** computed object inside your component instance.

### 3 - Notice When Styles Updated

    VueEvent 'styleChange'

**styleChange** event fires when your style changes and applied to DOM.


---

### Helper

You can use [`helper()`](#helper) object from first parameter of [`style()`](#1-define-style) function to defining your stylesheet. Helper object has these functions

- [`className()`](#class-name)
- [`mediaQuery()`](#media-query)
- [`keyFrames()`](#key-frames)
- [`custom()`](#custom)

#### Class Name

    Function helper.className(name, content)

To define your scopped css class styles, use this helper function.

| Param | Type | Default | Description |
| - | - | - | - |
| name | String | | Name of your class. All of your defined names will be accessable via $style Object later. |
| content | Object | {} | Your sass-style class properties. You can also style nested. |

##### Example

```javascript
style({ className }) {
  return [
    className('customClass', {
      color: 'red',
      fontWeight: 'bold',
      borderRadius: `${this.size}px`,
      '& > div': {
        color: 'blue',
      },
    }),
  ];
}
```

#### Media Query

    Function helper.mediaQuery(mediaFeature, content)

To define your customized style to different screen sizes, use this helper function. 

| Param | Type | Default | Description |
| - | - | - | - |
| mediaFeature | Object | | Media features. Common keys on this object are 'minWidth' and 'maxWidth'. |
| content | Array | [] | List of [`className()`](#class-name)s that you need to redefine. |

##### Example

```javascript
style({ mediaQuery, className }) {
  return [
    className('responsiveClass', {
      width: '50%',
    }),
    mediaQuery({ maxWidth: '320px' }, [
      className('responsiveClass', {
        width: '100%',
      }),     
    ]),
  ];
}
```

#### Key Frames

    Function helper.keyFrames(name, content)

To define your scopped keyframes animation with specefic name, use this helper function. 

| Param | Type | Default | Description |
| - | - | - | - |
| name | String | | Keyframes name. |
| content | Object | | Keyframes properties. If you don't pass this prop, calculated hash name of already generated keyframes will be returns. |

##### Example

```javascript
style({ keyFrames, className }) {
  return [
    className('animatedThing', {
      color: 'blue',
      animationName: keyFrames('myAnimation'),
      animationDuration: '2s',
    }),
    keyFrames('myAnimation', {
      from: {
        color: 'blue',
      },
      to: {
        color: 'red',
      },
    ]),
  ];
}
```

#### Custom

    Function helper.custom(rule, content)

To define your custom css style sections, use this helper function. **Note that styles generated by this helper function are not scopped!**

| Param | Type | Default | Description |
| - | - | - | - |
| rule | String | | Rule name. |
| content | Object | | Style properties. |

##### Example

```javascript
style({ custom }) {
  return [
    custom('@font-face', {
      fontFamily: 'MyFont',
      src: 'url("/my-font.woff")',
    }),
  ];
}
```