const axios = require('axios');
const FormData = require('form-data');

async function uploadFile(buffer, fileName, mimeType) {
    const form = new FormData();
    form.append('file', buffer, { filename: fileName, contentType: mimeType });
    form.append('fileName', fileName);
    form.append('folder', '/yt-complete-backend/music');

    const response = await axios.post(
        'https://upload.imagekit.io/api/v1/files/upload',
        form,
        {
            headers: {
                ...form.getHeaders(),
            },
            auth: {
                username: process.env.IMAGEKIT_PRIVATE_KEY,
                password: '',
            },
        }
    );

    return response.data;
}

module.exports = { uploadFile }