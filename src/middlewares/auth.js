export function auth(req,res,next) {

   
    console.log(req.session)
    console.log(req.session.user)

    if(!req.session || !req.session.user) {
        return res.redirect('/api/views/login')
    }
    next()
}