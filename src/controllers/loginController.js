const Login = require('../models/LoginModel')
module.exports.index = (req, res) => {
  if(req.session.user) return res.render('logado')
    res.render('Login')
}
module.exports.register = async function(req, res){
    try{
        const login = new Login(req.body)
        await  login.register();
         if(login.erros.length > 0){
            req.flash('erros', login.erros)
            req.session.save(function(){
                return res.redirect('/login/index')
                });
            return
            }
            req.flash('success', 'Usuario criado com sucesso')
            req.session.save(function(){
            return res.redirect('/login/index')})
    }catch(e){
        console.log(e)
        return res.render('404')
    }
}
module.exports.login = async function(req, res){
    try{
        const login = new Login(req.body)
        await login.login()
         if(login.erros.length > 0){
            req.flash('erros', login.erros)
            req.session.save(function(){
                return res.redirect('/login/index')
                });
            return;
            }
            req.flash('success', 'Você entrou no sistema')
            req.session.user = login.user;
            req.session.save(function(){
             return res.redirect('/')})
    }catch(e){
        console.log(e)
        return res.render('404')
    }

}
module.exports.logout = (req, res) => {
   req.session.destroy()
   res.redirect('/')
}