/**
 * @description: 翻牌类游戏
 * @author: liejiayong(809206619@qq.com)
 * @Date: 2022-01-15 11:58:49
 * @LastEditTime: 2022-01-14 11:01:12
 * @FilePath: \business-logic\template\js\index.js
 * @warning:
 */
import './classList-pollyfill.js';

function getRandom(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
function shuffle(arr) {
  let _arr = arr.slice();
  for (let i = 0; i < _arr.length; i++) {
    let j = getRandom(0, i);
    let n = _arr[i];
    _arr[i] = _arr[j];
    _arr[j] = n;
  }
  return _arr;
}

function isFunction(value) {
  var type = Object.prototype.toString.call(value);

  return type === '[object Function]';
}

class Flop {
  constructor(element = null /* 挂载元素 */, options = {}) {
    // this.playing = false; /* 正在游戏标识 */
    this.selected = null; /* 已选卡片。Object */
    this.list = this._resetList(options.list);
    this.options = this._extend(options, Flop.options);
    this.namespaceClass = this._extend((options.namespaceClass = {}), Flop.options.namespaceClass);
    this.$parent = document.querySelector(element);

    this.init();
  }
  init() {
    const { onBefore } = this.options;
    isFunction(onBefore) ? onBefore(this) : null;
  }
  start() {
    this.reset();

    /* 后期可考虑添加游戏倒计时 */
    // this.playing = true;
  }
  reset() {
    const { onDOMRender } = this.options;

    if (!isFunction(onDOMRender)) {
      const err = new Error('the parameter of turn must be function');
      throw err;
    }

    this._resetList();
    onDOMRender(this);
  }
  click(index, callback) {
    var self = this,
      options = self.options,
      curSelected = self.list[index],
      lastSelected = self.selected;

    /* 点击已翻开卡片 */
    if (!curSelected.visible || curSelected.open) return;
    var itemCls = self.namespaceClass.item,
      itemActive = self.namespaceClass.itemActive,
      curEl = self.$parent.querySelector(itemCls + ':nth-of-type(' + (index + 1) + ')');
    self.list.forEach(function (val, i) {
      if (i === index) {
        val.open = true;
        curEl.classList.add(itemActive);
      }
    });

    /* 点击翻开2张卡片 */
    if (self.selected) {
      self.list.forEach(function (val) {
        val.open = true;
      });

      if (curSelected.type === lastSelected.type) {
        setTimeout(function () {
          self.list.forEach(function (val, i) {
            if (val.type === curSelected.type) {
              val.visible = false;
              self.$parent.querySelector(itemCls + ':nth-of-type(' + (i + 1) + ')').style = 'visibility: hidden;';
            }
            val.open = false;
          });
          self.selected = null;
          isFunction(callback) && callback(self);
          self._onFinish();
        }, options.duration);
      } else {
        setTimeout(function () {
          self.list.forEach(function (val, i) {
            if (val.type === curSelected.type || val.type === lastSelected.type) {
              self.$parent.querySelector(itemCls + ':nth-of-type(' + (i + 1) + ')').classList.remove(itemActive);
            }
            val.open = false;
          });
          self.selected = null;
          self._onFinish();
          isFunction(callback) && callback(self);
        }, options.duration);
      }
    }
    self.selected = curSelected;
  }
  _onFinish() {
    var total = this.list.reduce(function (total, val) {
      if (!val.visible) total += 1;
      return total;
    }, 0);
    if (total === this.list.length && isFunction(this.options.onFinished)) {
      this.options.onFinished(this);
    }
  }
  _resetList(list = Flop.options.list) {
    list = shuffle(list);
    return list.map(function (val, i) {
      return {
        type: val,
        open: false /* 翻开 */,
        visible: true,
      };
    });
  }
  _extend(from, to) {
    const ret = {};
    for (let key in to) {
      if (from[key]) {
        ret[key] = from[key];
      } else {
        ret[key] = to[key];
      }
    }
    return ret;
  }
}
Flop.options = Object.freeze({
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
});

export default Flop;
