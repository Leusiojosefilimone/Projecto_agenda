const mongoose = require('mongoose');
const validator = require('validator')
const bcryptjs = require('bcryptjs')
const LoginSchema = new mongoose.Schema({
  email: { type: String, required: true },
  password:  { type: String, required: true },
});

const LoginModel = mongoose.model('Login', LoginSchema);

class Login{
  constructor(body){
    this.body = body;
    this.erros = [];
    this.user = null;
  }
  async login(){
     this.valida()
    if(this.erros.length > 0 )return;
    this.user = await LoginModel.findOne({email: this.body.email})
    if(!this.user) {
      this.erros.push('Não foi possivel entar porque o usuario não existe')
      return;
  }
    if (!bcryptjs.compareSync(this.body.password, this.user.password)){
      this.erros.push('Senha inválida')
      this.user = null
      return;
    }
  }
  async register(){
    await this.userExists()
    if(this.erros.length > 0 )return;
    const salt = bcryptjs.genSaltSync()
    this.body.password = bcryptjs.hashSync(this.body.password)
    try{
       this.user = await LoginModel.create(this.body)
    }catch(e){
      console.log(e)
    }
   
  }
    async userExists(){
     const user = await LoginModel.findOne({email: this.body.email})
     if (user){
      this.erros.push('Não foi possivel cadastrar porque o usuario já existe')
     }
  }
  valida(){
    if(!validator.isEmail(this.body.email)) this.erros.push('Email invalido')
    if(this.body.password.length < 3 || this.body.password.length > 50) this.erros.push('A senha deve ter  de 3 a 50 caracteres')
  }
  cleanUp(){
    for (const key in this.body){
      if (typeof this.body[key] !== 'string'){
        this.body[key] = ''
      }
    }
    this.body = {
      email: this.body.email,
      password: this.body.password
    }
  }
}

module.exports = Login;
