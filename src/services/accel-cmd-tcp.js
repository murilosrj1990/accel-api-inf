var net = require('net');

var HOST = '127.0.0.1';
var PORT = 2001;

var client = new net.Socket();
client.connect(PORT, HOST, function() {
  console.log('CONNECTED TO: ' + HOST + ':' + PORT);
  // Write a message to the socket as soon as the client is connected, the server will receive it as message from the client
 client.write('terminate if pppoe3 hard\n');
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
        console.log(cabecalho);
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
                        "calling_sid": colunas[7].trim(),
                        "called_sid": colunas[8].trim(),
                        "sid": colunas[9].trim(),
                        "rx_bytes": colunas[10].trim(),
                        "tx_bytes": colunas[11].trim()
                }
                //Adiciona os dados de uma sessao ao array sessoes
                sessoes.push(sessao);
        }

        //Cria objeto para ser retornado na requisicao http
        var obj_return = new Object();
        obj_return={
                "total_sessoes": sessoes.length,
                "sessoes": sessoes
        }
        
        console.log(data.toString());
        //Finaliza conexao
        client.destroy();

});

// Add a 'close' event handler for the client socket
client.on('close', function() {
  console.log('Connection closed');
});
