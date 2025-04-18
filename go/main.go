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

type User struct {
	UserName string `json:"user_name"`
	Password string `json:"password"`
}

type Post struct {
	UserName string `json:"user_name"`
	Title string `json:"title"`
	About string `json:"about"`
	PostDate time.Time `json:"post_date"`
}

type deleteItem struct {
	PostID int `json:"post_id"`
}

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

	// e.GET("/api/status", func(c *gin.Context) {
	// 	c.JSON(200, gin.H{
	// 		"status": "success",
	// 	})
	// })

	e.GET("/api/users", func(c *gin.Context) {
		rows, err := db.Query("SELECT user_name, password FROM Users;")
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		defer rows.Close()

		var users []map[string]interface{}

		for rows.Next() {
			var userName string
			var password string

			if err := rows.Scan(&userName, &password); err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
				return
			}

			user := map[string]interface{}{
				"user_name": userName,
				"password": password,
			}
			users = append(users, user)
		}
		// 結果を JSON 形式で返す
		c.JSON(http.StatusOK, gin.H{"users": users})
	})

	e.POST("/api/users/signin", func(c *gin.Context) {
		var user User

		if err := c.ShouldBindJSON(&user); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		var dbPassword string
		err := db.QueryRow("SELECT password FROM Users WHERE user_name = ?", user.UserName).Scan(&dbPassword)
		if err == sql.ErrNoRows {
			c.JSON(http.StatusNotFound, gin.H{"error": "ユーザーが存在しません"})
			return
		} else if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		if dbPassword == user.Password {
			c.JSON(http.StatusOK, gin.H{"message": "パスワードが一致しました", "token": user.UserName})
		} else {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "パスワードが一致しません"})
		}
	})

	e.POST("/api/users/signup", func(c *gin.Context) {
		var newuser User

		if err := c.ShouldBindJSON(&newuser); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		var dbUserName string
		err := db.QueryRow("SELECT user_name FROM Users WHERE user_name = ?", newuser.UserName).Scan(&dbUserName)
		if err == nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "すでに存在する名前です"})
			return
		} else if err != nil && err != sql.ErrNoRows {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		_, err = db.Exec("INSERT INTO Users (user_name, password) VALUES (?, ?)", newuser.UserName, newuser.Password)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		c.JSON(http.StatusOK, gin.H{"message": "新規登録が正常に終了しました", "token": newuser.UserName})
	})

	e.GET("/api/posts", func(c *gin.Context) {
		rows, err := db.Query("SELECT post_id, user_name, title, COALESCE(about, ''), post_date FROM Posts;")
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		defer rows.Close()

		var posts []map[string]interface{}

		for rows.Next() {
			var postID int
			var userName string
			var title string
			var about string
			var postDate string

			if err := rows.Scan(&postID, &userName, &title, &about, &postDate); err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
				return
			}

			post := map[string]interface{}{
				"post_id": postID,
				"user_name": userName,
				"title": title,
				"about": about,
				"post_date": postDate,
			}
			posts = append(posts, post)
		}
		// 結果を JSON 形式で返す
		c.JSON(http.StatusOK, gin.H{"posts": posts})
	})

	e.POST("/api/posts/post", func(c *gin.Context) {
		var newPost Post
		
		if err := c.ShouldBindJSON(&newPost); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		newPost.PostDate = time.Now()
		formattedTime := newPost.PostDate.Format("2006-01-02 15:04")

		result, err := db.Exec("INSERT INTO Posts (user_name, title, post_date) VALUES (?, ?, ?)", newPost.UserName, newPost.Title, formattedTime)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		id, err := result.LastInsertId()
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		c.JSON(http.StatusOK, gin.H{"message": "データが追加されました", "id": id})
	})

	e.POST("/api/posts/delete", func(c *gin.Context) {
		var postID deleteItem

		if err := c.ShouldBindJSON(&postID); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		result, err := db.Exec("DELETE FROM Posts WHERE post_id = ?", postID.PostID)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		rowsAffected, _ := result.RowsAffected()
    if rowsAffected == 0 {
			c.JSON(http.StatusNotFound, gin.H{"message": "該当するデータがありません", "id": postID.PostID})
			return
    }

		c.JSON(http.StatusOK, gin.H{"message": "データが削除されました", "id": postID.PostID})
	})

	if err := e.Run(":8000"); err != nil {
		log.Fatal("サーバー起動エラー:", err)
	}
}