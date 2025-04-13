package main

import (
	"database/sql"
	"log"
	"errors"
	"time"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/gin-contrib/cors"
	_ "github.com/go-sql-driver/mysql" // _ を使うと、そのパッケージ内の初期化処理（init() 関数）が実行されるだけで、直接コード中で呼び出す必要がない、という意味
)

func waitForDatabase(db *sql.DB) error {
	const maxRetries = 10
	const delay = time.Second * 5

	for i := 0; i < maxRetries; i++ {
		err := db.Ping()
		if err == nil {
			log.Println("Database is ready!")
			return nil
		}
		log.Printf("MySQL is not ready (attempt %d/%d): %v. Retrying in %v...", i+1, maxRetries, err, delay)
		time.Sleep(delay)
	}
	return errors.New("database is not ready after several attempts")
}

func main() {
	dsn := "todouser:todopass@tcp(todoapp-mysql-1:3306)/todo_db?charset=utf8mb4&parseTime=True&loc=Asia%2FTokyo"
	db, err := sql.Open("mysql", dsn)
	if err != nil {
		log.Fatal("DB接続エラー:", err)
	}
	// defer で main 関数終了時に DB 接続をクローズする
	defer db.Close()

	// 接続を確認するために Ping する
	if err := waitForDatabase(db); err != nil {
		log.Fatal("Pingエラー:", err)
	}

	db.SetConnMaxLifetime(time.Minute * 3)
	db.SetMaxOpenConns(10)
	db.SetMaxIdleConns(10)

	e := gin.Default()

	// CORSミドルウェアでフロントエンドからのリクエストを許可
	e.Use(cors.Default())

	e.GET("/api/status", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"status": "success",
		})
	})

	e.GET("/users", func(c *gin.Context) {
		rows, err := db.Query("SELECT user_id, user_name FROM Users;")
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		defer rows.Close()

		var users []map[string]interface{}

		for rows.Next() {
			var userID int
			var userName string

			if err := rows.Scan(&userID, &userName); err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
				return
			}

			user := map[string]interface{}{
				"user_id": userID,
				"user_name": userName,
			}
			users = append(users, user)
		}
		// 結果を JSON 形式で返す
		c.JSON(http.StatusOK, gin.H{"users": users})
	})

	if err := e.Run(":8000"); err != nil {
		log.Fatal("サーバー起動エラー:", err)
	}
}