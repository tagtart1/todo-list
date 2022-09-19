//creates, updates, reads, deletes tasks
import {format, parseISO } from 'date-fns'

export const createTask = (title, details, priority, dueDate) => {
    let isChecked = false;

    const getTitle = () => title;
    const getDetails = () => details;
    const getPriority = () => priority;
    const getDueDate = () => format(parseISO(dueDate), 'MMMM do');
    const getExtendedDueDate = () => format(parseISO(dueDate), 'MMMM do, yyyy');
    
    const toggleChecked = () => isChecked = !isChecked;
    const getChecked = () => isChecked;



    return {
        getTitle,
        getDetails,
        getPriority,
        getDueDate,
        getExtendedDueDate,
        toggleChecked,
        getChecked,
    }
}

