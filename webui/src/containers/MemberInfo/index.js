import React, { Component } from 'react';
import _ from 'lodash';

import imgAnnounce from '../../images/pages/profile/announce.png';
import imgHeart from '../../images/pages/profile/heart.png';
import imgCommunication from '../../images/pages/profile/communication.png';
import imgSecurity from '../../images/pages/profile/security.png';

const infoLists = [
  {
    img: imgAnnounce,
    title: 'ลงประกาศขาย - เช่า ฟรี',
    description: 'ให้คุณประกาศอสังหาฯของคุณแบบอันลิมิต ไม่มีขีดจำกัดด้วยระบบที่สั้นและเข้าใจง่าย ใช้เวลาลงประกาศแต่ละรายการในระยะเวลาอันสั้น',
  },
  {
    img: imgHeart,
    title: 'รายการโปรด',
    description: 'จัดเก็บรายการอสังหาฯ ที่คุณสนใจหรือชื่นชอบไว้ในรายการส่วนตัวของคุณ เพื่อความ สะดวกในการเรียกดูครั้งต่อไป',
  },
  {
    img: imgCommunication,
    title: 'ติดต่อผู้ขายโดยตรง',
    description: 'พอกันที่สำหรับการเปิด - ปิดโประแกรมอีเมล์เพื่อติดต่อผู้ขาย ผู้ซื้อติดต่อผู้ขายโดยตรง ได้ทันทีผ่านแบบฟอร์ม หรือแบบแสดงความคิดเห็น บนเว็บ พร้อมระบบแจ้งเตือนผู้ขาย',
  },
  {
    img: imgSecurity,
    title: 'ปลอดภัยสำหรับผู้ขาย',
    description: 'เว็บไวต์มาพร้อมระบบช่วยปกป้องอีเมล์ผู้ขายจากสแปม ไม่ต้องปวดหัวกับอีเมล์ขยะที่เกิด จากการลงประกาศอีกต่อไป',
  },
];

class MemberInfo extends Component {

  getInfo = () => {
    const infoItems = _.map(infoLists, (value, index) => 
      <li key={index}>
        <div className="block">
          <div className="row">
            <div className="col-md-3 vcenter">
              <div className="image">
                <img src={value.img} alt={value.title} />
              </div>
            </div>
            <div className="col-md-9 vcenter">
              <div className="title">
                {value.title}
              </div>
              <div className="description">
                {value.description}
              </div>
            </div>
          </div>
        </div>
      </li>
    );
    return (
      <ul>
        {infoItems}
      </ul>
    );
  }

  render() {
    return (
      <div className="MemberInfo">
        <div className="layout">
          <h2 className="title">Log-in เข้าสู่ระบบ Propshop.com</h2>
          <div className="description">สมาชิกเว็บไซต์ Propshop จะได้รับสิทธิประโยชน์มากมาย ทั้งลงประกาศขาย - เช่าฟรี และรับข้อมูล ข่าวสารเกี่ยวกับอสังหาฯในเมืองไทย</div>
          <div className="info">
            {this.getInfo()}
          </div>
        </div>
      </div>
    );
  }
}

export default MemberInfo;