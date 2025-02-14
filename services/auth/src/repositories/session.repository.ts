import { DynamoDB } from 'aws-sdk';
import { Session } from '../types';

export class SessionRepository {
  private readonly dynamodb: DynamoDB.DocumentClient;
  private readonly tableName: string;

  constructor() {
    this.dynamodb = new DynamoDB.DocumentClient();
    this.tableName = process.env.SESSIONS_TABLE!;
  }

  async create(session: Session): Promise<Session> {
    await this.dynamodb.put({
      TableName: this.tableName,
      Item: session
    }).promise();

    return session;
  }

  async findById(id: string): Promise<Session | null> {
    const result = await this.dynamodb.get({
      TableName: this.tableName,
      Key: { id }
    }).promise();

    return result.Item as Session || null;
  }
}