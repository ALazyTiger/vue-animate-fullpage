'use strict'
var fullscreen = {}
var opt = {
  start: 0,
  loop: false,
  direction: 'v',
  duration: 500,
  distance: 0.1,
  movingFlag: false,
  preventWechat: false,
  beforeChange: function (data) { },
  afterChange: function (data) { }
}
fullscreen.install = function (Vue, options) {
  var that = fullscreen
  Vue.directive('fullscreen', {
    inserted: function (el, binding, vnode) {
      var opts = binding.value || {}
      that.init(el, opts, vnode)
    },
    componentUpdated: function (el, binding, vnode) {
      var opts = binding.value || {}
      that.init(el, opts, vnode)
    }
  })
  Vue.directive('animate', {
    inserted: function (el, binding, vnode) {
      if (binding.value) {
        that.initAnimate(el, binding, vnode)
      }
    }
  })
}

fullscreen.initAnimate = function (el, binding, vnode) {
  var that = fullscreen;
  var vm = vnode.context;
  var aminate = binding.value;
  el.style.opacity = '0';
  vm.$on('toogle_animate', function (curIndex) {
    var parent = el.parentNode;
    while (parent.getAttribute('data-id') === null) {
      parent = parent.parentNode;
    }
    var curPage = +parent.getAttribute('data-id');

    if (curIndex === curPage) {
      that.addAnimated(el, aminate);
    } else {
      el.style.opacity = '0';
      that.removeAnimated(el, aminate);
    }
  });
};
fullscreen.addAnimated = function (el, animate) {
  var delay = animate.delay || 0
  // console.log(el)
  el.classList.add('animated')

  window.setTimeout(function () {
    el.style.opacity = '1'
    el.classList.add(animate.value)
  }, delay)
}

fullscreen.removeAnimated = function (el, animate) {
  if(el.getAttribute('class').indexOf('animated') > -1) {
    el.classList.remove(animate.value)
  }
}

fullscreen.assignOpts = function (option) {
  var that = fullscreen
  var o = option || {}
  for (var key in opt) {
    if (!o.hasOwnProperty(key)) {
      o[key] = opt[key]
    }
  }
  that.o = o
}

fullscreen.initScrollDirection = function () {
  if (this.o.direction !== 'v') {
    this.el.classList.add('fullscreen-wp-h')
  }
}

fullscreen.init = function (el, options, vnode) {
  var that = fullscreen
  that.assignOpts(options)

  that.vm = vnode.context
  that.vm.$fullscreen = that
  if (typeof (that.curIndex) == "undefined") {
    that.curIndex = that.o.start;

  }
  that.startY = 0
  that.deltaX = 0
  that.deltaY = 0
  that.o.movingFlag = false

  that.el = el
  that.el.classList.add('fullscreen-wp')

  that.parentEle = that.el.parentNode
  that.parentEle.classList.add('fullscreen-container')

  that.pageEles = that.el.children
  that.total = that.pageEles.length

  that.initScrollDirection()
  window.setTimeout(function () {
    that.width = that.parentEle.offsetWidth
    that.height = that.parentEle.offsetHeight
    for (var i = 0; i < that.pageEles.length; i++) {
      var pageEle = that.pageEles[i]
      pageEle.setAttribute('data-id', i)
      pageEle.classList.add('page')
      pageEle.style.width = that.width + 'px'
      pageEle.style.height = that.height + 'px'
      that.initEvent(pageEle)
    }
    // that.el.classList.add('anim');

    that.moveTo(that.curIndex, false)

  }, 0)
}

fullscreen.initEvent = function (el) {
  var that = fullscreen
  that.prevIndex = that.curIndex
  el.addEventListener('touchstart', function (e) {
    if (that.o.movingFlag) {
      return false
    }
    that.startX = e.targetTouches[0].pageX
    that.startY = e.targetTouches[0].pageY
  })
  el.addEventListener('mousewheel', function (e) {
    if (that.o.movingFlag) {
      return false
    }
    that.deltaX = e.deltaX
    that.deltaY = e.deltaY
    var direction = that.o.direction
    if (that.deltaY > 0) {
      var nextIndex = that.curIndex + 1

      if (nextIndex < that.total) {
        that.moveTo(nextIndex, true)
      }
    } else {
      var nextIndex = that.curIndex - 1
      if (nextIndex >= 0) {
        that.moveTo(nextIndex, true)
      }
    }
  })
  el.addEventListener('touchend', function (e) {
    if (that.o.movingFlag) {
      return false
    }
    var direction = that.o.direction
    var sub = direction === 'v' ? (e.changedTouches[0].pageY - that.startY) / that.height : (e.changedTouches[0].pageX - that.startX) / that.width
    var distance = sub > that.o.distance ? -1 : sub < -that.o.distance ? 1 : 0
    // that.curIndex推迟到moveTo执行完之后再更新
    var nextIndex = that.curIndex + distance

    if (nextIndex >= 0 && nextIndex < that.total) {
      that.moveTo(nextIndex, true)
    } else {
      if (that.o.loop) {
        nextIndex = nextIndex < 0 ? that.total - 1 : 0
        that.moveTo(nextIndex, true)
      } else {
        that.curIndex = nextIndex < 0 ? 0 : that.total - 1
      }
    }
  })
  if (that.o.preventWechat) {
    el.addEventListener('touchmove', function (e) {
      e.preventDefault()
    })
  }
}

fullscreen.moveTo = function (curIndex, anim) {
  var that = fullscreen;
  var dist = that.o.direction === 'v' ? curIndex * - that.height : curIndex * - that.width;
  that.o.movingFlag = true;
  if (anim) {
    var flag = that.o.beforeChange(that.prevIndex, curIndex);
    if (flag === false) {
      // 重置movingFlag
      that.o.movingFlag = false;
      return false;
    }
    that.curIndex = curIndex;
    if (anim) {
      that.el.classList.add('anim');
    } else {
      that.el.classList.remove('anim');
    }
    that.move(dist);
    var preValue = that.prevIndex;
    window.setTimeout(function () {
      that.o.afterChange(preValue, curIndex);
      that.o.movingFlag = false;
      that.prevIndex = curIndex;
      that.vm.$emit('toogle_animate', curIndex);
    }, that.o.duration);
  } else {
    window.setTimeout(function () {
      that.o.movingFlag = false;
      that.vm.$emit('toogle_animate', curIndex);
    }, that.o.duration);
  }
};

fullscreen.move = function (dist) {

  var xPx = '0px'
  var yPx = '0px'
  if (this.o.direction === 'v') {
    yPx = dist + 'px'
  } else {
    xPx = dist + 'px'
  }
  this.el.style.cssText += ('-webkit-transform:translate3d(' + xPx + ', ' + yPx + ', 0px);transform:translate3d(' + xPx + ', ' + yPx + ', 0px);')
}

if (typeof exports === 'object') {
  module.exports = fullscreen
} else if (typeof define === 'function' && define.amd) {
  define([], function () {
    return fullscreen
  })
} else if (window.Vue) {
  window.Vuefullscreen = fullscreen
  Vue.use(fullscreen)
}
export default fullscreen;
