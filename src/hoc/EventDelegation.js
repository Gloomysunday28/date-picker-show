const EventDelegation = (eTagName, fn) => {
  return function(e) {
    const target = e.target
    if (target.nodeType === 1 && target.classList.contains(eTagName)) {
      fn && fn.call(this, ...arguments)
    }
  }
}

function getAbstractComponent(vnode) {
  return vnode && vnode.componentOptions && vnode.componentOptions.Ctor.options.abstract
}

export default {
  name: 'EventDelegation',
  abstract: true,
  props: {
    transition: {
      type: Object,
      default: () => ({}),
      required: false
    },
    eTagName: {
      type: String,
      default: '',
      required: true
    }
  },
  render() {
    let vnode = this.$slots.default[0]
    while(getAbstractComponent(vnode)) {
      vnode = (vnode.children || vnode.componentOptions.children || [])[0]
    }
    if (vnode) {
      if (!vnode.data.on) return vnode
      for (let eve in vnode.data.on) {
        vnode.data.on[eve] = EventDelegation(this.eTagName, vnode.data.on[eve])
      }
    }

    if (Object.keys(this.transition).length) { // 替代transition组件
      vnode.data.transition = this.transition
    }
    return vnode
  }
}
