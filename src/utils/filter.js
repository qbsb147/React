import { getWeekRange } from "./date";

export const userFilter = ({data, users}) => {
    const {now, preWeek} = getWeekRange();
    return data.filter((entry) => (
        (users.newUser      && entry.create_at >= preWeek && entry.create_at<=now) ||
        (users.existingUser && entry.create_at <  preWeek)
    ))
};
export const eventFilter = ({data, events}) => {
    return data.filter((entry) => (
        entry.type  === (events.view&&'view')           || 
        entry.type  === (events.click&&'click')         ||
        entry.type  === (events.purchase&&'purchase')
    ))
}
export const eventTypeFilter = ({data, type}) => 
    data.filter((entry) => entry.type  === (type))

export const userTypeFilter = ({data, type}) => {
    const {now, preWeek} = getWeekRange();
    return data.filter((entry) => (
        (type === 'newUser'      && entry.create_at >= preWeek && entry.create_at<=now) ||
        (type === 'existingUser' && entry.create_at < preWeek)
    ))
};

export const userDateFilter = ({data, startDate, endDate}) => {
    return data.filter((entry)=>(
        entry.access_time >=startDate && entry.access_time<=endDate
    ));
}