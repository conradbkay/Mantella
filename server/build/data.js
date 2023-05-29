"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateGuestUser = exports.generateDefaultProject = exports.defaultColors = exports.generateIds = exports.taskObjects = exports.tags = exports.defaultTask = void 0;
const uuid_1 = require("uuid");
exports.defaultTask = {
    name: 'Task',
    points: 0,
    subTasks: [],
    timeWorkedOn: 0,
    comments: [],
    color: '#FFFFFF',
    assignedTo: [],
    createdAt: new Date().toString()
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
const taskObjects = (ids, userId) => [
    Object.assign(Object.assign({}, exports.defaultTask), { id: ids[0], name: 'Welcome To Mantella! Click on any task to edit it' }),
    Object.assign(Object.assign({}, exports.defaultTask), { id: ids[1], name: 'Tasks can be dragged to other lists or reordered within a list', description: '{"root":{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Hold space on a focused task to move it ","type":"code-highlight","version":1},{"detail":0,"format":0,"mode":"normal","style":"","text":"with","type":"code-highlight","version":1,"highlightType":"keyword"},{"detail":0,"format":0,"mode":"normal","style":"","text":" keyboard arrows","type":"code-highlight","version":1}],"direction":"ltr","format":"","indent":0,"type":"code","version":1,"language":"javascript"}],"direction":"ltr","format":"","indent":0,"type":"root","version":1}}' }),
    Object.assign(Object.assign({}, exports.defaultTask), { id: ids[2], name: 'Create new tasks with the + button on the right of the list title' }),
    Object.assign(Object.assign({}, exports.defaultTask), { id: ids[3], name: 'Right click a list or use the menu to the left of the + button to edit, delete, or move it' }),
    Object.assign(Object.assign({}, exports.defaultTask), { id: ids[4], name: 'Navigate between or create new projects with the projects menu at the top left corner of your screen' }),
    Object.assign(Object.assign({}, exports.defaultTask), { id: ids[5], name: 'You can search for projects, lists, and tasks (for all projects) with the universal search bar at the top of your screen' }),
    Object.assign(Object.assign({}, exports.defaultTask), { id: ids[6], name: 'Create a list by pressing the large + button within a project' }),
    Object.assign(Object.assign({}, exports.defaultTask), { id: ids[7], name: 'You can add colors to Tasks', color: '#005BD2' }),
    Object.assign(Object.assign({}, exports.defaultTask), { id: ids[8], name: 'Tasks can be assigned a Point importance', points: 2 }),
    Object.assign(Object.assign({}, exports.defaultTask), { id: ids[9], name: 'Drag member icons from the top right onto tasks to assign them or multiple members', assignedTo: [userId] }),
    Object.assign(Object.assign({}, exports.defaultTask), { id: ids[10], name: 'You can add, delete, and edit comments to Tasks' }),
    Object.assign(Object.assign({}, exports.defaultTask), { id: ids[11], name: 'Tasks can include subtasks', subTasks: [{ name: 'This is a subtask!', completed: false, id: (0, uuid_1.v4)() }] }),
    Object.assign(Object.assign({}, exports.defaultTask), { id: ids[12], name: '(Coming Soon) all changes will be tracked in the project history, and you can revert to any point in time!' }),
    Object.assign(Object.assign({}, exports.defaultTask), { id: ids[13], name: 'Log time on tasks by pressing the button on the bottom right of each task or use the pomodoro tab (the last icon in the sidebar) to include breaks' }),
    Object.assign(Object.assign({}, exports.defaultTask), { id: ids[14], name: 'Tasks can be filtered by points, color, due date, and (soon) members' }),
    Object.assign(Object.assign({}, exports.defaultTask), { id: ids[15], name: 'Invite and manage members with the share button in the top right corner of your screen' }),
    Object.assign(Object.assign({}, exports.defaultTask), { id: ids[16], name: 'Create and assign member roles in the project settings' }),
    Object.assign(Object.assign({}, exports.defaultTask), { id: ids[17], name: "Each project comes with its own messaging system. View a project's chat by clicking the chat icon in the sidebar, or view all projects with the Chat tab in the main header" }),
    Object.assign(Object.assign({}, exports.defaultTask), { id: ids[18], name: 'I hope you enjoy using Mantella, email me (conradkaydev@gmail.com) with feature requests or bugs, I appreciate any and all feedback!' })
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
exports.defaultColors = [
    '#C20026',
    '#C38300',
    '#3D8F00',
    '#005BD2',
    '#7B39BC',
    '#B52DB5',
    '#00A86C',
    '#D0CD00'
];
const generateDefaultProject = (newUser, projectId, chat) => {
    const listIds = [(0, uuid_1.v4)(), (0, uuid_1.v4)(), (0, uuid_1.v4)()];
    const roleId = (0, uuid_1.v4)();
    const ids = (0, exports.generateIds)(19);
    const tasks = (0, exports.taskObjects)(ids, newUser.id);
    return {
        colors: exports.defaultColors,
        channels: [chat],
        history: [],
        name: 'Tutorial Project',
        lists: [
            {
                id: listIds[0],
                name: 'Fundementals',
                taskIds: [[ids[0], ids[1], ids[2], ids[3], ids[4], ids[5]], [], []]
            },
            {
                id: listIds[1],
                name: 'Setting Up',
                taskIds: [[ids[6], ids[7], ids[8], ids[9]], [], []]
            },
            {
                id: listIds[2],
                name: 'Other Features',
                taskIds: [
                    [
                        ids[10],
                        ids[11],
                        ids[12],
                        ids[13],
                        ids[14],
                        ids[15],
                        ids[16],
                        ids[17],
                        ids[18]
                    ],
                    [],
                    []
                ]
            }
        ],
        security: {
            public: true
        },
        ownerId: newUser.id,
        id: projectId,
        tasks: tasks,
        users: [Object.assign(Object.assign({}, newUser), { roles: [roleId] })],
        roles: [
            {
                id: roleId,
                name: 'Admin',
                color: '#FF0000'
            }
        ],
        data: {}
    };
};
exports.generateDefaultProject = generateDefaultProject;
const generateGuestUser = (projectId, userId) => {
    return {
        id: userId,
        email: (0, uuid_1.v4)() + '.gmail.com',
        username: 'Guest',
        projects: [projectId],
        guest: true,
        profileImg: 'https://mb.cision.com/Public/12278/2797280/879bd164c711a736_800x800ar.png'
    };
};
exports.generateGuestUser = generateGuestUser;
//# sourceMappingURL=data.js.map