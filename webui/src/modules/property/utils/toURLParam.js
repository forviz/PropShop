import _ from 'lodash';

export default data => `?${_.join(_.map(data, (value, key) => `${key}=${value}`), '&')}`;
