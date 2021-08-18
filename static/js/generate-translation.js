const fs = require('fs');
const path = require('path');
const themePath = process.argv[2];
const outputPath = process.argv[3];

const openStatusHeader = `
import { DayNames } from './hours/constants.js';
import { OpenStatusStrings } from './hours/open-status/constants.js';
import { getLanguageFromLocale } from './utils';

export default function provideOpenStatusTranslation (locale) {
  const language = getLanguageFromLocale(locale);\n`;

const tableStringHeader = `
import { TableHeaders } from '../constants';
import { getLanguageFromLocale } from '../../utils';

export default function provideTableHeadersTranslation(locale) {
  const language = getLanguageFromLocale(locale);\n`;


const openstatustranslation = {
  generatedfilepath: `${outputPath}/static/js/open-status-i18n.js`,
  header: openStatusHeader,
  potfilepath: `${themePath}/translations/open-status.pot`
}

const tablestringtranslation = {
  generatedfilepath: `${outputPath}/static/js/hours/table/table-strings-i18n.js`,
  header: tableStringHeader,
  potfilepath: `${themePath}/translations/table-strings.pot`
}

function generateStaticTranslationFile({generatedfilepath, header, potfilepath}) {
  let data = header;
  data += generateSwitchStatement(potfilepath);
  data += '}\n';
  fs.writeFileSync(generatedfilepath, data);
}


function generateSwitchStatement(potfilepath) {
  const stringsToTranslate = parsePOTfile(potfilepath);
  const enums = generateEnums(stringsToTranslate);
  const translationsFolder = `${themePath}/translations/`;
  let data = '  switch (language) {\n';
  fs.readdirSync(translationsFolder)
    .forEach(file => {
      if(file.endsWith('.po')) {
        const language = file.substring(0, file.length - 3);
        const translations = parsePOfile(stringsToTranslate, path.join(translationsFolder, file));
        data += generateSwitchCase(language, translations, enums);
      }
    });
  data += generateDefaultSwitchCase(stringsToTranslate, enums);
  data += '  }\n';
  return data;
}

function generateEnums(stringsToTranslate) {
  return stringsToTranslate.map((str) => {
    const val = str.replace('the ', '').replace(/ /g, '_').toUpperCase();
    if(val.endsWith('DAY')) {
      return 'DayNames.' + val;
    } else if (val.includes('CLOSE') || val.includes('OPEN')) {
      return 'OpenStatusStrings.' + val;
    } else {
      return 'TableHeaders.' + val;
    }
  });
}

function generateSwitchCase(language, translations, enums) {
  if(Object.keys(translations).length == 0) {
    return '';
  }
  let switchcase = `    case '${language}':\n      return {\n`;
  Object.values(translations).forEach((msgstr, index) => switchcase += `        [${enums[index]}]: '${msgstr}',\n`);
  switchcase += '      }\n';
  return switchcase;
}

function generateDefaultSwitchCase(translations, enums) {
  let switchcase = `    default:\n      return {\n`;
  translations.forEach((msgstr, index) => switchcase += `        [${enums[index]}]: '${msgstr}',\n`);
  switchcase += '      }\n';
  return switchcase;
}

function parsePOTfile(potfilepath) {
  if (!fs.existsSync(potfilepath)) {
    throw new Error(`file ${potfilepath} does not exist.`);
  }
  var filedata = fs.readFileSync(potfilepath, 'utf-8');
  var stringsToTranslate = [];
  var target = 'msgid "';
  var fileIndex = filedata.indexOf(target) + target.length; // skip header in .pot file
  var targetIndex = filedata.indexOf(target, fileIndex);
  while (targetIndex != -1) {
    stringsToTranslate.push(filedata.substring(targetIndex + target.length, filedata.indexOf('"\n', targetIndex)));
    fileIndex = targetIndex + 1;
    targetIndex = filedata.indexOf(target, fileIndex);
  }
  return stringsToTranslate;
}

function parsePOfile(stringsToTranslate, pofilepath) {
  var filedata = fs.readFileSync(pofilepath, 'utf-8');
  var translations = {};
  stringsToTranslate.forEach(msg => {
    const msgid = `msgid "${msg}"`;
    const msgstr = 'msgstr "';
    const msgidIndex = filedata.indexOf(msgid);
    if(msgidIndex != -1) {
      const pos = filedata.indexOf(msgstr, msgidIndex) + msgstr.length;
      translations[msg] = filedata.substring(pos, filedata.indexOf('"\n', pos));
    }
  });
  return translations;
}

generateStaticTranslationFile(openstatustranslation);
generateStaticTranslationFile(tablestringtranslation);