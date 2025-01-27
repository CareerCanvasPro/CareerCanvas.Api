import {
  DeleteItemCommand,
  DynamoDBClient,
  GetItemCommand,
  PutItemCommand,
  UpdateItemCommand,
} from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";

import { config } from "../../../config";

interface IAttribute {
  name: string;
  value: unknown;
}

interface BuildUpdateExpressionParams {
  attributes: IAttribute[];
}

interface DeleteUserParams {
  keyValue: string;
}

interface GetUserParams {
  keyValue: string;
}

interface PutUserParams {
  user: Record<string, unknown>;
}

interface UpdateUserParams {
  attributes: IAttribute[];
  keyValue: string;
}

export default class UserManagement {
  private readonly dynamoDBClient: DynamoDBClient;

  constructor(
    private readonly keyName: string,
    private readonly tableName: string
  ) {
    this.dynamoDBClient = new DynamoDBClient({
      credentials: {
        accessKeyId: config.aws.accessKey,
        secretAccessKey: config.aws.secretAccessKey,
      },
      region: config.aws.region,
    });
  }

  private buildUpdateExpression({ attributes }: BuildUpdateExpressionParams): {
    expressionAttributeNames: Record<string, string>;
    expressionAttributeValues: Record<string, unknown>;
    updateExpression: string;
  } {
    const expressionAttributeNames: Record<string, string> = {};

    const expressionAttributeValues: Record<string, unknown> = {};

    const updateExpressions: string[] = [];

    attributes.forEach((attribute, index) => {
      const placeholderName = `#field${index}`;

      const placeholderValue = `:value${index}`;

      expressionAttributeNames[placeholderName] = attribute.name;

      expressionAttributeValues[placeholderValue] = attribute.value;

      updateExpressions.push(`${placeholderName} = ${placeholderValue}`);
    });

    const updateExpression = `SET ${updateExpressions.join(", ")}`;

    return {
      expressionAttributeNames,
      expressionAttributeValues,
      updateExpression,
    };
  }

  public async deleteUser({ keyValue }: DeleteUserParams): Promise<{
    deletedUser: Record<string, unknown>;
    httpStatusCode: number;
  }> {
    const {
      $metadata: { httpStatusCode },
      Attributes,
    } = await this.dynamoDBClient.send(
      new DeleteItemCommand({
        Key: {
          [this.keyName]: {
            S: keyValue,
          },
        },
        ReturnValues: "ALL_OLD",
        TableName: this.tableName,
      })
    );

    const deletedUser = Attributes ? unmarshall(Attributes) : null;

    return { deletedUser, httpStatusCode };
  }

  public async getUser({ keyValue }: GetUserParams): Promise<{
    httpStatusCode: number;
    user: Record<string, unknown>;
  }> {
    const {
      $metadata: { httpStatusCode },
      Item,
    } = await this.dynamoDBClient.send(
      new GetItemCommand({
        Key: {
          [this.keyName]: {
            S: keyValue,
          },
        },
        TableName: this.tableName,
      })
    );

    const user = Item ? unmarshall(Item) : null;

    return { httpStatusCode, user };
  }

  public async putUser({
    user,
  }: PutUserParams): Promise<{ httpStatusCode: number }> {
    const {
      $metadata: { httpStatusCode },
    } = await this.dynamoDBClient.send(
      new PutItemCommand({
        Item: marshall(user),
        TableName: this.tableName,
      })
    );

    return { httpStatusCode };
  }

  public async updateUser({ attributes, keyValue }: UpdateUserParams): Promise<{
    httpStatusCode: number;
    updatedItem: Record<string, unknown>;
  }> {
    const {
      expressionAttributeNames,
      expressionAttributeValues,
      updateExpression,
    } = this.buildUpdateExpression({ attributes });

    const {
      $metadata: { httpStatusCode },
      Attributes,
    } = await this.dynamoDBClient.send(
      new UpdateItemCommand({
        ExpressionAttributeNames: expressionAttributeNames,
        ExpressionAttributeValues: marshall(expressionAttributeValues),
        Key: {
          [this.keyName]: { S: keyValue },
        },
        ReturnValues: "ALL_NEW",
        TableName: this.tableName,
        UpdateExpression: updateExpression,
      })
    );

    const updatedItem = Attributes ? unmarshall(Attributes) : null;

    return { httpStatusCode, updatedItem };
  }

  //   async updateMatchPreference(
  //     username: string,
  //     matchPreference: any
  //   ): Promise<{ success: boolean; message: string; data?: any }> {
  //     try {
  //       // Step 1: Fetch current matchPreference from DynamoDB
  //       const currentMatchPreference = await this.getCurrentMatchPreference(
  //         username
  //       );

  //       // Step 2: Compare incoming matchPreference with currentMatchPreference to find updates
  //       const updates = this.getUpdatedFields(
  //         currentMatchPreference,
  //         matchPreference
  //       );

  //       const marshalledUpdates = marshall(updates);

  //       const params = {
  //         ExpressionAttributeValues: {
  //           ":mp": {
  //             M: marshalledUpdates,
  //           },
  //         },
  //         Key: {
  //           username: {
  //             S: username,
  //           },
  //         },
  //         TableName: this.tableName,
  //         UpdateExpression: "set matchPreference = :mp",
  //       };

  //       const command = new UpdateItemCommand(params);
  //       const data = await this.dynamoDBClient.send(command);

  //       return {
  //         data,
  //         message: "Item updated successfully",
  //         success: true,
  //       };
  //     } catch (error) {
  //       return {
  //         message: error.message,
  //         success: false,
  //       };
  //     }
  //   }

  // Fetch current matchPreference for a user
  //   private async getCurrentMatchPreference(username: string): Promise<any> {
  //     const params = {
  //       Key: {
  //         username: {
  //           S: username,
  //         },
  //       },
  //       TableName: this.tableName,
  //     };

  //     const command = new GetItemCommand(params);
  //     const result = await this.dynamoDBClient.send(command);

  //     if (result.Item) {
  //       return unmarshall(result.Item).matchPreference || {}; // Return current matchPreference, default to empty object if not found
  //     }
  //     return {}; // Return empty if no data found
  //   }

  //   private getUpdatedFields(current: any, incoming: any): any {
  //     const updates: any = { ...current }; // Start with all fields from `current`

  //     // Clean incoming and current objects to remove null/undefined or unwanted fields
  //     const cleanedIncoming = this.cleanObject(incoming);
  //     const cleanedCurrent = this.cleanObject(current);

  //     // Update or add fields from `incoming` to `updates` only if the value has changed
  //     Object.entries(cleanedIncoming).forEach(([key, value]) => {
  //       // Update only if the value in `incoming` is different from `current`
  //       if (JSON.stringify(cleanedCurrent[key]) !== JSON.stringify(value)) {
  //         updates[key] = value;
  //       }
  //     });

  //     // Remove any remaining null or undefined values in `updates`
  //     const finalUpdates = this.cleanObject(updates);
  //     return finalUpdates;
  //   }

  // Utility function to clean up the object by removing empty/null/undefined values
  //   private cleanObject(object: Record<string, unknown>): any {
  //     if (Array.isArray(object)) {
  //       return object.filter(
  //         (item) => item !== null && item !== undefined && item !== ""
  //       );
  //     }

  //     if (typeof obj === "object" && obj !== null) {
  //       return Object.entries(obj).reduce((acc, [key, value]) => {
  //         if (
  //           value !== null &&
  //           value !== undefined &&
  //           value !== "" &&
  //           !(Array.isArray(value) && value.length === 0)
  //         ) {
  //           acc[key] = this.cleanObject(value); // Recursive cleaning for nested objects
  //         }
  //         return acc;
  //       }, {});
  //     }

  //     return obj; // Return the value as is if it's not an object or array
  //   }

  //   async updateAdvancePreference(
  //     username: string,
  //     advancePreference: any
  //   ): Promise<{ success: boolean; message: string; data?: any }> {
  //     const marshalledMatchPreference = marshall(advancePreference);
  //     const params = {
  //       ExpressionAttributeValues: {
  //         ":mp": {
  //           M: marshalledMatchPreference,
  //         },
  //       },
  //       Key: {
  //         username: {
  //           S: username,
  //         },
  //       },
  //       TableName: this.tableName,
  //       UpdateExpression: "set advancePreference = :mp",
  //     };

  //     try {
  //       const command = new UpdateItemCommand(params);
  //       const data = await this.dynamoDBClient.send(command);
  //       return { success: true, message: "Item updated successfully", data };
  //     } catch (error) {
  //       return { success: false, message: error.message };
  //     }
  //   }

  //   async updateNotificationSetting(
  //     username: string,
  //     data: any
  //   ): Promise<{ success: boolean; message: string; data?: any }> {
  //     const marshalledMatchPreference = marshall(data);
  //     const params = {
  //       ExpressionAttributeValues: {
  //         ":mp": {
  //           M: marshalledMatchPreference,
  //         },
  //       },
  //       Key: {
  //         username: {
  //           S: username,
  //         },
  //       },
  //       TableName: this.tableName,
  //       UpdateExpression: "set notificationSettings = :mp",
  //     };

  //     try {
  //       const command = new UpdateItemCommand(params);
  //       const data = await this.dynamoDBClient.send(command);
  //       return {
  //         data,
  //         message: "Item updated successfully",
  //         success: true,
  //       };
  //     } catch (error) {
  //       return {
  //         message: error.message,
  //         success: false,
  //       };
  //     }
  //   }

  //   async updateImageGalleries(
  //     username: string,
  //     updateGalleries: Array<any>
  //   ): Promise<{ success: boolean; message: string; data?: any }> {
  //     try {
  //       let params;

  //       params = {
  //         ExpressionAttributeValues: {
  //           ":emptyList": {
  //             L: [],
  //           },
  //           ":newGalleries": {
  //             L: marshall(updateGalleries),
  //           },
  //         },
  //         Key: {
  //           username: {
  //             S: username,
  //           },
  //         },
  //         TableName: this.tableName,
  //         UpdateExpression:
  //           "SET imageGallery = list_append(if_not_exists(imageGallery, :emptyList), :newGalleries)",
  //       };
  //       const command = new UpdateItemCommand(params);
  //       const data = await this.dynamoDBClient.send(command);
  //       return {
  //         data,
  //         message: "Item updated successfully",
  //         success: true,
  //       };
  //     } catch (error) {
  //       return {
  //         message: error.message,
  //         success: false,
  //       };
  //     }
  //   }

  //   async updateIdentity(
  //     username: string,
  //     updatetrustbadge: any
  //   ): Promise<{ success: boolean; message: string; data?: any }> {
  //     try {
  //       const params = {
  //         ExpressionAttributeValues: marshall({
  //           ":updatetrustbadge": updatetrustbadge,
  //           ":updatetrustbadgestatus": "pending",
  //         }),
  //         Key: {
  //           username: {
  //             S: username,
  //           },
  //         },
  //         TableName: this.tableName,
  //         UpdateExpression:
  //           "SET trustbadge = :updatetrustbadge, trustbadgeStatus = :updatetrustbadgestatus",
  //       };

  //       const command = new UpdateItemCommand(params);
  //       const data = await this.dynamoDBClient.send(command);
  //       return {
  //         data,
  //         message: "Item updated successfully",
  //         success: true,
  //       };
  //     } catch (error) {
  //       return {
  //         message: error.message,
  //         success: false,
  //       };
  //     }
  //   }

  //   async deleteTrustBadgeByUrl(
  //     username: string,
  //     url: string
  //   ): Promise<
  //     | {
  //         status: string;
  //         message: string;
  //         data: Record<string, unknown>;
  //       }
  //     | {
  //         status: string;
  //         message: any;
  //         data?: undefined;
  //       }
  //   > {
  //     try {
  //       // Step 1: Fetch the user item
  //       const getParams = {
  //         Key: {
  //           username: {
  //             S: username,
  //           },
  //         },
  //         TableName: "userprofiles",
  //       };

  //       const getResult = await this.dynamoDBClient.send(
  //         new GetItemCommand(getParams)
  //       );
  //       const trustbadge = getResult.Item?.trustbadge?.L;

  //       if (!trustbadge) {
  //         return { status: "error", message: "Trustbadge list not found" };
  //       }

  //       // Step 2: Find the index of the trust badge to delete
  //       const badgeIndex = trustbadge.findIndex(
  //         (badge) => badge.M?.url?.S === url
  //       );

  //       if (badgeIndex === -1) {
  //         return {
  //           status: "error",
  //           message: "Trustbadge with specified URL not found",
  //         };
  //       }

  //       // Step 3: Remove the trust badge item and set `trustbadgeStatus` to 'false'
  //       const deleteParamsDynamoDB = {
  //         ExpressionAttributeValues: {
  //           ":false": {
  //             BOOL: false,
  //           }, // Change this to a string if `trustbadgeStatus` is actually a string
  //         },
  //         Key: {
  //           username: {
  //             S: username,
  //           },
  //         },
  //         TableName: "userprofiles",
  //         UpdateExpression: `REMOVE trustbadge[${badgeIndex}] SET trustbadgeStatus = :false`,
  //       };

  //       const updateResult = await this.dynamoDBClient.send(
  //         new UpdateItemCommand(deleteParamsDynamoDB)
  //       );
  //       return {
  //         data: updateResult.Attributes,
  //         message: "Trustbadge deleted and status updated",
  //         status: "success",
  //       };
  //     } catch (error) {
  //       console.error("Error deleting trust badge or updating status:", error);
  //       return { status: "error", message: error.message };
  //     }
  //   }

  //   async deleteImageGalleries(
  //     username: string,
  //     updateGalleries: any
  //   ): Promise<{ success: boolean; message: string; data?: any }> {
  //     try {
  //       const params = {
  //         ExpressionAttributeValues: marshall({
  //           ":updateGallery": updateGalleries,
  //         }),
  //         Key: {
  //           username: {
  //             S: username,
  //           },
  //         },
  //         TableName: this.tableName,
  //         UpdateExpression: "SET imageGallery = :updateGallery",
  //       };
  //       const command = new UpdateItemCommand(params);
  //       const data = await this.dynamoDBClient.send(command);
  //       return {
  //         data,
  //         message: "Item updated successfully",
  //         success: true,
  //       };
  //     } catch (error) {
  //       return {
  //         message: error.message,
  //         success: false,
  //       };
  //     }
  //   }

  //   async getItems(keys: string[]): Promise<{
  //     users?: { otherUser: any; ownUser: any };
  //     responseMeta?: any;
  //     error?: any;
  //   }> {
  //     try {
  //       const params = {
  //         RequestItems: {
  //           [this.tableName]: {
  //             Keys: keys.map((key) => ({ ["username"]: { S: key } })),
  //           },
  //         },
  //       };

  //       const command = new BatchGetItemCommand(params);
  //       const result = await this.dynamoDBClient.send(command);
  //       const responseMeta = result?.$metadata;

  //       // Initialize users object with empty objects
  //       const users = {
  //         otherUser: {},
  //         ownUser: {},
  //       };

  //       const items =
  //         result.Responses?.[this.tableName]?.map((item) => unmarshall(item)) ||
  //         [];

  //       // Separate items into ownUser and otherUser
  //       items.forEach((item) => {
  //         if (item.username === keys[0]) {
  //           users.otherUser = item;
  //         } else {
  //           users.ownUser = item;
  //         }
  //       });

  //       return {
  //         responseMeta,
  //         users,
  //       };
  //     } catch (error) {
  //       // Properly handle the error by returning it in a structured way
  //       return {
  //         error: error.message,
  //         responseMeta: null,
  //         users: {
  //           otherUser: null,
  //           ownUser: null,
  //         },
  //       };
  //     }
  //   }

  //   async getItemFilter(
  //     key: string
  //     // filterItems: string[]
  //   ): Promise<{ data?: any; responseMeta?: any; error?: any }> {
  //     try {
  //       const params = {
  //         Key: {
  //           username: {
  //             S: key,
  //           },
  //         },
  //         ProjectionExpression: "trustbadge",
  //         TableName: this.tableName,
  //       };

  //       const command = new GetItemCommand(params);
  //       const item = await this.dynamoDBClient.send(command);
  //       const responseMeta = item?.$metadata;

  //       let data: any = {};
  //       data = unmarshall(item.Item);

  //       return { data, responseMeta };
  //     } catch (error) {
  //       return { error };
  //     }
  //   }

  //   async getItemWithPresignedURLs(
  //     key: string
  //   ): Promise<{ user?: any; responseMeta?: any }> {
  //     try {
  //       const params = {
  //         TableName: this.tableName,
  //         Key: { ["username"]: { S: key } },
  //       };

  //       const command = new GetItemCommand(params);
  //       const item = await this.dynamoDBClient.send(command);
  //       unmarshall(item?.Item);
  //       const responseMeta = item?.$metadata;
  //       return { user: unmarshall(item?.Item), responseMeta };
  //     } catch (error) {
  //       return error;
  //     }
  //   }

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

  //   async getCountry(): Promise<{ data?: any; message?: any }> {
  //     try {
  //       const params = {
  //         TableName: "country",
  //       };

  //       const command = new ScanCommand(params);
  //       const data = await this.dynamoDBClient.send(command);

  //       const items = data.Items?.map((item) => unmarshall(item));

  //       // Sort items alphabetically by the `name` attribute
  //       const sortedItems = items?.sort((a, b) => a.name.localeCompare(b.name));

  //       return { data: sortedItems };
  //     } catch (error) {
  //       return { message: error.message };
  //     }
  //   }

  //   async getCitiesByCountry(
  //     countries: string[]
  //   ): Promise<{ data?: any; message?: any }> {
  //     try {
  //       if (countries.length === 0) {
  //         return { data: [] };
  //       }

  //       const allCities = [];

  //       for (const country of countries) {
  //         const params = {
  //           ExpressionAttributeValues: {
  //             ":countryName": {
  //               S: country,
  //             },
  //           },
  //           FilterExpression: "countryName = :countryName",
  //           TableName: "city",
  //         };

  //         const command = new ScanCommand(params);
  //         const data = await this.dynamoDBClient.send(command);

  //         if (data.Items) {
  //           const items = data.Items.map((item) => unmarshall(item));
  //           allCities.push(...items);
  //         }
  //       }

  //       return { data: allCities };
  //     } catch (error) {
  //       return { message: error.message };
  //     }
  //   }

  //   async getStateByCountry(
  //     countries: string[]
  //   ): Promise<{ data?: any; message?: any }> {
  //     try {
  //       if (countries.length === 0) {
  //         return { data: [] };
  //       }

  //       const uniqueStates = new Set<string>(); // Use a Set to store unique states

  //       for (const country of countries) {
  //         const params = {
  //           ExpressionAttributeValues: {
  //             ":countryName": {
  //               S: country,
  //             },
  //           },
  //           FilterExpression: "countryName = :countryName",
  //           ProjectionExpression: "stateName", // Only fetch required attributes
  //           TableName: "city",
  //         };

  //         const command = new ScanCommand(params);
  //         const data = await this.dynamoDBClient.send(command);

  //         if (data.Items) {
  //           const items = data.Items.map((item) => unmarshall(item));

  //           // Add each stateName to the Set for uniqueness
  //           items.forEach(({ stateName }) => {
  //             if (stateName) {
  //               uniqueStates.add(stateName);
  //             }
  //           });
  //         }
  //       }

  //       // Convert the unique states to the desired format (array of objects with name property)
  //       const result = Array.from(uniqueStates).map((state) => ({ name: state }));

  //       return { data: result };
  //     } catch (error) {
  //       return { message: error.message };
  //     }
  //   }
}
