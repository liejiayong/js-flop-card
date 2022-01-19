# Flop

Flop 是一款翻牌类配对消除游戏，基于 JavaScript 原生插件 [效果预览](https://codepen.io/liejiayong/pen/dyVLXEm)

由于公司业务需要，于是将 主要逻辑封装为插件，方便日后复用~

## 特性

- 兼容 pc ie10+ 及现代浏览器
- 支持移动端
- 支持可配置

<!-- ## Usage -->

<!-- ## install

```bash

npm i scratchers -S

``` -->

## use

首先创建元素

```html
<div class="flop-container"></div>
```

接着由于插件没有使用 JavaScript 为每个方块添加滑动动画，因此需要在每个方块设置动效

```css
.flop-container {
  position: relative;
  display: -webkit-box;
  display: -webkit-flex;
  display: -moz-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-flex-wrap: wrap;
  -ms-flex-wrap: wrap;
  flex-wrap: wrap;
  width: 500px;
  height: 500px;
}

.flop-container .item {
  position: relative;
  margin: 10px;
  -webkit-box-flex: 0;
  -webkit-flex: none;
  -moz-box-flex: 0;
  -ms-flex: none;
  flex: none;
  width: 100px;
  height: 100px;
  cursor: pointer;
  -webkit-transition: -webkit-transform 0.3s linear;
  transition: -webkit-transform 0.3s linear;
  -o-transition: -o-transform 0.3s linear;
  -moz-transition: transform 0.3s linear, -moz-transform 0.3s linear;
  transition: transform 0.3s linear;
  transition: transform 0.3s linear, -webkit-transform 0.3s linear, -moz-transform 0.3s linear, -o-transform 0.3s linear;
}

.flop-container .item .front {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: 1px solid #ccc;
  background: #ccc;
  z-index: 2;
  pointer-events: none;
}

.flop-container .item .back {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: orangered;
  z-index: 1;
  pointer-events: none;
  -webkit-transform: rotateY(180deg);
  -moz-transform: rotateY(180deg);
  transform: rotateY(180deg);
}

.flop-container .item.active {
  -webkit-transform: rotateY(180deg);
  -moz-transform: rotateY(180deg);
  transform: rotateY(180deg);
}

.flop-container .item.active .front {
  z-index: 0;
}
```

最后创建实例对象

```js
var tpl = {
  format: function (str, data) {
    return str.replace(/\{#(\w+)#\}/g, function (match, key) {
      return typeof data[key] === undefined ? '' : data[key];
    });
  },
  tmp: ['<div class="item flop-item">', '<div class="front"></div>', '<div class="back">{#type#}</div>', '</div>'],
};
document.addEventListener('DOMContentLoaded', function () {
  var map = [1, 2, 3, 4, 5, 6, 7, 8];
  var install = new Flop('.flop-container', {
    list: map.concat(map),
    duration: 500,
    onBefore: function () {},
    onDOMRender: function (install) {
      var tmp = tpl.tmp.join(''),
        list = install.list,
        str = '';
      list.forEach(function (val) {
        str += tpl.format(tmp, { type: val.type });
      });

      $('.flop-container').html(str);
    },
    onFinished: function (install) {
      console.log('游戏结束', install);
    },
  });
  $('.flop-container').on('click', '.item', function (e) {
    e.stopPropagation();
    install.click($(this).index());
  });
  install.start();
  console.log('Flop install ', install);
});
```

## API

### Flop(el, config)

构造函数 Flop 需要配置挂载元素 el 和配置项 config

配置项默认参数如下

```js
{
  list: [] /* 卡片数据。Array<{string?:any}> */,
  duration: 1200,
  namespaceClass: {
    container: '.flop-container',
    item: '.flop-item',
    itemActive: 'active',
  } /* 类名空间 */,
  onBefore: () => {} /* 开始游戏前 */,
  onFinished: () => {} /* 开始游戏后 */,
  onDOMRender: () => {} /* 卡片渲染函数 */,
}
```

### Flop.prototype.start()

初始化游戏

```js
install.start();
```

### Flop.prototype.reset()

初始化方块

```js
install.reset();
```

### Flop.prototype.click(index)

翻开卡片

```js
install.click(index);
```
