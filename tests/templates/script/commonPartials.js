const path = require('path');
const fs = require('fs');
const hbs = require('../../test-utils/hbs');
const directoryPath = 'templates/common-partials/script'
const partialPath = path.resolve(__dirname, `../../../${directoryPath}`);
const files = fs.readdirSync(partialPath);

files.forEach(function (file) {
    const filename = file.concat('.js')
    const tempPath = path.join(__dirname, "fixtures", filename);
    const fixture = fs.readFileSync(tempPath, 'utf-8')
    const partial = fs.readFileSync(path.join(partialPath, file), 'utf-8')
    it(`checks ${file} is equal to fixture`, () => {
        expect(fixture).toEqual(hbs.compile(partial)({
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
        }));
    });    
});