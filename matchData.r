library(tidyverse)
library(stringr)
library(arules)
library(data.table)
library(dplyr)
library(MASS)
library(fBasics)
##추가 필요 날짜별 승률변화
setwd("C:/Users/KTH/Desktop/github/example")

matchInfo <- read.csv("matchInfo.csv")
matchData <- read.csv("matchData.csv")
winMatch <- matchInfo[matchInfo$Match == "win",] #승리한 매치만 보관
loseMatch <- matchInfo[matchInfo$Match == "lose",] #패배한 매치만 보관

####이미 작성한 경기들 기록(생략용)##
setwd("C:/Users/KTH/Desktop/github")
matchIdBackup <- read.csv("matchIdBackup.csv")
matchId <- read.csv("matchId.csv")
matchIdBackup <- rbind(matchIdBackup,matchId)
matchIdBackup<- unique(matchIdBackup)
write.csv(matchIdBackup,"matchIdBackup.csv", row.names=FALSE)
write.table(t(matchIdBackup),"prevMatch.csv", sep=",", row.names=FALSE, col.names=FALSE, quote=FALSE)

matchCount <-winMatch%>%group_by(Match.ID)%>%summarise(pick=n())
nrow(matchCount)#판수
matchCount[[2]][3]

######맵 별 승률계산#########
setwd("C:/Users/KTH/Desktop/github/example/map")
for (i in list("리버포드","메트로폴리스","브리스톨","스프링필드","그랑플람 아시아 지부")){
  mapInfo <- matchInfo[matchInfo$Map == i,]
  mapRate <- data.frame()
  for (j in list("탱커","서포터","근거리딜러","원거리딜러")){
    position_Map<- mapInfo[mapInfo$Position == j,] 
    pickRate <- position_Map%>%group_by(Character.Id)%>%summarise(pick=n(),meanKill=mean(Kill),meanDeath=mean(Death),meanAssist=mean(Assist))
    winRate <- position_Map[position_Map$Match =="win",]%>%group_by(Character.Id)%>%summarise(win=n())
    
    CharRate <- merge(pickRate,winRate,by='Character.Id')
    CharRate$pickRate = CharRate$pick/nrow(mapInfo)
    CharRate$winRate = CharRate$win/CharRate$pick
    CharRate$meanKDA = (CharRate$meanKill+CharRate$meanAssist)/CharRate$meanAssist
    CharRate<-CharRate[order(-CharRate$pick),]
    CharRate <- CharRate[,c(1,2,6,7,8,3,4,5,9)]
    CharRate$position <- j
    mapRate <- rbind(mapRate,CharRate)
  }
  mapRate<-mapRate[order(-mapRate$pick),]
  Save <- paste0(i,".csv")
  write.csv(mapRate,Save,row.names =FALSE)
}

########통합승률계산##########
pickRate <- matchInfo%>%group_by(Character.Id)%>%summarise(pick=n(),meanKill=mean(Kill),meanDeath=mean(Death),meanAssist=mean(Assist))
winRate <- matchInfo[matchInfo$Match =="win",]%>%group_by(Character.Id)%>%summarise(win=n())
CharRate <- merge(pickRate,winRate,by='Character.Id')
CharRate$pickRate = CharRate$pick/nrow(matchCount)
CharRate$winRate = CharRate$win/CharRate$pick
CharRate$meanKDA = (CharRate$meanKill+CharRate$meanAssist)/CharRate$meanAssist
CharRate <- CharRate[,c(1,2,6,7,8,3,4,5,9)]
CharRate<-CharRate[order(-CharRate$pick),]
setwd("C:/Users/KTH/Desktop/github/example/position")
write.csv(CharRate,"Total.csv",row.names =FALSE)

########포지션별 승률계산##########
setwd("C:/Users/KTH/Desktop/github/example/position")
positionData <- data.frame()
for (i in list("탱커","서포터","근거리딜러","원거리딜러")){
  positionInfo<- matchInfo[matchInfo$Position == i,] 
  pickRate <- positionInfo%>%group_by(Character.Id)%>%summarise(pick=n(),meanKill=mean(Kill),meanDeath=mean(Death),meanAssist=mean(Assist))
  winRate <- positionInfo[positionInfo$Match =="win",]%>%group_by(Character.Id)%>%summarise(win=n())
  CharRate <- merge(pickRate,winRate,by='Character.Id')
  CharRate$pickRate = (CharRate$pick/nrow(matchCount))
  CharRate$winRate = (CharRate$win/CharRate$pick)
  # CharRate <- CharRate[CharRate$pickRate >=0.1,]
  CharRate$meanKDA = (CharRate$meanKill+CharRate$meanAssist)/CharRate$meanAssist
  CharRate <- CharRate[order(-CharRate$pick),]
  CharRate <- CharRate[,c(1,2,6,7,8,3,4,5,9)]
  Save <- paste0(positionInfo$Position[1],".csv")
  write.csv(CharRate,Save,row.names =FALSE)
  CharRate$position <-i
  positionData <- rbind(positionData,CharRate)
}
positionData<-positionData[order(-positionData$pick),]
write.csv(positionData,"positionInfo.csv",row.names =FALSE)
##########################

#######승리조합##########
setwd("C:/Users/KTH/Desktop/github/example")
winCombi<-(table(cbind(winMatch[4],winMatch[17])))
write.csv(winCombi,"winCombi.csv")
winCombi <- read.csv("winCombi.csv",check.names=FALSE,sep = ",")
winCombi <- (data.frame(table(winCombi[-1])))
names(winCombi)[5] <-c("winGame")
#######패배조합##########
loseCombi<-(table(cbind(loseMatch[4],loseMatch[17])))
write.csv(loseCombi,"loseCombi.csv")
loseCombi <- read.csv("loseCombi.csv",check.names=FALSE,sep = ",")
loseCombi <- (data.frame(table(loseCombi[-1])))
names(loseCombi)[5] <-c("loseGame")
#######조합총합##########
combination <- (merge(winCombi,loseCombi,all=T))
combination <- data.frame(combination)
combination$total <- (combination$winGame+combination$loseGame)
combination$ratio <- combination$total/sum(combination$total)
combination$winratio <- (combination$winGame)/combination$total
combination <- combination[combination$total>10,]
combination <-combination[order(-combination$total),]
combination <-head(combination,n=5)
write.csv(combination,"combination.csv",row.names =FALSE)
#########################


##########템트리 찾기(이긴 경기 기준)###########
setwd("C:/Users/KTH/Desktop/github/example/build")
CharRate <- matchInfo%>%group_by(Character.Id)%>%summarise(pick=n()) #matchInfo 
for (k in list("탱커","서포터","근거리딜러","원거리딜러")){
  positionInfo<- matchInfo[matchInfo$Position == k,]
  positionWin <- winMatch[winMatch$Position == k,]
  for (i in 1:nrow(CharRate)){
    charTmp<-positionInfo[positionInfo$Character.Id ==CharRate[[1]][i],]
    charWin <- positionWin[positionWin$Character.Id ==CharRate[[1]][i],]
    if (nrow(charTmp)<(nrow(matchCount)*0.05)) next ##픽률 5%미만은 pass
    itemlist<- data.frame(c(1:5))
    tmp<-charTmp[7:36] 
    tmp<-data.frame(table(tmp[12:14]))
    winTmp <- charWin[7:36]
    winTmp<-data.frame(table(winTmp[12:14]))
    tmp <-cbind(tmp,winTmp)
    tmp <-cbind(tmp[1:4],tmp[8])
    tmp[5] <- tmp[5]/tmp[4]
    tmp[4] <- tmp[4]/sum(tmp[4])
    names(tmp)[4:5] <-c("픽률","승률")
    tmp <- tmp[tmp[4]>0,]
    tmp <- head(tmp[order(-tmp[4]),],n=5)
    if(nrow(tmp)<5)
    {
      for(l in nrow(tmp)+1:(5-nrow(tmp)))
        tmp <- rbind(tmp,c("NA","NA","NA","0","0"))
    }
    itemlist <- cbind(itemlist,tmp)
    for (j in 21:36){ #장비
      tmp <- data.frame(table(charTmp[j]))
      winTmp<- data.frame(table(charWin[j]))
      tmp <-cbind(tmp,winTmp)
      tmp <-cbind(tmp[1:2],tmp[4])
      tmp[3] <- tmp[3]/tmp[2]
      tmp[2]<- tmp[2]/sum(tmp[2])
      tmp <- tmp[tmp$Freq>0,]
      tmp <- head(tmp[order(-tmp[2]),],n=5)
      if(nrow(tmp)<5)
      {
        for(l in nrow(tmp)+1:(5-nrow(tmp)))
          tmp <- rbind(tmp,c("NA","0","0"))
      }
      names(tmp) <-c(colnames(charTmp[j]),"픽률","승률")
      itemlist <- cbind(itemlist,tmp)
    }
    Save <- paste0(CharRate[[1]][i],"_",k,".csv")
    write.csv(itemlist,Save,row.names =FALSE)
  }
}
############################################
