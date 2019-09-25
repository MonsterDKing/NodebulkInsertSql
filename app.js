'use strict';
const sql = require('mssql');
const uuidv1 = require('uuid/v1');
const fs = require('fs');
const CsvParser = require('csv-parse');
const csvFilePath = 'codigo.csv'

var config = {
    user: 'admMePXmas19',
    password: 'xNdB)f5[5q@X9=',
    server: 'mdspxmas.database.windows.net',
    database: 'Pringles_XMas_Gaming',
    encrypt: true
};


const readCodigos = fs.createReadStream(csvFilePath)
const csvParser = new CsvParser({
    delimiter: '/n'
});

sql.connect(config)
  .then(() => {
    console.log('connected');

    const table = new sql.Table('Codigos');
    table.create = true;
    table.columns.add('CodigoId', sql.UniqueIdentifier, { nullable: false, primary: true });
    table.columns.add('FechaCreacion', sql.DateTime, {nullable:false})
    table.columns.add('FechaCanje', sql.DateTime, {nullable:false})
    table.columns.add('Valor', sql.NVarChar(sql.MAX), {nullable:true})
    table.columns.add('EstatusCodigo', sql.Int, {nullable:false})
    table.columns.add('TipoLata', sql.Int, {nullable:false})
    table.columns.add('UsuarioId', sql.UniqueIdentifier, {nullable:true})


//agregar registros
    var contador = 0;
    readCodigos
    .pipe(csvParser)
    .on('data',(data) => {
      contador++;
       table.rows.add(uuidv1(), new Date(),new Date(),data[0],0,1,null);
    })
    .on('end', ()=>{
      console.log("Finalizo")
      const request = new sql.Request();
      return request.bulk(table)
    })
    // add here rows to insert into the table
    // table.rows.add(uuidv1(), new Date(),new Date(),'12345',0,1,null);

    // const request = new sql.Request();
    // return request.bulk(table)
  })
  .catch(err => {
    console.log(err);
  });