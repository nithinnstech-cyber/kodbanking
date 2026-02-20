-- KodBanking MySQL Schema
-- Run this script to create the required tables

CREATE DATABASE IF NOT EXISTS kodbanking;
USE kodbanking;

CREATE TABLE IF NOT EXISTS kodusers (
  uid INT PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  balance DECIMAL(15,2) DEFAULT 100000,
  phone VARCHAR(50),
  role VARCHAR(20) DEFAULT 'Customer' CHECK (role IN ('Customer', 'manager', 'admin'))
);

CREATE TABLE IF NOT EXISTS usertoken (
  tid INT AUTO_INCREMENT PRIMARY KEY,
  token TEXT NOT NULL,
  uid INT NOT NULL,
  expiry DATETIME NOT NULL,
  FOREIGN KEY (uid) REFERENCES kodusers(uid) ON DELETE CASCADE
);
