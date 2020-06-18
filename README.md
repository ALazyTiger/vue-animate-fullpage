# vue-animate-fullpage

### 功能简介
 > 基于animate.css动画库的全屏滚动，适用于vue.js(移动端、pc)项目。

### 安装
 > npm install vue-animate-fullpage --save

### 使用

#### main.js
 > 在main.js需要引入该插件的css和js文件
 
 > import 'vue-animate-fullpage/animate.css'
 
 > import VueAnimateFullpage from 'vue-animate-fullpage'
 
 > Vue.use(VueAnimateFullpage)

#### template

 > 在page-wp容器上加v-fullpage指令,v-fullpage的值是fullpage的配置 在page容器上加v-animate指令,v-animate的值是animate.css的动画效果
``` html
	<div class="fullpage-container">
	  <div class="fullpage-wp" v-fullpage="opts">
		<div class="page-1 page">
		  <p class="part-1" v-animate="{value: 'bounceInLeft'}">vue-fullpage</p>
		</div>
		<div class="page-2 page">
		  <p class="part-2" v-animate="{value: 'bounceInRight'}">vue-fullpage</p>
		</div>
		<div class="page-3 page">
		  <p class="part-3" v-animate="{value: 'bounceInLeft', delay: 0}">vue-fullpage</p>
		  <p class="part-3" v-animate="{value: 'bounceInRight', delay: 600}">vue-fullpage</p>
		  <p class="part-3" v-animate="{value: 'zoomInDown', delay: 1200}">vue-fullpage</p>
		</div>
	  </div>
	</div>
``` 

``` js
export default {

  data() {
    return {
      opts: {
		  start: 0,
		  dir: 'v',
		  loop: false,
		  duration: 500,
		  beforeChange: (prev, next)=> {
			console.log('before', prev, next)
		  },
		  afterChange: (prev, next)=> {
			console.log('after', prev, next)
		  }
   	 	}
    }
  }
}
```
手动跳转到指定页:
 > this.$fullpage.moveTo(0, true) ;
 
___
## api文档

##### page
 > 每屏的选择符，默认是 .page。
必须给每页添加该选择符。

##### start
 > 从第几屏开始，默认是第一屏。

##### duration
 > 每屏动画的显示时间，切换页面后在duration时间过后才能再次切换下一页，默认为500ms

##### loop
 > 是否支持循环滚动，默认为false

##### dir
 > 滚动方向，默认为v，垂直滚动 垂直滚动：v,水平滚动：h

##### der
 > 最小滑动距离，只有滑动距离大于最小滑动距离才会触发滚动效果 默认为：0.1

##### beforeChange
 > 当页面在滑动后触发beforeChange 包含两个参数prev和next，指当前页面和滑动后页面的index 在beforeChange方法中return false可以阻止页面的滑动

##### afterChange

 >  当页面滑动到下一页并且过了duration这个时间段后触发 包含两个参数prev和next，指当前页面和滑动后页面的index

--- 
##  v-animate指令的值

下面是一个典型的自定义属性
``` js
{
	value:'bounceInLeft',
	delay: 0
}
``` 
##### value
这个属性是一个元素的动画类型, 它的值取决于animate.css。
 