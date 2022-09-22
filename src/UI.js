//takes input and displays onto DOM
import * as TaskHandler from './taskHandler.js'
import * as ProjectHandler from './projectHandler.js'


const UIHandler = () => {
    

    let isEditMode = false;
    let taskToEdit;
    let oldProjectDeleteIcon = null;
    let oldProjectDeleteConfirm = null;
    const formContainer = document.querySelector('.new-task-form-container');
    const createTaskForm = document.querySelector('.popup');
    const main= document.querySelector('.main');
    const header = document.querySelector('.header');
    const mainTab = document.querySelectorAll('.main-tab');
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
        
        
        mainTab.forEach((tab) => {
            
            const project = ProjectHandler.createProject(tab.textContent, tab);
            if (tab.textContent == 'Home')  {
                homeTab = tab;
                ProjectHandler.setCurrentProject(project);
                ProjectHandler.setHomeProject(project);
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

        toggleTaskForm(e);
       
        createTaskForm.reset();
        loadProjectTasks(); // probably better to reload the single task
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
        //Ability to mark a task as done
        const todoCheckboxInner = document.createElement('div');
        if (task.getChecked()) {
            todoCheckboxInner.classList.toggle('todo-done-checked');
            taskDueDate.classList.toggle('todo-date-checked');
            todoTitle.classList.toggle('todo-title-checked');
            detailsBtn.classList.toggle('todo-details-checked');
            editIcon.classList.toggle('todo-icons-checked');
            deleteIcon.classList.toggle('todo-icons-checked');
        }
        todoCheckbox.addEventListener('click', () => {
            todoCheckboxInner.classList.toggle('todo-done-checked');
            taskDueDate.classList.toggle('todo-date-checked');
            todoTitle.classList.toggle('todo-title-checked');
            detailsBtn.classList.toggle('todo-details-checked');
            editIcon.classList.toggle('todo-icons-checked');
            deleteIcon.classList.toggle('todo-icons-checked');
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
            task.getParentProject().removeTask(task.getParentProject().projectTasks.indexOf(task));
            ProjectHandler.homeProject.removeTask(ProjectHandler.homeProject.projectTasks.indexOf(task));
        })

        createTodoBtn.parentNode.insertBefore(divTodo, createTodoBtn);
    }

    const openEditTaskForm = (e, task) => {
        toggleTaskForm(e);
        //set to true so form only edits the task
        isEditMode = true;
        formTitle.textContent = 'Edit Task...';
        submitTaskBtn.textContent = 'EDIT';
        //Puts task details into edit
        createTaskForm.elements['title'].value = task.getTitle();
        createTaskForm.elements['details'].value = task.getDetails();
        createTaskForm.elements['dueDate'].value = task.getRawDueDate();
        createTaskForm.elements['priority'].value = task.getPriority();
    }

    const toggleDetailsPopup = () => {
        blurPage();
        detailsContainer.classList.toggle('invis');
        detailsPopup.classList.toggle('visible');
    }

    const loadProjectTasks = () => {
        
        const project = ProjectHandler.getCurrentProject();
        projectHeaderTxt.textContent = project.getName();

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
      
        ProjectHandler.flushHomeProject();
    
        //Goto home


        ProjectHandler.setCurrentProject(ProjectHandler.homeProject);
        loadProjectTasks();
        homeTab.classList.add('tab-selected')
    }

    const resetDeleteIcons = () => {
        
        deleteProjectIcon.classList.remove('display-none');
        deleteProjectConfirm.classList.add('display-none');
    }

    const hideDeleteIcons = () => {
        deleteProjectIcon.classList.add('display-none');
        deleteProjectConfirm.classList.add('display-none');
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
        
        const newTabItem = document.createElement('li');
        const newProject = ProjectHandler.createProject(newProjectForm.elements['project-title'].value, newTabItem);
        newTabItem.classList.add('tab-item');
        
        newTabItem.textContent = newProject.getName();
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
        deleteProject(ProjectHandler.getCurrentProject().getAttachedDOMTab());
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
    return { toggleTaskForm };
}

const UIObject = UIHandler();

export default UIObject;



