import React from 'react';

import imgExpert from '../../images/pages/agent/expert.png';
import imgReview from '../../images/pages/agent/review.png';
import imgWebboard from '../../images/pages/agent/webboard.png';

export default () => (
  <div className="about">
    <div className="container">
      <div className="row">
        <div className="col-md-8 col-md-offset-2">
          <h3 className="topic">ดูข้อมูลที่จำเป็นที่คุณต้องการในศูนย์ตัวแทน</h3>
          <div className="items">
            <div className="row">
              <div className="col-md-4 vbottom">
                <div className="image"><img src={imgReview} alt="รีวิว" /></div>
                <div className="title">รีวิว</div>
                <div className="detail">ดูบทวิจารณ์ที่เป็นกลางจากก่อนหน้านี้ลูกค้าและคนที่คุณไว้วางใจ</div>
              </div>
              <div className="col-md-4 vbottom">
                <div className="image"><img src={imgExpert} alt="ประสบการณ์ที่เกี่ยวข้อง" /></div>
                <div className="title">ประสบการณ์ที่เกี่ยวข้อง</div>
                <div className="detail">ดูความชำนาญและทักษะของเอเจนซีและบ้านที่พวกเขาขายใกล้บ้านคุณ</div>
              </div>
              <div className="col-md-4 vbottom">
                <div className="image"><img src={imgWebboard} alt="ความเชี่ยวชาญในตลาดท้องถิ่น" /></div>
                <div className="title">ความเชี่ยวชาญในตลาดท้องถิ่น</div>
                <div className="detail">ดูคำถามคำตอบและบล็อกของตัวแทนในพื้นที่ชุมชน <span className="text-green">เว็บบอร์ด</span> ของเรา</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);
