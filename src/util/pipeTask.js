import _ from 'lodash'

/**
 * [pipeTask 排序/过滤任务]
 * @param  {Array}  data       [任务对象数组]
 * @param  {Object} filterType [过滤对象]
 * @param  {String} sortType   [排序类型]
 * @return {[Array]}
 *
 * filterType:
 *   0 为过滤掉
 *   finish:   {Number} 0/1 [是否过滤完成的任务]
 *   ing:      {Number} 0/1 [是否过滤进行中的任务]
 *   postpone: {Number} 0/1 [是否过滤延期的任务]
 *
 * sortType:
 *   0 {Number} 默认排序
 *   1 {Number} 任务发布时间由近到远
 *   2 {Number} 任务发布时间由远到近
 */
export function pipeTask (data = [], filterType = {}, sortType = 0) {
  // 如果数据为空
  // 且没有过滤任何数据默认排序
  // 返回当前对象
  if (
    !data.length ||
    Object.values(filterType).every(v => v) && sortType === 0
  ) {
    return data
  }

  return data.filter(v => {
    if (
      !filterType.finish   && v.status === '1' ||
      !filterType.ing      && v.status === '2' ||
      !filterType.postpone && v.status === '0'
    ) {
      return false
    }

    return true
  }).sort((a, b) => {
    // 如果是默认排序就不排序啦
    if (sortType === 0) {
      return 0
    }

    // 任务发布时间由近到远
    if (sortType === 1) {
      return a.rawAddTime - b.rawAddTime
    }

    // 任务发布时间由远到近
    if (sortType === 2) {
      return b.rawAddTime - a.rawAddTime
    }
  })
}
