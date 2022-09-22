import * as ProjectHandler from './projectHandler.js';
import * as TaskHandler from './taskHandler.js';

export const loadLocalProjects = () => {
    const project = JSON.parse(localStorage.getItem('Jimmmy'));
    
   
    let newProject = ProjectHandler.createProject('Jimmmy2', 'test');
    Object.assign(newProject,project);
    
    console.log(newProject.projectTasks[0].title);
}