import * as StorageHandler from './storageHandler.js';


export let allProjects = [];

export const getCurrentProject = () => currentProject;
export const setCurrentProject = (project) => currentProject = project;
export const setHomeProject = (project) => homeProject = project;
export const setAllProject = (projects) => allProjects = projects;
export const flushHomeProject = () => {
    
    currentProject.projectTasks.forEach((task) => {
        homeProject.removeTask(homeProject.projectTasks.indexOf(task));
    });
}



export const createProject = (name, attachedDOMTab) => {

    
   
    let projectTasks = []; //holds task objects

    
    

    const removeTask = (index) => {
        console.log('sup removing');
        
        obj.projectTasks.splice(index, 1)
    }
    const obj = {projectTasks, name, removeTask, attachedDOMTab };

    return obj;
}

export const deleteProjectFromArray = (projectToDelete) => {
    
    allProjects.splice(allProjects.indexOf(projectToDelete), 1);
    StorageHandler.removeProject(projectToDelete);
    
}

export const addProjectToArray = (projectToAdd) => {
    allProjects.push(projectToAdd);
    StorageHandler.saveProject(projectToAdd)
    

}

export const getProjectByString = (projectName) => {
    let projectToReturn;
    allProjects.forEach((project) => {
        if (project.name == projectName) {
            
            projectToReturn = project;
        }
    })
    return projectToReturn;
}

let currentProject;
export let homeProject;




