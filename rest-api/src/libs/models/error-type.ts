import {HttpType} from "./http-type";

export namespace ErrorType {

    export enum Type {
        DATABASE = 'DATABASE',
        INVALID_REQUEST = 'INVALID_REQUEST',
        NOT_FOUND = 'NOT_FOUND',
        INTERNAL = 'INTERNAL',
        EXTERNAL_CONNECTION = 'EXTERNAL_CONNECTION',
        ILLEGAL_ARGUMENT = 'ILLEGAL_ARGUMENT',
    }

    export class Base extends Error {
        readonly type: Type;

        constructor(type: ErrorType.Type, message: string) {
            super(message);
            this.type = type;
        }
    }

    export class Database extends Base {
        constructor(message: string) {
            super(Type.DATABASE, message);
        }
    }

    export class IllegalArgument extends Base {
        constructor(message: string) {
            super(Type.ILLEGAL_ARGUMENT, message);
        }
    }

    export class NotFound extends Base {
        constructor(message: string) {
            super(Type.NOT_FOUND, message);
        }
    }

    export class Internal extends Base {
        constructor(message: string) {
            super(Type.INTERNAL, message);
        }
    }

    export class ExternalConnection extends Base {
        readonly response?: HttpType.Response<any>;

        constructor(
            provider: string,
            response?: HttpType.Response<any>) {
            super(
                Type.EXTERNAL_CONNECTION,
                `There was a problem connecting to the remote resource gateway ${provider}`);

            this.response = response;
        }
    }

    export class InvalidRequest extends Base {
        constructor(message: string) {
            super(Type.INVALID_REQUEST, message);
        }
    }
}
