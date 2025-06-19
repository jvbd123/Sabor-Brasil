CREATE DATABASE  IF NOT EXISTS `banco_trabalho` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `banco_trabalho`;
-- MySQL dump 10.13  Distrib 8.0.41, for Win64 (x86_64)
--
-- Host: localhost    Database: banco_trabalho
-- ------------------------------------------------------
-- Server version	8.0.41

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `comentario`
--

DROP TABLE IF EXISTS `comentario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `comentario` (
  `id` int NOT NULL AUTO_INCREMENT,
  `usuarioid` int NOT NULL,
  `publicacaoid` int NOT NULL,
  `texto` text NOT NULL,
  `data_comentario` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `usuarioid` (`usuarioid`),
  KEY `publicacaoid` (`publicacaoid`),
  CONSTRAINT `comentario_ibfk_1` FOREIGN KEY (`usuarioid`) REFERENCES `usuario` (`id`),
  CONSTRAINT `comentario_ibfk_2` FOREIGN KEY (`publicacaoid`) REFERENCES `publicacao` (`id_publicacao`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `comentario`
--

LOCK TABLES `comentario` WRITE;
/*!40000 ALTER TABLE `comentario` DISABLE KEYS */;
INSERT INTO `comentario` VALUES (1,8,1,'fff','2025-03-31 02:02:51'),(2,8,1,'muito bommmm','2025-03-31 02:03:57'),(6,10,1,'opa','2025-03-31 02:43:22'),(16,11,1,'oi','2025-03-31 14:41:54');
/*!40000 ALTER TABLE `comentario` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `curtida`
--

DROP TABLE IF EXISTS `curtida`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `curtida` (
  `id` int NOT NULL AUTO_INCREMENT,
  `usuarioid` int NOT NULL,
  `publicacaoid` int NOT NULL,
  `tipo_interacao` enum('like','deslike','none') NOT NULL DEFAULT 'none',
  PRIMARY KEY (`id`),
  KEY `usuarioid` (`usuarioid`),
  KEY `publicacaoid` (`publicacaoid`),
  CONSTRAINT `curtida_ibfk_1` FOREIGN KEY (`usuarioid`) REFERENCES `usuario` (`id`),
  CONSTRAINT `curtida_ibfk_2` FOREIGN KEY (`publicacaoid`) REFERENCES `publicacao` (`id_publicacao`)
) ENGINE=InnoDB AUTO_INCREMENT=64 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `curtida`
--

LOCK TABLES `curtida` WRITE;
/*!40000 ALTER TABLE `curtida` DISABLE KEYS */;
INSERT INTO `curtida` VALUES (1,8,1,'deslike'),(2,8,1,'deslike'),(3,8,1,'like'),(4,8,1,'deslike'),(5,8,1,'like'),(6,8,1,'deslike'),(7,8,1,'like'),(8,8,1,'deslike'),(9,8,1,'like'),(10,8,1,'deslike'),(11,8,1,'like'),(12,8,1,'deslike'),(13,8,1,'like'),(14,1,1,'deslike'),(15,1,2,'deslike'),(16,1,3,'deslike'),(17,1,2,'like'),(18,1,1,'like'),(19,8,1,'deslike'),(20,9,1,'like'),(21,9,2,'deslike'),(22,9,3,'like'),(23,10,1,'like'),(24,10,2,'deslike'),(25,10,3,'like'),(26,1,1,'deslike'),(27,1,1,'none'),(28,1,1,'deslike'),(29,1,1,'like'),(30,1,1,'none'),(31,1,1,'like'),(32,11,1,'like'),(33,11,2,'like'),(34,11,3,'like'),(35,11,1,'deslike'),(36,11,1,'like'),(37,11,2,'deslike'),(38,11,2,'none'),(39,11,2,'deslike'),(40,11,2,'none'),(41,11,2,'like'),(42,11,2,'none'),(43,11,2,'deslike'),(44,11,2,'none'),(45,11,2,'like'),(46,11,2,'none'),(47,11,1,'deslike'),(48,11,1,'like'),(49,11,1,'deslike'),(50,11,2,'deslike'),(51,11,3,'deslike'),(52,11,1,'like'),(53,11,2,'like'),(54,11,3,'like'),(55,12,1,'like'),(56,12,2,'like'),(57,12,3,'like'),(58,6,1,'like'),(59,6,1,'none'),(60,6,1,'like'),(61,6,1,'none'),(62,6,2,'like'),(63,6,3,'like');
/*!40000 ALTER TABLE `curtida` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `empresa`
--

DROP TABLE IF EXISTS `empresa`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `empresa` (
  `id_empresa` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(100) NOT NULL,
  `logo` text,
  `createdat` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedat` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_empresa`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `empresa`
--

LOCK TABLES `empresa` WRITE;
/*!40000 ALTER TABLE `empresa` DISABLE KEYS */;
INSERT INTO `empresa` VALUES (1,'Sabor do Brasil','C:UsersPichauOneDriveTrabalhoDefinitivopublicimageslogo_sabor_do_brasil.png','2023-11-23 13:49:17','2021-02-22 12:13:55');
/*!40000 ALTER TABLE `empresa` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `publicacao`
--

DROP TABLE IF EXISTS `publicacao`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `publicacao` (
  `id_publicacao` int NOT NULL AUTO_INCREMENT,
  `foto` text,
  `titulo_prato` varchar(100) NOT NULL,
  `nome_local` varchar(100) DEFAULT NULL,
  `cidade` varchar(100) DEFAULT NULL,
  `empresaid` int NOT NULL,
  `createdat` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedat` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_publicacao`),
  KEY `empresaid` (`empresaid`),
  CONSTRAINT `publicacao_ibfk_1` FOREIGN KEY (`empresaid`) REFERENCES `empresa` (`id_empresa`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `publicacao`
--

LOCK TABLES `publicacao` WRITE;
/*!40000 ALTER TABLE `publicacao` DISABLE KEYS */;
INSERT INTO `publicacao` VALUES (1,'C:UsersPichauOneDriveTrabalhoDefinitivopublicimagespublicacao01.png','Titulo do Prato 01','Local 01','Maceio-AL',1,'2023-02-22 12:15:55','2023-09-22 12:18:55'),(2,'C:UsersPichauOneDriveTrabalhoDefinitivopublicimagespublicacao02.png','Titulo do Prato 02','Local 02','Minas Gerais-MG',1,'2023-02-22 12:10:55','2023-02-22 12:16:55'),(3,'C:UsersPichauOneDriveTrabalhoDefinitivopublicimagespublicacao03.png','Titulo do Prato 03','Local 03','Rio de Janerio-RJ',1,'2023-05-22 12:13:55','2023-02-22 12:15:55');
/*!40000 ALTER TABLE `publicacao` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuario`
--

DROP TABLE IF EXISTS `usuario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuario` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(255) NOT NULL,
  `email` varchar(100) NOT NULL,
  `nickname` varchar(50) NOT NULL,
  `senha` varchar(255) NOT NULL,
  `foto` text,
  `createdat` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedat` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `nickname` (`nickname`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuario`
--

LOCK TABLES `usuario` WRITE;
/*!40000 ALTER TABLE `usuario` DISABLE KEYS */;
INSERT INTO `usuario` VALUES (1,'usuario01','usuario01@usuario.com','bylr','123456','/uploads/c3d15106322469e6fffd0085dd46f8d0','2023-06-22 12:13:55','2025-03-31 18:19:28'),(2,'usuario02','usuario02@usuario.com','usuario_02','654321','C:UsersPichauOneDriveTrabalhoDefinitivopublicimagesusuario_02.jpg','2023-02-22 12:13:55','2023-02-22 12:13:58'),(3,'usuario03','usuario03@usuario.com','usuario_03','987654','C:UsersPichauOneDriveTrabalhoDefinitivopublicimagesusuario_03.jpg','2023-08-22 12:13:55','2023-08-22 12:15:55'),(4,'byle','aisim@gmail.com','oi','123456',NULL,'2025-03-30 05:02:41','2025-03-30 05:02:41'),(5,'telma','telma@um.com','telma','123',NULL,'2025-03-30 05:29:24','2025-03-30 05:29:24'),(6,'pao','oi1234@gmail.com','kkkk','123','/uploads/f7462f98768e05622d0ec44241efe1f2','2025-03-30 16:05:32','2025-03-31 19:06:15'),(7,'p','p@1gmail.com','eu','1',NULL,'2025-03-31 02:56:46','2025-03-31 02:56:46'),(8,'dddd','ddd@gmail.com','kkk','2',NULL,'2025-03-31 05:02:29','2025-03-31 05:02:29'),(9,'oi','oi@gmail.com','5','5',NULL,'2025-03-31 05:34:17','2025-03-31 05:34:17'),(10,'oioi','oio@gmail.com','oioi','10',NULL,'2025-03-31 05:42:38','2025-03-31 05:42:38'),(11,'paulo','paulo@gmail.com','paulo','123','/uploads/60874302ab525d1cfa1cb4735c1f5010','2025-03-31 17:30:28','2025-03-31 18:37:19'),(12,'ana','a@gmail.com','eue','1','/uploads/e524df9054f226261b4b64d9b1406ba8','2025-03-31 18:38:20','2025-03-31 18:58:43');
/*!40000 ALTER TABLE `usuario` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'banco_trabalho'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-03-31 16:35:36
