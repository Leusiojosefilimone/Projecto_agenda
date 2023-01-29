exports.middlewareGlobal = (req, res, next) => {
  res.locals.erros = req.flash('erros')
  res.locals.success = req.flash('success') 
  res.locals.user = req.session.user; 
  next();
};
exports.outroMiddleware = (req, res, next) => {
  next();
};
exports.checkCsrfError = (err, req, res, next) => {
  if(err) {
    return res.render('404');
  }
  next()
};
exports.csrfMiddleware = (req, res, next) => {
  res.locals.csrfToken = req.csrfToken();
  next();
};
exports.loginRequired = (req, res, next) => {
  if(!req.session.user){
    req.flash('erros', 'Voce precisa estar logado para criar ou editar contactos')
    req.session.save(() => res.redirect('/'))
    return
  }
  next()
}