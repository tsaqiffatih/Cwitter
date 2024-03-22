const express = require('express');
const router = require('./Routers');
const app = express()
const fs = require('fs');
const session = require('express-session')


app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: false}))

const directoryPath = './uploads';
if (!fs.existsSync(directoryPath)) {
  fs.mkdirSync(directoryPath);
  console.log('Direktori berhasil dibuat.');
} else {
  console.log('Direktori sudah ada.');
}
app.use('/uploads', express.static('uploads'));

app.use(session({
  secret: 'punya kita',
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: false ,
    sameSite: true 
  }
}))

app.use(router);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`)
})