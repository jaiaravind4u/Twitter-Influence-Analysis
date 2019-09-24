//Imports
const express = require('express')
const path  = require('path')
const {getHDFSFile , executeCmd} = require('./app/utils/helper')
//Initialisation
const app = express()
require("dotenv").config()


app.use('/res', express.static(path.join(__dirname, '/app/static'))) // Set static resource directory
app.set('view engine', 'pug') 
app.set('views', './app/views')

//Routes
app.get('/' , (req , res) => res.render('index') )

app.get('/getFile' , (req , res)=>{

    getHDFSFile(`${process.env.HDFS_BASE_PATH}/${req.query.file}/part-00000` , res);
})
app.get('/generateInputFile' , (req , res)=>{

    console.log("Generating Input File....")
    let cmd = `python scripts/tweets.py ${req.query.topic} ${req.query.location} ${req.query.file}`
    console.log(cmd)
    executeCmd(cmd , res)
})
app.get('/uploadFileToHDFS' , (req , res)=>{

    console.log("Uploading Input File to HDFS....")
    let cmd = `hdfs dfs -put ${req.query.file} input`
    executeCmd(cmd , res)
})
app.get('/startJob' , (req , res)=>{

    console.log("Starting Map Reduce Job....")
    let cmd = `/usr/local/Cellar/hadoop/3.1.1/bin/hadoop jar /usr/local/Cellar/hadoop/3.1.1/libexec/share/hadoop/tools/lib/hadoop-*streaming*.jar -file ${path.join(__dirname,'scripts/mapTweets.py')} -mapper  ${path.join(__dirname,'scripts/mapTweets.py')} -file ${path.join(__dirname,'scripts/reduceTweets.py')} -reducer  ${path.join(__dirname,'scripts/reduceTweets.py')} -input input/${req.query.file} -output output/${req.query.file}`

    console.log(`/usr/local/Cellar/hadoop/3.1.1/bin/hadoop jar /usr/local/Cellar/hadoop/3.1.1/libexec/share/hadoop/tools/lib/hadoop-*streaming*.jar -file ${path.join(__dirname,'scripts/mapTweets.py')} -mapper  ${path.join(__dirname,'scripts/mapTweets.py')} -file ${path.join(__dirname,'scripts/reduceTweets.py')} -reducer  ${path.join(__dirname,'scripts/reduceTweets.py')} -input input/${req.query.file} -output output/${req.query.file}`)

    executeCmd(cmd , res)
})

app.listen(process.env.PORT, function() {
    console.log(`Server started on ${process.env.PORT} `)
});