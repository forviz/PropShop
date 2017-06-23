export const receiveAgentEntity = (agentId, agent) => {
  return {
    type: 'ENTITY/AGENT/RECEIVED',
    agentId,
    agent,
  };
};

export const receiveReferenceEntity = (referenceId, reference) => {
  return {
    type: 'ENTITY/REFERENCE/RECEIVED',
    referenceId,
    reference,
  };
};
