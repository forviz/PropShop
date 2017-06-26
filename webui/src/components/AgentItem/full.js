import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { Rate } from 'antd';
import ButtonPrimary from '../Button/Primary';

const AgentItemRow = styled.div`
  clear: both;
  width: 100%;
  padding: 20px;
  -webkit-transition: all .4s east-out;
  transition: all .4s east-out;
  &:hover {
    background: #eeeeee;
  }
`;
const ProfileWrapper = styled.div`
  clear: both;
`;

const ProfileDetail = styled.div`
  line-height: 26px;
`;

const ProfileHeading = styled.div`
  color: #88b840;
  font-size: 18px;
`;

const BodyText = styled.p`
  color: #484749;
  font-size: 12px;
`;

const StrongText = styled.span`
  color: #999999;
  font-weight: bold;
`;

const AvatarImage = styled.img`
  width: 120px;
  min-height: 120px;
  background: #efefef;
  float:left;
  margin-right: 15px;
`;

export default ({ item }) => {
  return (
    <AgentItemRow>
      <Link to={`/agent/${item.id}`}>
        <div className="row">
          <div className="col-md-4">
            <ProfileWrapper>
              <AvatarImage src={item.image} alt={item.name} />
              <ProfileDetail>
                <ProfileHeading>{item.name}</ProfileHeading>
                <BodyText>จากกลุ่มบริษัทพฤกษา</BodyText>
                <StrongText>089-325-0482</StrongText>
              </ProfileDetail>
            </ProfileWrapper>
          </div>
          <div className="col-md-3">
            <div className="rating">
              <Rate disabled defaultValue={item.rate.rating} />
              <span>({item.rate.count})</span>
            </div>
            <BodyText>เขตกรุงเทพฯ และปริมณฑล</BodyText>
            <BodyText>124 บ้านที่ขายแล้ว</BodyText>
            <BodyText>10 รายชื่อที่ใช้งานอยู่</BodyText>
          </div>
          <div className="col-md-3">
            <ButtonPrimary>ติดต่อนายหน้า</ButtonPrimary>
          </div>
        </div>
      </Link>
    </AgentItemRow>
  );
}
