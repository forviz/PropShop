import React from 'react';
import T from 'prop-types';
import moment from 'moment';
import styled from 'styled-components';

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

const ActivityItem = ({ id, by, description, action, createdAt }) => {
  return (
    <ReferenceItem key={id}>
      <UserName>{by}</UserName> | <MetaText>{moment(createdAt).format('DD/MM/YYYY')}</MetaText> | <MetaText>{action}</MetaText>
      <ReferenceDetail>{description}</ReferenceDetail>
    </ReferenceItem>
  );
};

ActivityItem.propTypes = {
  id: T.string.isRequired,
  by: T.string.isRequired,
  description: T.string.isRequired,
  action: T.string.isRequired,
  createdAt: T.string.isRequired,
};

export default ActivityItem;
