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
matchInfo<- unique(matchInfo)
winInfo <- matchInfo[matchInfo$Match == "win",] #승리한 매치만 보관
loseInfo <- matchInfo[matchInfo$Match == "lose",] #패배한 매치만 보관

Tank<- matchInfo[matchInfo$Position == "탱커",] 
Support <-matchInfo[matchInfo$Position == "서포터",] 
Melee <- matchInfo[matchInfo$Position == "근거리딜러",] 
Ranged <- matchInfo[matchInfo$Position == "원거리딜러",] 



colnames(winInfo)

matchCount <-matchInfo%>%group_by(Match.ID)%>%summarise(pick=n())
nrow(matchCount)#판수
########승률계산##########
pickRate <- matchInfo%>%group_by(Character.Id)%>%summarise(pick=n(),meanKill=mean(Kill),meanDeath=mean(Death),meanAssist=mean(Assist))
winRate <- matchInfo[matchInfo$Match =="win",]%>%group_by(Character.Id)%>%summarise(win=n())

CharRate <- merge(pickRate,winRate,by='Character.Id')
CharRate$pickRate = CharRate$pick/nrow(matchCount)
CharRate$winRate = CharRate$win/CharRate$pick
CharRate$meanKDA = (CharRate$meanKill+CharRate$meanAssist)/CharRate$meanAssist
CharRate<-CharRate[order(-CharRate$pick),]
CharRate<-CharRate[CharRate$pickRate>0.1,]
viewRate <- cbind(CharRate[1],CharRate[7:9])
view(viewRate)


##########################

########근딜승률계산##########
pickRate <- Melee%>%group_by(Character.Id)%>%summarise(pick=n())#,meanKill=mean(Kill),meanDeath=mean(Death),meanAssist=mean(Assist))
winRate <- Melee[Melee$Match =="win",]%>%group_by(Character.Id)%>%summarise(win=n())

CharRate <- merge(pickRate,winRate,by='Character.Id')
CharRate$pickRate = (CharRate$pick/nrow(matchCount))*100
CharRate$winRate = (CharRate$win/CharRate$pick)*100
CharRate <- CharRate[CharRate$pickRate >=0.1,]
#CharRate$meanKDA = (CharRate$meanKill+CharRate$meanAssist)/CharRate$meanAssist
view(CharRate[order(-CharRate$pick),])
CharRate <- CharRate[order(-CharRate$pick),]
view(CharRate[order(-CharRate$pick),])
tmp <-as.data.frame(t(CharRate[2:5]))
names(tmp) <-c(t(CharRate[1]))
barplot(as.matrix(tmp[1,]),main = "근거리 딜러 선호도")
##########################

########원딜승률계산##########
pickRate <- Ranged%>%group_by(Character.Id)%>%summarise(pick=n())#,meanKill=mean(Kill),meanDeath=mean(Death),meanAssist=mean(Assist))
winRate <- Ranged[Ranged$Match =="win",]%>%group_by(Character.Id)%>%summarise(win=n())

CharRate <- merge(pickRate,winRate,by='Character.Id')
CharRate$pickRate = (CharRate$pick/nrow(matchCount))*100
CharRate$winRate = (CharRate$win/CharRate$pick)*100
CharRate <- CharRate[CharRate$pickRate >=0.1,]
#CharRate$meanKDA = (CharRate$meanKill+CharRate$meanAssist)/CharRate$meanAssist
CharRate <- CharRate[order(-CharRate$pick),]
view(CharRate[order(-CharRate$pick),])
tmp <-as.data.frame(t(CharRate[2:5]))
names(tmp) <-c(t(CharRate[1]))
barplot(as.matrix(tmp[1,]),main = "원거리 딜러 선호도")
##########################

########서폿승률계산##########
pickRate <- Support%>%group_by(Character.Id)%>%summarise(pick=n())#,meanKill=mean(Kill),meanDeath=mean(Death),meanAssist=mean(Assist))
winRate <- Support[Support$Match =="win",]%>%group_by(Character.Id)%>%summarise(win=n())

CharRate <- merge(pickRate,winRate,by='Character.Id')
CharRate$pickRate = (CharRate$pick/nrow(matchCount))*100
CharRate$winRate = (CharRate$win/CharRate$pick)*100
#CharRate$meanKDA = (CharRate$meanKill+CharRate$meanAssist)/CharRate$meanAssist
view(CharRate[order(-CharRate$pick),])
##########################

########탱커승률계산##########
pickRate <- Tank%>%group_by(Character.Id)%>%summarise(pick=n())#,meanKill=mean(Kill),meanDeath=mean(Death),meanAssist=mean(Assist))
winRate <- Tank[Tank$Match =="win",]%>%group_by(Character.Id)%>%summarise(win=n())
CharRate <- merge(pickRate,winRate,by='Character.Id')
CharRate$pickRate = (CharRate$pick/nrow(matchCount))*100
CharRate$winRate = (CharRate$win/CharRate$pick)*100
CharRate <- CharRate[CharRate$pickRate >=0.1,]
CharRate <- CharRate[order(-CharRate$pick),]
view(CharRate)
#CharRate$meanKDA = (CharRate$meanKill+CharRate$meanAssist)/CharRate$meanAssist

tmp <-as.data.frame(t(CharRate[2:5]))
names(tmp) <-c(t(CharRate[1]))
view(tmp[1:2,])
barplot(as.matrix(tmp[1,]),main = "탱커 선호도")
##########################




#######승리조합##########
winCombi<-(table(cbind(winInfo[3],winInfo[16])))
write.csv(winCombi,"winCombi.csv")
winCombi <- read.csv("winCombi.csv",check.names=FALSE,sep = ",")
winCombi <- (data.frame(table(winCombi[-1])))
names(winCombi)[5] <-c("winGame")

#######패배조합##########
loseCombi<-(table(cbind(loseInfo[3],loseInfo[16])))
write.csv(loseCombi,"loseCombi.csv")
loseCombi <- read.csv("loseCombi.csv",check.names=FALSE,sep = ",")
loseCombi <- (data.frame(table(loseCombi[-1])))
names(loseCombi)[5] <-c("loseGame")

#######조합총합##########
combination <- (merge(winCombi,loseCombi,all=T))
combination <- data.frame(combination)
combination$total <- (combination$winGame+combination$loseGame)
combination <- combination[combination$total>10,]
combination$ratio <- (combination$winGame+combination$loseGame)/(nrow(matchCount)*2)
view(combination[order(-combination$total),])

#########################




##########템트리 찾기(이긴 경기 기준)###########
view(CharRate[[1]]) #사이퍼 이름 리스트(뒤 숫자에 따라 바뀜)  
colnames(list)
list<-matchInfo[matchInfo$Character.Id ==CharRate[[1]][65],]
list<-list[6:35] 
colnames(list)
position <- table(list[11])
position <- data.frame(position)
position <- position[position$Freq>0,]
view(position[order(-position$Freq),])

attribute<-table(list[11:14])#특성123
attribute <- data.frame(attribute)
attribute <- attribute[attribute$Freq>5,]
view(attribute[order(-attribute$Freq),])
############################################




#########듀오찾기(짜는중)############
colnames(winInfo)
corlist <- cbind(winInfo[3],winInfo[6])
corlist<-table(corlist)
write.csv(corlist,"UserTable.csv")
corlist <- read.csv("UserTable.csv",check.names=FALSE,sep = ",")
corlist <- cor(corlist[-1],method = "pearson") 
write.csv(corlist,"corlist.csv")
##########################
