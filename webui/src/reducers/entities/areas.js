import _ from 'lodash';

const initialState = {
  entities: {
    bangkok: {
      slug: 'bangkok',
      title: { en: 'Bangkok', th: 'กรุงเทพ' },
      location: '13.7248946,100.4930242,11z',
      category: 'PROVINCE',
      bound: {
        sw: { lat: 13.522361, lng: 100.349517 },
        ne: { lat: 13.951911, lng: 100.941405 },
      },
    },
    wattana: {
      slug: 'watthana',
      title: { en: 'Watthana', th: 'วัฒนา' },
      category: 'DISTRICT',
      bound: {
        sw: { lat: 13.712135, lng: 100.549385 },
        ne: { lat: 13.739066, lng: 100.605347 },
      },
    },
    'yan-nawa': {
      slug: 'yan-nawa',
      title: { en: 'Yan Nawa', th: 'ยานนาวา' },
      category: 'SUBDISTRICT',
      bound: {
        sw: { lat: 13.710224, lng: 100.508002 },
        ne: { lat: 13.721543, lng: 100.532421 },
      },
    },
    'thung-mahamek': {
      slug: 'thung-mahamek',
      title: { en: 'Thung Mahamek', th: 'ทุ่งมหาเมฆ' },
      category: 'SUBDISTRICT',
      bound: {
        sw: { lat: 13.704280, lng: 100.531781 },
        ne: { lat: 13.724626, lng: 100.553410 },
      },
    },
    'khlong-toei-nuea': {
      slug: 'khlong-toei-nuea',
      title: { en: 'Khlong Toei Nuea', th: 'คลองเตยเหนือ' },
      category: 'SUBDISTRICT',
      bound: {
        sw: { lat: 13.736377, lng: 100.549722 },
        ne: { lat: 13.746465, lng: 100.579622 },
      },
    },
    'khlong-tan': {
      slug: 'khlong-tan',
      title: { en: 'Khlong Tan', th: 'คลองตัน' },
      category: 'SUBDISTRICT',
      bound: {
        sw: { lat: 13.715759, lng: 100.564239 },
        ne: { lat: 13.731226, lng: 100.578487 },
      },
    },
    'khlong-tan-nuea': {
      slug: 'khlong-tan-nuea',
      title: { en: 'Khlong Tan Nuea', th: 'คลองตันเหนือ' },
      category: 'SUBDISTRICT',
      bound: {
        sw: { lat: 13.726826, lng: 100.565291 },
        ne: { lat: 13.739583, lng: 100.605159 },
      },
    },
    'phra-khanong-nuea': {
      slug: 'phra-khanong-nuea',
      title: { en: 'Phra Khanong Nuea', th: 'พระโขนงเหนือ' },
      category: 'SUBDISTRICT',
      bound: {
        sw: { lat: 13.705084, lng: 100.583700 },
        ne: { lat: 13.725846, lng: 100.605844 },
      },
    },
    'suan-luang': {
      slug: 'suan-luang',
      title: { en: 'Suan Luang', th: 'สวนหลวง' },
      category: 'SUBDISTRICT',
      bound: {
        sw: { lat: 13.704695, lng: 100.602155 },
        ne: { lat: 13.746968, lng: 100.657601 },
      },
    },
    'bang-chak': {
      slug: 'bang-chak',
      title: { en: 'Bang Chak', th: 'บางจาก' },
      category: 'SUBDISTRICT',
      bound: {
        sw: { lat: 13.679353, lng: 100.588069 },
        ne: { lat: 13.704704, lng: 100.637593 },
      },
    },
    'bang-na': {
      slug: 'bang-na',
      title: { en: 'Bang Na', th: 'บางนา' },
      category: 'SUBDISTRICT',
      bound: {
        sw: { lat: 13.660798, lng: 100.578325 },
        ne: { lat: 13.680480, lng: 100.653771 },
      },
    },
    senanikhom1: {
      slug: 'senanikhom1',
      title: { en: 'senanikhom1', th: 'ซอยเสนานิคม 1' },
      location: '13.8325384,100.5767017,16z',
      category: 'NEIBORHOOD',
      bound: {
        sw: { lat: 13.522361, lng: 100.349517 },
        ne: { lat: 13.951911, lng: 100.941405 },
      },
    },
    ratchayothin: {
      slug: 'ratchayothin',
      title: { en: 'Ratchayothin', th: 'รัชโยธิน' },
      location: '13.8264438,100.5640438,16z',
      category: 'NEIBORHOOD',
      bound: {
        sw: { lat: 13.522361, lng: 100.349517 },
        ne: { lat: 13.951911, lng: 100.941405 },
      },
    },
    mochit: {
      slug: 'mochit',
      title: { en: 'Mochit', th: 'หมอชิต' },
      location: '13.8014124,100.5498388,16z',
      category: 'BTS',
      bound: {
        sw: { lat: 13.797, lng: 100.543 },
        ne: { lat: 13.8048, lng: 100.5628 },
      },
    },
    sapankwai: {
      mochit: 'sapankwai',
      title: { en: 'Sapan Kwai', th: 'สะพานควาย' },
      location: '13.7935809,100.5474953,16z',
      category: 'BTS',
      bound: {
        sw: { lat: 13.788644, lng: 100.539405 },
        ne: { lat: 13.794990, lng: 100.559550 },
      },
    },
    ari: {
      title: { en: 'Ari', th: 'อารีย์' },
      location: '13.7796185,100.5422168,16z',
      category: 'BTS',
      bound: {
        sw: { lat: 13.778567, lng: 100.534933 },
        ne: { lat: 13.783670, lng: 100.552786 },
      },
    },
    sanampao: {
      title: { en: 'Sanam Pao', th: 'สนามเป้า' },
      location: '13.7726578,100.5398886,16z',
      category: 'BTS',
      bound: {
        sw: { lat: 13.772021, lng: 100.530835 },
        ne: { lat: 13.776216, lng: 100.549182 },
      },
    },
    'victory-monument': {
      title: { en: 'Victory of Monument', th: 'อนุสาวรีย์ชัยสมรภูมิ' },
      location: '13.7650299,100.5336123,16z',
      category: 'BTS',
      bound: {
        sw: { lat: 13.760506, lng: 100.529487 },
        ne: { lat: 13.768722, lng: 100.545152 },
      },
    },
    phayathai: {
      title: { en: 'Phayathai', th: 'พญาไท' },
      location: '13.756464,100.5294924,16z',
      category: 'BTS',
      bound: {
        sw: { lat: 13.755483, lng: 100.526832 },
        ne: { lat: 13.759144, lng: 100.540586 },
      },
    },
    ratchathewi: {
      title: { en: 'Ratchathewi', th: 'ราชเทวี' },
      location: '13.751936,100.5273681,16z',
      category: 'BTS',
      bound: {
        sw: { lat: 13.749378, lng: 100.526 },
        ne: { lat: 13.752678, lng: 100.540 },
      },
    },
    siamsquare: {
      title: { en: 'Siam Square', th: 'สยามสแควร์' },
      location: '13.7454609,100.5324483,16z',
      category: 'BTS',
      bound: {
        sw: { lat: 13.741683, lng: 100.530285 },
        ne: { lat: 13.748817, lng: 100.540848 },
      },
    },
    chidlom: {
      title: { en: 'Chidlom', th: 'ชิดลม' },
      location: '13.7442377,100.542221,16z',
      category: 'BTS',
      bound: {
        sw: { lat: 13.741, lng: 100.539389 },
        ne: { lat: 13.747176, lng: 100.546953 },
      },
    },
    ploenchit: {
      title: { en: 'Ploenchit', th: 'เพลินจิต' },
      location: '13.7426217,100.5462458,16z',
      category: 'BTS',
      bound: {
        sw: { lat: 13.737442, lng: 100.544764 },
        ne: { lat: 13.746707, lng: 100.554066 },
      },
    },
    nana: {
      title: { en: 'Nana', th: 'นานา' },
      location: '13.7408443,100.5521043,16z',
      category: 'BTS',
      bound: {
        sw: { lat: 13.736359, lng: 100.551727 },
        ne: { lat: 13.743873, lng: 100.559441 },
      },
    },
    asoke: {
      title: { en: 'Asoke', th: 'อโศก' },
      location: '13.7357541,100.5566995,16z',
      category: 'BTS',
      bound: {
        sw: { lat: 13.733467, lng: 100.555897 },
        ne: { lat: 13.743519, lng: 100.569194 },
      },
    },
    phrompong: {
      title: { en: 'Phrompong', th: 'พร้อมพงษ์' },
      location: '13.7304631,100.5647048,16z',
      category: 'BTS',
      bound: {
        sw: { lat: 13.721888, lng: 100.562307 },
        ne: { lat: 13.742523, lng: 100.578633 },
      },
    },
    thonglor: {
      title: { en: 'Thonglor', th: 'ทองหล่อ' },
      location: '13.7243972,100.5746183,16z',
      category: 'BTS',
      bound: {
        sw: { lat: 13.721859, lng: 100.573305 },
        ne: { lat: 13.743126, lng: 100.589781 },
      },
    },
    ekkamai: {
      title: { en: 'Ekkamai', th: 'เอกมัย' },
      location: '13.7252116,100.5844235,16z',
      category: 'BTS',
      bound: {
        sw: { lat: 13.713, lng: 100.576 },
        ne: { lat: 13.729, lng: 100.591 },
      },
    },
    phrakanong: {
      title: { en: 'Phrakanong', th: 'พระโขนง' },
      location: '13.7153778,100.5890691,16z',
      category: 'BTS',
      bound: {
        sw: { lat: 13.711, lng: 100.583 },
        ne: { lat: 13.723, lng: 100.598 },
      },
    },
    onnut: {
      title: { en: 'Onnut', th: 'อ่อนนุช' },
      location: '13.7071486,100.5956689,16z',
      category: 'BTS',
      bound: {
        sw: { lat: 13.701, lng: 100.593 },
        ne: { lat: 13.716, lng: 100.614 },
      },
    },
    bangchak: {
      title: { en: 'Bangchak', th: 'บางจาก' },
      location: '13.6978405,100.6016278,16z',
      category: 'BTS',
      bound: {
        sw: { lat: 13.691, lng: 100.596 },
        ne: { lat: 13.7026, lng: 100.6136 },
      },
    },
    punnawithi: {
      title: { en: 'Punnawithi', th: 'ปุณณวิถี' },
      location: '13.688986,100.6078008,16z',
      category: 'BTS',
      bound: {
        sw: { lat: 13.684, lng: 100.602 },
        ne: { lat: 13.695, lng: 100.6207 },
      },
    },
    udomsuk: {
      title: { en: 'Udonsuk', th: 'อุดมสุข' },
      location: '13.6801312,100.6076645,16z',
      category: 'BTS',
      bound: {
        sw: { lat: 13.6765, lng: 100.6026 },
        ne: { lat: 13.685, lng: 100.6216 },
      },
    },
    bangna: {
      title: { en: 'Bangna', th: 'บางนา' },
      location: '13.6689142,100.5974721,16z',
      category: 'BTS',
      bound: {
        sw: { lat: 13.662, lng: 100.59765 },
        ne: { lat: 13.6755, lng: 100.617 },
      },
    },
    bearing: {
      title: { en: 'Bearing', th: 'แบริ่ง' },
      location: '13.6607722,100.5992746,16z',
      category: 'BTS',
      bound: {
        sw: { lat: 13.6566, lng: 100.5947 },
        ne: { lat: 13.662, lng: 100.612 },
      },
    },
    ratchadamri: {
      title: { en: 'Ratchadamri', th: 'ราชดำริ' },
      location: '13.739411,100.5356314,16z',
      category: 'BTS',
      bound: {
        sw: { lat: 13.733394, lng: 100.536328 },
        ne: { lat: 13.741589, lng: 100.542480 },
      },
    },
    silom: {
      title: { en: 'Silom', th: 'สีลม' },
      location: '13.7266423,100.5289839,16z',
      category: 'BTS',
      bound: {
        sw: { lat: 13.722963, lng: 100.532526 },
        ne: { lat: 13.730715, lng: 100.539510 },
      },
    },
    chongnonsri: {
      title: { en: 'Chongnonsri', th: 'ช่องนนทรี' },
      location: '13.7229698,100.5278257,16z',
      category: 'BTS',
      bound: {
        sw: { lat: 13.720760, lng: 100.525084 },
        ne: { lat: 13.726435, lng: 100.532966 },
      },
    },
    surasak: {
      title: { en: 'Surasak', th: 'สุรศักดิ์' },
      location: '13.7188902,100.5180897,16z',
      category: 'BTS',
      bound: {
        sw: { lat: 13.715037, lng: 100.517480 },
        ne: { lat: 13.725310, lng: 100.525558 },
      },
    },
    'sapan-taksin': {
      title: { en: 'Sapan Taksin', th: 'สะพานตากสิน' },
      location: '13.7184877,100.5103311,16z',
      category: 'BTS',
      bound: {
        sw: { lat: 13.714450, lng: 100.507689 },
        ne: { lat: 13.7242532, lng: 100.5150303 },
      },
    },
    'krung-thon-buri': {
      title: { en: 'Krung Thon Buri', th: 'กรุงธนบุรี' },
      location: '13.7209335,100.5026136,16z',
      category: 'BTS',
      bound: {
        sw: { lat: 13.716858, lng: 100.499227 },
        ne: { lat: 13.724748, lng: 100.505986 },
      },
    },
    'wongwian-yai': {
      title: { en: 'Wongwian Yai', th: 'วงเวียนใหญ่' },
      location: '13.7211257,100.4914626,16z',
      category: 'BTS',
      bound: {
        sw: { lat: 13.717192, lng: 100.490429 },
        ne: { lat: 13.724884, lng: 100.499398 },
      },
    },
    'pho-nimit': {
      title: { en: 'Pho Nimit', th: 'โพธิ์นิมิตร' },
      location: '13.718656,100.4831202,16z',
      category: 'BTS',
      bound: {
        sw: { lat: 13.714482, lng: 100.482211 },
        ne: { lat: 13.723, lng: 100.490 },
      },
    },
    'talat-phlu': {
      title: { en: 'Talat Phlu', th: 'ตลาดพลู' },
      location: '13.7137164,100.4736102,16z',
      category: 'BTS',
      bound: {
        sw: { lat: 13.7096, lng: 100.472 },
        ne: { lat: 13.7183, lng: 100.481 },
      },
    },
    wutthakat: {
      title: { en: 'Wutthakat', th: 'วุฒากาศ' },
      location: '13.7127102,100.4656067,16z',
      category: 'BTS',
      bound: {
        sw: { lat: 13.709364, lng: 100.463500 },
        ne: { lat: 13.716358, lng: 100.474 },
      },
    },
    'bang-wa': {
      title: { en: 'Bang wa', th: 'บางหว้า' },
      location: '13.7206527,100.4547245,16z',
      category: 'BTS',
      bound: {
        sw: { lat: 13.716, lng: 100.453 },
        ne: { lat: 13.7247, lng: 100.463 },
      },
    },
    'hua-lamphong': {
      title: { en: 'Hua Lamphong', th: 'หัวลำโพง' },
      category: 'MRT',
      bound: {
        sw: { lat: 13.736, lng: 100.516 },
        ne: { lat: 13.738, lng: 100.521 },
      },
    },
    'sam-yan': {
      title: { en: 'Sam Yan', th: 'สามย่าน' },
      category: 'MRT',
      bound: {
        sw: { lat: 13.729, lng: 100.525 },
        ne: { lat: 13.735, lng: 100.533 },
      },
    },
    'si-lom': {
      title: { en: 'Si Lom', th: 'สีลม' },
      category: 'MRT',
      bound: {
        sw: { lat: 13.725, lng: 100.531 },
        ne: { lat: 13.732, lng: 100.539 },
      },
    },
    lumphini: {
      title: { en: 'Lumphini', th: 'ลุมพินี' },
      category: 'MRT',
      bound: {
        sw: { lat: 13.722, lng: 100.537 },
        ne: { lat: 13.729, lng: 100.550 },
      },
    },
    'klong-toei': {
      title: { en: 'Klong Toei', th: 'คลองเตย' },
      category: 'MRT',
      bound: {
        sw: { lat: 13.717, lng: 100.547 },
        ne: { lat: 13.725, lng: 100.559 },
      },
    },
    'queen-sirkit-national-convention-center': {
      title: { en: 'Queen Sirkit National Convention Center', th: 'ศูนย์ประชุมแห่งชาติสิริกิติ์' },
      category: 'MRT',
      bound: {
        sw: { lat: 13.719, lng: 100.553 },
        ne: { lat: 13.726, lng: 100.566 },
      },
    },
    sukhumvit: {
      title: { en: 'Sukhumvit', th: 'สุขุมวิท' },
      category: 'MRT',
      bound: {
        sw: { lat: 13.734, lng: 100.554 },
        ne: { lat: 13.741, lng: 100.566 },
      },
    },
    phetchaburi: {
      title: { en: 'Phetchaburi', th: 'เพชรบุรี' },
      category: 'MRT',
      bound: {
        sw: { lat: 13.744, lng: 100.558 },
        ne: { lat: 13.751, lng: 100.568 },
      },
    },
    'phra-ram-9': {
      title: { en: 'Phra Ram 9', th: 'พระราม 9' },
      category: 'MRT',
      bound: {
        sw: { lat: 13.753, lng: 100.559 },
        ne: { lat: 13.760, lng: 100.570 },
      },
    },
    'thailand-cultural-center': {
      title: { en: 'Thailand Cultural Center', th: 'ศูนย์วัฒนธรรม' },
      category: 'MRT',
      bound: {
        sw: { lat: 13.763, lng: 100.565 },
        ne: { lat: 13.770, lng: 100.577 },
      },
    },
    'huai-khwang': {
      title: { en: 'Huai Khwang', th: 'ห้วยขวาง' },
      category: 'MRT',
      bound: {
        sw: { lat: 13.775, lng: 100.568 },
        ne: { lat: 13.782, lng: 100.589 },
      },
    },
    sutthisan: {
      title: { en: 'Sutthisan', th: 'สุทธิสาร' },
      category: 'MRT',
      bound: {
        sw: { lat: 13.784, lng: 100.567 },
        ne: { lat: 13.792, lng: 100.579 },
      },
    },
    ratchadaphisek: {
      title: { en: 'Ratchadaphisek', th: 'รัชดาภิเษก' },
      category: 'MRT',
      bound: {
        sw: { lat: 13.794, lng: 100.568 },
        ne: { lat: 13.801, lng: 100.579 },
      },
    },
    'lat-phrao': {
      title: { en: 'Lat Phrao', th: 'ลาดพร้าว' },
      category: 'MRT',
      bound: {
        sw: { lat: 13.802, lng: 100.567 },
        ne: { lat: 13.809, lng: 100.579 },
      },
    },
    'phahon-yothin': {
      title: { en: 'Phahon Yothin', th: 'พหลโยธิน' },
      category: 'MRT',
      bound: {
        sw: { lat: 13.810, lng: 100.553 },
        ne: { lat: 13.817, lng: 100.566 },
      },
    },
    'chatuchak-park': {
      title: { en: 'Chatuchak Park', th: 'สวนจตุจักร' },
      category: 'MRT',
      bound: {
        sw: { lat: 13.800, lng: 100.548 },
        ne: { lat: 13.807, lng: 100.559 },
      },
    },
    'kamphaen-phet': {
      title: { en: 'Kamphaen Phet', th: 'กำแพงเพชร' },
      category: 'MRT',
      bound: {
        sw: { lat: 13.793, lng: 100.541 },
        ne: { lat: 13.800, lng: 100.554 },
      },
    },
    'bang-sue': {
      title: { en: 'Bang Sue', th: 'บางซื่อ' },
      category: 'MRT',
      bound: {
        sw: { lat: 13.799, lng: 100.533 },
        ne: { lat: 13.806, lng: 100.505 },
      },
    },
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
