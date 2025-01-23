import config from '../../config/config';
import UserProfile from "./schema";
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';
import {
  DynamoDBClient,
  PutItemCommand,
  UpdateItemCommand,
  DeleteItemCommand,
  GetItemCommand,
  BatchGetItemCommand,
  ScanCommand
} from "@aws-sdk/client-dynamodb";

export default class UserManagementService {
  private readonly tableName: string;
  private readonly primaryKey: string;
  private readonly dynamoDBClient: DynamoDBClient;
  private config = {
    region: config.aws.cognito.region,
  }

  constructor(tableName: string, primaryKey: string) {
    this.tableName = tableName;
    this.primaryKey = primaryKey;
    this.dynamoDBClient = new DynamoDBClient(this.config );
  }

  async createItem(item: UserProfile): Promise<{ response?:any}> {
    try {
      const params = {
        TableName: this.tableName,
        Item: marshall(item),
      };
      const command = new PutItemCommand(params);
      const resp = await this.dynamoDBClient.send(command);
      return { response: resp,};
    } catch (error) {
      return { response: error };
    }
  }

  async createAttributeChangeRequest(item: any): Promise<{ response?:any}> {
    try {
      const params = {
        TableName: this.tableName,
        Item: marshall(item),
      };
      const command = new PutItemCommand(params);
      const resp = await this.dynamoDBClient.send(command);
      return { response: resp,};
    } catch (error) {
      return { response: error };
    }
  }

  async updateItem(
    updateExpression: any,
    expressionAttributeNames:any,
    expressionAttributeValues: { [key: string]: any }
  ): Promise<{ success: boolean; message: string; data?: any }> {
    try {
      const params = {
        TableName: this.tableName,
        Key: { ["username"]: { S: this.primaryKey } },
        UpdateExpression: updateExpression,
        ExpressionAttributeNames: expressionAttributeNames,
        ExpressionAttributeValues: expressionAttributeValues,
      };

      const command = new UpdateItemCommand(params);
      const data = await this.dynamoDBClient.send(command);
      return { success: true, message: 'Item updated successfully', data };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  async updateMatchPreference(
    username: string,
    matchPreference: any
  ): Promise<{ success: boolean; message: string; data?: any }> {
    try {
      // Step 1: Fetch current matchPreference from DynamoDB
      const currentMatchPreference = await this.getCurrentMatchPreference(username);

      // Step 2: Compare incoming matchPreference with currentMatchPreference to find updates
      const updates = this.getUpdatedFields(currentMatchPreference, matchPreference);

      const marshalledUpdates = marshall(updates);
    


        const params = {
          TableName: this.tableName,
          Key: {
            username: { S: username },
          },
          UpdateExpression: "set matchPreference = :mp",
          ExpressionAttributeValues: {
            ":mp": { M: marshalledUpdates },
          },
        };

        const command = new UpdateItemCommand(params);
        const data = await this.dynamoDBClient.send(command);

        return { success: true, message: "Item updated successfully", data };

    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  // Fetch current matchPreference for a user
  private async getCurrentMatchPreference(username: string): Promise<any> {
    const params = {
      TableName: this.tableName,
      Key: {
        username: { S: username },
      },
    };

    const command = new GetItemCommand(params);
    const result = await this.dynamoDBClient.send(command);

    if (result.Item) {
      return unmarshall(result.Item).matchPreference || {};  // Return current matchPreference, default to empty object if not found
    }
    return {};  // Return empty if no data found
  }

  private getUpdatedFields(current: any, incoming: any): any {
    const updates: any = { ...current }; // Start with all fields from `current`

    // Clean incoming and current objects to remove null/undefined or unwanted fields
    const cleanedIncoming = this.cleanObject(incoming);
    const cleanedCurrent = this.cleanObject(current);

    // Update or add fields from `incoming` to `updates` only if the value has changed
    Object.entries(cleanedIncoming).forEach(([key, value]) => {
      // Update only if the value in `incoming` is different from `current`
      if (JSON.stringify(cleanedCurrent[key]) !== JSON.stringify(value)) {
        updates[key] = value;
      }
    });

    // Remove any remaining null or undefined values in `updates`
    const finalUpdates = this.cleanObject(updates);
    return finalUpdates;
  }





  // Utility function to clean up the object by removing empty/null/undefined values
  private cleanObject(obj: any): any {
    if (Array.isArray(obj)) {
      return obj.filter(item => item !== null && item !== undefined && item !== "");
    }

    if (typeof obj === "object" && obj !== null) {
      return Object.entries(obj).reduce((acc, [key, value]) => {
        if (value !== null && value !== undefined && value !== "" && 
            (!(Array.isArray(value) && value.length === 0))) {
          acc[key] = this.cleanObject(value);  // Recursive cleaning for nested objects
        }
        return acc;
      }, {});
    }

    return obj;  // Return the value as is if it's not an object or array
  }

  // Dynamically build the UpdateExpression for DynamoDB
  private buildUpdateExpression(updates: any): string {
    const setExpressions = Object.keys(updates).map(key => `#${key} = :${key}`);
    return `set ${setExpressions.join(", ")}`;
  }


  
  
  async updateAdvancePreference(
    username:string,
    advancePreference:any
  ): Promise<{ success: boolean; message: string; data?: any }> {

    const marshalledMatchPreference = marshall(advancePreference);
    const params = {
      TableName: this.tableName,
      Key: {
        username: { S: username },
      },
      UpdateExpression: "set advancePreference = :mp",
      ExpressionAttributeValues: {
        ":mp": { M: marshalledMatchPreference },
      }
    };

    try {
      const command = new UpdateItemCommand(params);
      const data = await this.dynamoDBClient.send(command);
      return { success: true, message: 'Item updated successfully', data };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  async updateNotificationSetting(
    username:string,
    data:any
  ): Promise<{ success: boolean; message: string; data?: any }> {

    const marshalledMatchPreference = marshall(data);
    const params = {
      TableName: this.tableName,
      Key: {
        username: { S: username },
      },
      UpdateExpression: "set notificationSettings = :mp",
      ExpressionAttributeValues: {
        ":mp": { M: marshalledMatchPreference },
      }
    };

    try {
      const command = new UpdateItemCommand(params);
      const data = await this.dynamoDBClient.send(command);
      return { success: true, message: 'Item updated successfully', data };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  
  async updateImageGalleries(username: string, updateGalleries: Array<any>): Promise<{ success: boolean; message: string; data?: any }> {

    try {
        let params;

          params = {
              TableName: this.tableName,
              Key: {
                  username: { S: username },
              },
              UpdateExpression: 'SET imageGallery = list_append(if_not_exists(imageGallery, :emptyList), :newGalleries)',
              ExpressionAttributeValues: {
                  ':newGalleries': { L: marshall(updateGalleries) },
                  ':emptyList': { L: [] }
              }
          };
        const command = new UpdateItemCommand(params);
        const data = await this.dynamoDBClient.send(command);
        return { success: true, message: 'Item updated successfully', data };
    } catch (error) {
        return { success: false, message: error.message };
    }
  }

  async updateIdentity(username: string, updatetrustbadge: any): Promise<{ success: boolean; message: string; data?: any }> {

    try {
      
      const params = {
        TableName: this.tableName,
        Key: {
            "username": { S: username }
        },
        UpdateExpression: 'SET trustbadge = :updatetrustbadge, trustbadgeStatus = :updatetrustbadgestatus',
        ExpressionAttributeValues: marshall({
            ":updatetrustbadge": updatetrustbadge,
            ":updatetrustbadgestatus": "pending"
        })
    };

        const command = new UpdateItemCommand(params);
        const data = await this.dynamoDBClient.send(command);
        return { success: true, message: 'Item updated successfully', data };
    } catch (error) {
        return { success: false, message: error.message };
    }
  }

  async deleteTrustBadgeByUrl(username: string, url: string) {
    try {
      // Step 1: Fetch the user item
      const getParams = {
        TableName: "userprofiles",
        Key: { username: { S: username } },
      };
  
      const getResult = await this.dynamoDBClient.send(new GetItemCommand(getParams));
      const trustbadge = getResult.Item?.trustbadge?.L;
  
      if (!trustbadge) {
        return { status: "error", message: "Trustbadge list not found" };
      }
  
      // Step 2: Find the index of the trust badge to delete
      const badgeIndex = trustbadge.findIndex((badge) => badge.M?.url?.S === url);

      if (badgeIndex === -1) {
        return { status: "error", message: "Trustbadge with specified URL not found" };
      }
  
      // Step 3: Remove the trust badge item and set `trustbadgeStatus` to 'false'
      const deleteParamsDynamoDB = {
        TableName: "userprofiles",
        Key: { username: { S: username } },
        UpdateExpression: `REMOVE trustbadge[${badgeIndex}] SET trustbadgeStatus = :false`,
        ExpressionAttributeValues: {
          ":false": { BOOL: false }, // Change this to a string if `trustbadgeStatus` is actually a string
        }
      };
  
      const updateResult = await this.dynamoDBClient.send(new UpdateItemCommand(deleteParamsDynamoDB));
      return { status: "success", message: "Trustbadge deleted and status updated", data: updateResult.Attributes };
  
    } catch (error) {
      console.error("Error deleting trust badge or updating status:", error);
      return { status: "error", message: error.message };
    }
  }
  
  
  async deleteImageGalleries(username: string, updateGalleries: any): Promise<{ success: boolean; message: string; data?: any }> {

    try {
      const params = {
        TableName: this.tableName,
        Key: {
            "username": { S: username }
        },
        UpdateExpression: 'SET imageGallery = :updateGallery',
        ExpressionAttributeValues: marshall({ ":updateGallery": updateGalleries })
      };
      const command = new UpdateItemCommand(params);
      const data = await this.dynamoDBClient.send(command);
      return { success: true, message: 'Item updated successfully', data };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  async getItem(key: string): Promise<{ user?:any, responseMeta?: any, }> {
    try {
      const params = {
        TableName: this.tableName,
        Key: { ["username"]: { S: key } }
      };

      const command = new GetItemCommand(params);
      const item = await this.dynamoDBClient.send(command);
      const responseMeta = item?.$metadata;
      
      return { user: unmarshall(item?.Item),responseMeta};
    } catch (error) {
      return error ;
    }
  }

  async getItems(keys: string[]): Promise<{ users?: { otherUser: any, ownUser: any }, responseMeta?: any, error?:any }> {
    try {
      const params = {
        RequestItems: {
          [this.tableName]: {
            Keys: keys.map(key => ({ ["username"]: { S: key } }))
          }
        }
      };
  
      const command = new BatchGetItemCommand(params);
      const result = await this.dynamoDBClient.send(command);
      const responseMeta = result?.$metadata;
  
      // Initialize users object with empty objects
      let users = {
        otherUser: {},
        ownUser: {}
      };
  
      const items = result.Responses?.[this.tableName]?.map(item => unmarshall(item)) || [];
  
      // Separate items into ownUser and otherUser
      items.forEach(item => {
        if (item.username === keys[0]) {
          users.otherUser = item;
        } else {
          users.ownUser = item;
        }
      });
  
      return { users, responseMeta };
    } catch (error) {
      // Properly handle the error by returning it in a structured way
      return { users: { otherUser: null, ownUser: null }, responseMeta: null, error: error.message };
    }
  }

  
  async getItemFilter(key: string, filterItems: string[]): Promise<{ data?: any; responseMeta?: any; error?: any }> {
    try {
        const params = {
            TableName: this.tableName,
            Key: { "username": { S: key } },
            ProjectionExpression: "trustbadge"
        };

        const command = new GetItemCommand(params);
        const item = await this.dynamoDBClient.send(command);
        const responseMeta = item?.$metadata;

        let data: any = {};
        data = unmarshall(item.Item)

        return { data, responseMeta };
    } catch (error) {
        return { error }; 
    }
  }

  async getItemWithPresignedURLs(key: string): Promise<{ user?: any; responseMeta?: any }> {
    try {
      const params = {
        TableName: this.tableName,
        Key: { ["username"]: { S: key } }
      };

      const command = new GetItemCommand(params);
      const item = await this.dynamoDBClient.send(command);
      const userdata = unmarshall(item?.Item)
      const responseMeta = item?.$metadata;
      return { user: unmarshall(item?.Item),responseMeta};
    } catch (error) {
      return error ;
    }
  }

  async deleteItem(key: string): Promise<{ success: boolean; message: string }> {
    try {
      const params = {
        TableName: this.tableName,
        Key: { ["username"]: { S: key } },
      };

      const command = new DeleteItemCommand(params);
      await this.dynamoDBClient.send(command);
      return { success: true, message: 'Item deleted successfully' };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

 
  // async getCountry(): Promise<{ data?: any, message?:any }> {
  //   try {
  //     const params = {
  //       TableName: "country",
  //     };

  //     const command = new ScanCommand(params);
  //     const data = await this.dynamoDBClient.send(command);

  //     const items = data.Items?.map(item => unmarshall(item));

  //     return { data: items };
  //   } catch (error) {
  //     return { message: error.message };
  //   }
  // }

  async getCountry(): Promise<{ data?: any; message?: any }> {
    try {
      const params = {
        TableName: "country",
      };
  
      const command = new ScanCommand(params);
      const data = await this.dynamoDBClient.send(command);
  
      const items = data.Items?.map((item) => unmarshall(item));
  
      // Sort items alphabetically by the `name` attribute
      const sortedItems = items?.sort((a, b) =>
        a.name.localeCompare(b.name)
      );
  
      return { data: sortedItems };
    } catch (error) {
      return { message: error.message };
    }
  }

  async getCitiesByCountry(countries: string[]): Promise<{data?: any, message?:any }> {
    try {
      if (countries.length === 0) {
        return { data: [] };
      }

      const allCities = [];

      for (const country of countries) {
        const params = {
          TableName: "city",
          FilterExpression: "countryName = :countryName",
          ExpressionAttributeValues: {
            ":countryName": { S: country }
          }
        };

        const command = new ScanCommand(params);
        const data = await this.dynamoDBClient.send(command);

        if (data.Items) {
          const items = data.Items.map(item => unmarshall(item));
          allCities.push(...items);
        }
      }

      return { data: allCities };
    } catch (error) {
      return { message: error.message };
    }
  }

  async getStateByCountry(countries: string[]): Promise<{ data?: any; message?: any }> {
    try {
      if (countries.length === 0) {
        return { data: [] };
      }
  
      const uniqueStates = new Set<string>(); // Use a Set to store unique states
  
      for (const country of countries) {
        const params = {
          TableName: "city",
          FilterExpression: "countryName = :countryName",
          ExpressionAttributeValues: {
            ":countryName": { S: country },
          },
          ProjectionExpression: "stateName", // Only fetch required attributes
        };
  
        const command = new ScanCommand(params);
        const data = await this.dynamoDBClient.send(command);
  
        if (data.Items) {
          const items = data.Items.map(item => unmarshall(item));
  
          // Add each stateName to the Set for uniqueness
          items.forEach(({ stateName }) => {
            if (stateName) {
              uniqueStates.add(stateName);
            }
          });
        }
      }
  
      // Convert the unique states to the desired format (array of objects with name property)
      const result = Array.from(uniqueStates).map(state => ({ name: state }));
  
      return { data: result };
    } catch (error) {
      return { message: error.message };
    }
  }
  
  
}