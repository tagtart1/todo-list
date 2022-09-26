//takes input and displays onto DOM
import * as TaskHandler from './taskHandler.js'
import * as ProjectHandler from './projectHandler.js'
import * as StorageHandler from './storageHandler.js';


const UIHandler = () => {
    

    let isEditMode = false;
    let taskToEdit;
    
    const formContainer = document.querySelector('.new-task-form-container');
    const createTaskForm = document.querySelector('.popup');
    const main= document.querySelector('.main');
    const header = document.querySelector('.header');
    const mainTabs = document.querySelectorAll('.main-tab');
    const deleteProjectIcon = document.querySelector('.delete-project-button');
    const deleteProjectConfirm = document.querySelector('.delete-confirm');

    const projectHeaderTxt = document.querySelector('.project-header-text');
    const newTaskBtn = document.querySelector('.create-todo');
    const submitTaskBtn = document.querySelector('.submit-task-btn');
    const closeFormBtn = document.querySelector('.backout-btn');
    const addNewProject = document.querySelector('.new-project-button');
    const newProjectForm = document.querySelector('.new-project-form');
    const formTitle = document.querySelector('.form-title');
    const projectFormCancelBtn = document.querySelector('.cancel-btn');
    const projectHeader = document.querySelector('.project-header');
    const detailsPopup = document.querySelector('.details-popup');
    const detailsContainer = document.querySelector('.details-container');
    const detailsCloseBtn = document.querySelector('.details-close');

    //Details form DOM to output
    const detailsTitle = document.querySelector('.detail-title');
    const detailsProject = document.querySelector('.detail-project');
    const detailsPriority = document.querySelector('.detail-priority');
    const detailsDate = document.querySelector('.detail-date');
    const detailsText = document.querySelector('.detail-text');

    let homeTab;

    

    const setupStartProject = () => {
  
        let counter = 0;
        mainTabs.forEach((tab) => {
            
            let project;
            if (localStorage.length < 3) { 
                project = ProjectHandler.createProject(tab.textContent, tab);
                ProjectHandler.addProjectToArray(project);
                console.log('here');
            }
            else {
                console.log('here2');
                console.log(localStorage);
                project = ProjectHandler.createProject(StorageHandler.getSavedProject(tab.textContent).name, tab);
                project.projectTasks = StorageHandler.getSavedProject(tab.textContent).projectTasks;
                ProjectHandler.addProjectToArray(project);
                
                counter++
               
                //Rebuild tasks
                if (project.projectTasks.length > 0) {
                for(let i = 0; i < project.projectTasks.length; i++) {
            
                  
                    
                    let setupTask = TaskHandler.createTask(project.projectTasks[i].title, project.projectTasks[i].details, project.projectTasks[i].priority, project.projectTasks[i].dueDate, project.projectTasks[i].parentProjectName);
                    project.projectTasks[i] = setupTask;
                    if (project.name == 'Home') {
                        TaskHandler.addToAllTasks(project.projectTasks[i]);
                        
                   }
                }
                }
            }

            if (tab.textContent == 'Home')  {
                homeTab = tab;
                ProjectHandler.setCurrentProject(project);
                ProjectHandler.setHomeProject(project);
                loadProjectTasks();
                tab.classList.add('tab-selected');
                
            }
            tab.addEventListener('click', () => {
                const oldSelected = document.querySelector('.tab-selected');
                if (oldSelected != null) {
                    oldSelected.classList.remove('tab-selected');
                }
                tab.classList.add('tab-selected');
                ProjectHandler.setCurrentProject(project);
                loadProjectTasks();
                hideDeleteIcons();
            })
        })
        
    }

    const loadSavedProjects = () => {
        for (let i = 0; i < localStorage.length; i++) {
            if (localStorage.key(i) != 'Home' && localStorage.key(i) != 'Today' && localStorage.key(i) != 'Week') {
                
                const newTabItem = createProjectTab(localStorage.key(i));
                const newProject = ProjectHandler.createProject(localStorage.key(i), newTabItem);
                newProject.projectTasks = StorageHandler.getSavedProject(localStorage.key(i)).projectTasks;
               
                ProjectHandler.addProjectToArray(newProject);

                if (newProject.projectTasks.length > 0) {
                    for(let i = 0; i < newProject.projectTasks.length; i++) {
                
                       
                        
                        let setupTask = TaskHandler.createTask(newProject.projectTasks[i].title, newProject.projectTasks[i].details, newProject.projectTasks[i].priority, newProject.projectTasks[i].dueDate, newProject.projectTasks[i].parentProjectName);
                        newProject.projectTasks[i] = setupTask;
                       
                    }
                }

                newTabItem.addEventListener('click', () => {
                    const oldSelected = document.querySelector('.tab-selected');
                    if (oldSelected != null) {
                        oldSelected.classList.remove('tab-selected');
                    }
                    ProjectHandler.setCurrentProject(newProject);
                  
                    newTabItem.classList.add('tab-selected');
                    loadProjectTasks();
                    resetDeleteIcons();
                })
        
                addNewProject.parentNode.insertBefore(newTabItem, addNewProject);

            }
        }

      
    }

    const handleCopyingTasks = () => [
        ProjectHandler.allProjects.forEach((project) => {
            if (project.name != 'Home') {
               project.projectTasks.splice(0, project.projectTasks.length);
               ProjectHandler.homeProject.projectTasks.forEach((homeTask) => {
                 if (homeTask.parentProjectName == project.name) {
                    project.projectTasks.push(homeTask);
                 }
               })
            }
        })
    ]

    const toggleTaskForm = (e) => {
        isEditMode = false;
        e.preventDefault();
        blurPage();
       
        formTitle.textContent = 'Create New Task...';
        submitTaskBtn.textContent = 'Add Task';
       
        formContainer.classList.toggle('invis');
        createTaskForm.classList.toggle('visible');
        createTaskForm.reset();
    }

    const blurPage = () => {
        main.classList.toggle('blur-overlay');
        header.classList.toggle('blur-overlay');
    }


    const editTask = (e) => {
        taskToEdit.updateTask(createTaskForm.elements['title'].value, createTaskForm.elements['details'].value, createTaskForm.elements['priority'].value, 
        createTaskForm.elements['dueDate'].value);
        console.log(taskToEdit);
        console.log(TaskHandler.allTasks);
        StorageHandler.saveProject(ProjectHandler.getCurrentProject());
        StorageHandler.saveProject(ProjectHandler.homeProject);
        toggleTaskForm(e);
       
        createTaskForm.reset();
        loadProjectTasks(); // probably better to reload the single task
    }


    const submitTask = (e) => {
        //calls to taskhandler to create a task object
        const newTask = TaskHandler.createTask(createTaskForm.elements['title'].value, createTaskForm.elements['details'].value, createTaskForm.elements['priority'].value, 
        createTaskForm.elements['dueDate'].value, ProjectHandler.getCurrentProject().name);
       
        console.log(newTask.parentProjectName);
        // Modify this to make it make sense later \/
        if(ProjectHandler.getCurrentProject() === ProjectHandler.homeProject) {
            ProjectHandler.homeProject.projectTasks.push(newTask);
        }
        else {
            ProjectHandler.getCurrentProject().projectTasks.push(newTask);
           
            
            ProjectHandler.homeProject.projectTasks.push(newTask);
            StorageHandler.saveProject(ProjectHandler.homeProject);
        }
        //Update save to storage
        
        StorageHandler.saveProject(ProjectHandler.getCurrentProject());
        toggleTaskForm(e);
        
        createTaskForm.reset();
      
        
        addTaskToDOM(newTask);
       
    }


    const addTaskToDOM = (task) => {
        const createTodoBtn = document.querySelector('.create-todo');

        

        const divTodo = document.createElement('div');
        divTodo.classList.add('todo');

        const leftSideDiv = document.createElement('div');
        leftSideDiv.classList.add('todo-left-side');
        divTodo.appendChild(leftSideDiv);

        const priorityLine = document.createElement('div');
        priorityLine.classList.add('priority-line');

        switch(task.priority) {
            case 'low': priorityLine.style.backgroundColor = 'rgb(54, 173, 70)';
            break;
            case 'medium': priorityLine.style.backgroundColor = 'rgb(218, 203, 0)';
            break;
            case 'high': priorityLine.style.backgroundColor = 'rgb(245, 54, 28)';
            break;
        };
      

        leftSideDiv.appendChild(priorityLine);

        const todoCheckbox = document.createElement('div');
        todoCheckbox.classList.add('todo-checkbox');
        leftSideDiv.appendChild(todoCheckbox);

  
        
        const todoTitle = document.createElement('p');
        todoTitle.textContent = task.title;
        leftSideDiv.appendChild(todoTitle);
        //Ability to mark a task as done
        const todoCheckboxInner = document.createElement('div');
       
        todoCheckbox.addEventListener('click', () => {
            todoCheckboxInner.classList.toggle('todo-done-checked');
            taskDueDate.classList.toggle('todo-date-checked');
            todoTitle.classList.toggle('todo-title-checked');
            detailsBtn.classList.toggle('todo-details-checked');
            editIcon.classList.toggle('todo-icons-checked');
            deleteIcon.classList.toggle('todo-icons-checked');
           
            task.isChecked = !task.isChecked;
            if (ProjectHandler.getCurrentProject() != ProjectHandler.homeProject) {
                
                StorageHandler.saveProject(ProjectHandler.getCurrentProject());
            }
            else {
                StorageHandler.saveProject( ProjectHandler.getProjectByString(task.parentProjectName));
            }
            StorageHandler.saveProject(ProjectHandler.homeProject);
        })
        todoCheckbox.appendChild(todoCheckboxInner);

        const todoActions = document.createElement('div');
        todoActions.classList.add('todo-actions');
        divTodo.appendChild(todoActions);

        const taskDueDate = document.createElement('p');
        taskDueDate.textContent = task.getFormattedDueDate();
        todoActions.appendChild(taskDueDate);

        const detailsBtn = document.createElement('button');
        detailsBtn.classList.add('details-btn');
        detailsBtn.textContent ='DETAILS'
        todoActions.appendChild(detailsBtn);
        //Toggles the details popup
        detailsBtn.addEventListener('click', () => {
            toggleDetailsPopup();
           
            detailsTitle.textContent = task.title;
            detailsProject.textContent = task.parentProjectName;
            detailsPriority.textContent = task.priority;
            detailsDate.textContent = task.getExtendedDueDate();
            detailsText.textContent = task.details;
        } );

        const editIcon = new Image();
        editIcon.src = 'edit.svg';
        editIcon.alt = "edit button";
        todoActions.appendChild(editIcon);
        //Opens edit mode for that task
        editIcon.addEventListener('click', (e) => {   
            taskToEdit = task;
            openEditTaskForm(e, task);
        })

        const deleteIcon = new Image();
        deleteIcon.src = 'delete.svg';
        deleteIcon.alt = 'delete button';
        todoActions.appendChild(deleteIcon);

        //Deletes task completely move to projectandler
        deleteIcon.addEventListener('click', () => {
            divTodo.remove(); 
            
           
            if (ProjectHandler.getCurrentProject() != ProjectHandler.homeProject) {
                
                ProjectHandler.getCurrentProject().removeTask(ProjectHandler.getCurrentProject().projectTasks.indexOf(task));
                ProjectHandler.homeProject.removeTask(ProjectHandler.homeProject.projectTasks.indexOf(task));

                StorageHandler.saveProject(ProjectHandler.getCurrentProject());
            }
            else {
                ProjectHandler.homeProject.removeTask(ProjectHandler.homeProject.projectTasks.indexOf(task));
                ProjectHandler.getProjectByString(task.parentProjectName).removeTask(ProjectHandler.getProjectByString(task.parentProjectName).projectTasks.indexOf(task));

                StorageHandler.saveProject( ProjectHandler.getProjectByString(task.parentProjectName));
            }

            StorageHandler.saveProject(ProjectHandler.homeProject);
              
        })

        if (task.isChecked) {
            console.log('should be checking');
            todoCheckboxInner.classList.add('todo-done-checked');
            taskDueDate.classList.add('todo-date-checked');
            todoTitle.classList.add('todo-title-checked');
            detailsBtn.classList.add('todo-details-checked');
            editIcon.classList.add('todo-icons-checked');
            deleteIcon.classList.add('todo-icons-checked');
        }

        createTodoBtn.parentNode.insertBefore(divTodo, createTodoBtn);
    }

    const openEditTaskForm = (e, task) => {
        toggleTaskForm(e);
        //set to true so form only edits the task
        isEditMode = true;
        formTitle.textContent = 'Edit Task...';
        submitTaskBtn.textContent = 'EDIT';
        //Puts task details into edit
        createTaskForm.elements['title'].value = task.title;
        createTaskForm.elements['details'].value = task.details;
        createTaskForm.elements['dueDate'].value = task.dueDate
        createTaskForm.elements['priority'].value = task.priority;
    }

    const toggleDetailsPopup = () => {
        blurPage();
        detailsContainer.classList.toggle('invis');
        detailsPopup.classList.toggle('visible');
    }

    const loadProjectTasks = () => {
        
        const project = ProjectHandler.getCurrentProject();
        projectHeaderTxt.textContent = project.name;
        const oldTodos = document.querySelectorAll('.todo');
        
        oldTodos.forEach((todo) => {
            todo.remove();
        })
        project.projectTasks.forEach((task) => {
            addTaskToDOM(task);
        });
    }

    const toggleProjectForm = () => {
        newProjectForm.classList.toggle('display-none');
        addNewProject.classList.toggle('display-none');
    }

    const deleteProject = (projectDOM) => {
        
        hideDeleteIcons();
        projectDOM.remove();
        ProjectHandler.deleteProjectFromArray(ProjectHandler.getCurrentProject());
       
        ProjectHandler.flushHomeProject();
        StorageHandler.saveProject(ProjectHandler.homeProject);
        //Goto home


        ProjectHandler.setCurrentProject(ProjectHandler.homeProject);
        loadProjectTasks();
        homeTab.classList.add('tab-selected');
        
    }

    const resetDeleteIcons = () => {
        
        deleteProjectIcon.classList.remove('display-none');
        deleteProjectConfirm.classList.add('display-none');
    }

    const hideDeleteIcons = () => {
        deleteProjectIcon.classList.add('display-none');
        deleteProjectConfirm.classList.add('display-none');
    }

    const createProjectTab = (tabName) => {
        const newTabItem = document.createElement('li');
        newTabItem.classList.add('tab-item');
        newTabItem.textContent = tabName;

        return newTabItem;
    }

  
    //stops anim from playing on page start
   document.addEventListener('DOMContentLoaded', () => {
     header.classList.toggle('preload');
     main.classList.toggle('preload');
     createTaskForm.classList.toggle('preload');
     detailsPopup.classList.toggle('preload');
   });
    
    addNewProject.addEventListener('click', toggleProjectForm);
    projectFormCancelBtn.addEventListener('click', (e) => {
        e.preventDefault();
        newProjectForm.reset();
        toggleProjectForm();
        
    })


    //Submits to create a project
    newProjectForm.addEventListener('submit', (e) => {

        //Create a new project
        e.preventDefault();
        //Duplicate Check
        let isDuplicateName = false;

        ProjectHandler.allProjects.forEach((project) => {
            if (project.name == newProjectForm.elements['project-title'].value) {
                isDuplicateName = true;
                return;
            }
        })
        if(newProjectForm.elements['project-title'].value == 'Home' || newProjectForm.elements['project-title'].value == 'Today' || 
        newProjectForm.elements['project-title'].value == 'Week') {
            alert('No duplicate names!');
            
        } else if (isDuplicateName) {
            alert('No duplicate names!');
        } else {
            //Make Project
            const newTabItem = createProjectTab(newProjectForm.elements['project-title'].value);
            const newProject = ProjectHandler.createProject(newProjectForm.elements['project-title'].value, newTabItem);
        
      
       
            ProjectHandler.addProjectToArray(newProject);

            newProjectForm.reset();
            toggleProjectForm();

            //When clicked, set and load the current projects tasks
            newTabItem.addEventListener('click', () => {
                const oldSelected = document.querySelector('.tab-selected');
                if (oldSelected != null) {
                    oldSelected.classList.remove('tab-selected');
                }
                ProjectHandler.setCurrentProject(newProject);
          
                newTabItem.classList.add('tab-selected');
                loadProjectTasks();
                resetDeleteIcons();
            })

            addNewProject.parentNode.insertBefore(newTabItem, addNewProject); 
         }
    })



    deleteProjectIcon.addEventListener('click', () => {
        deleteProjectIcon.classList.toggle('display-none');
        deleteProjectConfirm.classList.toggle('display-none');
        const projectIconClick = ProjectHandler.getCurrentProject();

        //If we switch projects before this run then there is no need to run it, so we return
        setTimeout(() => {
            if (projectIconClick !== ProjectHandler.getCurrentProject()) return;
            resetDeleteIcons();
        }, 7000);
    });

    deleteProjectConfirm.addEventListener('click', () => {
        deleteProject(ProjectHandler.getCurrentProject().attachedDOMTab);
    })

    detailsCloseBtn.addEventListener('click', toggleDetailsPopup)
    newTaskBtn.addEventListener('click', toggleTaskForm);
    closeFormBtn.addEventListener('click', toggleTaskForm);

    //Form Submission events
    createTaskForm.addEventListener('submit', (e) => {
        if (isEditMode) {
            
            editTask(e);
        }
        else submitTask(e);
    })

    setupStartProject();
    loadSavedProjects();
    handleCopyingTasks();

    return { toggleTaskForm  };
}

const UIObject = UIHandler();

export default UIObject;



