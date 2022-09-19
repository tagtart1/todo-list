


export const getCurrentProject = () => currentProject;
export const setCurrentProject = (project) => currentProject = project;
export const setHomeProect = (project) => homeProject = project;
export const createProject = (name) => {
    let projectTasks = []; //holds task objects


    const getName = () => name;

    const removeTask = (index) => {
        projectTasks.splice(index, 1)
    }

    return {projectTasks, getName, removeTask};
}

let currentProject;
export let homeProject;


