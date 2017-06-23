export const receivePropertyEntity = (propertyId, property) => {
  return {
    type: 'ENTITY/PROPERTY/RECEIVED',
    propertyId,
    property,
  };
};
