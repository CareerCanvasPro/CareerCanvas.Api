import { DynamoDB } from 'aws-sdk';
import { MagicLink } from '../types';
import { NotFoundError } from '../lib/errors';

export class MagicLinkRepository {
  private readonly dynamodb: DynamoDB.DocumentClient;
  private readonly tableName: string;

  constructor() {
    this.dynamodb = new DynamoDB.DocumentClient();
    this.tableName = process.env.MAGIC_LINKS_TABLE!;
  }

  async create(magicLink: MagicLink): Promise<MagicLink> {
    await this.dynamodb.put({
      TableName: this.tableName,
      Item: magicLink,
      ConditionExpression: 'attribute_not_exists(id)'
    }).promise();

    return magicLink;
  }

  async findByToken(token: string): Promise<MagicLink | null> {
    const result = await this.dynamodb.query({
      TableName: this.tableName,
      IndexName: 'token-index',
      KeyConditionExpression: 'token = :token',
      ExpressionAttributeValues: {
        ':token': token
      }
    }).promise();

    return result.Items?.[0] as MagicLink || null;
  }

  async markAsUsed(id: string): Promise<MagicLink> {
    const result = await this.dynamodb.update({
      TableName: this.tableName,
      Key: { id },
      UpdateExpression: 'SET used = :used',
      ExpressionAttributeValues: {
        ':used': true
      },
      ReturnValues: 'ALL_NEW'
    }).promise();

    return result.Attributes as MagicLink;
  }
}