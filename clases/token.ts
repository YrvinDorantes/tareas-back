import jwt from 'jsonwebtoken';
import "dotenv/config";


export default class Token {

    private static seed: string = `${process.env.SEEED_JWT}`;
    private static caducidad: string = '30d';

    constructor() { }

    static getJwtToken( payload: any ): string {
        return jwt.sign({
            usuario: payload
        }, this.seed, { expiresIn: this.caducidad });

    }

    static comprobarToken( userToken: string ) {

        return new Promise( (resolve, reject ) => {

            jwt.verify( userToken, this.seed, ( err, decoded ) => {
    
                if ( err ) {
                    reject();
                } else {
                    resolve( decoded );
                }
    
    
            })

        });


    }
    


}


