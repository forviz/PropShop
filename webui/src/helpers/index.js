import numeral from 'numeral';

export const validateEmail = (email) => {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

export const errorMessageInputEmail = (email) => {
  if (!email) {
    return 'กรุณากรอกอีเมล';
  } else if (!validateEmail(email)) {
    return 'อีเมลไม่ถูกต้อง';
  } else {
    return '';
  }
}

export const errorMessageInputPassword = (password) => {
  if ( !password ) {
    return 'กรุณากรอกรหัสผ่าน';
  } else {
    return '';
  }
}

export const errorMessageInputConfirmPassword = (password1, password2) => {
	if ( password1 !== password2 ) {
    return 'ยืนยันรหัสผ่านไม่ถูกต้อง';
  } else {
  	return '';
  }
}

const doConvertNumberToText = (number) => {
  switch ( number ) {
    case 1:
      return ['หนึ่ง','เอ็ด'];
    case 2:
      return ['สอง','ยี่'];
    case 3:
      return 'สาม';
    case 4:
      return 'สี่';
    case 5:
      return 'ห้า';
    case 6:
      return 'หก';
    case 7:
      return 'เจ็ด';
    case 8:
      return 'แปด';
    case 9:
      return 'เก้า';
    case 10:
      return 'สิบ';
    case 11:
      return 'สิบเอ็ด';
    case 20:
      return 'ยี่สิบ';
    default:
      return number;
  }
};


export const convertRealestatePrice = (price) => {

  if (!price) {
    return price;
  }

  const numberStr = price.toString();
  const digits = numberStr.length;

  switch (digits) {
    // case 5: // หมื่น
    //   return convertNumberToText(numberStr[0]) + 'หมื่น';
    //   break;
    // case 6: // แสน
    //   break;
    case 7: // ล้าน
      return doConvertNumberToText(Math.round(numberStr[0]+'.'+numberStr[1])) + ' ล.บ.';
    case 8: // สิบล้าน
      return numberStr[0]+doConvertNumberToText(Math.round(numberStr[1]+'.'+numberStr[2])) + ' ล.บ.';
    case 9: // ร้อยล้าน
      return numberStr[0]+numberStr[1]+doConvertNumberToText(Math.round(numberStr[2]+'.'+numberStr[3])) + ' ล.บ.';
    default:
      return numeral(price).format('0,0') + ' บ.';
  }
}

export const diffDay = (timestamp1, timestamp2) => {
  const difference = timestamp1 - timestamp2;
  const daysDifference = Math.floor(difference/1000/60/60/24) + 1;
  return daysDifference;
}
