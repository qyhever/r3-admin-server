-- MySQL dump 10.13  Distrib 8.0.31, for macos12 (arm64)
--
-- Host: localhost    Database: r3
-- ------------------------------------------------------
-- Server version	8.0.31

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `resource`
--

DROP TABLE IF EXISTS `resource`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `resource` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'Unique identifier',
  `code` varchar(50) NOT NULL COMMENT '权限码',
  `name` varchar(50) NOT NULL COMMENT '权限名',
  `type` varchar(1) NOT NULL COMMENT '权限类型 1目录/2资源',
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `parentCode` varchar(60) NOT NULL COMMENT '父级',
  `isDeleted` tinyint NOT NULL DEFAULT '0' COMMENT '是否删除',
  `isEnabled` tinyint NOT NULL DEFAULT '1' COMMENT '启用/禁用',
  `isSystemDefault` tinyint NOT NULL DEFAULT '0' COMMENT '系统默认',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `resource`
--

LOCK TABLES `resource` WRITE;
/*!40000 ALTER TABLE `resource` DISABLE KEYS */;
INSERT INTO `resource` VALUES (1,'home1','首页1','2','2025-05-03 13:37:24','2025-08-30 13:56:33','',0,1,1),(2,'root','后台管理系统','2','2025-05-05 07:14:29','2025-06-29 05:29:43','',0,1,1),(3,'component','组件','1','2025-05-05 07:14:29','2025-08-15 15:37:25','',0,1,1),(4,'clipboard','复制','2','2025-05-05 07:14:29','2025-08-15 15:38:59','component',0,1,1),(5,'qrcode','二维码','2','2025-05-05 07:14:29','2025-09-13 06:06:16','component',0,0,1),(6,'user','账号管理','2','2025-05-05 07:14:29','2025-06-29 05:29:43','',0,1,1),(7,'role','角色管理','2','2025-05-05 07:14:29','2025-06-29 05:29:43','',0,1,1),(8,'resource','权限管理','2','2025-05-05 07:14:29','2025-06-29 05:29:43','',0,1,1),(9,'guestPage','guest页面','2','2025-05-05 07:14:29','2025-06-29 05:29:43','',0,1,1),(10,'testPage','test页面','2','2025-05-05 07:14:29','2025-06-29 05:29:43','',0,1,1),(11,'operationPage','operation页面','2','2025-05-05 07:14:29','2025-06-29 05:29:43','',0,1,1),(12,'live','直播','2','2025-05-05 07:14:29','2025-06-29 05:29:43','',0,1,1),(13,'live1','zhibo1','2','2025-05-05 07:14:29','2025-06-29 05:29:43','',0,1,1),(14,'test','测试 的','2','2025-05-05 07:14:29','2025-06-29 05:29:43','',0,1,1),(15,'test2901','丛2901','2','2025-06-28 17:21:37','2025-06-29 05:29:43','',1,1,1),(16,'test2902','丛2902','2','2025-06-29 04:00:24','2025-06-29 05:29:43','',1,1,1),(17,'test2903','丛2903','2','2025-06-29 04:03:27','2025-06-29 05:29:43','',1,0,1),(18,'chart','图表','1','2025-08-15 15:41:05','2025-08-15 15:41:05','',0,1,0),(19,'married','结婚统计表','2','2025-08-15 15:42:14','2025-08-15 15:42:14','chart',0,1,0),(20,'birth','出生统计表','2','2025-08-15 15:42:58','2025-08-15 15:42:58','chart',0,1,0);
/*!40000 ALTER TABLE `resource` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `role`
--

DROP TABLE IF EXISTS `role`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `role` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'Unique identifier',
  `name` varchar(50) NOT NULL COMMENT 'Role name',
  `description` varchar(255) DEFAULT NULL COMMENT 'Role description',
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `isDeleted` tinyint NOT NULL DEFAULT '0' COMMENT '是否删除',
  `code` varchar(50) NOT NULL COMMENT 'Role code',
  `isEnabled` tinyint NOT NULL DEFAULT '1' COMMENT '启用/禁用',
  `isSystemDefault` tinyint NOT NULL DEFAULT '0' COMMENT '系统默认',
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_ae4578dcaed5adff96595e6166` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `role`
--

LOCK TABLES `role` WRITE;
/*!40000 ALTER TABLE `role` DISABLE KEYS */;
INSERT INTO `role` VALUES (1,'管理员','管理员re','2025-05-14 13:03:37','2025-08-27 15:32:52',0,'admin',1,0),(2,'游客','游客re','2025-05-14 13:05:50','2025-08-02 13:51:24',0,'guest',1,0),(3,'泰能011','re','2025-08-16 15:23:56','2025-08-16 16:08:00',0,'yoh0111',1,0),(4,'泰能0022','','2025-08-24 10:35:04','2025-09-13 07:24:23',0,'yoh002',1,0);
/*!40000 ALTER TABLE `role` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `role_resource`
--

DROP TABLE IF EXISTS `role_resource`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `role_resource` (
  `roleId` int NOT NULL COMMENT 'Role ID',
  `resourceId` int NOT NULL COMMENT 'Resource ID',
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `isDeleted` tinyint NOT NULL DEFAULT '0' COMMENT '是否删除',
  PRIMARY KEY (`roleId`,`resourceId`),
  KEY `FK_8e41fa151bd158bc1ef96f7056c` (`resourceId`),
  CONSTRAINT `FK_8e41fa151bd158bc1ef96f7056c` FOREIGN KEY (`resourceId`) REFERENCES `resource` (`id`),
  CONSTRAINT `FK_eb3b0d193525d121cd3dc549acb` FOREIGN KEY (`roleId`) REFERENCES `role` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `role_resource`
--

LOCK TABLES `role_resource` WRITE;
/*!40000 ALTER TABLE `role_resource` DISABLE KEYS */;
INSERT INTO `role_resource` VALUES (4,3,'2025-09-13 05:58:31','2025-09-13 05:58:31',0),(4,4,'2025-09-13 05:58:31','2025-09-13 05:58:31',0),(4,5,'2025-09-13 05:58:31','2025-09-13 05:58:31',0),(4,6,'2025-09-13 05:58:31','2025-09-13 05:58:31',0),(4,7,'2025-09-13 05:58:31','2025-09-13 05:58:31',0);
/*!40000 ALTER TABLE `role_resource` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'Unique identifier',
  `username` varchar(50) NOT NULL COMMENT 'Login username',
  `password` varchar(255) NOT NULL COMMENT 'Hashed password',
  `isDeleted` tinyint NOT NULL DEFAULT '0' COMMENT '是否删除',
  `avatar` varchar(255) NOT NULL COMMENT '头像URL',
  `isEnabled` tinyint NOT NULL DEFAULT '1' COMMENT '启用/禁用',
  `isSystemDefault` tinyint NOT NULL DEFAULT '0' COMMENT '系统默认',
  `mobile` varchar(11) NOT NULL COMMENT '手机号',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES ('2025-05-14 14:32:23','2025-06-28 07:52:19',1,'张三','123456',1,'',1,0,''),('2025-05-14 14:33:18','2025-06-28 07:52:26',2,'张三','123456',1,'',1,0,''),('2025-05-14 14:36:21','2025-06-28 07:52:28',3,'张三','123456',1,'',1,0,''),('2025-05-14 14:36:39','2025-06-28 07:52:30',4,'张三','123456',1,'',1,0,''),('2025-05-14 14:54:45','2025-08-27 15:32:27',5,'张三','$2b$10$fGELrXWGkwWLrlfMZc1DeeLvvDPjVpVZ5b4vrLFGYMWeY0UPkI7DK',0,'',1,0,'15927700473'),('2025-05-18 12:54:47','2025-08-27 15:32:34',6,'李四','$2b$10$c92UnBascvMKGWwKq5In4ejvQr5ItT8hWQFM5/0CkgeoBm0XpeTj2',0,'',1,0,'15927700474'),('2025-05-18 12:54:58','2025-08-27 15:02:23',7,'王五','$2b$10$L93XQoSO8EwZmhSwAqsdbuLA.hhzM5UQnn2jwGzvOHjlDBQCOVwGW',0,'',1,0,'15927700475'),('2025-05-18 12:55:00','2025-08-27 15:32:40',8,'赵六','$2b$10$wR/W/MpW6KVZVda5iGqzzeiw9zwi2ZoM8Ro/x3ECcKoQJr67wV04y',0,'',1,0,'15927700476'),('2025-08-29 16:07:16','2025-09-13 07:24:43',9,'yohq','$2b$10$lJII6PvndCwHO0FPyjXXXexG5uNha0gYIQdPOoFqHMbpGqJ37ONkW',0,'http://abc.com',1,0,'18688886666');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_role`
--

DROP TABLE IF EXISTS `user_role`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_role` (
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `isDeleted` tinyint NOT NULL DEFAULT '0' COMMENT '是否删除',
  `userId` int NOT NULL COMMENT 'User ID',
  `roleId` int NOT NULL COMMENT 'Role ID',
  PRIMARY KEY (`userId`,`roleId`),
  KEY `FK_dba55ed826ef26b5b22bd39409b` (`roleId`),
  CONSTRAINT `FK_ab40a6f0cd7d3ebfcce082131fd` FOREIGN KEY (`userId`) REFERENCES `user` (`id`),
  CONSTRAINT `FK_dba55ed826ef26b5b22bd39409b` FOREIGN KEY (`roleId`) REFERENCES `role` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_role`
--

LOCK TABLES `user_role` WRITE;
/*!40000 ALTER TABLE `user_role` DISABLE KEYS */;
INSERT INTO `user_role` VALUES ('2025-08-27 15:32:27','2025-08-27 15:32:27',0,5,1),('2025-08-27 15:32:27','2025-08-27 15:32:27',0,5,2),('2025-08-27 15:32:34','2025-08-27 15:32:34',0,6,1),('2025-08-27 15:32:34','2025-08-27 15:32:34',0,6,2),('2025-08-27 15:02:23','2025-08-27 15:02:23',0,7,1),('2025-08-27 15:02:23','2025-08-27 15:02:23',0,7,2),('2025-08-27 15:32:40','2025-08-27 15:32:40',0,8,1),('2025-08-27 15:32:40','2025-08-27 15:32:40',0,8,2),('2025-09-13 07:24:43','2025-09-13 07:24:43',0,9,1);
/*!40000 ALTER TABLE `user_role` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-09-13 15:35:55
