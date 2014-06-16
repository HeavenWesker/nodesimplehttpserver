#!/usr/bin/env node
var http = require("http")
var url = require("url")
var fs = require("fs")
var domain = require("domain")

process.on('uncaughtException', function(err) {
    console.error('Error caught in uncaughtException event:', err);
});

function server(port, root){
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
    if(fs.existsSync(root + url.parse(req.url).path)){
      fs.readdir(root + url.parse(req.url).path, function(err,list){
        if(err){
          if(fs.lstatSync(root + requestpath).isFile()){
            var d = domain.create()
            d.on("error",function(e){
              res.writeHeader(200,{"Content-Type":"text/plain"})
              res.write("Permission Denied when try to access " + requestpath)
              res.end()
            })
            d.run(function(){
              fs.createReadStream(root + requestpath).pipe(res)
            })
          }else{
            console.log("FFUUCCKK")
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
  }).listen(port)
  console.log("Start")
}
exports.server = server
