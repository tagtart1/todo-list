//creates, updates, reads, deletes tasks
import {format} from 'date-fns'

export const createTask = (title, details, priority, dueDate) => {
    const getTitle = () => title;
    const getDetails = () => details;
    const getPriority = () => priority;
    const getDueDate = () => format(new Date(dueDate), 'LLLL eo');

    


    return {
        getTitle,
        getDetails,
        getPriority,
        getDueDate
    }
}

