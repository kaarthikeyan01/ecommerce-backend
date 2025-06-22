import multer from "multer"
// to store the file in ur disk

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/temp')// file location
  },
  // to edit the filename in this disk
 filename: function (req, file, cb) {
    //const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.originalname)
  }
})
// intialising multer with storage
const upload = multer({ storage: storage })// u can also use other fiels like filefilter,limit etc
