export default {
    name: 'CognitoAuthorizer',
    arn: 'arn:aws:cognito-idp:ap-southeast-2:206653033893:userpool/${file(./src/config.json):chrome_user_pool}',
    resultTtlInSeconds: 300
}