import multer from "multer"

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "./public/temp")
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
  })

  // const fileFilter = (req, file, cb) => {
  //   if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
  //   cb(null,true)
  //   }
  //   else {
  //   // orevent te upload
  //   cb({message: 'Unsupported File Format'}, false)
  //   }
  // } 
  
//   const upload = multer({
//     storage: storage,
//     limits: { fileSize: 1024 * 1024 },
//     fileFilter:fileFilter
//     }) 

//  export {upload};

 export  const upload = multer({
  storage,
})