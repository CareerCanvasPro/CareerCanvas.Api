import { createHmac } from "node:crypto";

import {
  AdminGetUserCommand,
  CognitoIdentityProviderClient,
  ConfirmForgotPasswordCommand,
  ConfirmForgotPasswordCommandOutput,
  ConfirmSignUpCommand,
  ConfirmSignUpCommandOutput,
  ForgotPasswordCommand,
  ForgotPasswordCommandOutput,
  InitiateAuthCommand,
  InitiateAuthCommandOutput,
  ListUsersCommand,
  ResendConfirmationCodeCommand,
  ResendConfirmationCodeCommandOutput,
  SignUpCommand,
  SignUpCommandOutput,
  UpdateUserAttributesCommand,
  UpdateUserAttributesCommandOutput,
  UserStatusType,
  VerifyUserAttributeCommand,
  VerifyUserAttributeCommandOutput,
} from "@aws-sdk/client-cognito-identity-provider";

import { config } from "@career-canvas/services/auth/config";
import { IUserAttributes } from "@career-canvas/services/auth/src/types";

export class Cognito {
  private readonly clientId = config.aws.cognito.clientId;
  private readonly cognitoIdentityProviderClient: CognitoIdentityProviderClient;
  private readonly config = {
    region: config.aws.cognito.region,
  };
  private readonly secretHash = config.aws.cognito.secretHash;
  private readonly userPoolId = config.aws.cognito.userPoolId;

  constructor() {
    this.cognitoIdentityProviderClient = new CognitoIdentityProviderClient(
      this.config
    );
  }

  // Sign Up Method
  public async handleSignUp(
    password: string,
    userAttributes: Array<IUserAttributes>,
    username: string
  ): Promise<SignUpCommandOutput> {
    try {
      return await this.cognitoIdentityProviderClient.send(
        new SignUpCommand({
          ClientId: this.clientId,
          Password: password,
          SecretHash: this.generateSecretHash(username),
          UserAttributes: userAttributes,
          Username: username,
        })
      );
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
    }
  }

  // Sign in User
  public async handleSignIn(
    password: string,
    username: string
  ): Promise<InitiateAuthCommandOutput> {
    try {
      return await this.cognitoIdentityProviderClient.send(
        new InitiateAuthCommand({
          AuthFlow: "USER_PASSWORD_AUTH",
          AuthParameters: {
            PASSWORD: password,
            SECRET_HASH: this.generateSecretHash(username),
            USERNAME: username,
          },
          ClientId: this.clientId,
        })
      );
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
    }
  }

  // Account confirm after Sign up
  public async confirmSignUp(
    confirmationCode: string,
    username: string
  ): Promise<ConfirmSignUpCommandOutput> {
    try {
      return await this.cognitoIdentityProviderClient.send(
        new ConfirmSignUpCommand({
          ClientId: this.clientId,
          ConfirmationCode: confirmationCode,
          SecretHash: this.generateSecretHash(username),
          Username: username,
        })
      );
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
    }
  }

  public async handleForgotPassword(
    username: string
  ): Promise<ForgotPasswordCommandOutput> {
    try {
      return await this.cognitoIdentityProviderClient.send(
        new ForgotPasswordCommand({
          ClientId: this.clientId,
          SecretHash: this.generateSecretHash(username),
          Username: username,
        })
      );
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
    }
  }

  public async confirmForgotPassword(
    confirmationCode: string,
    password: string,
    username: string
  ): Promise<ConfirmForgotPasswordCommandOutput> {
    try {
      return await this.cognitoIdentityProviderClient.send(
        new ConfirmForgotPasswordCommand({
          ClientId: this.clientId,
          ConfirmationCode: confirmationCode,
          Password: password,
          SecretHash: this.generateSecretHash(username),
          Username: username,
        })
      );
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
    }
  }

  public async handleChangeEmail(
    accessToken: string,
    email: string
  ): Promise<UpdateUserAttributesCommandOutput> {
    try {
      return await this.cognitoIdentityProviderClient.send(
        new UpdateUserAttributesCommand({
          AccessToken: accessToken,
          UserAttributes: [
            {
              Name: "email",
              Value: email,
            },
          ],
        })
      );
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
    }
  }

  public async VerifyChangeEmail(
    accessToken: string,
    confirmationCode: string
  ): Promise<VerifyUserAttributeCommandOutput> {
    try {
      return await this.cognitoIdentityProviderClient.send(
        new VerifyUserAttributeCommand({
          AccessToken: accessToken, // The access token of the authenticated user
          AttributeName: "email",
          Code: confirmationCode, // The OTP/code received in the email
        })
      );
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
    }
  }

  public async resendConfirmationCode(
    username: string
  ): Promise<ResendConfirmationCodeCommandOutput> {
    try {
      return await this.cognitoIdentityProviderClient.send(
        new ResendConfirmationCodeCommand({
          ClientId: this.clientId,
          SecretHash: this.generateSecretHash(username),
          Username: username,
        })
      );
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
    }
  }

  public async checkIfUserExists(email: string): Promise<boolean> {
    try {
      const output = await this.cognitoIdentityProviderClient.send(
        new ListUsersCommand({
          // Replace with your actual Cognito User Pool ID
          Filter: `email = "${email}"`, // Search by email
          UserPoolId: this.userPoolId,
        })
      );

      return output.Users && output.Users.length > 0;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
    }
  }

  public async checkUserStatus(username: string): Promise<UserStatusType> {
    try {
      const output = await this.cognitoIdentityProviderClient.send(
        new AdminGetUserCommand({
          UserPoolId: this.userPoolId, // Your Cognito User Pool ID
          Username: username, // The username of the user to check
        })
      );

      return output.UserStatus;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
    }
  }

  // Generate Hash Code for extra leyer request security
  private generateSecretHash(username: string): string {
    return createHmac("sha256", this.secretHash)
      .update(username + this.clientId)
      .digest("base64");
  }
}
