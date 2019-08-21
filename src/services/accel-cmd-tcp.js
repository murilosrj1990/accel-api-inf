net = require('net');
const HOST = '10.0.0.5';
const PORT = 2001;
        
module.exports={
        getSessions: async function (res){
                var retorno;
                var client = new net.Socket();

                client.connect(PORT, HOST, function() {
                        console.log('CONNECTED TO: ' + HOST + ':' + PORT);
                        // Write a message to the socket as soon as the client is connected, the server will receive it as message from the client
                        client.write('show sessions\n');
                });
        
                // Add a 'data' event handler for the client socket
                // data is what the server sent to this socket
                client.on('data', function(data) {
                        console.log(data.toString());
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
                                sessao = {
                                        "ifname": colunas[0].trim(),
                                        "username": colunas[1].trim(),
                                        "ip": colunas[2].trim(),
                                        "ip6": colunas[3].trim(),
                                        "ip6dp": colunas[4].trim(),
                                        "type": colunas[5].trim(),
                                        "uptime": colunas[6].trim(),
                                        "callingSid": colunas[7].trim(),
                                        "calledSid": colunas[8].trim(),
                                        "sid": colunas[9].trim(),
                                        "rxBytes": colunas[10].trim(),
                                        "txBytes": colunas[11].trim()
                                }
                                //Adiciona os dados de uma sessao ao array sessoes
                                sessoes.push(sessao);
                        }
        
                        //Cria objeto para ser retornado na requisicao http
                        
                        objeto={totalSessoes: sessoes.length,sessoes: sessoes};
                        retorno=objeto;


                        console.log(retorno);
                        res.status(200).send(retorno);
                        
                        //Finaliza conexao
                        console.log("Destruindo sessao tcp com accel");                      
                        client.destroy();

                        
                        
                });
        
                // Add a 'close' event handler for the client socket
                client.on('close', function() {
                console.log('Connection closed');
                });                  
                
        }
}    











