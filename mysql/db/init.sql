CREATE DATABASE IF NOT EXISTS todo_db;
use todo_db;

CREATE TABLE IF NOT EXISTS Users (
  user_name VARCHAR(30) PRIMARY KEY,
  password VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS Posts(
  post_id INT AUTO_INCREMENT PRIMARY KEY,
  user_name VARCHAR(30),
  title TEXT NOT NULL,
  about TEXT,
  post_date DATETIME NOT NULL,
  FOREIGN KEY (user_name) REFERENCES Users(user_name)
);