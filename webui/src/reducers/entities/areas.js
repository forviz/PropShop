import _ from 'lodash';

const initialState = {
  entities: {
    bangkok: { slug: 'bangkok', title: 'Bangkok', location: '13.7248946,100.4930242,11z', category: 'Province' },
    kaset: { title: 'ม.เกษตร', location: '13.8465276,100.5625376,16z', category: 'Neighborhood' },
    senanikhom1: { title: 'ซอยเสนานิคม 1', location: '13.8325384,100.5767017,16z', category: 'Neighborhood' },
    ratchayothin: { title: 'รัชโยธิน', location: '13.8264438,100.5640438,16z', category: 'Neighborhood' },
    mochit: { title: 'หมอชิต', location: '13.8014124,100.5498388,16z', category: 'Neighborhood' },
    sapankwai: { title: 'สะพานควาย', location: '13.7935809,100.5474953,16z', category: 'Neighborhood' },
    ari: { title: 'อารีย์', location: '13.7796185,100.5422168,16z', category: 'Neighborhood' },
    sanampao: { title: 'สนามเป้า', location: '13.7726578,100.5398886,16z', category: 'Neighborhood' },
    'victory-monument': { title: 'อนุสาวรีย์ชัยสมรภูมิ', location: '13.7650299,100.5336123,16z', category: 'Neighborhood' },
    phayathai: { title: 'พญาไท', location: '13.756464,100.5294924,16z', category: 'Neighborhood' },
    ratchathewi: { title: 'ราชเทวี', location: '13.751936,100.5273681,16z', category: 'Neighborhood' },
    siamsquare: { title: 'Siam Square', location: '13.7454609,100.5324483,16z', category: 'Neighborhood' },
    ratchaprasong: { title: 'ราชประสงค์', location: '13.7451888,100.5376444,16z', category: 'Neighborhood' },
    chidlom: { title: 'Chidlom', location: '13.7442377,100.542221,16z', category: 'Neighborhood' },
    ploenchit: { title: 'Ploenchit', location: '13.7426217,100.5462458,16z', category: 'Neighborhood' },
    nana: { title: 'Nana', location: '13.7408443,100.5521043,16z', category: 'Neighborhood' },
    asoke: { title: 'Asoke', location: '13.7357541,100.5566995,16z', category: 'Neighborhood' },
    phrompong: { title: 'พร้อมพงษ์', location: '13.7304631,100.5647048,16z', category: 'Neighborhood' },
    thonglor: { title: 'ทองหล่อ', location: '13.7243972,100.5746183,16z', category: 'Neighborhood' },
    ekkamai: { title: 'เอกมัย', location: '13.7252116,100.5844235,16z', category: 'Neighborhood' },
    phrakanong: { title: 'พระโขนง', location: '13.7153778,100.5890691,16z', category: 'Neighborhood' },
    onnut: { title: 'อ่อนนุช', location: '13.7071486,100.5956689,16z', category: 'Neighborhood' },
    bangchak: { title: 'บางจาก', location: '13.6978405,100.6016278,16z', category: 'Neighborhood' },
    punnawithi: { title: 'ปุณณวิถี', location: '13.688986,100.6078008,16z', category: 'Neighborhood' },
    udomsuk: { title: 'อุดมสุข', location: '13.6801312,100.6076645,16z', category: 'Neighborhood' },
    bangna: { title: 'บางนา', location: '13.6689142,100.5974721,16z', category: 'Neighborhood' },
    bearing: { title: 'แบริ่ง', location: '13.6607722,100.5992746,16z', category: 'Neighborhood' },
    ratchadamri: { title: 'ราชดำริ', location: '13.739411,100.5356314,16z', category: 'Neighborhood' },
    silom: { title: 'สีลม', location: '13.7266423,100.5289839,16z', category: 'Neighborhood' },
    chongnonsri: { title: 'ช่องนนทรี', location: '13.7229698,100.5278257,16z', category: 'Neighborhood' },
    surasak: { title: 'สุรศักดิ์', location: '13.7188902,100.5180897,16z', category: 'Neighborhood' },
    'sapan-taksin': { title: 'สะพานตากสิน', location: '13.7184877,100.5103311,16z', category: 'Neighborhood' },
    'krung-thon-buri': { title: 'กรุงธนบุรี', location: '13.7209335,100.5026136,16z', category: 'Neighborhood' },
    'wongwian-yai': { title: 'วงเวียนใหญ่', location: '13.7211257,100.4914626,16z', category: 'Neighborhood' },
    'pho-nimit': { title: 'โพธิ์นิมิตร', location: '13.718656,100.4831202,16z', category: 'Neighborhood' },
    'talat-phlu': { title: 'ตลาดพลู', location: '13.7137164,100.4736102,16z', category: 'Neighborhood' },
    wutthakat: { title: 'วุฒากาศ', location: '13.7127102,100.4656067,16z', category: 'Neighborhood' },
    'bang-wa': { title: 'บางหว้า', location: '13.7206527,100.4547245,16z', category: 'Neighborhood' },
  },
  fetchStatus: {},
  errors: {},
};

const areas = (state = initialState, action) => {
  switch (action.type) {
    default: return state;
  }
};

export default areas;
