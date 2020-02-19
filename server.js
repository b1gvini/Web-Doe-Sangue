//configurando o servidor
const express = require("express")
const server = express()

//configurando o servidor para arquivos extras (styles, scripts)
server.use(express.static('public'))

//habilitar body do formulário

server.use(express.urlencoded({ extended: true}))

//configurar a conexão com o bd
const Pool = require('pg').Pool
const db = new Pool({
    user: 'postgres',
    password: 'root',
    host: 'localhost',
    port: 5432,
    database: 'doe'
})


//configurando o template engine
const nunjucks = require("nunjucks")
nunjucks.configure("./",{
    express: server,
    noCache: true,
    
})


//configurar a apresentação da página
server.get("/",function(req, res){
    db.query("SELECT * from donors", function(err, result){
        if(err) return res.send("Erro de exibição no Banco de Dados.")
        

        const donors = result.rows;
        return res.render("index.html", { donors })
    })
    
})

server.post("/", function(req, res){
    //pegar dados do formulário
    const name = req.body.name
    const email = req.body.email
    const blood = req.body.blood

    if (name == "" || email == "" || blood == ""){
        return res.send("Todos os campos são obrigatórios.")
    }

    //colocando valores dentro do bd
    const query = `INSERT INTO donors("name","email","blood") 
    VALUES ($1, $2, $3)`

    const values = [name, email, blood]
    db.query(query, values, function(err){
        //fluxo de erro
        if (err) return res.send("Erro no Banco de Dados.")
        
        //fluxo ideal
        return res.redirect("/")
    } )

    
})


// ligar o servidor e permitir o acesso na porta 3000
server.listen(3000, function(){
    console.log("Iniciei o servidor")
})