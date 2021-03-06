export function randomString(length) {
    return Math.round((Math.pow(36, length + 1) - Math.random() * Math.pow(36, length))).toString(36).slice(1);
}

//https://stackoverflow.com/questions/16106701/how-to-generate-a-random-string-of-letters-and-numbers-in-javascript
export function stringGen(len) {
  var text = "";
  var charset = "abcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < len; i++)
    text += charset.charAt(Math.floor(Math.random() * charset.length));
  return text;
}


export function getMousePos(e) {
  let canvasDims = e.target.getBoundingClientRect();
  return {x:e.x - canvasDims.left,y:e.y - canvasDims.top};
}


export function isEmpty(obj) {
  for(var prop in obj) {
    if(obj.hasOwnProperty(prop)) {
      return false;
    }
  }

  return JSON.stringify(obj) === JSON.stringify({});
}


//////////////////// CALENDAR PROCESSING ////////////////////

function splitArray(array,chunkSize ) {
    let arrayOfArrays = [];

    while (array.length > 0) {
        let arrayElement = array.splice(0,chunkSize);
        arrayOfArrays.push(arrayElement);
    }
    return arrayOfArrays;
}


function isLeapYear(year) {
  return year % 4 === 0;
}

function getLastOfMonth(year,month) {
  switch(month) {
    case 1:
      return 31;
    case 2:
      if(isLeapYear(year)) {
        return 29;
      } else {
        return 28;
      }
    case 3:
      return 31;
    case 4:
      return 30;
    case 5:
      return 31;
    case 6:
      return 30;
    case 7:
      return 31;
    case 8:
      return 31;
    case 9:
      return 30;
    case 10:
      return 31;
    case 11:
      return 30;
    case 12:
      return 31;
  }
}

function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;

    return [year, month, day].join('-');
}

const monthNames = {
  1: 'January',
  2: 'February',
  3: 'March',
  4: 'April',
  5: 'May',
  6: 'June',
  7: 'July',
  8: 'August',
  9: 'September',
  10: 'October',
  11: 'November',
  12: 'December'
}

export function getMonthName(monthNo) {
  return monthNames[monthNo];
}


//Transform the month data into an array where it can be output sequentially
export const transformMonthData = (year,month,slots) => {
  let monthData = []

  const firstOfMonthStr = `${year}-${month}-1`;
  const firstOfMonth = new Date(firstOfMonthStr);
  const lastOfMonthStr = `${year}-${month}-${getLastOfMonth(year,month)}`;
  const lastOfMonth = new Date(lastOfMonthStr);

  //Adjust for calendar so that Sunday is day 7 and Monday day 0

  if(firstOfMonth.getDay() !== 1) {
    //Set the blank days
    let beforeMonthStr = '';
    if(month === 1) {
      beforeMonthStr = `${year-1}-12-${getLastOfMonth(year-1,12)}`;
    } else {
      beforeMonthStr = `${year}-${month-1}-${getLastOfMonth(year,month-1)}`;
    }
    let beforeMonth = new Date(beforeMonthStr);

    //Wind back
    while(beforeMonth.getDay() !== 1) {
      beforeMonth.setDate(beforeMonth.getDate() - 1);
    }

    while(beforeMonth.getMonth() !== firstOfMonth.getMonth()) {
      monthData.push({
        active:false,
        gone: true,
        className: 'inactive-day',
        day: beforeMonth.getDate(),
        date: new Date(beforeMonth.getTime()),
        dateStr: formatDate(beforeMonth)
      });
      beforeMonth.setDate(beforeMonth.getDate() + 1);
    }
  }

  //Sandwich the actual month
  //Process the bulk of the calendar month
  for(let i=0;i<lastOfMonth.getDate();i++) {
    let gone = false;
    let className = 'active-day';
    let dtNow = new Date()
    dtNow.setDate(dtNow.getDate()-1)
    if(dtNow >= firstOfMonth) {
      gone = true;
      className = 'passed-day';
    }

    monthData.push({
      active:true,
      gone: gone,
      className: className,
      day: firstOfMonth.getDate(),
      date: new Date(firstOfMonth.getTime()),
      dateStr: formatDate(firstOfMonth)
    });
    firstOfMonth.setDate(firstOfMonth.getDate() + 1);
  }

  //Get the end of the month
  lastOfMonth.setDate(lastOfMonth.getDate() + 1);

  while(lastOfMonth.getDay() !== 1) {
    monthData.push({
      active:false,
      gone:false,
      className: 'inactive-day',
      day: lastOfMonth.getDate(),
      date: new Date(lastOfMonth.getTime()),
      dateStr: formatDate(lastOfMonth)
    });
    lastOfMonth.setDate(lastOfMonth.getDate() + 1);
  }
  //Return month data partitioned into weeks
  return(splitArray(monthData,7));
}


export function simpleDateCompare(date1,date2) {
  return date1.getMonth() === date2.getMonth()
      && date1.getDate() === date2.getDate()
      && date1.getYear() === date2.getYear();
}
