const mongoose = require('mongoose');
const validator = require('validator');
const ContatoSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  sobrenome: { type: String, required: false,  default: '' },
  telefone: { type: String, required: false,  default: '' },
  email: { type: String, required: false,  default: '' },
  criadoEm:{ type: Date, default: Date.now }
});
const ContatoModel = mongoose.model('Contato', ContatoSchema);
function Contato (body){
    this.body = body
    this.erros = []
    this.contato = null
}

Contato.prototype.register = async function(){
    this.valida()
    if(this.erros.length > 0 )return;
    try{
       this.contato = await ContatoModel.create(this.body)
    }catch(e){
      console.log(e)
    }
  }
  Contato.prototype.valida = function() {
    this.cleanUp()
    //validação
    if(this.body.email && !validator.isEmail(this.body.email)) this.erros.push('Email invalido')
    if(!this.body.nome) this.erros.push('Nome é um campo obrigatorio')
    if(!this.body.email && !this.body.contacto) this.erros.push('pelo menos um contacto precisa ser enviado: email ou telefone')
  }
  Contato.prototype.cleanUp = function(){
    for (const key in this.body){
      if (typeof this.body[key] !== 'string'){
        this.body[key] = ''
      }
    }
    this.body = {  
     nome: this.body.nome,
     sobrenome: this.body.sobrenome,
     telefone: this.body.telefone,
      email: this.body.email,
  }
}
Contato.prototype.edit =  async function(id){
    if (typeof id !== 'string') return;
    this.valida()
    if(this.erros.length > 0)return
    this.contato = await ContatoModel.findByIdAndUpdate(id, this.body, {new: true})
}
//métodos estáticos
Contato.idSearch = async function(id){
  if (typeof id !== 'string')return;
  const contato = await ContatoModel.findById(id)
  return contato;
}
Contato.contatoSearch = async function(){
  const contatos = await ContatoModel.find()
  .sort({ criadoEm: -1})
  return contatos;
}
Contato.delete = async function(id){
  if (typeof id !== 'string')return;
  const contato = await ContatoModel.findOneAndDelete({_id: id})
  return contato;
}
module.exports = Contato
