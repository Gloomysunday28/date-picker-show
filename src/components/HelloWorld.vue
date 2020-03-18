<template>
  <div class="m-date__picker">
    <div class="m-date__month">
      <div class="m-date__select" @click="selectMonth('reduce')">
        <!-- <color-icon use="icon-fanhui1-copy" /> -->
      </div>
      {{month | filterMonth}}月{{year}}年
      <div class="m-date__select" @click="selectMonth('plus')">
        <!-- <color-icon use="icon-jiantou1" /> -->
      </div>
    </div>
    <div class="m-date__distributions">
      <table class="m-date__table">
        <thead>
          <th class="m-date__week" v-for="week in weekDistributions" :key="week">{{week}}</th>
        </thead>
        <EventDelegation eTagName="m-date__time" :transition="transitionConfig">
          <tbody :key="month" @click="selectDate">
            <tr class="m-date__date" v-for="(dateColumn, index) in dateDistributions" :key="index">
              <td class="m-date__td" v-for="date in dateColumn" :key="date.date">
                <div
                  :data-date="date.date"
                  :data-month="date.month"
                  :data-year="date.year"
                  :data-expired="date.expired"
                  class="m-date__time"
                  :class="{
                    'm-date__time--select': date.select && date.month === month,
                    'm-date__time--light': date.expired,
                    'm-date__time--half_delivery': date.halfDelivery,
                    'm-date__time--no_delivery': date.noDelivery,
                  }"
                >
                  {{date.date}}
                </div>
              </td>
            </tr>
          </tbody>
        </EventDelegation>
      </table>
    </div>
  </div>
</template>

<script>
const utils = {
  flatArray(arr) {
      return arr.reduce((prev, next) => {
        return prev.concat(Array.isArray(next) ? this.flatArray(next) : next)
      }, [])
    },
    padFillDate(date) {
      return date.toString().padStart(2, '0')
    }
}
export default {
  name: 'DatePicker',
  filters: {
    filterMonth(n) {
      return n.toString().padStart(2, '0')
    }
  },
  data() {
    const year = new Date().getFullYear()
    const month = new Date().getMonth() + 1
    // const date = new Date().getDate()

    return {
      currentDate: '',
      transitionConfig: {
        name: 'slide-down-table',
        appear: true
      },
      year,
      month,
      dateDistributions: [],
      weekDistributions: ['日', '一', '二', '三', '四', '五', '六']
    }
  },
  computed: {
    /** 
     * @description
     *  扁平化日历表，以便后面选择日期时可以有利筛选
     */
    flatDate() {
      return utils.flatArray(this.dateDistributions)
    },
    padFillDate() {
      return utils.padFillDate
    }
  },
  mounted() {
    this.getCurrentDate()
  },
  methods: {
    /**
     * @param {Object} event MouseEvent, 被点击的元素
     * @description 
     *  点击日期，选择日期并且传递到父级
     *  若点击区域是非本月的，那么会跳转到点击的月份
     */
    selectDate(event) {
      const { month, padFillDate } = this
      const { target } = event
      const {
        dataset: {
          date,
          expired,
          year: dateYear,
          month: dateMonth
        }
      } = target

      Array.from(document.getElementsByClassName('m-date__time'), el => {
        el.classList.remove('m-date__time--select')
      })
      target.classList.add('m-date__time--select')
      
      this.currentDate = `${expired ? dateYear : this.year}-${expired ? dateMonth : month}-${date}`
      this.$emit('selectDate', this.currentDate)
      
      if (expired) {
        this.selectMonth(`${dateYear}-${padFillDate(dateMonth)}` > `${this.year}-${padFillDate(month)}` ? 'plus' : 'reduce')
      }
    },
    /**
     * @description 
     *  检验当前日历表与当前选择的日期是否一致，一致则需要勾选上
     */
    changeSelectDate() {
      const { currentDate, year } = this
      this.flatDate.forEach(date => {
        date.select = !!(`${year}-${date.month}-${date.date}` === currentDate)
      })
    },
    /**
     * @description
     *   控制month的更改
     * @param { String } action month变化行为
     */
    selectMonth(action) {
      const { month, judgeMonth } = this
      this.month = judgeMonth(action === 'plus' ? month + 1 : month - 1)
      this.getCurrentDate()

      this.changeSelectDate()
    },
    /**
     * @description
     *  判读日期是否超过12月或小于1月
     * @param { Number } month 月份
     * @returns { Number } month 最终月份
     */
    judgeMonth(month, changeYear = true/* 只有在selectMonth调用时, 当前的年份才会发生改变 */) {
      if (month > 12) {
        month = 1
        changeYear && (this.year += 1)
      } else if (month < 1) {
        month = 12
        changeYear && (this.year -= 1)
      }

      return month
    },
    /**
     * @description
     *  当前月份日历表
     *  思路：
     *    1. 首先需要知道当月需要显示几行，有些月份只显示5行有些会显示6行 计算方式: Math.ceil((当前月份的总天数+本月1号的星期) / 7) * 7 取最大行数
     *    2. 获取本月的1号是周几，本月的总天数以及上个月的最后一号
     *    3. 循环遍历35
     *      a. 小于本月1号的星期是上个月份的日期, 计算方式：last_month - 本月1号的星期 + 当前遍历的索引 + 1
     *      b. 大于等于本月1号的星期并且小于本月总天数+本月1号星期则是当前月份
     *      c. 大于或等于本月总天数+本月1号星期则是下个月份
     */
    getCurrentDate() {
      this.dateDistributions = []
      const {
        year,
        month,
        dateDistributions,
        judgeMonth,
        $set
      } = this

      const currentDays = new Date(year, month, 0).getDate() // 获取当前月份的总天数
      const firstDayInWeek = new Date(year, month - 1, 1).getDay() // 获取当前月份1号在周几
      const lastMonthDays = new Date(year, month - 1, 0).getDate() // 获取当前月份1号在周几

      var i = -1, column = 0, dateMonth = 0
      while (i++, i < Math.ceil((currentDays + firstDayInWeek) / 7) * 7) {
        column = ~~(i / 7)
        const currentColumnDate = (dateDistributions[column] || ($set(dateDistributions, column, [])))
        if (i < firstDayInWeek) { // i 当前要 小于本月1号
          dateMonth = judgeMonth(month - 1, false)
          currentColumnDate.push({
            date: lastMonthDays - firstDayInWeek + i + 1,
            expired: true,
            select: false,
            month: dateMonth,
            year: dateMonth === 12 ? year - 1 : year
          })
        } else if (i >= firstDayInWeek && i < currentDays + firstDayInWeek) {
           currentColumnDate.push({
            date: i - firstDayInWeek + 1,
            expired: false,
            select: false,
            halfDelivery: true,
            month
          })
        } else { // i 当前要 大于本月最后一号
          dateMonth = judgeMonth(month + 1, false)
          currentColumnDate.push({
            date: i - currentDays - firstDayInWeek + 1,
            expired: true,
            select: false,
            month: dateMonth,
            year: dateMonth === 1 ? year + 1 : year
          })
        }
      }
    }
  }
}
</script>

<style scoped lang="less">
  .m-date__picker {
    padding: .23rem .4rem;
    background: #fff;
    .m-date__month {
      margin-bottom: .18rem;
      display: flex;
      justify-content: space-between;
      font-size: .36rem;
      color: #273142;
    }
    .m-date__distributions {
      padding: .23rem;
    }
    .m-date__select {
      width: .616rem;
      height: .616rem;
      border: .017rem solid #c8c8c8;
      border-radius: .2rem;
      display: flex;
      justify-content: center;
      align-items: center;
      .c-color__icon {
        color: red;
        width: .24rem;
        height: .24rem;
      }
    }
  }
  .m-date__table {
    width:100%;
    border: none;
    border-collapse: collapse;
    .m-date__td {
      position: relative;
      height: .83rem;
      border: none;
    }
    .m-date__week {
      color: #c8c8c8;
    }
  }
  .m-date__time {
    margin: .37rem auto 0;
    width: .54rem;
    height: .54rem;
    border-radius: 100%;
    box-sizing: content-box;
    line-height: .54rem;
    text-align: center;
    color: #9b9b9b;
    background-clip: content;
    -webkit-background-clip: content;
    &.m-date__time--select {
      border-color: green !important;
      background-color: green !important;
    }
    &.m-date__time--light {
      color: #e4e4e4;
    }
    &.m-date__time--half_delivery {
      color: #fff;
      padding: .08rem;
      background-color: #F7B500;
      border: .01rem solid #F7B500;
    }
    &.m-date__time--no_delivery {
      color: #fff;
      background-color: #F75F47;
    }
  }
</style>