let fs: any;
if (process.env.REACT_APP_MODE === 'electron') {
    console.log(`REQUIRING fs-extra`);
    fs = require('fs-extra');
}

export default class TestFs {

    static getDirectoryListing(): string {
        if (process.env.REACT_APP_MODE === 'electron') {
            let files = fs.readdirSync('.');
            return JSON.stringify(files, null, 2);
        } else {
            return 'Directory listing is not available in the browser.'
        }
    }
}
