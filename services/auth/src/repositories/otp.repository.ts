import { DynamoDB } from 'aws-sdk';
import { OTP } from '../types';
import { NotFoundError } from '../lib/errors';

export class OTPRepository {
  private readonly dynamodb: DynamoDB.DocumentClient;
  private readonly tableName: string;

  constructor() {
    this.dynamodb = new DynamoDB.DocumentClient();
    this.tableName = process.env.OTP_TABLE!;
  }

  async create(otp: OTP): Promise<OTP> {
    await this.dynamodb.put({
      TableName: this.tableName,
      Item: otp,
      ConditionExpression: 'attribute_not_exists(id)'
    }).promise();

    return otp;
  }

  async findByPhoneAndCode(phoneNumber: string, code: string): Promise<OTP | null> {
    const result = await this.dynamodb.query({
      TableName: this.tableName,
      IndexName: 'phone-code-index',
      KeyConditionExpression: 'phoneNumber = :phone AND code = :code',
      ExpressionAttributeValues: {
        ':phone': phoneNumber,
        ':code': code
      }
    }).promise();

    return result.Items?.[0] as OTP || null;
  }

  async markAsVerified(id: string): Promise<OTP> {
    const result = await this.dynamodb.update({
      TableName: this.tableName,
      Key: { id },
      UpdateExpression: 'SET verified = :verified',
      ExpressionAttributeValues: {
        ':verified': true
      },
      ReturnValues: 'ALL_NEW'
    }).promise();

    return result.Attributes as OTP;
  }
}