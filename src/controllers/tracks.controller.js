/**
 * Propios del controller:
 * Funciones para almacenar datos, consularls, etc
 */

 const multer = require('multer');
const { getConnection } = require('../database');
const { GridFSBucket, ObjectID } = require('mongodb');
const {Readable} = require('stream');

const getTrack = (req, res) => {
    // TODO: Valiadar ID 
    try {
        trackID = new ObjectID(req.params.trackID)
    } catch (error) {
        return res.status(400).json({message: 'Invalid track Id in URL'})
    }
    // console.log(req.params.trackID)
    // res.send('recived');

    // Setear que va a retornar un mp3
    res.set('content-type', 'audio/mp3');
    res.set('accept-ranges', 'bytes');

    const db = getConnection();
    const bucket = new GridFSBucket(db , {
        bucketName: 'tracks'
    })

    let downloadStream = bucket.openDownloadStream(trackID);

    downloadStream.on('error', () => {
        res.sendStatus(404);
    })

    downloadStream.on('data', chunk => {
        res.write(chunk);
    })

    downloadStream.on('end', chunk => {
        res.end();
    })
};


 const uploadTrack = (req, res) => {
    // res.send('track saved');
    // Puede guardar en memoria el archivo
    const storage = multer.memoryStorage();

    // configurar la obtencion del archivo
    const upload = multer({
        storage,
        limits:{
            fields: 1,          // cuantos campos
            filesize: 9000000,  // tamano del archivo
            files: 1,           // cantidad de archivos
            parts: 2
        }
    })

    upload.single('track')(req, res, (err) => {
        if(err){
            console.log("el err: "+ err);

            return res.status(400).json({message: err.message});

        }
        else if(!req.body.name){
            return res.status(400).json({message: 'No track name in request body.'});

        }

        let trackName = req.body.name;

        const readableTrackStream = new Readable();
        readableTrackStream.push(req.file.buffer);      // AQUI SI ESTA EL AUDIO
        readableTrackStream.push(null);

        const db = getConnection();

        // Almacena un archivo en diferentes partes y/o servidores
        let bucket = new GridFSBucket(db, {
            bucketName: 'tracks'
        });

        let uploadStream = bucket.openUploadStream(trackName);
        const id = uploadStream.id;
        readableTrackStream.pipe(uploadStream);

        uploadStream.on('error', () => {
            return res.status(500).json({message: 'error uploading your file'});

        })
        
        uploadStream.on('finish', () => {
            return res.status(200).json({message: 'file uploades succesufully!!, stored by id: '+ id});
            
        })
    });

    
};

module.exports = {
    getTrack,
    uploadTrack,
};