<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
html {
   -ms-text-size-adjust: 100%;
        -webkit-text-size-adjust: 100%;
        -webkit-tap-highlight-color: transparent;
        -webkit-font-smoothing: antialiased;
        height: 100%;
        /*width: 100%;*/
        overflow-x: hidden;
        font-family: -apple-system,PingFang-SC-Regular,BlinkMacSystemFont,PingFang SC,Helvetica Neue,STHeiti,Microsoft Yahei,Tahoma,Simsun,sans-serif;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  font-size: .28rem;
}

 .slide-down-table-enter-active {
        animation: slide-downs .5s linear;
    }

    @keyframes slide-downs {
        from {
            opacity: 0;
            transform: translate3d(0, -.6rem, 0)
        }
        to {
            opacity: 1;
            transform: translate3d(0, 0, 0)
        }
    }
</style>
