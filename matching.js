var btn = document.getElementById('index-btn');

btn.addEventListener('click', ()=>{
  request_reservation_list();
});

// リスト取得
const request_reservation_list = () => {
  // フォームから年情報取得
  const yearform = document.yearform.year;
  const yearnum = yearform.selectedIndex;
  const year = yearform.options[yearnum].value;
  // フォームから月情報取得
  const monthform = document.monthform.month;
  const monthnum = monthform.selectedIndex;
  const month = monthform.options[monthnum].value;

  const dayform = document.dayform.day;
  const daynum = dayform.selectedIndex;
  const day = dayform.options[daynum].value;

  let parameter = year + month + day;
  parameter = encodeURI(parameter);
  
  let request_url = "https://3fendtwomj.execute-api.ap-northeast-1.amazonaws.com/prod/testappapi?param1=";   
  request_url = request_url + parameter;

  fetch(request_url, { mode: "cors" })
  .then(response => response.json())
  .then(data => {
    // let output_label = document.getElementById("output_label");
    // output_label.innerText = data["body"][0]["area"]
    console.log(data);
    createUserTable(data);
    createStaffTable(data);
    
})};

// マッチング結果のID送信
$(function () {
  $(document).on('click', '.matching_select .submit_button', function () {
    var ids = [];
    $(this).closest('form').find('[name=reservation]:checked').each(function () {
      ids.push($(this).val());
    });
    
    // staff_idにはスタッフの予約のIDが格納される
    let request_url = "https://3fendtwomj.execute-api.ap-northeast-1.amazonaws.com/prod/matchingFunction?";   
    request_url = request_url + 'yoyaku_id=' + ids[0] + '&staff_id=' + ids[1];
    
    fetch(request_url, {mode: 'cors'})
    .then(response => response.json())
    .then(data => {
      console.log(data)
      if (data.body[0] == 'マッチング成功しました'){
        window.alert('マッチングに成功しました');
        location.reload();
      }else if(data.body[0] == 'マッチング失敗しました'){
        window.alert('マッチングに失敗しました、時間が合わない組み合わせです')
      }
    })
  });
});

function createUserTable(data) {
  for(let i in data.body.user) {
      let start = extractDate(data.body.user[i].start);
      let end = extractDate(data.body.user[i].end);

      let user_checkbox_td = '<th class="border border-secondary"><input type="checkbox" name="reservation" value=' + String(data.body.user[i].id) + '></th>';   
      let user_name_td = '<td class="border border-secondary">' + data.body.user[i].user_name + '</td>';
      let user_area_td = '<td class="border border-secondary">' + data.body.user[i].area + '</td>';
      let user_time_td;

      $('#user_checkbox').append(user_checkbox_td);
      $('#user_name').append(user_name_td);
      $('#user_area').append(user_area_td);
  
      // 希望時間帯のみ色を付ける
      for(let time = 7; time <= 21; time++) {
        if (time >= Number(start) && time <= Number(end)) {
          user_time_td = '<td class="border table-success border_secondary"></td>';
          $(`#user_${time}h`).append(user_time_td);
        } else {
          user_time_td = '<td class="border border-secondary"></td>';
          $(`#user_${time}h`).append(user_time_td);
        }
      };
    }
};

function createStaffTable(data) {
  for(let i in data.body.staff) {
      let start = extractDate(data.body.staff[i].start)
      let end = extractDate(data.body.staff[i].end)
      let staff_checkbox_td = '<th class="border border-secondary"><input type="checkbox" name="reservation" value=' + String(data.body.staff[i].id) + '></th>';   
      let staff_name_td = '<td class="border border-secondary">' + data.body.staff[i].staff_name + '</td>';
      let staff_area_td = '<td class="border border-secondary">' + data.body.staff[i].area + '</td>';
      let staff_time_td;
      
      $('#staff_checkbox').append(staff_checkbox_td);
      $('#staff_name').append(staff_name_td);
      $('#staff_area').append(staff_area_td);
  
      // 希望時間帯のみ色を付ける
      for(let time = 7; time <= 21; time++) {
        if (time >= Number(start) && time <= Number(end)) {
          staff_time_td = '<td class="border table-info border-secondary"></td>';

          $(`#staff_${time}h`).append(staff_time_td);
        } else {
          staff_time_td = '<td class="border border-secondary"></td>';
          $(`#staff_${time}h`).append(staff_time_td);
        }
      };
    }
};

function extractDate(date) {
  var time = date.substr(8);
  return time
}



