//creates, updates, reads, deletes tasks
import {format, parseISO } from 'date-fns'

export const createTask = (title, details, priority, dueDate, parentProject) => {
    let isChecked = false;
    

    const getParentProject = () => parentProject;
    const getTitle = () => title;
    const getDetails = () => details;
    const getPriority = () => priority;
    const getRawDueDate = () => dueDate;
    const getDueDate = () => format(parseISO(dueDate), 'MMMM do');
    const getExtendedDueDate = () => format(parseISO(dueDate), 'MMMM do, yyyy');
    
    const toggleChecked = () => isChecked = !isChecked;
    const getChecked = () => isChecked;

    const updateTask = (newTitle, newDetails, newPriority, newDueDate) => {
        title = newTitle;
        details = newDetails;
        priority = newPriority;
        dueDate = newDueDate;
    }


    return {
        getTitle,
        getDetails,
        getPriority,
        getDueDate,
        getExtendedDueDate,
        toggleChecked,
        getChecked,
        getParentProject,
        getRawDueDate,
        updateTask
    }
}

