/**
 * Propios del controller:
 * Funciones para almacenar datos, consularls, etc
 */

 const multer = require('multer');
 
 const getTrack = (req, res) => {
    res.send('track');
 };


 const uploadTrack = (req, res) => {
    res.send('track saved');

};

module.exports = {
    getTrack,
    uploadTrack,
};