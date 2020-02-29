'use strict';

const Helpers = use('Helpers');

class FileHelper {

  static async moveToTemp(file) {

    await file.move(Helpers.tmpPath('uploads'), {
      name: `deu-certo.${file.extname}`,
      overwrite: true
    });

    if (!file.moved()) return false;
    return true;
  }
}

module.exports = FileHelper;
