import {APIGatewayProxyEvent} from "aws-lambda";
import {EventType} from "@libs/models/event-type";
import {ErrorType} from "@libs/models/error-type";

class EventService {

    /**
     * Returns the event endpoint from path with the path values.
     */
    public getEventEndpoint(
        event: APIGatewayProxyEvent,
        eventEndpoints: EventType.Endpoint[]): EventType.Endpoint {

        const fullPath = event.path;

        if (!fullPath) {
            throw new ErrorType.NotFound('Request not found');
        }

        const pathParameters = event.pathParameters;
        const httpMethod = event.httpMethod;

        let path = fullPath;

        for (let key in pathParameters) {
            const value = pathParameters[key];
            if (value) {
                path = fullPath.replace(value, `{${key}}`);
            }
        }

        // Endpoint will be obtained from the full path and values
        const eventEndpoint = eventEndpoints.find(eventEndpoint =>
            path.replace(/\//g, '') === eventEndpoint.path.replace(/\//g, '')
            && httpMethod === eventEndpoint.method);

        // If an endpoint is not found an exception should be thrown
        if (!eventEndpoint) {
            throw new ErrorType.NotFound(`Request ${httpMethod} ${fullPath} not found`);
        }

        return eventEndpoint;
    }

    /**
     * Returns the content from api gateway proxy.
     */
    public getEventContent(event: APIGatewayProxyEvent): EventType.Content<any> {
        return {
            body: event.body && JSON.parse(event.body!),
            queryParameters: event.queryStringParameters,
            pathParameters: event.pathParameters,
            meta: event.stageVariables,
            headers: event.headers
        };
    }
}

export const eventService = new EventService();
