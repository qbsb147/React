export const getWeekRange = () => {
    const now = Date.now();
    const preDate = new Date();
    const preWeek = preDate.setDate(preDate.getDate()-7);
    return {now, preWeek};
}
