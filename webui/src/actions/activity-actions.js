export const receiveActivityEntity = (activityId, activity) => {
  return {
    type: 'ENTITY/ACTIVITY/RECEIVED',
    activityId,
    activity,
  };
};
