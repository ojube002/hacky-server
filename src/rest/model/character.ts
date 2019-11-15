/**
 * Test rest api
 * REST API for test
 *
 * OpenAPI spec version: 3.0.0
 * 
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 */


export interface Character { 
    id: string  | null;
    name: string ;
    level: number ;
    experience: number ;
    readonly createdAt: Date  | null;
    readonly updatedAt: Date  | null;
}    

export interface CharacterOpt { 
    id?: string;
    name?: string;
    level?: number;
    experience?: number;
    readonly createdAt?: Date;
    readonly updatedAt?: Date;
}