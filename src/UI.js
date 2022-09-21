//takes input and displays onto DOM
import * as TaskHandler from './taskHandler.js'
import * as ProjectHandler from './projectHandler.js'


const UIHandler = () => {
  
    const formContainer = document.querySelector('.new-task-form-container');
    const createTaskForm = document.querySelector('.popup');
    const main= document.querySelector('.main');
    const header = document.querySelector('.header');

    const newTaskBtn = document.querySelector('.create-todo');
    const closeFormBtn = document.querySelector('.backout-btn');
    const addNewProject = document.querySelector('.new-project-button');
    const newProjectForm = document.querySelector('.new-project-form');
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


    const setupStartProject = () => {
        
        const mainTab = document.querySelectorAll('.main-tab');
        mainTab.forEach((tab) => {
            
            const project = ProjectHandler.createProject(tab.textContent);
            if (tab.textContent == 'Home')  {
                ProjectHandler.setCurrentProject(project);
                ProjectHandler.setHomeProect(project);
            }
            tab.addEventListener('click', () => {
                ProjectHandler.setCurrentProject(project);
                loadProjectTasks();
            })
        })
        
    }

    const toggleTaskForm = (e) => {
        e.preventDefault();
        blurPage();
       
       
        formContainer.classList.toggle('invis');
        createTaskForm.classList.toggle('visible');
        createTaskForm.reset();
    }

    const blurPage = () => {
        main.classList.toggle('blur-overlay');
        header.classList.toggle('blur-overlay');
    }




    const submitTask = (e) => {
        //calls to taskhandler to create a task object
        const newTask = TaskHandler.createTask(createTaskForm.elements['title'].value, createTaskForm.elements['details'].value, createTaskForm.elements['priority'].value, 
        createTaskForm.elements['dueDate'].value, ProjectHandler.getCurrentProject());

        // Modify this to make it make sense later \/
        if(ProjectHandler.getCurrentProject() === ProjectHandler.homeProject) {
            ProjectHandler.homeProject.projectTasks.push(newTask);
        }
        else {
            ProjectHandler.getCurrentProject().projectTasks.push(newTask);
            ProjectHandler.homeProject.projectTasks.push(newTask);
        }
        
        
        // /\
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

        switch(task.getPriority()) {
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
        todoTitle.textContent = task.getTitle();
        leftSideDiv.appendChild(todoTitle);

        const todoCheckboxInner = document.createElement('div');
        if (task.getChecked()) {
            todoCheckboxInner.classList.toggle('todo-done-checked');
            todoTitle.classList.toggle('todo-title-checked');
        }
        todoCheckbox.addEventListener('click', () => {
            todoCheckboxInner.classList.toggle('todo-done-checked');
            todoTitle.classList.toggle('todo-title-checked');
            task.toggleChecked();
        })
        todoCheckbox.appendChild(todoCheckboxInner);

        const todoActions = document.createElement('div');
        todoActions.classList.add('todo-actions');
        divTodo.appendChild(todoActions);

        const taskDueDate = document.createElement('p');
        taskDueDate.textContent = task.getDueDate();
        todoActions.appendChild(taskDueDate);

        const detailsBtn = document.createElement('button');
        detailsBtn.classList.add('details-btn');
        detailsBtn.textContent ='DETAILS'
        todoActions.appendChild(detailsBtn);
        //Toggles the details popup
        detailsBtn.addEventListener('click', () => {
            toggleDetailsPopup();
            detailsTitle.textContent = task.getTitle();
            detailsProject.textContent = task.getParentProject().getName();
            detailsPriority.textContent = task.getPriority();
            detailsDate.textContent = task.getExtendedDueDate();
            detailsText.textContent = task.getDetails();
        } );

        const editIcon = new Image();
        editIcon.src = 'edit.svg';
        editIcon.alt = "edit button";
        todoActions.appendChild(editIcon);

        const deleteIcon = new Image();
        deleteIcon.src = 'delete.svg';
        deleteIcon.alt = 'delete button';
        todoActions.appendChild(deleteIcon);

        //Deletes task completely move to projectandler
        deleteIcon.addEventListener('click', () => {
            divTodo.remove();   
            task.getParentProject().removeTask(task.getParentProject().projectTasks.indexOf(task));
            ProjectHandler.homeProject.removeTask(ProjectHandler.homeProject.projectTasks.indexOf(task));
        })

        createTodoBtn.parentNode.insertBefore(divTodo, createTodoBtn);
    }

    const toggleDetailsPopup = () => {
        blurPage();
        detailsContainer.classList.toggle('invis');
        detailsPopup.classList.toggle('visible');
    }

    const loadProjectTasks = () => {
        const project = ProjectHandler.getCurrentProject();
        projectHeader.textContent = project.getName();
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
        projectDOM.remove();
      
        ProjectHandler.flushHomeProject();
    
        //Goto home
        ProjectHandler.setCurrentProject(ProjectHandler.homeProject);
        loadProjectTasks();

    }

    const loadDeleteProjectIcon = (projectDOM) => {
        const newSpan = document.createElement('span');
        const deleteIcon = new Image();
        deleteIcon.src = 'delete.svg';
        deleteIcon.classList.add('delete-project-button');
        newSpan.appendChild(deleteIcon);
        projectHeader.appendChild(newSpan);

        const confirmBtn = document.createElement('button');
        confirmBtn.classList.add('delete-confirm');
        confirmBtn.classList.add('display-none');
        confirmBtn.textContent ='CONFIRM';

        projectHeader.appendChild(confirmBtn);

        deleteIcon.addEventListener('click', () => {
            deleteIcon.classList.toggle('display-none');
            confirmBtn.classList.toggle('display-none');
            setTimeout(() => {
                
                deleteIcon.classList.remove('display-none');
                confirmBtn.classList.add('display-none');
            }, 7000);
        })

        confirmBtn.addEventListener('click', () => {
            deleteProject(projectDOM);
        })
            
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



    newProjectForm.addEventListener('submit', (e) => {

        //Create a new project
        e.preventDefault();
        const newProject = ProjectHandler.createProject(newProjectForm.elements['project-title'].value);
        const newTabItem = document.createElement('li');
        newTabItem.classList.add('tab-item');
        
        newTabItem.textContent = newProject.getName();
        newProjectForm.reset();
        toggleProjectForm();

        //When clicked, set and load the current projects tasks
        newTabItem.addEventListener('click', () => {
            ProjectHandler.setCurrentProject(newProject);
            loadProjectTasks();
            loadDeleteProjectIcon(newTabItem);
        })

        addNewProject.parentNode.insertBefore(newTabItem, addNewProject); 
    })



    
    detailsCloseBtn.addEventListener('click', toggleDetailsPopup)
    newTaskBtn.addEventListener('click', toggleTaskForm);
    closeFormBtn.addEventListener('click', toggleTaskForm);
    createTaskForm.addEventListener('submit', submitTask)

    setupStartProject();
    return { toggleTaskForm };
}

const UIObject = UIHandler();

export default UIObject;



