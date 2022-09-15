//creates, updates, reads, deletes tasks


export const Task = (title, details, priority, dueDate) => {
    const getTitle = () => title;
    const getDetails = () => details;
    const getPriority = () => priority;
    const getDueDate = () => dueDate;

    


    return {
        getTitle,
        getDetails,
        getPriority,
        getDueDate
    }
}

