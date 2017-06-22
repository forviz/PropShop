import React from 'react';
import { Link } from 'react-router-dom';
import { Rate } from 'antd';

export default ({ item }) => {
  return (
    <div className="AgentItem">
      <Link to={`/agent/${item.id}`}>
        <div className="row">
          <div className="col-md-5 vcenter">
            <div className="image">
              <img src={item.image} alt={item.name} style={{ maxWidth: '100%' }} />
            </div>
          </div>
          <div className="col-md-7 vcenter">
            <div className="detail" style={{ lineHeight: '26px' }}>
              <div className="name text-green">{item.name}</div>
              <div className="rating">
                <Rate disabled defaultValue={item.rate.rating} />
                <span>({item.rate.count})</span>
              </div>
              <div className="sold_out" style={{ fontSize: '12px' }}>124 บ้านที่ขายแล้ว</div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
