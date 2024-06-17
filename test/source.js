exports.bind = function(typeData){
    if (typeData.type === 'd'){
        return parseDate;
    }
}

class Date{
    constructor(){
        this.year   = '';
        this.month  = '';
        this.day    = '';
        this.hour   = '0';
        this.minute = '0';
        this.second = '0';
        this.msec   = '0';

        this.TZ     = 'Z';
    }
}


function getMonth(datestr){
    const monthListRuFull = ['январ', 'феврал', 'март', 'апрел', 'ма', 'июн', 'июл', 'август', 'сентябр', 'октябр', 'ноябр', 'декабр'];
    const monthListRuShort = ['янв', 'фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'];
    const monthListEnFull = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const monthListEnShort = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const numberOfMonths = 12;

    let thisMonth = false;

    for (let i=0; i < numberOfMonths; i++){
        thisMonth = datestr.indexOf(monthListRuFull[i]) !== -1
        if (thisMonth) return i+1;
        
        thisMonth = datestr.indexOf(monthListRuShort[i]) !== -1
        if (thisMonth) return i+1;
        
    }

    return -1
}

function parseDate(data){
    let date = new Date()

    let dateStr = String(data.src[data.options])

    // fetch date YYYY-MM-DD
    regex = /(-?(?:[1-9][0-9]*)?[0-9]{4})(-|\.|\/)(1[0-2]|0[1-9])(-|\.|\/)(3[01]|0[1-9]|[12][0-9])/;
    res = dateStr.match(regex)
    if (res !== null){
        res = res[0];
        date.year  = res.slice(0, 4);
        date.month = res.slice(5, 7); 
        date.day   = res.slice(8);

        dateStr = dateStr.replace(res, '');
    }

    // fetch date DD-MM-YYYY
    regex = /(3[01]|0[1-9]|[12][0-9])(-|\.|\/)(1[0-2]|0[1-9])(-|\.|\/)(-?(?:[1-9][0-9]*)?[0-9]{4})/;
    res = dateStr.match(regex)
    if (res !== null){
        res = res[0];
        date.day  = res.slice(0, 2);
        date.month = res.slice(3, 5); 
        date.year   = res.slice(6);

        dateStr = dateStr.replace(res, '');

    }

    // fetch TZ
    regex = /(\+|\-)(2[0-3]|[01][0-9]):([0-5][0-9])/;
    res = dateStr.match(regex)
    if (res !== null){
        res = res[0];
        date.TZ = res;

        dateStr = dateStr.replace(res, '');
    }
    
   
    // fetch time
    regex = /(2[0-3]|[01][0-9]):([0-5][0-9])(:([0-5][0-9])(.[0-9]+)?)?/;
    res = dateStr.match(regex)
    if (res !== null){
        res = res[0];
        date.hour = res.slice(0, 2);
        date.minute = res.slice(3, 5); 
        date.second = res.length > 5 ? res.slice(6, 8) : '0';
        date.msec = res.length > 8 ? res.slice(9) : '0';

        dateStr = dateStr.replace(res, '');
        
    }

    // fetch date if litterral format
    if (date.year === ''){
        // month
        date.month = String(getMonth(dateStr));
        //year
        regex = /(-?(?:[1-9][0-9]*)?[0-9]{4})/
        res = dateStr.match(regex)[0]
        date.year = res;

        dateStr = dateStr.replace(res, '');
        //day
        regex = /(3[01]|0[1-9]|[12][0-9])/;
        res = dateStr.match(regex);
        if (res !== null){
            res = res[0];
            date.day = res;
        } else {
            // writen with one number
            regex = /(3?[01]|0?[1-9]|[12]?[0-9])/;
            res = dateStr.match(regex);
            date.day = (res !== null)? res[0] : '99'
        }

    }
    

    // if nothing was found
    if (date.year === ''){
        date.year   = '1970';
        date.month  = '1';
        date.day    = '1';
    }
    

    return dateToStr(date);
    
}

function dateToStr(date){
    let year   = date.year;
    let month  = ((date.month.length === 2)? date.month : '0' + date.month);
    let day    = ((date.day.length === 2)? date.day : '0' + date.day);
    let hour   = ((date.hour.length === 2)? date.hour : '0' + date.hour);
    let minute = ((date.minute.length === 2)? date.minute : '0' + date.minute);
    let second = ((date.second.length === 2)? date.second : '0' + date.second);
    let msec   = date.msec;

    while (msec.length < 3) {
        msec = '0' + msec;
    }

    
    return (`${year}-${month}-${day}T${hour}:${minute}:${second}.${msec}${date.TZ}`)
}


