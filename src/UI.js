//takes input and displays onto DOM


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
        toggleTaskForm(e);
        createTaskForm.reset();
        
        //toggle task form
        //calls to taskHandler to create task, returns task
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


