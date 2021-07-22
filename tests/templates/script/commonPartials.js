const path = require('path');
const fs = require('fs');
const hbs = require('../../test-utils/hbs');
const directoryPath = 'templates/common-partials/script'
const partialPath = path.resolve(__dirname, `../../../${directoryPath}`);
const files = fs.readdirSync(partialPath);

/*
//Generates common-partials default values
files.forEach(function (file) {
    const filename = file.concat('.js')
    var tempPath = path.join(__dirname, "fixtures", filename);
    fs.writeFile(tempPath, hbs.compile(fs.readFileSync(path.join(partialPath, file), 'utf-8'))({
            "verticalKey": "testKey",
            "componentSettings": {
                "AppliedFilters": {"a": "testAF"},
                "Facets": {"a":"testF"},
                "FilterBox": {"a":"testFB"},
                "LocationBias": {"a":"testLB"},
                "Navigation": {"a":"testN"},
                "QASubmission": {"a":"testQAS"},
                "SearchBar": {"a":"testSB"},
                "SortOptions": {"a":"testSO"},
                "SpellCheck": {"a":"testSC"},
                "VerticalResults": {"a":"testVR"},
                "VerticalResultsCount": {"a":"testVRC"}
            }
        }), err => {
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
        const fixture = fs.readFileSync(tempPath, 'utf-8')
        const partial = fs.readFileSync(path.join(partialPath, file), 'utf-8')
        expect(fixture).toEqual(hbs.compile(partial)( {
            "verticalKey": "testKey",
            "componentSettings": {
                "AppliedFilters": {"a": "testAF"},
                "Facets": {"a":"testF"},
                "FilterBox": {"a":"testFB"},
                "LocationBias": {"a":"testLB"},
                "Navigation": {"a":"testN"},
                "QASubmission": {"a":"testQAS"},
                "SearchBar": {"a":"testSB"},
                "SortOptions": {"a":"testSO"},
                "SpellCheck": {"a":"testSC"},
                "VerticalResults": {"a":"testVR"},
                "VerticalResultsCount": {"a":"testVRC"}
            }
        }
        ));
    });
});
