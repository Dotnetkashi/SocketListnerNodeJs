var rl = require("readline"); 
var app = require('express')();
var http = require('http').Server(app);
//var serverSocket=require('socket.io')(http);
var serverSocket = require('socket.io');
var clientSocket=require('socket.io-client');
var Request = require("request");
var Client = require('node-rest-client').Client;
var logger = require('./logger').Logger; 
const notification_server = '197.15.13.12';
const OrganisationMobileNumber="4871012121";
var token="eyJhbGciOiJIUzI1NiIsInR5";

function GetToken()
{
    var username = "james_clarke@secom.co.uk";
    var password = "96fl4d9s";
    
    console.log('Username password', username, password);
    var url = 'http://192.168.0.42/api/v1/accounts/login';
    // var url = '';
    var data = {
        username: username,
        password: password
    };
     
    Request.post({
        "headers": { "content-type": "application/json" },
        "url": url,
        "body":JSON.stringify(data)
    }, (error, response, body) => {
        console.log(response);
    });
}


function parseJwt () {
    var base64Url = token.split('.')[1];
    console.log(base64Url);
    var base64 = base64Url.replace('-', '+').replace('_', '/');
    return JSON.parse(Buffer.from(base64, 'base64').toString());
}
logger.info("Log INOF");
logger.debug("Log debug");
logger.error("Log error");
var socket = undefined;

function socketConnect (token) {
        var securityFilterData = {
        'filter': {
            'voId': 'dfedfwefqedfqwdfqwfdqwe'
            }
        };
        var jwtData = parseJwt(token);
        console.log('jwt data ', jwtData);
        if (typeof jwtData["owner_id"] !== 'undefined') {
            console.log(jwtData["owner_id"]);
            securityFilterData.filter.voId = jwtData["owner_id"];

            var url="notification_server/security?token="+token;

            var io=clientSocket.connect(url);

            io.on('connect', function(){
                try {
                   console.log('socket connect');
                   console.log(io.id);
                   io.emit('server.version', {});
                   io.emit('security:analytics:filter', securityFilterData);
                } catch(e) {
                  console.log(e);
                }
             });
            io.on('server.version', (res) => {
                console.log('server.version', res );
            });
            // var arrayMac=[];
            io.on('security:analytics:receive', (res) => {
                console.log('receive');
                var json = JSON.parse(res)
                console.log(json.monitor.device.device_id);
            });
        }
    }
 

  

