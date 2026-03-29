const fs = require('fs');
const https = require('https');
const path = require('path');

const outputTxtPath = 'C:/Users/Júlio Cesar/.gemini/antigravity/brain/a26e6a6d-f9b2-464f-afb9-889fd2168877/.system_generated/steps/255/output.txt';
const tmpScreensDir = path.join(__dirname, 'tmp_screens');

if (!fs.existsSync(tmpScreensDir)) {
    fs.mkdirSync(tmpScreensDir);
}

const data = JSON.parse(fs.readFileSync(outputTxtPath, 'utf8'));

const download = (url, dest) => {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(dest);
        https.get(url, (response) => {
            response.pipe(file);
            file.on('finish', () => {
                file.close(resolve);
            });
        }).on('error', (err) => {
            fs.unlink(dest, () => reject(err));
        });
    });
};

async function main() {
    for (const screen of data.screens) {
        if (!screen.htmlCode || !screen.htmlCode.downloadUrl) continue;
        const filename = screen.title.replace(/[^a-z0-9]/gi, '_').toLowerCase() + '.html';
        const filepath = path.join(tmpScreensDir, filename);
        console.log(`Downloading ${screen.title} to ${filename}...`);
        await download(screen.htmlCode.downloadUrl, filepath);
        console.log(`Saved ${filename}`);
    }
}

main().catch(console.error);
