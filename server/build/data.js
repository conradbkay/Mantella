"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateGuestUser = exports.generateDefaultProject = exports.generateIds = exports.taskObjects = exports.tags = exports.defaultTask = void 0;
const uuid_1 = require("uuid");
exports.defaultTask = {
    name: 'Task',
    points: 0,
    subTasks: [],
    timeWorkedOn: 0,
    comments: [],
    color: '#FFFFFF',
    progress: 0,
    assignedTo: []
};
exports.tags = [
    { name: 'error', color: '#ffccd6' },
    {
        name: 'review',
        color: '#ffe7b6'
    },
    {
        name: 'important',
        color: '#c3ddff'
    }
];
const taskObjects = (ids) => [
    Object.assign(Object.assign({}, exports.defaultTask), { id: ids[0], name: 'Welcome To Mantella!' }),
    Object.assign(Object.assign({}, exports.defaultTask), { id: ids[1], name: 'This is a Task, click on it!' }),
    Object.assign(Object.assign({}, exports.defaultTask), { id: ids[2], name: 'Tasks are part of lists, drag this task into another list' }),
    Object.assign(Object.assign({}, exports.defaultTask), { id: ids[3], name: 'Lists can be assigned to projects and reordered' }),
    Object.assign(Object.assign({}, exports.defaultTask), { id: ids[4], name: 'Projects can be created at any time, you can have as many projects as you want!' }),
    Object.assign(Object.assign({}, exports.defaultTask), { id: ids[5], name: 'You can add colors to Tasks', color: '#c3ddff' }),
    Object.assign(Object.assign({}, exports.defaultTask), { id: ids[6], name: 'Tasks can be assigned a Point importance', points: 2 }),
    Object.assign(Object.assign({}, exports.defaultTask), { id: ids[7], name: 'Create a list by pressing the large + button within a project' }),
    Object.assign(Object.assign({}, exports.defaultTask), { id: ids[8], name: 'Tasks can be dragged into different lists or reordered within a list' }),
    Object.assign(Object.assign({}, exports.defaultTask), { id: ids[9], name: 'You can add, delete, and edit comments to Tasks' }),
    Object.assign(Object.assign({}, exports.defaultTask), { id: ids[10], name: 'Tasks can include subTasks', subTasks: [{ name: 'This is a subtask!', completed: false, id: (0, uuid_1.v4)() }] }),
    Object.assign(Object.assign({}, exports.defaultTask), { id: ids[11], name: 'You can invite members to projects and see who is online' }),
    Object.assign(Object.assign({}, exports.defaultTask), { id: ids[12], name: 'All board activity will be logged, in Beta' }),
    Object.assign(Object.assign({}, exports.defaultTask), { id: ids[13], name: 'Log time on Tasks by clicking the pomodoro tab button' }),
    Object.assign(Object.assign({}, exports.defaultTask), { id: ids[14], name: 'Tasks can be assigned to one or more people!' }),
    Object.assign(Object.assign({}, exports.defaultTask), { id: ids[15], name: 'I hope you enjoy Mantella, email me with feature requests or bugs, I appreciate all feedback!' })
];
exports.taskObjects = taskObjects;
const generateIds = (length) => {
    let ids = [];
    for (let i = 0; i < length; i++) {
        ids.push((0, uuid_1.v4)());
    }
    return ids;
};
exports.generateIds = generateIds;
const generateDefaultProject = (newUser, projectId) => {
    const listIds = [(0, uuid_1.v4)(), (0, uuid_1.v4)(), (0, uuid_1.v4)()];
    const ids = (0, exports.generateIds)(16);
    const tasks = (0, exports.taskObjects)(ids);
    return {
        name: 'Tutorial Project',
        columns: [],
        lists: [
            {
                id: listIds[0],
                name: 'Fundementals',
                taskIds: [ids[0], ids[1], ids[2], ids[3], ids[4], ids[5]]
            },
            {
                id: listIds[1],
                name: 'Setting Up',
                taskIds: [ids[6], ids[7], ids[8], ids[9]]
            },
            {
                id: listIds[2],
                name: 'Other Features',
                taskIds: [ids[10], ids[11], ids[12], ids[13], ids[14]]
            }
        ],
        ownerId: newUser.id,
        id: projectId,
        tasks: tasks,
        users: [newUser]
    };
};
exports.generateDefaultProject = generateDefaultProject;
const generateGuestUser = (projectId, userId) => {
    return {
        id: userId,
        email: (0, uuid_1.v4)() + '.gmail.com',
        username: 'Guest',
        projects: [projectId],
        profileImg: 'https://mb.cision.com/Public/12278/2797280/879bd164c711a736_800x800ar.png'
    };
};
exports.generateGuestUser = generateGuestUser;
//# sourceMappingURL=data.js.map