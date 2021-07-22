const path = require('path');
const fs = require('fs');
const hbs = require('../../test-utils/hbs');
const directoryPath = 'templates/common-partials/script'
const partialPath = path.resolve(__dirname, `../../../${directoryPath}`);
const files = fs.readdirSync(partialPath);

describe('common partials convert from handlebars correctly', () => {
   /*
   //Generates common-partials default values
    files.forEach(function (file) {
        const filename = file.concat('.js')
        var tempPath = path.join(__dirname, "fixtures", filename);
        fs.writeFile(tempPath, hbs.compile(fs.readFileSync(path.join(partialPath, file), 'utf-8'))(), err => {
            if (err) {
                console.error(err)
                return
            }
        });
    });
    */
    

    it('checks all common partials', () => {
        files.forEach(function (file) {
            const filename = file.concat('.js')
            var tempPath = path.join(__dirname, "fixtures", filename);
            expect(fs.readFileSync(tempPath, 'utf-8')).toEqual(hbs.compile(fs.readFileSync(path.join(partialPath, file), 'utf-8'))());
        });
    });
});
