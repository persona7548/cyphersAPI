$(document.body).tooltip({ selector: "[title]" });
$(document).ready(function () {

$("button").on("click" , function() {    
    
    var target = $(this).attr('src');
    var equipment = ["101","102","103","104","105","106","202","203","301","302","303","304","305","107","204","205"];
    var id = $('.show').attr("id");
    var winTeamDeal=0,winTeamDamaged=0,winTeamBattleP=0,winTeamSightP=0;
    var loseTeamDeal=0, loseTeamDamaged=0, loseTeamBattleP=0,loseTeamSightP=0;


    if( $(this).html() == 'Info'&& $('#'+target+'_'+id).attr('src')=='disable'){
        $.ajax({
            url:'/match',
            dataType: "json",
            type: 'GET',
            data: {data: $(this).attr('src')},
            success: function(result) { 
                if(result.result.teams[0].result == "win"){
                    var winList = result.result.teams[0].players;
                    var loseList = result.result.teams[1].players;
                }
                else{
                    var winList = result.result.teams[1].players;
                    var loseList = result.result.teams[0].players;
                }
       
                for(var i=0; i<result.result.players.length ;i++){
                 if(winList.includes(result.result.players[i].playerId)){
                    winTeamDeal+= result.result.players[i].playInfo.attackPoint;
                    winTeamDamaged+=result.result.players[i].playInfo.damagePoint;
                    winTeamBattleP+=result.result.players[i].playInfo.battlePoint;
                    winTeamSightP+=result.result.players[i].playInfo.sightPoint;}
                 if(loseList.includes(result.result.players[i].playerId)){
                    loseTeamDeal+= result.result.players[i].playInfo.attackPoint;
                    loseTeamDamaged+=result.result.players[i].playInfo.damagePoint;
                    loseTeamBattleP+=result.result.players[i].playInfo.battlePoint;
                    loseTeamSightP+=result.result.players[i].playInfo.sightPoint;
                 }}

                 var graph =('<script>'+
                 'var ctx = document.getElementById("TeamDeal");'+
                 'var TeamDeal = new Chart(ctx, {'+
                 'type: "pie",'+
                 'data: {'+
                  '   labels: ["승리팀", "패배팀"],'+
                     'datasets: [{'+
                     'data: ['+winTeamDeal+','+loseTeamDeal+'],'+
                     'backgroundColor: ["#007bff", "#dc3545", "#ffc107", "#28a745"],'+
                     '}],'+
                 '},'+
                 '});</script>'
                 );
                 graph +=('<script>'+
                 'var ctx = document.getElementById("TeamDamaged");'+
                 'var TeamDamaged = new Chart(ctx, {'+
                 'type: "pie",'+
                 'data: {'+
                  '   labels: ["승리팀", "패배팀"],'+
                     'datasets: [{'+
                     'data: ['+winTeamDamaged+','+loseTeamDamaged+'],'+
                     'backgroundColor: ["#007bff", "#dc3545", "#ffc107", "#28a745"],'+
                     '}],'+
                 '},'+
                 '});</script>'
                 );
                 graph +=('<script>'+
                 'var ctx = document.getElementById("TeamBattleP");'+
                 'var TeamBattleP = new Chart(ctx, {'+
                 'type: "pie",'+
                 'data: {'+
                  '   labels: ["승리팀", "패배팀"],'+
                     'datasets: [{'+
                     'data: ['+winTeamBattleP+','+loseTeamBattleP+'],'+
                     'backgroundColor: ["#007bff", "#dc3545", "#ffc107", "#28a745"],'+
                     '}],'+
                 '},'+
                 '});</script>'
                 );
                graph +=('<script>'+
                 'var ctx = document.getElementById("TeamSightP");'+
                 'var TeamSightP = new Chart(ctx, {'+
                 'type: "pie",'+
                 'data: {'+
                  '   labels: ["승리팀", "패배팀"],'+
                     'datasets: [{'+
                     'data: ['+winTeamSightP+','+loseTeamSightP+'],'+
                     'backgroundColor: ["#007bff", "#dc3545", "#ffc107", "#28a745"],'+
                     '}],'+
                 '},'+
                 '});</script>'
                 );
               
               
    
            

                var total = ('<li class="list-group-item list-group-item-light"><ul class="nav nav-tabs" role="tablist" id="myTab">'+
                        '<li class="nav-item"> <a class="nav-link active" id="total-tab" data-toggle="tab" href="#total" role="tab" aria-controls="total" aria-selected="true">종합</a></li>'+
                         '<li class="nav-item"><a class="nav-link" id="item-tab" data-toggle="tab" href="#item" role="tab" aria-controls="item" aria-selected="false">아이템</a></li>'+
						 '<li class="nav-item"><a class="nav-link" id="team-tab" data-toggle="tab" href="#team" role="tab" aria-controls="team" aria-selected="false">팀 통계</a></li>'+
				'</ul><div class="tab-content" id="myTabContent">');
                
                total +=('<div role="tabpanel" class="tab-pane fade" id="team" aria-labelledby="team-tab"><br><div class="row">'+
                '<div class="col-md-6 col-lg-6 col-sm-6 col-xs-6"> <div class="card mb-4">'+
                '<div class="card-header" data-toggle="tooltip" data-placement="bottom" ><i class="fas fa-chart-pie mr-1"></i>딜량</div>'+
                '<div class="card-body"><canvas id="TeamDeal" width="100%" height="50"></canvas></div><a class="text-center">승리팀 : '+(winTeamDeal/1000).toFixed(0)+'K<br>패배팀 : '+(loseTeamDeal/1000).toFixed(0)+'K</a></div> </div>'+
                '<div class="col-md-6 col-lg-6 col-sm-6 col-xs-6"> <div class="card mb-4">'+
                '<div class="card-header" data-toggle="tooltip" data-placement="bottom" ><i class="fas fa-chart-pie mr-1"></i>받은 피해량</div>'+
                '<div class="card-body"><canvas id="TeamDamaged" width="100%" height="50"></canvas></div><a class="text-center">승리팀 : '+(winTeamDamaged/1000).toFixed(0)+'K<br>패배팀 : '+(loseTeamDamaged/1000).toFixed(0)+'K</a></div> </div>'+
                '<div class="col-md-6 col-lg-6 col-sm-6 col-xs-6"> <div class="card mb-4">'+
                '<div class="card-header" data-toggle="tooltip" data-placement="bottom" ><i class="fas fa-chart-pie mr-1"></i>전투 참여</div>'+
                '<div class="card-body"><canvas id="TeamBattleP" width="100%" height="50"></canvas></div><a class="text-center">승리팀 : '+winTeamBattleP+'점<br>패배팀 : '+loseTeamBattleP+'점</a></div> </div>'+
                '<div class="col-md-6 col-lg-6 col-sm-6 col-xs-6"> <div class="card mb-4">'+
                '<div class="card-header" data-toggle="tooltip" data-placement="bottom" ><i class="fas fa-chart-pie mr-1"></i>시야 확보</div>'+
                '<div class="card-body"><canvas id="TeamSightP" width="100%" height="50"></canvas></div><a class="text-center">승리팀 : '+winTeamSightP+'점<br>패배팀 : '+loseTeamSightP+'점</a></div> </div></div></div>');
                total += graph;
                total += ('<div role="tabpanel" class="tab-pane fade active show" id="total" aria-labelledby="total-tab">'+
                '<table class="table table-sm"><thead><tr class="table-info"><th class="text-center">승리</th><th class="text-center">유저</th><th class="text-center">KDA</th><th class="text-center">Info</th></tr><tbody>');
                
             
             for(var i=0; i<result.result.players.length ;i++)
                 if(winList.includes(result.result.players[i].playerId)){
                     var itemNum =0;
                     
                     if(result.result.players[i].playInfo.partyUserCount==0)
                         var count = "Solo";
                     else
                         var count =result.result.players[i].playInfo.partyUserCount+"인";
                     var kda = ((result.result.players[i].playInfo.killCount+result.result.players[i].playInfo.assistCount)/result.result.players[i].playInfo.deathCount).toFixed(1);
                     if(kda == "Infinity")
                         kda = "Perfect!";
                     else
                         kda = "평점 : "+kda;
 
                
                            total+=(   
                         '<tr class="table-primary"><td class="text-center">'+
                             '<a href="/character/'+result.result.players[i].playInfo.characterName+'"><img src = "public/thumb/'+result.result.players[i].playInfo.characterName+'.jpg"width="38" height="38"></a>'+
                             '<img src = "/public/attriImg/posi/'+result.result.players[i].position.name+'.jpg"  width="38" height="38">'+
                             '<br><img src = "https://img-api.neople.co.kr/cy/position-attributes/'+result.result.players[i].position.attribute[0].id+'"width="30" height="30" data-toggle="tooltip" role="tooltip" data-placement="bottom" data-html="true" title="'+result.result.players[i].position.attribute[0].name+'">'+
                             ' <img src = "https://img-api.neople.co.kr/cy/position-attributes/'+result.result.players[i].position.attribute[1].id+'"  width="30" height="30" data-toggle="tooltip" role="tooltip" data-placement="bottom" data-html="true" title="'+result.result.players[i].position.attribute[1].name+'">'+
                             ' <img src = "https://img-api.neople.co.kr/cy/position-attributes/'+result.result.players[i].position.attribute[2].id+'" width="30" height="30" data-toggle="tooltip" data-placement="bottom" data-html="true" title="'+result.result.players[i].position.attribute[2].name+'">'+
                         '</td><td class="text-center"><a href="/user?userName='+result.result.players[i].nickname+'" style="color: black"><small><strong><span class="d-inline-block text-truncate" style="max-width: 90px;" data-toggle="tooltip" data-placement="bottom" title="'+result.result.players[i].nickname+'">'+result.result.players[i].nickname+'</span></a><br>('+count+ ')'+
                         '</strong></small></td><td class="text-center">'+
                         '<small><strong>Lv.'+result.result.players[i].playInfo.level+'<br>'+result.result.players[i].playInfo.killCount+'/<span style="color:red">'+result.result.players[i].playInfo.deathCount+'</span>/'+result.result.players[i].playInfo.assistCount+'<br>'+kda+
                         '</strong></small></td><td class="text-center"><small><strong>가한 피해 : '+(result.result.players[i].playInfo.attackPoint/1000).toFixed(1)+'K ('+(result.result.players[i].playInfo.attackPoint/winTeamDeal*100).toFixed(1)+'%) | 전투 참여 : '+result.result.players[i].playInfo.battlePoint+'점<br>받은 피해 : '+(result.result.players[i].playInfo.damagePoint/1000).toFixed(1)+'K ('+(result.result.players[i].playInfo.damagePoint/winTeamDamaged*100).toFixed(1)+'%) | 시야 확보 : '+result.result.players[i].playInfo.sightPoint+'점</strong></small></td></tr>');
                     }
                     total += '<thead><tr class="table-danger"><th class="text-center">패배</th><th class="text-center">유저</th><th class="text-center">KDA</th><th class="text-center">Info</th></tr><tbody>'
                     for(var i=0; i<result.result.players.length ;i++)
                     if(loseList.includes(result.result.players[i].playerId)){
                         var itemNum =0;
                         
                         if(result.result.players[i].playInfo.partyUserCount==0)
                             var count = "Solo";
                         else
                             var count =result.result.players[i].playInfo.partyUserCount+"인";
                         var kda = ((result.result.players[i].playInfo.killCount+result.result.players[i].playInfo.assistCount)/result.result.players[i].playInfo.deathCount).toFixed(1);
                         if(kda == "Infinity")
                             kda = "Perfect!";
                         else
                             kda = "평점 : "+kda;
                         
                                 itemInfo+='</div></td>'
                                 total+=(   
                                     '<tr class="table-danger"><td class="text-center">'+
                                     '<a href="/character/'+result.result.players[i].playInfo.characterName+'"><img src = "public/thumb/'+result.result.players[i].playInfo.characterName+'.jpg"width="38" height="38"></a>'+
                                     '<img src = "/public/attriImg/posi/'+result.result.players[i].position.name+'.jpg"  width="38" height="38">'+
                                     '<br><img src = "https://img-api.neople.co.kr/cy/position-attributes/'+result.result.players[i].position.attribute[0].id+'"width="30" height="30" data-toggle="tooltip" role="tooltip" data-placement="bottom" data-html="true" title="'+result.result.players[i].position.attribute[0].name+'">'+
                                     ' <img src = "https://img-api.neople.co.kr/cy/position-attributes/'+result.result.players[i].position.attribute[1].id+'"  width="30" height="30" data-toggle="tooltip" role="tooltip" data-placement="bottom" data-html="true" title="'+result.result.players[i].position.attribute[1].name+'">'+
                                     ' <img src = "https://img-api.neople.co.kr/cy/position-attributes/'+result.result.players[i].position.attribute[2].id+'" width="30" height="30" data-toggle="tooltip" data-placement="bottom" data-html="true" title="'+result.result.players[i].position.attribute[2].name+'">'+
                                 '</td><td class="text-center"><a href="/user?userName='+result.result.players[i].nickname+'" style="color: black"><small><strong><span class="d-inline-block text-truncate" style="max-width: 90px;" data-toggle="tooltip" data-placement="bottom" title="'+result.result.players[i].nickname+'">'+result.result.players[i].nickname+'</span></a><br>('+count+ ')'+
                                 '</strong></small></td><td class="text-center">'+
                                 '<small><strong>Lv.'+result.result.players[i].playInfo.level+'<br>'+result.result.players[i].playInfo.killCount+'/<span style="color:red">'+result.result.players[i].playInfo.deathCount+'</span>/'+result.result.players[i].playInfo.assistCount+'<br>'+kda+
                                 '</strong></small></td><td class="text-center"><small><strong>가한 피해 : '+(result.result.players[i].playInfo.attackPoint/1000).toFixed(1)+'K ('+(result.result.players[i].playInfo.attackPoint/loseTeamDeal*100).toFixed(1)+'%) | 전투 참여 : '+result.result.players[i].playInfo.battlePoint+'점<br>받은 피해 : '+(result.result.players[i].playInfo.damagePoint/1000).toFixed(1)+'K ('+(result.result.players[i].playInfo.damagePoint/loseTeamDamaged*100).toFixed(1)+'%) | 시야 확보 : '+result.result.players[i].playInfo.sightPoint+'점</strong></small></td></tr>');
                                }

                total+='</table></div><div role="tabpanel" class="tab-pane fade" id="item" aria-labelledby="item-tab">'          
                total += '<table class="table table-sm"><thead><tr class="table-info"><th class="text-center">승리</th><th class="text-center">유저</th><th class="text-center">KDA</th><th class="text-center">아이템</th></tr><tbody>'
             
             for(var i=0; i<result.result.players.length ;i++)
                 if(winList.includes(result.result.players[i].playerId)){
                     var itemNum =0;
                     var itemInfo = '<div>';
                     if(result.result.players[i].playInfo.partyUserCount==0)
                         var count = "Solo";
                     else
                         var count =result.result.players[i].playInfo.partyUserCount+"인";
                     var kda = ((result.result.players[i].playInfo.killCount+result.result.players[i].playInfo.assistCount)/result.result.players[i].playInfo.deathCount).toFixed(1);
                     if(kda == "Infinity")
                         kda = "Perfect!";
                     else
                         kda = "평점 : "+kda;
 
                     for(var j=0; j<16 ;j++){
                         if(j==8)itemInfo +='</div><div>';   
                             try{
                                 if (result.result.players[i].items[itemNum].equipSlotCode == equipment[j]){
                                     itemInfo+='<img src = "https://img-api.neople.co.kr/cy/items/'+result.result.players[i].items[itemNum].itemId+'" class="border border-secondary"  width="34" height="34" data-toggle="tooltip" data-placement="bottom" data-html="true" title="'+result.result.players[i].items[itemNum].itemName+'">';
                                     itemNum += 1;
                                 }
                                 else
                                 itemInfo+='<img src ="/public/attriImg/NA.jpg" class="border border-secondary" width="34" height="34">';
                                 }
                             catch (e){
                                 itemInfo+='<img src ="/public/attriImg/NA.jpg" class="border border-secondary" width="34" height="34">';
                                 continue;}
                             }
                             itemInfo+='</div></td>'
                             total+=(   
                         '<tr class="table-primary"><td class="text-center">'+
                             '<a href="/character/'+result.result.players[i].playInfo.characterName+'"><img src = "public/thumb/'+result.result.players[i].playInfo.characterName+'.jpg"width="38" height="38"></a>'+
                             '<img src = "/public/attriImg/posi/'+result.result.players[i].position.name+'.jpg"  width="38" height="38">'+
                             '<br><img src = "https://img-api.neople.co.kr/cy/position-attributes/'+result.result.players[i].position.attribute[0].id+'"width="30" height="30" data-toggle="tooltip" role="tooltip" data-placement="bottom" data-html="true" title="'+result.result.players[i].position.attribute[0].name+'">'+
                             ' <img src = "https://img-api.neople.co.kr/cy/position-attributes/'+result.result.players[i].position.attribute[1].id+'"  width="30" height="30" data-toggle="tooltip" role="tooltip" data-placement="bottom" data-html="true" title="'+result.result.players[i].position.attribute[1].name+'">'+
                             ' <img src = "https://img-api.neople.co.kr/cy/position-attributes/'+result.result.players[i].position.attribute[2].id+'" width="30" height="30" data-toggle="tooltip" data-placement="bottom" data-html="true" title="'+result.result.players[i].position.attribute[2].name+'">'+
                         '</td><td class="text-center"><a href="/user?userName='+result.result.players[i].nickname+'" style="color: black"><small><strong><span class="d-inline-block text-truncate" style="max-width: 90px;" data-toggle="tooltip" data-placement="bottom" title="'+result.result.players[i].nickname+'">'+result.result.players[i].nickname+'</span></a><br>('+count+ ')'+
                         '</strong></small></td><td class="text-center">'+
                         '<small><strong>Lv.'+result.result.players[i].playInfo.level+'<br>'+result.result.players[i].playInfo.killCount+'/<span style="color:red">'+result.result.players[i].playInfo.deathCount+'</span>/'+result.result.players[i].playInfo.assistCount+'<br>'+kda+
                         '</strong></small></td><td class="text-center">'+itemInfo+'</td></tr>');
                     }
                     total += '<thead><tr class="table-danger"><th class="text-center">패배</th><th class="text-center">유저</th><th class="text-center">KDA</th><th class="text-center">아이템</th></tr><tbody>'
                     for(var i=0; i<result.result.players.length ;i++)
                     if(loseList.includes(result.result.players[i].playerId)){
                         var itemNum =0;
                         var itemInfo = '<div>';
                         if(result.result.players[i].playInfo.partyUserCount==0)
                             var count = "Solo";
                         else
                             var count =result.result.players[i].playInfo.partyUserCount+"인";
                         var kda = ((result.result.players[i].playInfo.killCount+result.result.players[i].playInfo.assistCount)/result.result.players[i].playInfo.deathCount).toFixed(1);
                         if(kda == "Infinity")
                             kda = "Perfect!";
                         else
                             kda = "평점 : "+kda;
                         for(var j=0; j<16 ;j++){
                             if(j==8)itemInfo +='</div><div>';   
                                 try{
                                     if (result.result.players[i].items[itemNum].equipSlotCode == equipment[j]){
                                         itemInfo+='<img src = "https://img-api.neople.co.kr/cy/items/'+result.result.players[i].items[itemNum].itemId+'" class="border border-secondary"  width="34" height="34" data-toggle="tooltip" data-placement="bottom" data-html="true" title="'+result.result.players[i].items[itemNum].itemName+'">';
                                         itemNum += 1;
                                     }
                                     else
                                     itemInfo+='<img src ="/public/attriImg/NA.jpg" class="border border-secondary" width="34" height="34" >';
                                     }
                                 catch (e){
                                     itemInfo+='<img src ="/public/attriImg/NA.jpg" class="border border-secondary" width="34" height="34">';
                                     continue;}
                                 }
                                 itemInfo+='</div></td>'
                                 total+=(   
                                     '<tr class="table-danger"><td class="text-center">'+
                                     '<a href="/character/'+result.result.players[i].playInfo.characterName+'"><img src = "public/thumb/'+result.result.players[i].playInfo.characterName+'.jpg"width="38" height="38"></a>'+
                                     '<img src = "/public/attriImg/posi/'+result.result.players[i].position.name+'.jpg"  width="38" height="38">'+
                                     '<br><img src = "https://img-api.neople.co.kr/cy/position-attributes/'+result.result.players[i].position.attribute[0].id+'"width="30" height="30" data-toggle="tooltip" role="tooltip" data-placement="bottom" data-html="true" title="'+result.result.players[i].position.attribute[0].name+'">'+
                                     ' <img src = "https://img-api.neople.co.kr/cy/position-attributes/'+result.result.players[i].position.attribute[1].id+'"  width="30" height="30" data-toggle="tooltip" role="tooltip" data-placement="bottom" data-html="true" title="'+result.result.players[i].position.attribute[1].name+'">'+
                                     ' <img src = "https://img-api.neople.co.kr/cy/position-attributes/'+result.result.players[i].position.attribute[2].id+'" width="30" height="30" data-toggle="tooltip" data-placement="bottom" data-html="true" title="'+result.result.players[i].position.attribute[2].name+'">'+
                                 '</td><td class="text-center"><a href="/user?userName='+result.result.players[i].nickname+'" style="color: black"><small><strong><span class="d-inline-block text-truncate" style="max-width: 90px;" data-toggle="tooltip" data-placement="bottom" title="'+result.result.players[i].nickname+'">'+result.result.players[i].nickname+'</span></a><br>('+count+ ')'+
                                 '</strong></small></td><td class="text-center">'+
                                 '<small><strong>Lv.'+result.result.players[i].playInfo.level+'<br>'+result.result.players[i].playInfo.killCount+'/<span style="color:red">'+result.result.players[i].playInfo.deathCount+'</span>/'+result.result.players[i].playInfo.assistCount+'<br>'+kda+
                                 '</strong></small></td><td class="text-center">'+itemInfo+'</td></tr>');
                         }
                         total +=('</table></div></li>');
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
    }else if($(this).attr('id')=='btn'){
        $('#'+target+'_'+id+' *').remove();
        $(this).html('Info');
        $('#'+target+'_'+id).attr('src','disable')  
      }
 
    });         
})
