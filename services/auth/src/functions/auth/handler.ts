import { APIGatewayProxyHandler } from "aws-lambda";
import { AuthService } from "../../services/auth.service";
import { loginSchema, registerSchema } from "../../validations/schemas";
import { response } from "../../lib/response";
import { request } from "../../lib/request";
import { validate } from "../../lib/validate";
import { ValidationError, AuthenticationError } from "../../lib/errors";
import { withAuth } from "../../lib/auth";

export const login: APIGatewayProxyHandler = async (event) => {
  try {
    const { value: body } = await validate(loginSchema)(request.getBody(event));
    const authService = new AuthService();
    const result = await authService.login(body.email, body.password);
    return response.success(result);
  } catch (error) {
    return response.error(error, "Login failed");
  }
};

export const register: APIGatewayProxyHandler = async (event) => {
  try {
    const { value: body } = await validate(registerSchema)(request.getBody(event));
    const authService = new AuthService();
    const result = await authService.register(body);
    return response.success(result, 201);
  } catch (error) {
    return response.error(error, "Registration failed");
  }
};

export const sendMagicLink: APIGatewayProxyHandler = async (event) => {
  try {
    const { value: body } = await validate(magicLinkSchema)(request.getBody(event));
    const authService = new AuthService();
    await authService.sendMagicLink(
      body.email, 
      body.method, 
      event.headers['User-Agent']
    );
    return response.success({ message: 'Magic link sent successfully' });
  } catch (error) {
    return response.error(error, 'Failed to send magic link');
  }
};

export const sendOTP: APIGatewayProxyHandler = async (event) => {
  try {
    const { value: body } = await validate(otpSchema)(request.getBody(event));
    const authService = new AuthService();
    await authService.sendOTP(
      body.phoneNumber,
      event.headers['User-Agent']
    );
    return response.success({ message: 'OTP sent successfully' });
  } catch (error) {
    return response.error(error, 'Failed to send OTP');
  }
};

export const verifyMagicLink: APIGatewayProxyHandler = async (event) => {
  try {
    const { value: body } = await validate(verifyMagicLinkSchema)(request.getBody(event));
    const authService = new AuthService();
    const result = await authService.verifyMagicLink(body.token);
    return response.success(result);
  } catch (error) {
    return response.error(error, 'Failed to verify magic link');
  }
};

export const verifyOTP: APIGatewayProxyHandler = async (event) => {
  try {
    const { value: body } = await validate(verifyOtpSchema)(request.getBody(event));
    const authService = new AuthService();
    const result = await authService.verifyOTP(body.phoneNumber, body.code);
    return response.success(result);
  } catch (error) {
    return response.error(error, 'Failed to verify OTP');
  }
};

export const me: APIGatewayProxyHandler = withAuth(async (event) => {
  try {
    const userId = event.requestContext.authorizer?.userId;
    if (!userId) {
      throw new AuthenticationError('User ID not found in token');
    }

    const authService = new AuthService();
    const user = await authService.getProfile(userId);
    return response.success({ user });
  } catch (error) {
    return response.error(error, "Failed to fetch user profile");
  }
});