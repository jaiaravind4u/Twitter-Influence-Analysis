const WebHDFS = require('webhdfs')
const request = require('request')
const {exec} = require('child_process')
require("dotenv").config()

module.exports = {
 
    getHDFSFile: (path , res ) => {
        let hdfs  = WebHDFS.createClient({
            user: process.env.HDFS_USER,
            host: process.env.HDFS_HOST,
            port: process.env.HDFS_PORT,
        });
          
        let remoteFile = hdfs.createReadStream(path);
        let result = ''
        remoteFile.on('error', function onError (err) {
            res.status(400).json(err) 
        });
           
        remoteFile.on('data', function onChunk (chunk) {
            result += chunk.toString('utf8')
        
        });
           
        remoteFile.on('finish', function onFinish () {
            result = JSON.parse(result.replace(/'/g, '"'));
            res.status(200).json((result)) 
        }); 
    },

    executeCmd : (cmd , res) => {
        exec( cmd , (error, stdout, stderr) => {
            if (error) {
                res.status(400).json(error) 
            }
            console.log(`${stdout}`);
            res.status(200).json({"success":true}) 
        });
    }
}