const express = require('express');

const app = express();

const fs = require('fs');

const TextToSpeechV1 = require('ibm-watson/text-to-speech/v1');

const { IamAuthenticator } = require('ibm-watson/auth');

const apikey = 'tF_Af-jOywiwBIYAXBWlLJC8ajbJUvp_8q6ClwXDDdPy';

const textToSpeech = new TextToSpeechV1({
    authenticator: new IamAuthenticator({
        apikey,
        disableSslVerification: true
    }),

    url: 'https://api.us-south.text-to-speech.watson.cloud.ibm.com',
    disableSslVerification: true
});

const text = 'Boa noite Brunão e Fernandão. Este é um exemplo.';

const voice = 'pt-BR_IsabelaV3Voice';

app.use(express.json());

const PORT = process.env.PORT || 443;

const fileFormat = 'mp3';

const params = {
    text,
    voice,
    accept: `audio/${fileFormat}`
};

const fileName = `hello_world.${fileFormat}`;

app.listen(PORT, () => {
    console.clear();
    console.log('\n Starting server...');
    console.log('\x1b[31m' + ' server.js' + '\x1b[0m' + ' listening to port ' + '\x1b[33m' + PORT + '\x1b[0m');
    console.log('\x1b[96m' + ' http://localhost:' + PORT + '\x1b[0m');
    console.log('\n /**logs**/\n');

    textToSpeech.synthesize(params)
        .then(response => {
            // only necessary for wav formats,
            // otherwise `response.result` can be directly piped to a file
            return textToSpeech.repairWavHeaderStream(response.result);
        })
        .then(buffer => {
            fs.writeFileSync(fileName, buffer);
        })
        .catch(err => {
            console.log('error:', err);
        });
});