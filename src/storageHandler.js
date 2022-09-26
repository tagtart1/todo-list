import * as ProjectHandler from './projectHandler.js';
import * as TaskHandler from './taskHandler.js';

//should only make useful calls to the localStorage

export const getParsedProjects = () => {
    let parsedProjects = [];
    for (let i = 0; i < localStorage.length; i++) {
        let parsedProject = JSON.parse(localStorage.getItem(localStorage.key(i)));
        parsedProjects.push(parsedProject);

        
    }
    return parsedProjects;
}

export const saveProject = (projectToSave) => {
    localStorage.setItem(projectToSave.name, JSON.stringify(projectToSave));
}

export const getSavedProject = (projectName) => {
   
    
    return JSON.parse(localStorage.getItem(projectName));
    
}

export const removeProject = (project) => {
    localStorage.removeItem(project.name);
}


export const saveAllProjects = (projects) => {
    localStorage.setItem('allProject',JSON.stringify(projects));
    console.log(localStorage);
}