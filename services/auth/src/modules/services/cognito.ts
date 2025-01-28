// import { createHmac } from "node:crypto";

// import {
//   AdminGetUserCommand,
//   AliasExistsException,
//   CodeDeliveryFailureException,
//   CodeMismatchException,
//   CognitoIdentityProviderClient,
//   CognitoIdentityProviderServiceException,
//   ConcurrentModificationException,
//   ConfirmForgotPasswordCommand,
//   ConfirmForgotPasswordCommandOutput,
//   ConfirmSignUpCommand,
//   ConfirmSignUpCommandOutput,
//   DuplicateProviderException,
//   EnableSoftwareTokenMFAException,
//   ExpiredCodeException,
//   ForbiddenException,
//   ForgotPasswordCommand,
//   ForgotPasswordCommandOutput,
//   GroupExistsException,
//   InitiateAuthCommand,
//   InitiateAuthCommandOutput,
//   InternalErrorException,
//   InvalidEmailRoleAccessPolicyException,
//   InvalidLambdaResponseException,
//   InvalidOAuthFlowException,
//   InvalidParameterException,
//   InvalidPasswordException,
//   InvalidSmsRoleAccessPolicyException,
//   InvalidSmsRoleTrustRelationshipException,
//   InvalidUserPoolConfigurationException,
//   LimitExceededException,
//   ListUsersCommand,
//   MFAMethodNotFoundException,
//   NotAuthorizedException,
//   PasswordResetRequiredException,
//   PreconditionNotMetException,
//   ResendConfirmationCodeCommand,
//   ResendConfirmationCodeCommandOutput,
//   ResourceNotFoundException,
//   ScopeDoesNotExistException,
//   SignUpCommand,
//   SignUpCommandOutput,
//   SoftwareTokenMFANotFoundException,
//   TooManyFailedAttemptsException,
//   TooManyRequestsException,
//   UnauthorizedException,
//   UnexpectedLambdaException,
//   UnsupportedIdentityProviderException,
//   UnsupportedOperationException,
//   UnsupportedTokenTypeException,
//   UnsupportedUserStateException,
//   UpdateUserAttributesCommand,
//   UpdateUserAttributesCommandOutput,
//   UserImportInProgressException,
//   UserLambdaValidationException,
//   UserNotConfirmedException,
//   UserNotFoundException,
//   UserPoolAddOnNotEnabledException,
//   UserPoolTaggingException,
//   UserStatusType,
//   UsernameExistsException,
//   VerifyUserAttributeCommand,
//   VerifyUserAttributeCommandOutput,
// } from "@aws-sdk/client-cognito-identity-provider";

// import { config } from "../../config";
// import { IError, IUserAttributes } from "../../types";

// export class Cognito {
//   private readonly clientId = config.aws.cognito.clientId;
//   private readonly clientSecret = config.aws.cognito.clientSecret;
//   private readonly cognitoIdentityProviderClient: CognitoIdentityProviderClient;
//   private readonly config = {
//     region: config.aws.cognito.region,
//   };
//   private readonly exceptions = [
//     AliasExistsException,
//     CodeDeliveryFailureException,
//     CodeMismatchException,
//     CognitoIdentityProviderServiceException,
//     ConcurrentModificationException,
//     DuplicateProviderException,
//     EnableSoftwareTokenMFAException,
//     ExpiredCodeException,
//     ForbiddenException,
//     GroupExistsException,
//     InternalErrorException,
//     InvalidEmailRoleAccessPolicyException,
//     InvalidLambdaResponseException,
//     InvalidOAuthFlowException,
//     InvalidParameterException,
//     InvalidPasswordException,
//     InvalidSmsRoleAccessPolicyException,
//     InvalidSmsRoleTrustRelationshipException,
//     InvalidUserPoolConfigurationException,
//     LimitExceededException,
//     MFAMethodNotFoundException,
//     NotAuthorizedException,
//     PasswordResetRequiredException,
//     PreconditionNotMetException,
//     ResourceNotFoundException,
//     ScopeDoesNotExistException,
//     SoftwareTokenMFANotFoundException,
//     TooManyFailedAttemptsException,
//     TooManyRequestsException,
//     UnauthorizedException,
//     UnexpectedLambdaException,
//     UnsupportedIdentityProviderException,
//     UnsupportedOperationException,
//     UnsupportedTokenTypeException,
//     UnsupportedUserStateException,
//     UserImportInProgressException,
//     UserLambdaValidationException,
//     UserNotConfirmedException,
//     UserNotFoundException,
//     UserPoolAddOnNotEnabledException,
//     UserPoolTaggingException,
//     UsernameExistsException,
//   ];
//   private readonly userPoolId = config.aws.cognito.userPoolId;

//   constructor() {
//     this.cognitoIdentityProviderClient = new CognitoIdentityProviderClient(
//       this.config
//     );
//   }

//   public async checkIfUserExists(email: string): Promise<boolean> {
//     const output = await this.cognitoIdentityProviderClient.send(
//       new ListUsersCommand({
//         // Replace with your actual Cognito User Pool ID
//         Filter: `email = "${email}"`, // Search by email
//         UserPoolId: this.userPoolId,
//       })
//     );

//     return output.Users && output.Users.length > 0;
//   }

//   public async checkUserStatus(username: string): Promise<UserStatusType> {
//     const output = await this.cognitoIdentityProviderClient.send(
//       new AdminGetUserCommand({
//         UserPoolId: this.userPoolId, // Your Cognito User Pool ID
//         Username: username, // The username of the user to check
//       })
//     );

//     return output.UserStatus;
//   }

//   // Generate Hash Code for extra leyer request security
//   private generateSecretHash(username: string): string {
//     return createHmac("sha256", this.clientSecret)
//       .update(username + this.clientId)
//       .digest("base64");
//   }

//   public async handleUpdateEmail(
//     accessToken: string,
//     email: string
//   ): Promise<UpdateUserAttributesCommandOutput> {
//     return await this.cognitoIdentityProviderClient.send(
//       new UpdateUserAttributesCommand({
//         AccessToken: accessToken,
//         UserAttributes: [
//           {
//             Name: "email",
//             Value: email,
//           },
//         ],
//       })
//     );
//   }

//   public handleError(error: unknown): IError {
//     for (const exception of this.exceptions) {
//       if (error instanceof exception) {
//         return {
//           httpStatusCode: error.$metadata.httpStatusCode,
//           message: error.message,
//         };
//       }
//     }

//     return {
//       httpStatusCode: null,
//       message: null,
//     };
//   }

//   // Sign Up Method
//   public async handleSignUp(
//     password: string,
//     userAttributes: Array<IUserAttributes>,
//     username: string
//   ): Promise<SignUpCommandOutput> {
//     return await this.cognitoIdentityProviderClient.send(
//       new SignUpCommand({
//         ClientId: this.clientId,
//         Password: password,
//         SecretHash: this.generateSecretHash(username),
//         UserAttributes: userAttributes,
//         Username: username,
//       })
//     );
//   }

//   // Account confirm after Sign up
//   public async handleConfirmSignUp(
//     confirmationCode: string,
//     email: string
//   ): Promise<ConfirmSignUpCommandOutput> {
//     return await this.cognitoIdentityProviderClient.send(
//       new ConfirmSignUpCommand({
//         ClientId: this.clientId,
//         ConfirmationCode: confirmationCode,
//         SecretHash: this.generateSecretHash(email),
//         Username: email,
//       })
//     );
//   }

//   // Sign in User
//   public async handleSignIn(
//     email: string,
//     password: string
//   ): Promise<InitiateAuthCommandOutput> {
//     return await this.cognitoIdentityProviderClient.send(
//       new InitiateAuthCommand({
//         AuthFlow: "USER_PASSWORD_AUTH",
//         AuthParameters: {
//           PASSWORD: password,
//           SECRET_HASH: this.generateSecretHash(email),
//           USERNAME: email,
//         },
//         ClientId: this.clientId,
//       })
//     );
//   }

//   public async handleForgotPassword(
//     email: string
//   ): Promise<ForgotPasswordCommandOutput> {
//     return await this.cognitoIdentityProviderClient.send(
//       new ForgotPasswordCommand({
//         ClientId: this.clientId,
//         SecretHash: this.generateSecretHash(email),
//         Username: email,
//       })
//     );
//   }

//   public async handleConfirmForgotPassword(
//     confirmationCode: string,
//     email: string,
//     password: string
//   ): Promise<ConfirmForgotPasswordCommandOutput> {
//     return await this.cognitoIdentityProviderClient.send(
//       new ConfirmForgotPasswordCommand({
//         ClientId: this.clientId,
//         ConfirmationCode: confirmationCode,
//         Password: password,
//         SecretHash: this.generateSecretHash(email),
//         Username: email,
//       })
//     );
//   }

//   public async handleResendConfirmationCode(
//     username: string
//   ): Promise<ResendConfirmationCodeCommandOutput> {
//     return await this.cognitoIdentityProviderClient.send(
//       new ResendConfirmationCodeCommand({
//         ClientId: this.clientId,
//         SecretHash: this.generateSecretHash(username),
//         Username: username,
//       })
//     );
//   }

//   public async handleVerifyEmail(
//     accessToken: string,
//     confirmationCode: string
//   ): Promise<VerifyUserAttributeCommandOutput> {
//     return await this.cognitoIdentityProviderClient.send(
//       new VerifyUserAttributeCommand({
//         AccessToken: accessToken, // The access token of the authenticated user
//         AttributeName: "email",
//         Code: confirmationCode, // The OTP/code received in the email
//       })
//     );
//   }
// }
