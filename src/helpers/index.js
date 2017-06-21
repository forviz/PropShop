import numeral from 'numeral';

export const validateEmail = (email) => {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

export const errorMessageInputEmail = (email) => {
  if ( !email ) {
    return 'กรุณากรอกอีเมล';
  } else if ( !validateEmail(email) ) {
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
      break;
    case 2:
      return ['สอง','ยี่'];
      break;
    case 3:
      return 'สาม';
      break;
    case 4:
      return 'สี่';
      break;
    case 5:
      return 'ห้า';
      break;
    case 6:
      return 'หก';
      break;
    case 7:
      return 'เจ็ด';
      break;
    case 8:
      return 'แปด';
      break;
    case 9:
      return 'เก้า';
      break;
    case 10:
      return 'สิบ';
      break;
    case 11:
      return 'สิบเอ็ด';
      break;
    case 20:
      return 'ยี่สิบ';
      break;
    default:
      return number;
  }
}

const convertNumberToText = (number) => {
  const numberStr = number.toString();
  const digits = numberStr.length;

  switch ( digits ) {
    case 1: 
      return 
      break;
    case 2: 
      return 
      break;
    default:
      return number;
  }
}

export const convertRealestatePrice = (price) => {

  if (!price) {
    return price;
  }

  const numberStr = price.toString();
  const digits = numberStr.length;

  switch ( digits ) {
    // case 5: // หมื่น
    //   return convertNumberToText(numberStr[0]) + 'หมื่น';
    //   break;
    // case 6: // แสน
    //   break;
    case 7: // ล้าน
      return doConvertNumberToText(Math.round(numberStr[0]+'.'+numberStr[1])) + ' ล.บ.';
      break;
    case 8: // สิบล้าน
      return numberStr[0]+doConvertNumberToText(Math.round(numberStr[1]+'.'+numberStr[2])) + ' ล.บ.';
      break;
    case 9: // ร้อยล้าน
      return numberStr[0]+numberStr[1]+doConvertNumberToText(Math.round(numberStr[2]+'.'+numberStr[3])) + ' ล.บ.';
      break;
    default:
      return numeral(price).format('0,0') + ' บ.';
  }
}