var btn = document.getElementById('index-btn');

btn.addEventListener('click', ()=>{
  matching_result_list();
});

const matching_result_list = () => {
  const yearform = document.yearform.year;
  const yearnum = yearform.selectedIndex;
  const year = yearform.options[yearnum].value;
  // フォームから月情報取得
  const monthform = document.monthform.month;
  const monthnum = monthform.selectedIndex;
  const month = monthform.options[monthnum].value;

  let parameter = year + month;
  parameter = encodeURI(parameter);
  
  let request_url = "https://3fendtwomj.execute-api.ap-northeast-1.amazonaws.com/prod/result?param1=";   
  request_url = request_url + parameter;
  
  fetch(request_url, { mode: "cors" })
  .then(response => response.json())
  .then(data => {
    // let output_label = document.getElementById("output_label");
    // output_label.innerText = data["body"][0]["area"]
    console.log(data);

    // テーブル展開
    // 選択月の日数を取得
    var last_day = get_last_day();
    // 選択月の日付リスト作成
    var days_of_month_list =  get_day_list(last_day);
    
    for (var i in days_of_month_list) {
      // 何週目か取得
      var week_num = get_week(i);
      
      // 曜日取得
      var day = Number(i) + 1
      var day_of_week = get_day_of_week(day);
      var week_target = $(`#week_${week_num}`);
      var table_flame_text = `<td class="baseline"><table id="day_${day}" class="table user_table"><tr id="user_checkbox"><td class="border border-dark" colspan="4">${day}</td></tr><tr id="user_checkbox"><td class="border border-dark" colspan="4">${day_of_week}</td>     </tr><tr id="user_checkbox"><td class="border border-dark">利用者名</td>     <td class="border border-dark">開始時間</td>  <td class="border border-dark">終了時間</td> <td class="border border-dark">支援者</td> </tr></table></td>`;
      $(week_target).append(table_flame_text);
    };

    // データ記入
    for (var i in data.body) {
      var day = i;
      day_table_target = $(`#day_${day}`);
      console.log(data.body[i].length);
      if (data.body[i].length) {
        for (var j in data.body[i]) {
          var day_table_text = '<tr><td class="border border-dark">' + 
                                data.body[i][j].user_name + '</td>' + 
                                '<td class="border border-dark">' + 
                                data.body[i][j].start + '</td>' + 
                                '<td class="border border-dark">' + 
                                data.body[i][j].end + '</td>' + 
                                '<td class="border border-dark">' + 
                                data.body[i][j].staff_name + 
                                '</td></tr>';
          $(day_table_target).append(day_table_text);
        }
        
      };
    };
  });
};

function get_last_day(date) {
  const yearform = document.yearform.year;
  const yearnum = yearform.selectedIndex;
  const year = yearform.options[yearnum].value;
  // フォームから月情報取得
  const monthform = document.monthform.month;
  const monthnum = monthform.selectedIndex;
  const month = monthform.options[monthnum].value;

  // 12月検証
  var date = new Date( Number(year), Number(month), 0 ) ;
  var lastDay = date.getDate() ;
  return lastDay
};

function get_day_list(n) {
  var list = [];
  i = 1
  while (n > 0) {
    list.push(i);
    i += 1;
    n -= 1;
  };
  return list
};

function get_week(i) {
  var week = 0;
  if (0 <= i && i <= 6) {
    week = 1
  } else if (7 <= i && i <= 13) {
    week = 2
  } else if (14 <= i && i <= 20) {
    week = 3
  } else if (21 <= i && i <= 27) {
    week = 4
  } else if (28 <= i) {
    week = 5
  }
  return week
};

function get_day_of_week(day) {
  const yearform = document.yearform.year;
  const yearnum = yearform.selectedIndex;
  const year = yearform.options[yearnum].value;
  // フォームから月情報取得
  const monthform = document.monthform.month;
  const monthnum = monthform.selectedIndex;
  const month = monthform.options[monthnum].value;

  var date = new Date( Number(year), Number(month) - 1, day ) ;
  var day_of_week = date.getDay() ;	
  var day_of_week_str = [ "日", "月", "火", "水", "木", "金", "土" ][day_of_week] ;

  return day_of_week_str
}
