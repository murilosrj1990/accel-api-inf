net = require('net');
const HOST = '10.0.0.11';
const PORT = 2001;

function checkShowSessionsParameter(parameter){
        parameterIsValid=false;
        
        switch(parameter){
                case "netns":
                        parameterIsValid=true;
                break;
                case "ifname":
                        parameterIsValid=true;
                break;
                case "ip":
                        parameterIsValid=true;
                break;
                case "ip6":
                        parameterIsValid=true;
                break;
                case "ip6-pd":
                        parameterIsValid=true;
                break;
                case "type":
                        parameterIsValid=true;
                break;
                case "state":
                        parameterIsValid=true;
                break;
                case "uptime":
                        parameterIsValid=true;
                break;
                case "uptime-raw":
                        parameterIsValid=true;
                break;
                case "calling-sid":
                        parameterIsValid=true;
                break;
                case "called-sid":
                        parameterIsValid=true;
                break;
                case "sid":
                        parameterIsValid=true;
                break;
                case "comp":
                        parameterIsValid=true;
                break;
                case "sid":
                        parameterIsValid=true;
                break;
                case "rx-bytes":
                        parameterIsValid=true;
                break;
                case "tx-bytes":
                        parameterIsValid=true;
                break;
                case "rx-bytes-raw":
                        parameterIsValid=true;
                break;
                case "tx-bytes-raw":
                        parameterIsValid=true;
                break;
                case "rx-pkts":
                        parameterIsValid=true;
                break;
                case "tx-pkts":
                        parameterIsValid=true;
                break;
                case "rate-limit":
                        parameterIsValid=true;
                break;
        }
        return parameterIsValid;
}

function filterStringParameterChain(stringChain){
        var checkStringArray=stringChain.split(',');
        var stringAux="";
        for(var i=0;i<checkStringArray.length;i++){
                if(checkShowSessionsParameter(checkStringArray[i])){
                        if(i==0){
                                stringAux=stringAux+checkStringArray[i]; 
                        }else{
                                stringAux=stringAux+","+checkStringArray[i];
                        }
               }
        }
        stringChain=stringAux;
        return stringChain;
}
        
module.exports={
        getSessions: function (res,order_parameter,columns){
                var retorno;
                var client = new net.Socket();
                var dados="";
                columns=filterStringParameterChain(columns);
                orderParameterIsValid=checkShowSessionsParameter(order_parameter);
                if(!orderParameterIsValid){
                        order_parameter="sid";
                }

                client.connect(PORT, HOST, function() {
                        
                        console.log( new Date().toLocaleString() + ' [info] Collecting info on accel sever(' + HOST + ':' + PORT+")");
                        // Write a message to the socket as soon as the client is connected, the server will receive it as message from the client
                        client.write('show sessions '+columns+' order '+order_parameter+'\n');
                });
        
                // Add a 'data' event handler for the client socket
                // data is what the server sent to this socket
                client.on('data', function(data) {                        
                        tamanhoDados=dados.length;
                        dados=dados+data.toString();
                        setTimeout(function(){
                                client.destroy(); 
                        },1000);                                                                
                });
        
                // Add a 'close' event handler for the client socket
                client.on('close', function() {
                        var linhas=new Array();
                        linhas=dados.toString().split("\n");
                        var cabecalho=linhas.splice(0,1);
                        cabecalho=cabecalho[0].split("|");
                        for(var y=0;y<cabecalho.length;y++){
                                cabecalho[y]=cabecalho[y].trim();
                        }
                        
                        linhas.splice(0,1);
                        linhas.splice((linhas.length - 1) , 1);
                        //Build sessions for HTTP request return
                        sessoes = new Array();
                        for(var i=0;i<linhas.length;i++){
                                var colunas=linhas[i].split("|");
                                var sessao="{";
                                for(var w=0;w<colunas.length;w++){
                                        colunas[w]=colunas[w].trim();
                                        sessao=sessao+JSON.stringify(cabecalho[w])+": "+JSON.stringify(colunas[w]);
                                        if(w!=colunas.length-1){
                                                sessao=sessao+", ";
                                        }
                                }
                                sessao=sessao+"}";
                                var sessionObject=JSON.parse(sessao);
                                sessoes.push(sessionObject);  
                                
                                
                        }
                        objeto={totalSessoes: sessoes.length,sessoes: sessoes};
                        retorno=objeto;
                        //Send the accel return in the response HTTP
                        res.status(200).send(retorno);
                        dados="";
                });                  
                
        }
        ,
        terminateSessionsByParameter: function (terminate_type,terminate_parameter,terminate_mode){
                console.log(new Date().toLocaleString()+" [info] Send terminate session command");
                var client = new net.Socket();

                client.connect(PORT, HOST, function() {
                        // Write a message to the socket as soon as the client is connected, the server will receive it as message from the client
                        client.write('terminate '+ terminate_type+" "+terminate_parameter+" "+terminate_mode+'\n');
                });

                client.on('data', function(data){
                        console.log(data.toString().trim());
                });
                
                client.on('close', function() {
                });

        }
         
}











