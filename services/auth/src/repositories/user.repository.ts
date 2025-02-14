import { DynamoDB } from 'aws-sdk';
import { User } from '../types';
import { NotFoundError, ConflictError, ServerError } from '../lib/errors';

export class UserRepository {
  private readonly dynamodb: DynamoDB.DocumentClient;
  private readonly tableName: string;

  constructor() {
    this.dynamodb = new DynamoDB.DocumentClient();
    this.tableName = process.env.USERS_TABLE!;
  }

  async create(user: User): Promise<User> {
    try {
      await this.dynamodb.put({
        TableName: this.tableName,
        Item: user,
        ConditionExpression: 'attribute_not_exists(id)'
      }).promise();

      return user;
    } catch (error) {
      if (error.code === 'ConditionalCheckFailedException') {
        throw new ConflictError('User already exists');
      }
      throw new ServerError(`Failed to create user: ${error.message}`);
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    try {
      const result = await this.dynamodb.query({
        TableName: this.tableName,
        IndexName: 'email-index',
        KeyConditionExpression: 'email = :email',
        ExpressionAttributeValues: {
          ':email': email
        }
      }).promise();

      return result.Items?.[0] as User || null;
    } catch (error) {
      throw new ServerError(`Failed to find user by email: ${error.message}`);
    }
  }

  async findByPhone(phone: string): Promise<User | null> {
    const result = await this.dynamodb.query({
      TableName: this.tableName,
      IndexName: 'phone-index',
      KeyConditionExpression: 'phone = :phone',
      ExpressionAttributeValues: {
        ':phone': phone
      }
    }).promise();

    return result.Items?.[0] as User || null;
  }
}