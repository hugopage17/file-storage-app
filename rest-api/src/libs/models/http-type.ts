import {AxiosRequestConfig, AxiosResponse} from "axios";

export namespace HttpType {

    /**
     * Http methods.
     */
    export enum Method {
        POST = 'POST',
        PUT = 'PUT',
        GET = 'GET',
        DELETE = 'DELETE',
        PATCH = 'PATCH',
    }

    /**
     * Standard Http response with data of type R
     */
    export interface Response<R> {
        data?: R;
        code: number;
        status: string;
        headers?: any;
        error: any;
        success: boolean;
    }

    /**
     * Http interceptors
     */
    export interface Interceptor {
        request(request: any): AxiosRequestConfig,

        response(response: any): AxiosResponse,

        error(error: any): any
    }

    /**
     * Indexable object parameters value
     */
    export interface PathValues {
        [key: string]: any;
    }

    /**
     * Indexable object of query parameters
     */
    export interface QueryParameters {
        [name: string]: any;
    }

    /**
     * Represents the api endpoint information which is used to connect external third parties API.
     */
    export interface ApiEndpoint {
        /**
         * Name of resource (prefer all upper case)
         */
        name: string;

        /**
         * Templated path to resource
         */
        path: string;

        /**
         * A list of exclusive methods for this endpoint.
         */
        method: HttpType.Method;

        /**
         * Does the path require an access token
         */
        isProtected?: boolean;
    }

    export enum StatusCode {
        OK = 200,
        OK_NOT_CONTENT = 204,
        BAD_REQUEST = 400,
        UNAUTHORIZED = 401,
        NOT_FOUND = 404,
        INTERNAL_ERROR = 500,
        BAD_GATEWAY = 502,
        GATEWAY_TIMEOUT = 504,
        MOVE_PERMANENTLY = 301,
    }
}
