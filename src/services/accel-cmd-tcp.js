net = require('net');
const HOST = '127.0.0.1';
const PORT = 2001;
        
module.exports={
        getSessions: async function (res){
                var retorno;
                var client = new net.Socket();

                client.connect(PORT, HOST, function() {
                        
                        console.log( new Date().toLocaleString() + ' [info] Collecting info on accel sever(' + HOST + ':' + PORT+")");
                        // Write a message to the socket as soon as the client is connected, the server will receive it as message from the client
                        client.write('show sessions\n');
                });
        
                // Add a 'data' event handler for the client socket
                // data is what the server sent to this socket
                client.on('data', function(data) {
                        data.toString();
                        var linhas=new Array();
                        linhas=data.toString().split("\n");
                        var cabecalho=linhas.splice(0,1);
                        cabecalho=cabecalho[0].split("|");
                        for(var y=0;y<cabecalho.length;y++){
                                cabecalho[y]=cabecalho[y].trim();
                        }
                        
                        linhas.splice(0,1);
                        linhas.splice((linhas.length - 1) , 1);
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
        
                        //Crate object for HTTP connection return                        
                        objeto={totalSessoes: sessoes.length,sessoes: sessoes};
                        retorno=objeto;
                        res.status(200).send(retorno);
                        
                        //Terminate TCP connection                
                        client.destroy();                       
                });
        
                // Add a 'close' event handler for the client socket
                client.on('close', function() {
                });                  
                
        }
        ,
        terminateSessionsByInterface: function (terminate_type,terminate_parameter,terminate_mode){
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











