/*
 Navicat Premium Data Transfer

 Source Server         : connection
 Source Server Type    : MySQL
 Source Server Version : 100432 (10.4.32-MariaDB)
 Source Host           : localhost:3306
 Source Schema         : webinar

 Target Server Type    : MySQL
 Target Server Version : 100432 (10.4.32-MariaDB)
 File Encoding         : 65001

 Date: 25/10/2024 05:37:04
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for ban
-- ----------------------------
DROP TABLE IF EXISTS `ban`;
CREATE TABLE `ban`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `webinarId` int NOT NULL,
  `ip` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `device` text CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `broadcastId` int NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `ban_FK`(`webinarId` ASC) USING BTREE,
  INDEX `ban_broadcast_id_fk`(`broadcastId` ASC) USING BTREE,
  CONSTRAINT `ban_FK` FOREIGN KEY (`webinarId`) REFERENCES `webinar` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `ban_broadcast_id_fk` FOREIGN KEY (`broadcastId`) REFERENCES `broadcast` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of ban
-- ----------------------------

-- ----------------------------
-- Table structure for broadcast
-- ----------------------------
DROP TABLE IF EXISTS `broadcast`;
CREATE TABLE `broadcast`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `autowebinarId` int NOT NULL,
  `title` text CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `backgroundIn` text CHARACTER SET utf8 COLLATE utf8_general_ci NULL,
  `backgroundOut` text CHARACTER SET utf8 COLLATE utf8_general_ci NULL,
  `userName` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `userDescription` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `userAvatar` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `userStatus` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `redirectOut` text CHARACTER SET utf8 COLLATE utf8_general_ci NULL,
  `redirectLeave` text CHARACTER SET utf8 COLLATE utf8_general_ci NULL,
  `dateStart` datetime NOT NULL,
  `comment` text CHARACTER SET utf8 COLLATE utf8_general_ci NULL,
  `commentData` text CHARACTER SET utf8 COLLATE utf8_general_ci NULL,
  `url` text CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `source` text CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `banWords` text CHARACTER SET utf8 COLLATE utf8_general_ci NULL,
  `status` tinyint NOT NULL DEFAULT 0,
  `isActive` tinyint NOT NULL DEFAULT 1,
  `buttonEnteringPage` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT 'Войти в комнату',
  `redirectLeaveEnteringPage` text CHARACTER SET utf8 COLLATE utf8_general_ci NULL,
  `additionalLinkEnterRoom` text CHARACTER SET utf8 COLLATE utf8_general_ci NULL,
  `playbackFrequency` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `backgroundImageStandard` text CHARACTER SET utf8 COLLATE utf8_general_ci NULL,
  `backgroundImageDesign` text CHARACTER SET utf8 COLLATE utf8_general_ci NULL,
  `backgroundImageInside` text CHARACTER SET utf8 COLLATE utf8_general_ci NULL,
  `viewersQuantityStart` int NULL DEFAULT NULL,
  `viewersQuantityMiddle` int NULL DEFAULT NULL,
  `viewersQuantityEnd` int NULL DEFAULT NULL,
  `links` text CHARACTER SET utf8 COLLATE utf8_general_ci NULL,
  `blockChatBeforeStart` varchar(1) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT 'N',
  `screensaverPhoto` text CHARACTER SET utf8 COLLATE utf8_general_ci NULL,
  `screensaverAudio` text CHARACTER SET utf8 COLLATE utf8_general_ci NULL,
  `screensaverVideo` text CHARACTER SET utf8 COLLATE utf8_general_ci NULL,
  `addLinkNotificationSound` varchar(1) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT 'N',
  `blockedChat` varchar(1) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `allowChatLinks` varchar(1) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT 'Y',
  `playback` varchar(1) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT 'N',
  `duration` int NULL DEFAULT NULL,
  `dateCreated` datetime NOT NULL DEFAULT current_timestamp ON UPDATE CURRENT_TIMESTAMP,
  `userCount` bigint NOT NULL DEFAULT 0,
  `videoType` int NOT NULL DEFAULT 0 COMMENT '0: uploaded video, 1: RTMP video',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `broadcast_FK`(`autowebinarId` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of broadcast
-- ----------------------------

-- ----------------------------
-- Table structure for chat
-- ----------------------------
DROP TABLE IF EXISTS `chat`;
CREATE TABLE `chat`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `webinarId` int NOT NULL,
  `msg` text CHARACTER SET utf8 COLLATE utf8_general_ci NULL,
  `data` text CHARACTER SET utf8 COLLATE utf8_general_ci NULL,
  `broadcastId` int NULL DEFAULT NULL,
  `status` int NOT NULL DEFAULT 0,
  `deleteTime` text CHARACTER SET utf8 COLLATE utf8_general_ci NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `chat_FK`(`webinarId` ASC) USING BTREE,
  INDEX `chat_broadcast_id_fk`(`broadcastId` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of chat
-- ----------------------------

-- ----------------------------
-- Table structure for chat_links
-- ----------------------------
DROP TABLE IF EXISTS `chat_links`;
CREATE TABLE `chat_links`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `chatId` int NOT NULL,
  `name` text CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `msg` text CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `color` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `chat_links_FK`(`chatId` ASC) USING BTREE,
  CONSTRAINT `chat_links_FK` FOREIGN KEY (`chatId`) REFERENCES `chat` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of chat_links
-- ----------------------------

-- ----------------------------
-- Table structure for event_log
-- ----------------------------
DROP TABLE IF EXISTS `event_log`;
CREATE TABLE `event_log`  (
  `logId` int NOT NULL AUTO_INCREMENT,
  `broadcastId` int NOT NULL,
  `actionType` varchar(20) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL DEFAULT NULL,
  `timeshift` bigint NULL DEFAULT NULL,
  `data` text CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL,
  `username` varchar(100) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL DEFAULT NULL,
  `message` text CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NULL,
  `role` varchar(20) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL DEFAULT NULL,
  `note` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL DEFAULT NULL,
  PRIMARY KEY (`logId`) USING BTREE,
  INDEX `broadcast_id`(`broadcastId` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8 COLLATE = utf8_unicode_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of event_log
-- ----------------------------

-- ----------------------------
-- Table structure for ghoste
-- ----------------------------
DROP TABLE IF EXISTS `ghoste`;
CREATE TABLE `ghoste`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `webinarId` int NOT NULL,
  `name` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `translationId` text CHARACTER SET utf8 COLLATE utf8_general_ci NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `ghostes_FK`(`webinarId` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of ghoste
-- ----------------------------

-- ----------------------------
-- Table structure for ignore
-- ----------------------------
DROP TABLE IF EXISTS `ignore`;
CREATE TABLE `ignore`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `webinarId` int NULL DEFAULT NULL,
  `ip` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `device` text CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `broadcastId` int NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `ingore_FK`(`webinarId` ASC) USING BTREE,
  CONSTRAINT `ingore_FK` FOREIGN KEY (`webinarId`) REFERENCES `webinar` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of ignore
-- ----------------------------

-- ----------------------------
-- Table structure for moderate
-- ----------------------------
DROP TABLE IF EXISTS `moderate`;
CREATE TABLE `moderate`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `webinarId` int NULL DEFAULT NULL,
  `broadcastId` int NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of moderate
-- ----------------------------

-- ----------------------------
-- Table structure for other_user
-- ----------------------------
DROP TABLE IF EXISTS `other_user`;
CREATE TABLE `other_user`  (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL DEFAULT NULL,
  `email` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL DEFAULT NULL,
  `phone` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8 COLLATE = utf8_unicode_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of other_user
-- ----------------------------

-- ----------------------------
-- Table structure for webinar
-- ----------------------------
DROP TABLE IF EXISTS `webinar`;
CREATE TABLE `webinar`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `title` text CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `backgroundIn` text CHARACTER SET utf8 COLLATE utf8_general_ci NULL,
  `backgroundOut` text CHARACTER SET utf8 COLLATE utf8_general_ci NULL,
  `userName` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `userDescription` longtext CHARACTER SET utf8 COLLATE utf8_general_ci NULL,
  `userAvatar` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `userStatus` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `redirectOut` text CHARACTER SET utf8 COLLATE utf8_general_ci NULL,
  `redirectLeave` text CHARACTER SET utf8 COLLATE utf8_general_ci NULL,
  `dateStart` datetime NOT NULL,
  `comment` text CHARACTER SET utf8 COLLATE utf8_general_ci NULL,
  `commentData` text CHARACTER SET utf8 COLLATE utf8_general_ci NULL,
  `url` text CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `source` text CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `banWords` text CHARACTER SET utf8 COLLATE utf8_general_ci NULL,
  `isActive` tinyint NOT NULL DEFAULT 1,
  `status` tinyint NOT NULL DEFAULT 0,
  `buttonEnteringPage` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT 'Войти в комнату',
  `redirectLeaveEnteringPage` text CHARACTER SET utf8 COLLATE utf8_general_ci NULL,
  `additionalLinkEnterRoom` text CHARACTER SET utf8 COLLATE utf8_general_ci NULL,
  `playbackFrequency` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `backgroundImageStandard` text CHARACTER SET utf8 COLLATE utf8_general_ci NULL,
  `backgroundImageDesign` text CHARACTER SET utf8 COLLATE utf8_general_ci NULL,
  `backgroundImageInside` text CHARACTER SET utf8 COLLATE utf8_general_ci NULL,
  `viewersQuantityStart` int NULL DEFAULT NULL,
  `viewersQuantityMiddle` int NULL DEFAULT NULL,
  `viewersQuantityEnd` int NULL DEFAULT NULL,
  `links` text CHARACTER SET utf8 COLLATE utf8_general_ci NULL,
  `blockChatBeforeStart` varchar(1) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT 'N',
  `screensaverPhoto` text CHARACTER SET utf8 COLLATE utf8_general_ci NULL,
  `screensaverAudio` text CHARACTER SET utf8 COLLATE utf8_general_ci NULL,
  `screensaverVideo` text CHARACTER SET utf8 COLLATE utf8_general_ci NULL,
  `addLinkNotificationSound` varchar(1) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT 'N',
  `blockedChat` varchar(1) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `allowChatLinks` varchar(1) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT 'Y',
  `playback` varchar(1) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT 'N',
  `autowebinarId` tinyint(1) NOT NULL DEFAULT 0,
  `duration` int NULL DEFAULT NULL,
  `lastTimeViewer` timestamp NULL DEFAULT NULL,
  `dateCreated` datetime NOT NULL DEFAULT current_timestamp ON UPDATE CURRENT_TIMESTAMP,
  `userCount` bigint NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of webinar
-- ----------------------------

SET FOREIGN_KEY_CHECKS = 1;
