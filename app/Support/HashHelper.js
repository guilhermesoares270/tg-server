'use strict'

const fs = use('fs');
const crypto = require('crypto');
const Env = use('Env');
const Helpers = use('Helpers');
const jwt = use('jsonwebtoken');

const uuid = require('uuid');
const njwt = require('njwt');

class HashHelper {

    /**
     * 
     * @param {string} sda The fingerprint of the document
     */
    static hteste (sda, url, keyidx) {
        const claims = {
            'sda': sda,
            'url': url,
            'keyidx': keyidx
        }

        const pk = fs.readFileSync(`${Helpers.tmpPath()}/private.txt`);
        const token = jwt.sign(claims, pk, { algorithm: 'RS256'});
        return token;
    }

    /**
     * This function is responsible for creating the digital signature
     * that will validate the asset be stored on a blockchain
     * 
     * @param {string} path Path to the file
     * @param {string} algorithm Algorithm to be used in the hashing
     * @return {Promise<string>} the hash value
     */
    static hash (path, algorithm = 'md5') {
        return new Promise((resolve, reject) => {
          // Algorithm depends on availability of OpenSSL on platform
          // Another algorithms: 'sha1', 'md5', 'sha256', 'sha512' ...
          const shasum = crypto.createHash(algorithm);

          try {
            const fileStream = fs.ReadStream(path);
            fileStream.on('data', function (data) {
              shasum.update(data);
            })

            fileStream.on('end', function () {
              const hash = shasum.digest('hex');
              return resolve(hash);
            })
          } catch (error) {
            return reject('The program couldn\'t create a hash');
          }
        });
      }

      /**
       * Generate a new public/private key pair
       * 
       * @return {void} 
       */
      static async generateKeyPairs() {

        return await crypto.generateKeyPair('rsa', {
            modulusLength: 4096,
            publicKeyEncoding: {
                type: 'spki',
                format: 'pem'
            },
            privateKeyEncoding: {
                type: 'pkcs8',
                format: 'pem',
                cipher: 'aes-256-cbc',
                passphrase: Env.get('RSA_PASSPHRASE')
            }
        }, (error, publicKey, privateKey) => {
            fs.writeFileSync(`${Helpers.tmpPath()}/publicKey.txt`, publicKey, (error) => {
                if (error) {
                    throw error;
                }
            });
            fs.writeFileSync(`${Helpers.tmpPath()}/privateKey.txt`, privateKey, (error) => {
                if (error) {
                    throw error;
                }
            });
        });
    }

    /**
     * Creates a new JWT using the given data and
     * a the default key adn default expirantion date
     * 
     * @param {object} data 
     */
    static createJWT(data) {
        
        const header = {
            'alg': 'HS256',
            'typ': 'JWT'
        };
        const base64Header = HashHelper.base64URL(header);
        
        const body = {
            'sub': '90129920',
            'uuid': 'teste',
            // 'iat': 1516239022,
            // 'exp': 1545926973
        };

        const base64Body = HashHelper.base64URL(body);
        // return (base64Header, base64Body);
        return HashHelper.signedJWT(base64Header, base64Body);
    }

    /**
     * Creates a signed JWT
     * 
     * @typedef header
     * @type {{}}
     * 
     * @private
     * @param {header} header 
     * @param {Object} payload
     * @type {Object}
     * @returns {Object} jwt
     */
    static signedJWT(header, payload) {

        const privateKey = Env.get('RSA_PASSPHRASE');

        // const _pk = (new Buffer(privateKey, 'hex')).toString('base64');

        const signature = HashHelper.base64URL(
            crypto.createHmac('SHA256', privateKey)
            .update(`${header}.${payload}`));
            // .digest('base64'));

        
        return(`${header}.${payload}.${signature}`);
    }

    static base64URL(data) {
        return Buffer.from(JSON.stringify(data))
            .toString('base64')
            .replace(/=/g, '')
            .replace(/\+/g, '-')
            .replace(/\//g, '_');
    }
}

module.exports = HashHelper;