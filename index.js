const express = require("express")
const app = express()
const port = 3000

app.set("view engine", "ejs")
app.set("views", __dirname + "/views")
app.use(express.static(__dirname + "/public"))

app.get("/", (req, res) => {
	res.render("index", {title: "hello ejs!"})
})

app.listen(port, () => {
	console.log("server runing")
})