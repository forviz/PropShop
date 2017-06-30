import React, { Component } from 'react';
import { Tabs } from 'antd';
import { NavLink } from 'react-router-dom';

import NewsBanner from '../../components/NewsBanner';
import NewsItem from '../../components/NewsItem';
import HotNews from '../../components/HotNews';

const TabPane = Tabs.TabPane;

function callback(key) {
  console.log(key);
}

class News extends Component {

  render() {
    const newsItem = [
      {
        image: 'http://www.allapril.com/wp-content/uploads/2016/08/shutterstock_261648890-Child-and-Family-Services.jpg',
        title: '3 สิ่งที่เสาหลักของครอบครัวควรเตรียมพร้อม',
        date: '22 มิ.ย. 2560',
        description: 'หากคุณเป็นเสาหลัก หรือ หัวหน้าครอบครัว โดยเฉพาะในรายที่มีลูก น้อย การเตรียมความพร้อมเพื่ออนาคตของคนที่คุณรักโดยเฉพาะด้าน การเงินเป็นสิ่งที่ห้ามมองข้าม',
        redirectURL: '###',
      },
      {
        image: 'http://www.allapril.com/wp-content/uploads/2016/08/shutterstock_261648890-Child-and-Family-Services.jpg',
        title: '3 สิ่งที่เสาหลักของครอบครัวควรเตรียมพร้อม',
        date: '22 มิ.ย. 2560',
        description: 'หากคุณเป็นเสาหลัก หรือ หัวหน้าครอบครัว โดยเฉพาะในรายที่มีลูก น้อย การเตรียมความพร้อมเพื่ออนาคตของคนที่คุณรักโดยเฉพาะด้าน การเงินเป็นสิ่งที่ห้ามมองข้าม',
        redirectURL: '###',
      },
      {
        image: 'http://www.allapril.com/wp-content/uploads/2016/08/shutterstock_261648890-Child-and-Family-Services.jpg',
        title: '3 สิ่งที่เสาหลักของครอบครัวควรเตรียมพร้อม',
        date: '22 มิ.ย. 2560',
        description: 'หากคุณเป็นเสาหลัก หรือ หัวหน้าครอบครัว โดยเฉพาะในรายที่มีลูก น้อย การเตรียมความพร้อมเพื่ออนาคตของคนที่คุณรักโดยเฉพาะด้าน การเงินเป็นสิ่งที่ห้ามมองข้าม',
        redirectURL: '###',
      },
      {
        image: 'http://www.allapril.com/wp-content/uploads/2016/08/shutterstock_261648890-Child-and-Family-Services.jpg',
        title: '3 สิ่งที่เสาหลักของครอบครัวควรเตรียมพร้อม',
        date: '22 มิ.ย. 2560',
        description: 'หากคุณเป็นเสาหลัก หรือ หัวหน้าครอบครัว โดยเฉพาะในรายที่มีลูก น้อย การเตรียมความพร้อมเพื่ออนาคตของคนที่คุณรักโดยเฉพาะด้าน การเงินเป็นสิ่งที่ห้ามมองข้าม',
        redirectURL: '###',
      },
    ];
    const newsBanner = [
      {
        image: 'http://www.allapril.com/wp-content/uploads/2016/08/shutterstock_261648890-Child-and-Family-Services.jpg',
        title: 'ถอดบทเรียน...ไฟไหม้ตึกในลอนดอน สู่อนาคตตึกสูงในกรุงเทพฯ',
        description: 'จากเหตุเพลิงไหม้เกรนเฟลล์ ทาวเวอร์ กรุงลอนดอน ประเทศอังกฤษ สร้างความสะเทือนใจระดับโลก ชี้ให้เห็นว่าอาคารเก่าและตึกสูง ควรตรวจสอบระบบป้องกันอัคคีภัยเพื่อเตรียมความพร้อมอยู่เสมอ และแน่นอนว่าตึกสูงในไทยก็เช่นเดียวกัน',
      },
      {
        image: 'http://www.allapril.com/wp-content/uploads/2016/08/shutterstock_261648890-Child-and-Family-Services.jpg',
        title: 'ถอดบทเรียน...ไฟไหม้ตึกในลอนดอน สู่อนาคตตึกสูงในกรุงเทพฯ',
        description: 'จากเหตุเพลิงไหม้เกรนเฟลล์ ทาวเวอร์ กรุงลอนดอน ประเทศอังกฤษ สร้างความสะเทือนใจระดับโลก ชี้ให้เห็นว่าอาคารเก่าและตึกสูง ควรตรวจสอบระบบป้องกันอัคคีภัยเพื่อเตรียมความพร้อมอยู่เสมอ และแน่นอนว่าตึกสูงในไทยก็เช่นเดียวกัน',
      },
      {
        image: 'http://www.allapril.com/wp-content/uploads/2016/08/shutterstock_261648890-Child-and-Family-Services.jpg',
        title: 'ถอดบทเรียน...ไฟไหม้ตึกในลอนดอน สู่อนาคตตึกสูงในกรุงเทพฯ',
        description: 'จากเหตุเพลิงไหม้เกรนเฟลล์ ทาวเวอร์ กรุงลอนดอน ประเทศอังกฤษ สร้างความสะเทือนใจระดับโลก ชี้ให้เห็นว่าอาคารเก่าและตึกสูง ควรตรวจสอบระบบป้องกันอัคคีภัยเพื่อเตรียมความพร้อมอยู่เสมอ และแน่นอนว่าตึกสูงในไทยก็เช่นเดียวกัน',
      },
    ];

    const hotNews = [
      {
        text: '[ดวงรายสัปดาห์]กูรู12ราศี: ประจำวันที่ 19 - 25 มิถุนายน 2560',
        date: '16 มิ.ย. 2560',
        redirectURL: '###',
      },
      {
        text: '[ดวงรายสัปดาห์]กูรู12ราศี: ประจำวันที่ 19 - 25 มิถุนายน 2560',
        date: '16 มิ.ย. 2560',
        redirectURL: '###',
      },
      {
        text: '[ดวงรายสัปดาห์]กูรู12ราศี: ประจำวันที่ 19 - 25 มิถุนายน 2560',
        date: '16 มิ.ย. 2560',
        redirectURL: '###',
      },
      {
        text: '[ดวงรายสัปดาห์]กูรู12ราศี: ประจำวันที่ 19 - 25 มิถุนายน 2560',
        date: '16 มิ.ย. 2560',
        redirectURL: '###',
      },
      {
        text: '[ดวงรายสัปดาห์]กูรู12ราศี: ประจำวันที่ 19 - 25 มิถุนายน 2560',
        date: '16 มิ.ย. 2560',
        redirectURL: '###',
      },
    ];

    return (
      <div id="News">
        <div className="container">

          <div className="breadcrumb">
            <div className="breadcrumb-item"><NavLink exact to="/">หน้าแรก ></NavLink></div>
            <div className="breadcrumb-item">ข่าวสารและบทความ</div>
          </div>

          <div className="row">
            <div className="col-md-12">
              <NewsBanner datas={newsBanner} />
            </div>
          </div>
          <div className="row">
            <div className="col-md-8">
              <Tabs defaultActiveKey="1" onChange={callback}>
                <TabPane tab="PROP NOW" key="1">
                  <div className="tap-title">PROP NOW</div>
                  <NewsItem datas={newsItem} />
                </TabPane>
                <TabPane tab="PROP TALK" key="2">
                  <div className="tap-title">PROP TALK</div>
                  <NewsItem datas={newsItem} />
                </TabPane>
                <TabPane tab="PROP VERDICT" key="3">
                  <div className="tap-title">PROP VERDICT</div>
                  <NewsItem datas={newsItem} />
                </TabPane>
              </Tabs>
            </div>
            <div className="col-md-4">
              <HotNews datas={hotNews} />
            </div>
          </div>

        </div>
      </div>
    );
  }
}

export default News;
