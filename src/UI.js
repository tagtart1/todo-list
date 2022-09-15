//takes input and displays onto DOM
import * as TaskHandler from './taskHandler.js'


const UIHandler = () => {
  
    const formContainer = document.querySelector('.new-task-form-container');
    const createTaskForm = document.querySelector('.popup');
    const main= document.querySelector('.main');
    const header = document.querySelector('.header');

    const newTaskBtn = document.querySelector('.create-todo');
    const closeFormBtn = document.querySelector('.backout-btn');


    

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
        createTaskForm.elements['dueDate'].value);

        toggleTaskForm(e);
        createTaskForm.reset();
        console.log(newTask.getPriority());
        addTaskToDOM(newTask);
       
    }


    const addTaskToDOM = (task) => {
        const createTodoBtn = document.querySelector('.create-todo');



        const divTodo = document.createElement('div');
        divTodo.classList.add('todo');

        const leftSideDiv = document.createElement('div');
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

        const todoTitle = document.createElement('p');
        todoTitle.textContent = task.getTitle();
        leftSideDiv.appendChild(todoTitle);

        const todoActions = document.createElement('div');
        todoActions.classList.add('todo-actions');
        divTodo.appendChild(todoActions);

        const taskDueDate = document.createElement('p');
        taskDueDate.textContent = task.getDueDate();
        todoActions.appendChild(taskDueDate);

        const editIcon = new Image();
        editIcon.src = 'edit.svg';
        editIcon.alt = "edit button";
        todoActions.appendChild(editIcon);

        const deleteIcon = new Image();
        deleteIcon.src = 'delete.svg';
        deleteIcon.alt = 'delete button';
        todoActions.appendChild(deleteIcon);

        createTodoBtn.parentNode.insertBefore(divTodo, createTodoBtn);
    }
    

    //stops anim from playing on page start
   document.addEventListener('DOMContentLoaded', () => {
     header.classList.toggle('preload');
     main.classList.toggle('preload');
     createTaskForm.classList.toggle('preload');
   });
    
    
    newTaskBtn.addEventListener('click', toggleTaskForm);
    closeFormBtn.addEventListener('click', toggleTaskForm);
    createTaskForm.addEventListener('submit', submitTask)


    return { toggleTaskForm };
}

const UIObject = UIHandler();

export default UIObject;



