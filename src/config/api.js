export const url = {
  // server: 'https://www.todooo.cn/app/',
  server: 'https://www.dzdyz.com/app/',
  // server: 'http://10.0.11.157:8080/app/',
}

export const api = {
  user: {
    login: 'userLogin/login',
    update: 'user/updateUserinfo',
  },

  team: {
    add: 'user/createGroup',
    remove: 'user/ExtGroup',
    // 修改用户昵称
    editNikeName: 'user/editGroupUserNikeName',
    list: 'user/myGroup',

    join: 'user/addGroup',
  },

  task: {
    add: 'task/createTask',
    detail: 'task/findTaskById',
    edit: 'task/editTask',
    remove: 'task/delTask',
    list: 'task/myTasks',
    team: 'task/taskByGroupId',
  },

  member: {
    add: '',
    remove: '',
    add: '',
    remove: '',
    list: 'user/groupMember',
  },

  dict: {
    // 小组类型
    team: 'user/createGroupBefor',
    // 任务类型
    task: 'task/addTaskBefor'
  },

  saveFormId: 'common/saveFormIds'
}
