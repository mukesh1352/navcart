package main

import (
	"context"
	"log"
	"net/http"
	"strings"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

const mongoURI = "mongodb+srv://mukesh:12345@cluster0.cfejaad.mongodb.net/"

var mongoClient *mongo.Client

type Item struct {
	ID           primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	Name         string             `bson:"name" json:"name"`
	Brand        string             `bson:"brand" json:"brand"`
	Price        float64            `bson:"price" json:"price"`
	Unit         string             `bson:"unit" json:"unit"`
	DepartmentID primitive.ObjectID `bson:"department_id" json:"department_id"`
}

type Department struct {
	ID    primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	Name  string             `bson:"name" json:"name"`
	Floor string             `bson:"floor" json:"floor"`
}

func main() {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	var err error
	mongoClient, err = mongo.Connect(ctx, options.Client().ApplyURI(mongoURI))
	if err != nil {
		log.Fatal(err)
	}

	r := gin.Default()

	// Enable CORS
	r.Use(cors.Default())

	// Routes
	r.GET("/items", getItems)
	r.GET("/find-department", findDepartmentByItem)
	r.GET("/grouped-items", getGroupedItems)

	r.Run(":8080")
}

func getItems(c *gin.Context) {
	floor := c.DefaultQuery("floor", "ground")
	deptID := c.Query("department_id")

	dbName := getDBName(floor)
	itemCollection := mongoClient.Database(dbName).Collection("items")

	filter := bson.M{}
	if deptID != "" {
		objID, err := primitive.ObjectIDFromHex(deptID)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid department_id"})
			return
		}
		filter["department_id"] = objID
	}

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	cursor, err := itemCollection.Find(ctx, filter)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error fetching items"})
		return
	}
	defer cursor.Close(ctx)

	var items []Item
	if err := cursor.All(ctx, &items); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error decoding items"})
		return
	}

	c.JSON(http.StatusOK, items)
}

func findDepartmentByItem(c *gin.Context) {
	floor := c.DefaultQuery("floor", "ground")
	itemName := c.Query("item_name")

	if itemName == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "item_name is required"})
		return
	}

	dbName := getDBName(floor)
	itemCollection := mongoClient.Database(dbName).Collection("items")
	departmentCollection := mongoClient.Database(dbName).Collection("departments")

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	var item Item
	err := itemCollection.FindOne(ctx, bson.M{
		"name": bson.M{"$regex": itemName, "$options": "i"},
	}).Decode(&item)

	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Item not found"})
		return
	}

	var dept Department
	err = departmentCollection.FindOne(ctx, bson.M{
		"_id": item.DepartmentID,
	}).Decode(&dept)

	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Department not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"item":       item.Name,
		"department": dept.Name,
		"floor":      dept.Floor,
	})
}

func getGroupedItems(c *gin.Context) {
	floor := c.DefaultQuery("floor", "ground")
	dbName := getDBName(floor)

	itemCollection := mongoClient.Database(dbName).Collection("items")
	deptCollection := mongoClient.Database(dbName).Collection("departments")

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	deptCursor, err := deptCollection.Find(ctx, bson.M{})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error fetching departments"})
		return
	}
	defer deptCursor.Close(ctx)

	deptMap := make(map[primitive.ObjectID]Department)
	var departments []Department
	if err := deptCursor.All(ctx, &departments); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error decoding departments"})
		return
	}
	for _, dept := range departments {
		deptMap[dept.ID] = dept
	}

	itemCursor, err := itemCollection.Find(ctx, bson.M{})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error fetching items"})
		return
	}
	defer itemCursor.Close(ctx)

	var items []Item
	if err := itemCursor.All(ctx, &items); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error decoding items"})
		return
	}

	grouped := make(map[string][]Item)
	for _, item := range items {
		dept, ok := deptMap[item.DepartmentID]
		deptName := "Unknown Department"
		if ok {
			deptName = dept.Name
		}
		grouped[deptName] = append(grouped[deptName], item)
	}

	c.JSON(http.StatusOK, grouped)
}

func getDBName(floor string) string {
	floor = strings.ToLower(floor)
	if floor == "first" {
		return "walmart_first_floor"
	}
	return "walmart_ground_floor"
}
