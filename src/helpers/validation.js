export function isEmpty(val) {
  return val.trim().length === 0;
}

export function isValidEmail(val) {
  return new RegExp(
    "[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?"
  ).test(val);
}

export function isFileTypeValid(file) {
  const fileTypes = ['jpg', 'jpeg', 'png'];

  let extension = file.name.split('.').pop().toLowerCase();
  let size = file.size;

  //Check file size is less than 4 mb and valid file type
  if( (size / 1024 < 4000) && fileTypes.includes(extension) ) {
    return true;
  } else {
    return false;
  }

}

export function validDesks(desks) {
  let valid = desks.length > 0;
  if(valid) {
    for(let i=0;i<desks.length;i++) {
      if(desks[i].name === '') {
        valid = false;
      }
    }
  }
  return valid;
}


export function allSaved(desks) {
  let valid = true;
  for(let i=0;i<desks.length;i++) {
    valid = desks[i].saved;
  }
  return valid;
}
