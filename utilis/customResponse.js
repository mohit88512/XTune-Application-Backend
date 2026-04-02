export default function customResponse(res,status,success,message,err,data){
  return res.status(status).json({
    success,message,err,data
  })
}

