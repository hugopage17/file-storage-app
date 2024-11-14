export class ResponseBase {
    headers: NodeJS.Dict<any>;
    body?: string;

    constructor(public statusCode: number, body?: any) {
        this.body = JSON.stringify(body)
        this.headers = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true,
        }
    }
}

export namespace Response {
    export class OK<T> extends ResponseBase {
        constructor(body: T) {
            super(200, body)
        }
    }

    export class OKCreated<T> extends ResponseBase {
        constructor(body: T) {
            super(201, body)
        }
    }

    export class OKNoContent extends ResponseBase {
        constructor() {
            super(204)
        }
    }
    
    export class BadRequest extends ResponseBase {
        constructor(Message: string) {
            super(400, { Message })
        }
    }

    export class NotFound extends ResponseBase {
        constructor(Message: string) {
            super(404, { Message })
        }
    }
}