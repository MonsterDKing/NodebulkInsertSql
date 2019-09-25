var express = require('express');
var app = express();
const csv = require('csvtojson')
const CsvParser = require('csv-parse');
const path = require('path');
const fs = require('fs');
const csvFilePath = 'codigos.csv'


const readCodigos = fs.createReadStream(csvFilePath)
const csvParser = new CsvParser({
    delimiter: '/n'
});
let codigo = '';

var sql = require("mssql");
var config = {
    user: 'admMePXmas19',
    password: 'xNdB)f5[5q@X9=',
    server: 'mdspxmas.database.windows.net',
    database: 'DBPXMas19',
    encrypt: true
};


// var config = {
//     user: 'mescalina',
//     password: 'mescalina',
//     server: 'DESKTOP-3ET4GT5',
//     database: 'Mescalina',
//     // encrypt: true
// };
function cargaMasiva() {
    readCodigos
        .pipe(csvParser)
        .on('data', async (data) => {
           insertarRegistro(insertarRegistro[0]).then(res =>{
               console.log(res)
           }).catch(err =>{
               console.log(err)
           })
        })
        .on('end', () => console.log(codigo))
    // sql.connect(config, function (err) {
    //     if (err) console.log(err);
    //     var request = new sql.Request();
    //     request.stream = true 
    //     readCodigos
    //         .pipe(csvParser)
    //         .on('data', async (data) => {
    //             fs.appendFile('consultas.txt', data, (err) => {
    //                 if (err) throw err;
    //                 console.log('The "data to append" was appended to file!');
    //               });
    //      request.stream = true 
    //     var consulta = `INSERT INTO Codigos(CodigoId,FechaCreacion,FechaCanje, Valor,EstatusCodigo,TipoLata,UsuarioId)
    //     VALUES (NEWID(),GETDATE(),GETDATE(),'${data[0]}',1,0,null);`
    //     request.query(consulta)
    //     request.on('done', result => {
    //        console.log(result);
    //     })
    //         })
    //         .on('end', () => console.log(codigo))

    // });
};




function insertarRegistro(codigo) {
    return new Promise((resolve, reject) => {
        var consulta = `INSERT INTO Codigos(CodigoId,FechaCreacion,FechaCanje, Valor,EstatusCodigo,TipoLata,UsuarioId) VALUES (NEWID(),GETDATE(),GETDATE(),'${codigo}',1,0,null);`
        sql.connect(config, function (err) {
            if (err) console.log(err);
            var request = new sql.Request();
            request.query(consulta, function (err, recordset) {
                if (err) reject(err)
                sql.close();
                resolve(recordset)

            });
        });
    })
}


cargaMasiva();