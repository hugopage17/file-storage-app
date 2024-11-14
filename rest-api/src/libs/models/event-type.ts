import {HttpType} from "@libs/models/http-type";

export namespace EventType {

    /**
     * Represents the api endpoint information which are exposed by the current serverless project.
     */
    export interface Endpoint {
        /**
         * Templated path to resource.
         */
        path: string;

        /**
         * A list of exclusive methods for this endpoint.
         */
        method: HttpType.Method;

        /**
         * The schema will validate the body data of a request.
         */
        schema?: { [key in string]: unknown }

        /**
         * Function which will be executed each time that event is called.
         * @param event
         */
        execute(event: any): any;
    }

    /**
     * Represents the event of each request.
     */
    export interface Content<T> {
        /**
         * Payload of the event.
         */
        body?: T;

        /**
         * Query parameter values.
         */
        queryParameters?: any;

        /**
         * Path parameter values.
         */
        pathParameters?: any;

        /**
         * Contains extra values such startTime, timestamp or aws id from initial request.
         */
        meta?: any;

        /**
         * Contains header values.
         */
        headers?: any;
    }
}
