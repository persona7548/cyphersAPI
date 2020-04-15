function addCookie(id) {
    var items = getCookie('userID'); // 이미 저장된 값을 쿠키에서 가져오기
    var maxItemNum = 8; // 최대 저장 가능한 아이템개수
    var expire = 60; // 쿠키값을 저장할 기간
    if (items) {
        var itemArray = items.split(',');
        if (itemArray.indexOf(id) != -1) {
            // 이미 존재하는 경우 종료
            console.log('Already exists.');
        } else {
            // 새로운 값 저장 및 최대 개수 유지하기
            itemArray.unshift(id);
            if (itemArray.length > maxItemNum) 
                itemArray.length = 5;
            items = itemArray.join(',');
            setCookie('userID', items, expire);
        }
    } else {
        // 신규 id값 저장하기
        setCookie('userID', id, expire);
    }}
    function getCookie(cookie_name) {
        var x, y;
        var val = document.cookie.split(';');
      
        for (var i = 0; i < val.length; i++) {
          x = val[i].substr(0, val[i].indexOf('='));
          y = val[i].substr(val[i].indexOf('=') + 1);
          x = x.replace(/^\s+|\s+$/g, ''); // 앞과 뒤의 공백 제거하기
          if (x == cookie_name) {
            return unescape(y); // unescape로 디코딩 후 값 리턴
          }
        }
      }
$("button").on("click" , function() {    
    if( $(this).attr('type')=='submit'){
        getCookie('userID');

}});
$("input").on("click" , function() {    
    addCookie(id)
});
