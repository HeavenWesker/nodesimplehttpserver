#!/usr/bin/env node
var http = require("http")
var url = require("url")
var fs = require("fs")
var root = process.argv[3] ? process.argv[3] : process.cwd()
http.createServer(function(req,res){
  console.log(url.parse(req.url).path)
  if(url.parse(req.url).path === "/"){
    var requestpath = ""
  }else{
    var requestpath = decodeURI(url.parse(req.url).path)
  }
  if(requestpath.replace(/\/$/g,"").replace(/\/[^/]*$/g,"").length === 0){
    var upperpath = "/"
  }else{
    var upperpath = requestpath.replace(/\/$/g,"").replace(/\/[^/]*$/g,"")
  }
  if(fs.existsSync(process.argv[3] ? process.argv[3] + requestpath :
                   root + url.parse(req.url).path)){
    fs.readdir(process.argv[3] ? 
               process.argv[3] + requestpath: 
             root + url.parse(req.url).path, function(err,list){
      if(err){
        if(fs.lstatSync(root + requestpath).isFile()){
          fs.createReadStream(root + requestpath).pipe(res)
        }else{
          res.writeHeader(200,{"Content-Type":"text/html"})
          res.write("404")
          res.end()
        }
      }else{
        res.writeHeader(200,{"Content-Type":"text/html"})
        res.write("Index of " 
                  + requestpath + "</br>" 
                  + "<a href=" 
                  + encodeURI(upperpath)
                  + ">⬆︎</a>" + "</br>" + "<hr />")
        var count = 0
        for(var i = 0; i < list.length; i++){
          res.write("<a href=" + encodeURI(requestpath) 
                    +"/" 
                    + encodeURI(list[i]) 
                    + ">" 
                    + list[i] + "</a></br>")
                    count++
                      if(count === list.length){res.end()}
        }
        if(count === 0){res.end()}
      }
    })
  }else{
    res.writeHeader(200,{"Content-Type":"text/html"})
    res.write("404")
    res.end()
  }
}).listen(process.argv[2] ? process.argv[2] : 4000)
console.log("Start")