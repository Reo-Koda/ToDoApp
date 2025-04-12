CREATE DATABASE IF NOT EXISTS todo_db;
use todo_db;

CREATE TABLE IF NOT EXISTS Users (
  user_id INT AUTO_INCREMENT PRIMARY KEY,
  user_name VARCHAR(30) NOT NULL,
  password VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS Posts(
  post_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  title TEXT NOT NULL,
  about TEXT,
  post_date DATETIME NOT NULL,
  FOREIGN KEY (user_id) REFERENCES Users(user_id)
);