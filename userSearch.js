$(document.body).tooltip({ selector: "[title]" });
$(document).ready(function () {

$("button").on("click" , function() {    
    
    var target = $(this).attr('src');
    var equipment = ["101","102","103","104","105","106","202","203","301","302","303","304","305","107","204","205"];
    var id = $('.show').attr("id");
    

    if( $(this).html() == 'Info'&& $('#'+target+'_'+id).attr('src')=='disable'){
        $.ajax({
            url:'/match',
            dataType: "json",
            type: 'GET',
            data: {data: $(this).attr('src')},
            success: function(result) { 
                var total = '<table class="table table-sm"><thead><tr class="table-info"><th class="text-center">승리</th><th class="text-center">유저</th><th class="text-center">KDA</th><th class="text-center">아이템</th></tr><tbody>'
                if(result.result.teams[0].result == "win"){
                    var winList = result.result.teams[0].players;
                    var loseList = result.result.teams[1].players;
                }
                else{
                    var winList = result.result.teams[1].players;
                    var loseList = result.result.teams[0].players;
                }
            
            for(var i=0; i<result.result.players.length ;i++)
                if(winList.includes(result.result.players[i].playerId)){
                    var itemNum =0;
                    var itemInfo = '';
                    if(result.result.players[i].playInfo.partyUserCount==0)
                        var count = "Solo";
                    else
                        var count =result.result.players[i].playInfo.partyUserCount+"인";
                    var kda = ((result.result.players[i].playInfo.killCount+result.result.players[i].playInfo.assistCount)/result.result.players[i].playInfo.deathCount).toFixed(1);
                    if(kda == "Infinity")
                        kda = "Perfect!";
                    for(var j=0; j<16 ;j++){
                        if(j==8)itemInfo +='<br>';   
                            try{
                                if (result.result.players[i].items[itemNum].equipSlotCode == equipment[j]){
                                    itemInfo+='<img src = "https://img-api.neople.co.kr/cy/items/'+result.result.players[i].items[itemNum].itemId+'" class="border border-secondary"  width="40" height="40" data-toggle="tooltip" data-placement="bottom" data-html="true" title="'+result.result.players[i].items[itemNum].itemName+'">';
                                    itemNum += 1;
                                }
                                else
                                itemInfo+='<img src ="/public/attriImg/NA.jpg" class="border border-secondary"  width="40" height="40">';
                                }
                            catch (e){
                                itemInfo+='<img src ="/public/attriImg/NA.jpg" class="border border-secondary"  width="40" height="40">';
                                continue;}
                            }
                            itemInfo+='</td>'
                            total+=(   
                        '<tr class="table-primary"><td class="text-center">'+
                            '<a href="/character/'+result.result.players[i].playInfo.characterName+'"><img src = "public/thumb/'+result.result.players[i].playInfo.characterName+'.jpg"width="46" height="46"></a>'+
                            '<img src = "/public/attriImg/posi/'+result.result.players[i].position.name+'.jpg"  width="46" height="46">'+
                            '<br><img src = "https://img-api.neople.co.kr/cy/position-attributes/'+result.result.players[i].position.attribute[0].id+'"width="31" height="31" data-toggle="tooltip" role="tooltip" data-placement="bottom" data-html="true" title="'+result.result.players[i].position.attribute[0].name+'">'+
                            ' <img src = "https://img-api.neople.co.kr/cy/position-attributes/'+result.result.players[i].position.attribute[1].id+'"  width="31" height="31" data-toggle="tooltip" role="tooltip" data-placement="bottom" data-html="true" title="'+result.result.players[i].position.attribute[1].name+'">'+
                            ' <img src = "https://img-api.neople.co.kr/cy/position-attributes/'+result.result.players[i].position.attribute[2].id+'" width="31" height="31" data-toggle="tooltip" data-placement="bottom" data-html="true" title="'+result.result.players[i].position.attribute[2].name+'">'+
                        '</td><td class="text-center "><a href="/user?userName='+result.result.players[i].nickname+'" style="color: black"><strong>'+result.result.players[i].nickname+'</a><br>('+count+ ')'+
                        '</strong></td><td class="text-center">'+
                        '<strong>Lv.'+result.result.players[i].playInfo.level+'<br>'+result.result.players[i].playInfo.killCount+' / <span style="color:red">'+result.result.players[i].playInfo.deathCount+'</span> / '+result.result.players[i].playInfo.assistCount+'<br>평점 : '+kda+
                        '</strong></td><td class="text-center">'+itemInfo+'</td></tr>');
                    }
                    total += '<thead><tr class="table-danger"><th class="text-center">패배</th><th class="text-center">유저</th><th class="text-center">KDA</th><th class="text-center">아이템</th></tr><tbody>'
                    for(var i=0; i<result.result.players.length ;i++)
                    if(loseList.includes(result.result.players[i].playerId)){
                        var itemNum =0;
                        var itemInfo = '';
                        if(result.result.players[i].playInfo.partyUserCount==0)
                            var count = "Solo";
                        else
                            var count =result.result.players[i].playInfo.partyUserCount+"인";
                        var kda = ((result.result.players[i].playInfo.killCount+result.result.players[i].playInfo.assistCount)/result.result.players[i].playInfo.deathCount).toFixed(1);
                        if(kda == "Infinity")
                            kda = "Perfect!";
                        for(var j=0; j<16 ;j++){
                            if(j==8)itemInfo +='<br>';   
                                try{
                                    if (result.result.players[i].items[itemNum].equipSlotCode == equipment[j]){
                                        itemInfo+='<img src = "https://img-api.neople.co.kr/cy/items/'+result.result.players[i].items[itemNum].itemId+'" class="border border-secondary"  width="40" height="40" data-toggle="tooltip" data-placement="bottom" data-html="true" title="'+result.result.players[i].items[itemNum].itemName+'">';
                                        itemNum += 1;
                                    }
                                    else
                                    itemInfo+='<img src ="/public/attriImg/NA.jpg" class="border border-secondary"  width="40" height="40">';
                                    }
                                catch (e){
                                    itemInfo+='<img src ="/public/attriImg/NA.jpg" class="border border-secondary"  width="40" height="40">';
                                    continue;}
                                }
                                itemInfo+='</td>'
                                total+=(   
                            '<tr class="table-danger"><td class="text-center">'+
                                '<a href="/character/'+result.result.players[i].playInfo.characterName+'"><img src = "public/thumb/'+result.result.players[i].playInfo.characterName+'.jpg"width="46" height="46"></a>'+
                                '<img src = "/public/attriImg/posi/'+result.result.players[i].position.name+'.jpg"  width="46" height="46">'+
                                '<br><img src = "https://img-api.neople.co.kr/cy/position-attributes/'+result.result.players[i].position.attribute[0].id+'"width="31" height="31" data-toggle="tooltip" data-placement="bottom" data-html="true" alt="'+result.result.players[i].position.attribute[0].name+'" title="'+result.result.players[i].position.attribute[0].name+'">'+
                                ' <img src = "https://img-api.neople.co.kr/cy/position-attributes/'+result.result.players[i].position.attribute[1].id+'"  width="31" height="31" data-toggle="tooltip" data-placement="bottom" data-html="true" title="'+result.result.players[i].position.attribute[1].name+'">'+
                                ' <img src = "https://img-api.neople.co.kr/cy/position-attributes/'+result.result.players[i].position.attribute[2].id+'" width="31" height="31" data-toggle="tooltip" data-placement="bottom" data-html="true" title="'+result.result.players[i].position.attribute[2].name+'">'+
                            '</td><td class="text-center "><a href="/user?userName='+result.result.players[i].nickname+'" style="color: black"><strong>'+result.result.players[i].nickname+'</a><br>('+count+ ')'+
                            '</strong></td><td class="text-center">'+
                            '<strong>Lv.'+result.result.players[i].playInfo.level+'<br>'+result.result.players[i].playInfo.killCount+' / <span style="color:red">'+result.result.players[i].playInfo.deathCount+'</span> / '+result.result.players[i].playInfo.assistCount+'<br>평점 : '+kda+
                            '</strong></td><td class="text-center">'+itemInfo+'</td></tr>');
                        }
                        total+='</table>'
                    $('#'+target+'_'+id).html(total);    
                    $('#'+target+'_'+id).attr('src','able')
            },
            beforeSend:function(){
                $('#'+target+'_'+id).append('<div class="text-center"><div class="spinner-border text-primary" role="status" id ="loading"><span class="sr-only"><br>Loading...</span></div></div>');
            },
            complete:function(){
                $('#loading').remove();
            },
            error: function() { 
                alert(err) ;
            }
        })
        $(this).html('Close');
    }else {
        $('#'+target+'_'+id+' *').remove();
        $(this).html('Info');
        $('#'+target+'_'+id).attr('src','disable')  
      }
 
    });         
})
