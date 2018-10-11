-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema kurisu-new
-- -----------------------------------------------------
DROP SCHEMA IF EXISTS `kurisu-new` ;

-- -----------------------------------------------------
-- Schema kurisu-new
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `kurisu-new` DEFAULT CHARACTER SET utf8 ;
USE `kurisu-new` ;

-- -----------------------------------------------------
-- Table `kurisu-new`.`User`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `kurisu-new`.`User` ;

CREATE TABLE IF NOT EXISTS `kurisu-new`.`User` (
  `ID` INT UNSIGNED NOT NULL,
  `Username` VARCHAR(45) NULL,
  `Discriminator` VARCHAR(45) NULL,
  PRIMARY KEY (`ID`));


-- -----------------------------------------------------
-- Table `kurisu-new`.`UserLevel`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `kurisu-new`.`UserLevel` ;

CREATE TABLE IF NOT EXISTS `kurisu-new`.`UserLevel` (
  `UserID` INT UNSIGNED NOT NULL,
  `TotalExp` INT UNSIGNED NULL,
  `Level` INT UNSIGNED NULL,
  PRIMARY KEY (`UserID`),
  CONSTRAINT `FK_UserLevel_UserID`
    FOREIGN KEY (`UserID`)
    REFERENCES `kurisu-new`.`User` (`ID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);


-- -----------------------------------------------------
-- Table `kurisu-new`.`Guild`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `kurisu-new`.`Guild` ;

CREATE TABLE IF NOT EXISTS `kurisu-new`.`Guild` (
  `ID` INT UNSIGNED NOT NULL,
  PRIMARY KEY (`ID`));


-- -----------------------------------------------------
-- Table `kurisu-new`.`GuildUserScore`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `kurisu-new`.`GuildUserScore` ;

CREATE TABLE IF NOT EXISTS `kurisu-new`.`GuildUserScore` (
  `GuildID` INT UNSIGNED NOT NULL,
  `UserID` INT UNSIGNED NOT NULL,
  `Score` INT UNSIGNED NULL,
  PRIMARY KEY (`GuildID`, `UserID`),
  CONSTRAINT `fk_GuildUserScore_GuildID`
    FOREIGN KEY (`GuildID`)
    REFERENCES `kurisu-new`.`Guild` (`ID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

USE `kurisu-new` ;

-- -----------------------------------------------------
-- procedure getUserLevel
-- -----------------------------------------------------

USE `kurisu-new`;
DROP procedure IF EXISTS `kurisu-new`.`getUserLevel`;

DELIMITER $$
USE `kurisu-new`$$
CREATE PROCEDURE `getUserLevel` (IN $ID INT)
BEGIN
	select *
    from UserLevel
    where UserID = $ID;
END$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure getUser
-- -----------------------------------------------------

USE `kurisu-new`;
DROP procedure IF EXISTS `kurisu-new`.`getUser`;

DELIMITER $$
USE `kurisu-new`$$
CREATE PROCEDURE `getUser` ()
BEGIN

END$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure getTopUserLevel
-- -----------------------------------------------------

USE `kurisu-new`;
DROP procedure IF EXISTS `kurisu-new`.`getTopUserLevel`;

DELIMITER $$
USE `kurisu-new`$$
CREATE PROCEDURE `getTopUserLevel` (IN $MAX INT)
BEGIN
	select * from UserLevel order by UserLevel.TotalExp desc limit $MAX;
END$$

DELIMITER ;

SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
