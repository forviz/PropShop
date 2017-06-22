export const receiveAgentEntity = (agentId, agent) => {
  return {
    type: 'ENTITY/AGENT/RECEIVED',
    agentId,
    agent,
  };
};
