// Import dependencies
const Parser = require("rss-parser");
var static = require('node-static');
var file = new static.Server();
// const encoding = require("encoding");
// const iconv = require("iconv-lite");

const finalData = require('./local-variables/FinalData');

const express = require("express");
const app = express();
app.use(express.static('public')); //Iniciamos el servidor e indicamos al servidor q use archivos de static public ////////////////////////////////// 
app.use(express.json());


(async function main() {

    // Make a new RSS Parser
    const parser = new Parser();

    // Get all the items in the RSS feed 
    const feedObras = await parser.parseURL("https://contrataciondelestado.es/wps/wcm/connect/4f63ed19-6c7f-4b91-8f7b-0d7ee34bc7de/index.xml?MOD=AJPERES"); // https://www.reddit.com/.rss
    // buffer = encoding.convert(feedObras.title, 'Latin_1');
    // str = iconv.decode(Buffer.from(buffer));
    // console.log(str);
    //console.log(feedObras);
    const feedSuministros = await parser.parseURL("https://contrataciondelestado.es/wps/wcm/connect/d515507e-997b-48f1-b87e-39155e09e821/index.xml?MOD=AJPERES");
    const feedServicios = await parser.parseURL("https://contrataciondelestado.es/wps/wcm/connect/f6672f78-9e48-4b50-9434-fe9380b7ecc1/index.xml?MOD=AJPERES");
    const feedConcseionObras = await parser.parseURL("https://contrataciondelestado.es/wps/wcm/connect/7ca3791d-8afd-43d6-899e-1a69d57ae8b9/index.xml?MOD=AJPERES");
    const feedCompraPublicaInovadora = await parser.parseURL("https://contrataciondelestado.es/wps/wcm/connect/08eccac8-a69d-4c53-bbcd-2dd56cb79e04/index.xml?MOD=AJPERES");
   // let URL=await parser.parseURL("https://contrataciondelestado.es/sindicacion/sindicacion_1044/PlataformasAgregadasSinMenores.atom")

    let datos = { obras: feedObras, suministros: feedSuministros, servicios: feedServicios, obrasConcesiones: feedConcseionObras, compras: feedCompraPublicaInovadora }

    finalData.setFinalData(datos);  
  
    
    console.log(finalData); // https://stackoverflow.com/questions/28594498/converting-a-string-from-utf8-to-latin1-in-nodejs


    //let items = [];

    // Clean up the string and replace reserved characters
    // const fileName = `${feed.title.replace(/\s+/g, "-").replace(/[/\\?%*:|"<>]/g, '').toLowerCase()}.js`;
    // if (fs.existsSync(fileName)) {
    //      items = require(`./${fileName}`);
    //  }
    // Add the items to the items array
    // await Promise.all(feed.items.map(async (currentItem) => {

    //     // Add a new item if it doesn't already exist
    //     if (items.filter((item) => isEquivalent(item, currentItem)).length <= 0) {
    //         items.push(currentItem);
    //     }
    // }
    // ));
    // Save the file
    // fs.writeFileSync(fileName, JSON.stringify(items),"UTF-8");
    //    console.log(items)
    //     for (let i = 0; i < items.length; i++) {
    //         document.getElementById("info").innerHTML += `
    //                         <li>
    //                          ${items[i].title}
    //                         </li>
    //                         `
    //     }


})();




app.get('/data', function (req, res) {
    res.send(finalData)
});


function isEquivalent(a, b) {
    // Create arrays of property names
    let aProps = Object.getOwnPropertyNames(a);
    let bProps = Object.getOwnPropertyNames(b);

    // if number of properties is different, objects are not equivalent
    if (aProps.length != bProps.length) {
        return false;
    }

    for (let i = 0; i < aProps.length; i++) {
        let propName = aProps[i];

        // if values of same property are not equal, objects are not equivalent
        if (a[propName] !== b[propName]) {
            return false;
        }
    }

    // if we made it this far, objects are considered equivalent
    return true;
}



require('http').createServer(function(request, response) {
    request.addListener('end', function() {
      file.serve(request, response);
    }).resume();
  }).listen(process.env.PORT || 3000);
