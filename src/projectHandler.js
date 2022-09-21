


export const getCurrentProject = () => currentProject;
export const setCurrentProject = (project) => currentProject = project;
export const setHomeProject = (project) => homeProject = project;

export const flushHomeProject = () => {
    
    currentProject.projectTasks.forEach((task) => {
        homeProject.removeTask(homeProject.projectTasks.indexOf(task));
    });
}

export const createProject = (name, attachedDOMTab) => {
    let projectTasks = []; //holds task objects

    const getAttachedDOMTab = () => attachedDOMTab;
    const getName = () => name;

    const removeTask = (index) => {
        projectTasks.splice(index, 1)
    }

    

    return {projectTasks, getName, removeTask, getAttachedDOMTab};
}

let currentProject;
export let homeProject;


