CREATE TABLE `build`
(
    `character`    CHAR(20) NOT NULL
 COMMENT 'character',
    `position`    CHAR(20) NOT NULL
 COMMENT 'position',
    `rank`    INTEGER NOT NULL
 COMMENT 'rank',
    `attributeLv1`    CHAR(20) NOT NULL
 COMMENT 'attributeLv1',
    `attributeLv2`    CHAR(20) NOT NULL
 COMMENT 'attributeLv2',
    `attributeLv3`    CHAR(20) NOT NULL
 COMMENT 'attributeLv3',
    `attriPick`    FLOAT NOT NULL
 COMMENT 'attriPick',
    `attriWin`    FLOAT NOT NULL
 COMMENT 'attriWin',
    `hand`    CHAR(20) NOT NULL
 COMMENT 'hand',
    `handPick`    FLOAT NOT NULL
 COMMENT 'handPick',
    `handWin`    FLOAT NOT NULL
 COMMENT 'handWin',
    `head`    CHAR(20) NOT NULL
 COMMENT 'head',
    `headPick`    FLOAT NOT NULL
 COMMENT 'headPick',
    `headWin`    FLOAT NOT NULL
 COMMENT 'headWin',
    `chest`    CHAR(20) NOT NULL
 COMMENT 'chest',
    `chestPick`    FLOAT NOT NULL
 COMMENT 'chestPick',
    `chestWin`    FLOAT NOT NULL
 COMMENT 'chestWin',
    `waist`    CHAR(20) NOT NULL
 COMMENT 'waist',
    `waistPick`    FLOAT NOT NULL
 COMMENT 'waistPick',
    `waistWin`    FLOAT NOT NULL
 COMMENT 'waistWin',
    `leg`    CHAR(20) NOT NULL
 COMMENT 'leg',
    `legPick`    FLOAT NOT NULL
 COMMENT 'legPick',
    `legWin`    FLOAT NOT NULL
 COMMENT 'legWin',
    `arti1`    CHAR(20) NOT NULL
 COMMENT 'arti1',
    `arti1Pick`    FLOAT NOT NULL
 COMMENT 'arti1Pick',
    `arti1Win`    FLOAT NOT NULL
 COMMENT 'arti1Win',
    `arit2`    CHAR(20) NOT NULL
 COMMENT 'arit2',
    `arti2Pick`    FLOAT NOT NULL
 COMMENT 'arti2Pick',
    `arti2Win`    FLOAT NOT NULL
 COMMENT 'arti2Win',
    `heal`    CHAR(20) NOT NULL
 COMMENT 'heal',
    `healPick`    FLOAT NOT NULL
 COMMENT 'healPick',
    `healWin`    FLOAT NOT NULL
 COMMENT 'healWin',
    `speed`    CHAR(20) NOT NULL
 COMMENT 'speed',
    `speedPick`    FLOAT NOT NULL
 COMMENT 'speedPick',
    `speedWin`    FLOAT NOT NULL
 COMMENT 'speedWin',
    `attack`    CHAR(20) NOT NULL
 COMMENT 'attack',
    `attackPick`    FLOAT NOT NULL
 COMMENT 'attackPick',
    `attackWin`    FLOAT NOT NULL
 COMMENT 'attackWin',
    `defense`    CHAR(20) NOT NULL
 COMMENT 'defense',
    `defensePick`    FLOAT NOT NULL
 COMMENT 'defensePick',
    `defenseWin`    FLOAT NOT NULL
 COMMENT 'defenseWin',
    `special`    CHAR(20) NOT NULL
 COMMENT 'special',
    `specialPick`    FLOAT NOT NULL
 COMMENT 'specialPick',
    `specialWin`    FLOAT NOT NULL
 COMMENT 'specialWin',
    `neck`    CHAR(20) NOT NULL
 COMMENT 'neck',
    `neckPick`    FLOAT NOT NULL
 COMMENT 'neckPick',
    `neckWin`    FLOAT NOT NULL
 COMMENT 'neckWin',
    `arti3`    CHAR(20) NOT NULL
 COMMENT 'arti3',
    `arti3Pick`    FLOAT NOT NULL
 COMMENT 'arti3Pick',
    `arti3Win`    FLOAT NOT NULL
 COMMENT 'arti3Win',
    `arti4`    CHAR(20) NOT NULL
 COMMENT 'arti4',
    `arti4Pick`    FLOAT NOT NULL
 COMMENT 'arti4Pick',
    `arti4Win`    FLOAT NOT NULL
 COMMENT 'arti4Win',
    `shoe`    CHAR(20) NOT NULL
 COMMENT 'shoe',
    `shoePick`    FLOAT NOT NULL
 COMMENT 'shoePick',
    `shoeWin`    FLOAT NOT NULL
 COMMENT 'shoeWin'
)
 COMMENT = 'build';


CREATE TABLE `positionInfo`
(
    `character`    CHAR(20) NOT NULL
 COMMENT 'character',
    `pick`    INTEGER NOT NULL
 COMMENT 'pick',
    `win`    INTEGER NOT NULL
 COMMENT 'win',
    `pickRate`    FLOAT NOT NULL
 COMMENT 'pickRate',
    `winRate`    FLOAT NOT NULL
 COMMENT 'winRate',
    `meanKDA`    FLOAT NOT NULL
 COMMENT 'meanKDA',
    `meanKill`    FLOAT NOT NULL
 COMMENT 'meanKill',
    `meanDeath`    FLOAT NOT NULL
 COMMENT 'meanDeath',
    `meanAssist`    FLOAT NOT NULL
 COMMENT 'meanAssist',
    `meanLevel`    FLOAT NOT NULL
 COMMENT 'meanLevel',
    `meanAttackPoint`    FLOAT NOT NULL
 COMMENT 'meanAttackPoint',
    `meanDamagePoint`    FLOAT NOT NULL
 COMMENT 'meanDamagePoint',
    `meanBattlePoint`    FLOAT NOT NULL
 COMMENT 'meanBattlePoint',
    `meanSightPoint`    FLOAT NOT NULL
 COMMENT 'meanSightPoint',
    `meanPlayTime`    FLOAT NOT NULL
 COMMENT 'meanPlayTime',
    `position`    CHAR(20) NOT NULL
 COMMENT 'position'
)
 COMMENT = 'positionInfo';