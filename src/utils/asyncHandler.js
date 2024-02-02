let aysncHandler = (requestHandler) =>{
    (req, res ,next)=>{
        Promise.resolve(requestHandler(req, res, next))
        .catch((error)=> next(error))
    }
}

export  {aysncHandler}


// try catch 
// let aysncHandler = (fn)=> async(req, res , next)=>{
// try {
//     await fn(req, res, next)
// } catch (error) {
//     res.status(err.code || 500).json({
//         succes: false,
//         message:err.message
//     })
// }
// }