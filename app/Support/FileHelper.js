'use strict';

const fs = use('fs');
const Helpers = use('Helpers');

class FileHelper {

    static async moveToTemp(file) {
       
        await file.move(Helpers.tmpPath('uploads'), {
            name: `deu-certo.${file.extname}`,
            overwrite: true
        });

        if (!file.moved()) {
            // return file.error();
            // throw file.error();
            return false;
        }
        // return 'File moved';
        return true;
    }
}

module.exports = FileHelper;