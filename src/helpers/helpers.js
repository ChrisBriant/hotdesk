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


//https://stackoverflow.com/questions/23593052/format-javascript-date-as-yyyy-mm-dd
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

//Transform the month data into an array where it can be output sequentially
export const transformMonthData = (year,month,slots) => {
  let monthData = []
  const firstOfMonth = new Date(year,month-1,1);
  const lastOfMonth = new Date(year,month,0);

  console.log('Months',firstOfMonth,lastOfMonth);

  let startDay;
  if(firstOfMonth.getDay() === 0) {
    startDay = 7;
  } else {
    startDay = firstOfMonth.getDay() -1;
  }
  //Set the blank days
  let beforeMonth = new Date(firstOfMonth.getTime());
  beforeMonth.setDate(beforeMonth.getDate() - startDay);

  for(let i=0;i<startDay;i++) {
    //Go backwards
    if(beforeMonth.getDay() >  0) {
      monthData.push({
        active:false,
        gone: true,
        className: 'inactive-day',
        day: beforeMonth.getDate(),
        date: new Date(beforeMonth.getTime()),
        //dateStr: `${beforeMonth.getFullYear()}-${beforeMonth.getMonth()}-${beforeMonth.getDate()}`
        dateStr: formatDate(beforeMonth)
      });
    }
    beforeMonth = new Date(beforeMonth.setDate(beforeMonth.getDate() + 1));
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
      //available: slots[`${formatDate(firstOfMonth)}`].available,
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
