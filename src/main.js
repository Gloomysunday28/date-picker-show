import Vue from 'vue'
import App from './App'
import router from './router'
import EventDelegation from './hoc/EventDelegation'
Vue.component(EventDelegation.name, EventDelegation)

;(function flexible(window, document) {
	function setRemUnit() {
		const viewport = document.querySelector('meta[name=viewport]')
		//下面是根据设备像素设置viewport
		const devicePixelRatio = window.devicePixelRatio || 1
		viewport.setAttribute(
			'content',
			`width=device-width,initial-scale=${1 / devicePixelRatio}, maximum-scale=${1 /
				devicePixelRatio}, minimum-scale=${1 / devicePixelRatio}, user-scalable=no, viewport-fit=cover`
		)

		let deviceWidth = document.documentElement.clientWidth
		document.documentElement.style.fontSize = deviceWidth / 7.5 + 'px'
		document.documentElement.setAttribute('dpr', deviceWidth / 7.5)
		window.dpr = deviceWidth / 7.5
	}
	setRemUnit()

	window.addEventListener('resize', setRemUnit)
	window.addEventListener('pageshow', function(e) {
		if (e.persisted) {
			setRemUnit()
		}
	})
})(window, document)


Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
