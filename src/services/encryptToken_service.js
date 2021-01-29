'use strict';
const logger = require('../config/log4js_config');
const headerSchema = require('../schemas/header_schema');
const encryptTokenSchema = require('../schemas/encryptToken_schema');
const jwt = require('jsonwebtoken');
const firmaTokenJwt = process.env.FIRMATOKENJWT;
const duracionTokenJwt = parseInt(process.env.DURACIONTOKENJWT);
const { JWE } = require('jose');
const firmaTokenJwe = process.env.FIRMATOKENJWE;

class Token {
    /**
     * @method
     * @description Valida el request de la solicitud
     * @param {object} headers cabecera de la solicitud
     * @param {object} body cuerpo de la solicitud
     * @param {object} res objeto que contiene respuesta de la solicitud
     */
    validarRequest(headers, body) {
        const Ajv = require('ajv');
        const ajv = new Ajv();
        let valid;

        return new Promise((resolve, reject) => {
            logger.info('Validando request de la solicitud');
            // Validando headers de la solicitud
            valid = ajv.validate(headerSchema, headers);
            if (!valid) {
                logger.error('Solicitud invalida - Headers invalidos!');

                // Llamando a metodo que arma objeto error
                reject(this.handlingError(400, '400', `${ajv.errors[0].message}`));
            } else {
                // Validando body de la solicitud
                valid = ajv.validate(encryptTokenSchema, body);

                if (!valid) {
                    logger.error('Solicitud invalida - Body invalido!');

                    // Llamando a metodo que arma objeto error
                    reject(this.handlingError(400, '400', `${ajv.errors[0].dataPath} - ${ajv.errors[0].message}`));
                } else {
                    logger.info('Solicitud valida!');
                    resolve(body);
                }
            }
        });
    }

    /**
     * @method
     * @description Metodo para validar si el objeto payload contiene propiedades
     * @param {object} payload objeto que contiene cuerpo del token
     * @returns {boolean} devuelve true si objeto contiene propiedades, false si no contiene
     */
    validarPayload(payload) {
        let arregloPropiedades = Object.keys(payload);

        logger.info('Validando payload');
        // Validando cantidad de propiedades
        if (arregloPropiedades.length > 0) {
            logger.info('Payload valido - contiene propiedades');
            return true;
        } else {
            logger.info('Payload invalido - no contiene propiedades');
            return false;
        }
    }

    /**
     * @method
     * @description Metodo para generar token
     * @param {object} payload objeto que contiene cuerpo del token
     * @returns {String} devuelve token generado
     */
    generarToken(payload) {
        logger.info('Generando token');
        let token = jwt.sign(
            {
                data: payload
            },
            firmaTokenJwt,
            { expiresIn: duracionTokenJwt }
        );

        return token;
    }

    /**
     * @method
     * @description Metodo para encriptar token
     * @param {String} token Token
     * @returns {String} devuelve token encriptado
     */
    encriptarToken(token) {
        logger.info('Encriptando token');
        let tokenJwe = JWE.encrypt(token, firmaTokenJwe);

        return tokenJwe;
    }

    /**
     * @method
     * @description Metodo para crear estructura de objeto error
     * @param {integer} status código estado de respuesta HTTP
     * @param {String} code codigo de error
     * @param {String} message mensaje de error
     * @returns {object} devuelv objeto error
     */
    handlingError(status, code, message) {
        let error = new Object();
        error.status = status;
        error.code = code;
        error.message = message;
        return error;
    }
}

module.exports = Token;
