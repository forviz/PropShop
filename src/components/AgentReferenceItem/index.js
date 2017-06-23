import React from 'react';
import T from 'prop-types';
import moment from 'moment';
import styled from 'styled-components';
import RatingComponent from '../RatingComponent';

const ReferenceItem = styled.div`
  padding: 20px 0;
`;

const UserName = styled.span`
  font-weight: bold;
  color: #333;
`;

const MetaText = styled.span`
  color: #787878;
`;

const ReferenceDetail = styled.p`
  line-height: 1.6;
`;

const AgentReferenceItem = ({ id, byUser, forAgent, activity, detail, createdAt, ratingOverall }) => {
  return (
    <ReferenceItem key={id}>
      <div><RatingComponent value={ratingOverall} /></div>
      <UserName>{byUser}</UserName> | <MetaText>{moment(createdAt).format('DD/MM/YYYY')}</MetaText> | <MetaText>{activity}</MetaText>
      <ReferenceDetail>{detail}</ReferenceDetail>
    </ReferenceItem>
  );
};

AgentReferenceItem.propTypes = {
  id: T.string.isRequired,
  byUser: T.string.isRequired,
  forAgent: T.string.isRequired,
  activity: T.string.isRequired,
  detail: T.string.isRequired,
  createdAt: T.string.isRequired,
  ratingOverall: T.number.isRequired,
};

export default AgentReferenceItem;
