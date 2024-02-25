const express = require('express')
const sqlite3 = require('sqlite3')
const { open } = require('sqlite')
const cors=require('cors')
const path = require('path')
const app = express()

const databasePath = path.join(__dirname, 'login.db')



app.use(cors())
app.use(express.json())

let db = null;


const InitializeDbAndServer = async () => {

    try {
        db = await open({
            filename: databasePath,
            driver: sqlite3.Database
        })
        app.listen(3001, () => {
            console.log('Server Runnig at Port 3001')
        })
    }
    catch (error) {
        console.log('DB Error' + `${error.message}`)
        process.exit(1)
    }

}

InitializeDbAndServer()


const validPasswordLength = (password) => {
    return password.length > 6
}

app.post('/register', async (req, res) => {
    const { name, email, mobile, password } = req.body


    const selectUserQuery = `select * from register where email='${email}';`;
    const dbUser = await db.get(selectUserQuery)


    if (dbUser !== undefined) {
        res.send('User Already Exist')
    }
    else {


        if (validPasswordLength(password)) {
            const createUserQuery = `INSERT INTO register(name,email,mobile,password)
     VALUES('${name}','${email}','${mobile}','${password}');`;
            const user = await db.run(createUserQuery)
            res.send("User created successfully");
        }
        else {
            res.send('Password too short')
        }
    }

})

app.post('/login',async(req,res)=>{
    const {email,password}=req.body 

    const qetUserQuery=`select * from register where email='${email}' AND password='${password}';`;
    const dbUser=await db.get(qetUserQuery)

    if(dbUser===undefined){
        res.send('Invalid User')
    }else{
        res.send('Succefully Login')
    }
})


