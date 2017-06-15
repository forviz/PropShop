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