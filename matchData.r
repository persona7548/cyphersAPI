library(recommenderlab)
library(tidyverse)
library(stringr)
library(arules)
library(data.table)
library(dplyr)
library(MASS)
library(fBasics)
library(RColorBrewer)
library(wordcloud)
library(nnet)
setwd("C:/Users/KTH/Desktop/github/example")

matchInfo <- read.csv("matchInfo.csv")
matchData <- read.csv("matchData.csv")

winInfo <- matchInfo[matchInfo$Match == "win",] #승리한 매치만 보관
loseInfo <- matchInfo[matchInfo$Match == "lose",] #패배한 매치만 보관

matchId <- read.csv("matchId.csv")
nrow(matchId)
matchId<- unique(matchId)

setwd("C:/Users/KTH/Desktop/github")
matchIdBackup <- read.csv("matchIdBackup.csv")
matchId <- read.csv("matchId.csv")
matchIdBackup <- rbind(matchIdBackup,matchId)
matchIdBackup<- unique(matchIdBackup)
write.csv(matchIdBackup,"matchIdBackup.csv", row.names=FALSE)
write.table(t(matchIdBackup),"prevMatch.csv", sep=",", row.names=FALSE, col.names=FALSE, quote=FALSE)

matchCount <-winInfo%>%group_by(Match.ID)%>%summarise(pick=n())
nrow(matchCount)#판수

######맵 별 승률계산#########
setwd("C:/Users/KTH/Desktop/github/example/map")
for (i in 1:5){
  mapInfo <- matchInfo[matchInfo$Map == MapCount[[1]][i],]
  mapRate <- data.frame()
  for (j in list("탱커","서포터","근거리딜러","원거리딜러")){
    position_Map<- mapInfo[mapInfo$Position == j,] 
    pickRate <- position_Map%>%group_by(Character.Id)%>%summarise(pick=n(),meanKill=mean(Kill),meanDeath=mean(Death),meanAssist=mean(Assist))
    winRate <- position_Map[position_Map$Match =="win",]%>%group_by(Character.Id)%>%summarise(win=n())
    
    CharRate <- merge(pickRate,winRate,by='Character.Id')
    CharRate$pickRate = CharRate$pick/MapCount[[2]][i]
    CharRate$winRate = CharRate$win/CharRate$pick
    CharRate$meanKDA = (CharRate$meanKill+CharRate$meanAssist)/CharRate$meanAssist
    CharRate<-CharRate[order(-CharRate$pick),]
    CharRate <- CharRate[,c(1,2,6,7,8,3,4,5,9)]
    CharRate$position <- j
    mapRate <- rbind(mapRate,CharRate)
  }
  mapRate<-mapRate[order(-mapRate$pick),]
  Save <- paste0(MapCount[[1]][i],".csv")
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
##########################

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
winCombi<-(table(cbind(winInfo[4],winInfo[17])))
write.csv(winCombi,"winCombi.csv")
winCombi <- read.csv("winCombi.csv",check.names=FALSE,sep = ",")
winCombi <- (data.frame(table(winCombi[-1])))
names(winCombi)[5] <-c("winGame")
#######패배조합##########
loseCombi<-(table(cbind(loseInfo[4],loseInfo[17])))
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
  positionWin <- winInfo[winInfo$Position == k,]
  for (i in 1:nrow(CharRate)){
    charTmp<-positionInfo[positionInfo$Character.Id ==CharRate[[1]][i],]
    #charWin <- positionWin[positionWin$Character.Id ==CharRate[[1]][5],]
    if (nrow(charTmp)<(nrow(matchCount)*0.05)) next
    nrow(charTmp)
    tmp<-charTmp[7:36] 
    itemlist<- data.frame(c(1:5))
    tmp<-table(tmp[12:14])
    tmp <- data.frame(tmp)
    tmp <- tmp[tmp$Freq>0,]
    tmp$Freq <- tmp$Freq/sum(tmp$Freq)
    tmp <- tmp[order(-tmp[4]),]
    names(tmp)[4] <-c("픽률")
    tmp <-head(tmp,n=5)
    if(nrow(tmp)<5)
    {
      for(j in nrow(tmp)+1:(5-nrow(tmp)))
        tmp <- rbind(tmp,c("NA","NA","NA","NA"))
    }
    itemlist <- cbind(itemlist,tmp)
    for (j in 21:36){ #장비
      tmp <- table(charTmp[j])
      tmp <- data.frame(tmp)
      tmp <- tmp[tmp$Freq>0,]
      tmp[2]<- tmp$Freq/sum(tmp$Freq)
      tmp <- tmp[order(-tmp$Freq),]
      tmp <-head(tmp,n=5)
      if(nrow(tmp)<5)
      {
        for(j in nrow(tmp)+1:(5-nrow(tmp)))
          tmp <- rbind(tmp,c("NA","NA"))
      }
      names(tmp)[1] <-c(colnames(charTmp[j]))
      names(tmp)[2] <-c("픽률")
      itemlist <- cbind(itemlist,tmp)
    }
    Save <- paste0(CharRate[[1]][i],"_",k,".csv")
    write.csv(itemlist,Save,row.names =FALSE)
  }
}
############################################




#########듀오찾기(짜는중)############
setwd("C:/Users/KTH/Desktop/github/example")
colnames(TankWin)
corlist <- cbind(TankWin[4],TankWin[7])
view(with(corlist,tapply(corlist$Match.ID,corlist$Character.Id)))
corlist<-table(corlist)
view(corlist)
write.csv(corlist,"UserTable.csv")
corlist <- read.csv("UserTable.csv",check.names=FALSE,sep = ",")
view(corlist)
corlist <- cor(corlist[-1],method = "pearson") 
write.csv(corlist,"corlist.csv")
##########################
#http://cyphers.nexon.com/cyphers/article/guide/topic/27409425


