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
