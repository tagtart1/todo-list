//creates, updates, reads, deletes tasks
import {format, parseISO } from 'date-fns'

export let allTasks = [];

export const addToAllTasks = (task) => {
    allTasks.push(task);
}

export const createTask = (title, details, priority, dueDate, parentProjectName) => {
    let isChecked = false;
    
    
 
    const getFormattedDueDate = () => format(parseISO(obj.dueDate), 'MMMM do');
    const getExtendedDueDate = () => format(parseISO(obj.dueDate), 'MMMM do, yyyy');
    
    const toggleChecked = () => {
        obj.isChecked = !obj.isChecked;
    }
    const updateTask = (newTitle, newDetails, newPriority, newDueDate) => {
        obj.title = newTitle;
        obj.details = newDetails;
        obj.priority = newPriority;
        obj.dueDate = newDueDate;
    }

    const obj = {
        title,
        details,
        priority,
        dueDate,
        parentProjectName,
        getFormattedDueDate,
        getExtendedDueDate,
        toggleChecked,
        updateTask,
        isChecked,
    
    }

    return obj;
}

