import * as express from 'express'
import { Request, Response, NextFunction } from 'express'
import { body, validationResult } from 'express-validator';
import UserManagementService from './user-management.service';
import DataValidator from "./validators";
import UserProfile from "./schema";
import StorageUtility from "../../../../utility/s3/storage"
import { v4 as uuidv4 }  from 'uuid';
import Logger from "../../../../utility/logger/logger";

class UserServiceController {
  public TableName = "userprofiles"
  public AttributeTableName = "attributeChangeRequest"

  createProfile = async (req: Request, res: Response) => {
    const result = validationResult(req.body);
    if (!result.isEmpty()) {
      return res.status(422).json({ errors: result.array() });
    }
  
    const { username} = req.body;
  
    // Initialize logger with specific context
    const requestedFrom = req.headers['requestedfrom'];
    const logger = new Logger("user-management-service", `CREATEPROFILE-${username}`,requestedFrom);
    const receivedData: UserProfile = req.body;
    const receivedBody = req.body;
  
    logger.info("Received profile creation request full body", { receivedBody });
    logger.info("Received profile creation request", { receivedData });
  
    try {
  
      // Filter and validate the data
      let filteredData;
      try {
        filteredData = DataValidator.filterBodyData(receivedData);
      } catch (validationError) {
        logger.error("Data validation error", { validationError });
        return res.status(400).json({ error: "Invalid data provided", details: validationError.message });
      }
  
     
  
      const now = new Date().toISOString(); 
      filteredData.email = filteredData.email?.toLowerCase(); // Ensure email is in lowercase
      filteredData.createdAt = now;
      filteredData.updatedAt = now;
      filteredData.password = Buffer.from(filteredData?.password).toString('base64');

      logger.info("Filtered data prepared for database", { filteredData });
  
      // Initialize the user service
      const userService = new UserManagementService(this.TableName, username);
  
      // Create the user profile in the database
      const response = await userService.createItem(filteredData);
  
      const responseMeta = response.response.$metadata;
      const statusCode = responseMeta.httpStatusCode || 201; // Default to 201 Created if statusCode is undefined
  
      logger.info("Profile created successfully", { statusCode, responseMeta });
  
      // Send the response
      return res.status(statusCode).json({ message: "Profile created successfully", metadata: responseMeta });
    } catch (error) {
      // Specific error handling for AWS SDK errors
      if (error.name === "ConditionalCheckFailedException") {
        logger.error("Conditional check failed during profile creation", { error });
        return res.status(409).json({ error: "Profile already exists or condition failed" });
      }
  
      // Check for AWS-related errors
      if (error.code === "ProvisionedThroughputExceededException") {
        logger.error("DynamoDB throughput exceeded", { error });
        return res.status(503).json({ error: "Service unavailable. Please try again later." });
      }
  
      // Handle any other unexpected errors
      logger.error("Unexpected error during profile creation", { error });
      return res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
  };
  
  
  
  
  updateProfile = (req: Request, res: Response) => {
    const result = validationResult(req.body);
    if (!result.isEmpty()) {
      return res.status(422).json({ errors: result.array() });
    }
  
    const requestedFrom = req.headers['requestedfrom'];
    const logger = new Logger("user-management-service", `UPDATEPROFILE-${req.body.username}`,requestedFrom);
    const receivedData: UserProfile = req.body;
    const { username } = req.body;
    const filteredData = DataValidator.filterBodyData(receivedData);
  
    logger.info("Received update profile request", { username, receivedData });
  
    let updateExpression = 'SET';
    delete filteredData.username;
  
    const now = new Date().toISOString(); // Get current date in ISO format
    filteredData.updatedAt = now; // Set current date for updatedAt
  
    const expressionAttributeNames: { [key: string]: any } = {};
    const expressionAttributeValues: { [key: string]: any } = {};
  
    // Loop through filtered data and construct update expression
    Object.entries(filteredData).forEach(([attrName, attrValue], index) => {
      const placeholder = `#attr${index}`;
      updateExpression += ` ${placeholder} = :value${index},`;
      expressionAttributeNames[placeholder] = attrName;
  
      // Special case: Set profileDescription to null
      if (attrName === 'profileDescription' && attrValue === "") {
        expressionAttributeValues[`:value${index}`] = { NULL: true };
        return;
      }
  
      if (typeof attrValue === 'string') {
        expressionAttributeValues[`:value${index}`] = { S: attrValue };
      } else if (typeof attrValue === 'number') {
        expressionAttributeValues[`:value${index}`] = { N: String(attrValue) };
      } else if (typeof attrValue === 'boolean') {
        expressionAttributeValues[`:value${index}`] = { BOOL: attrValue };
      } else if (Array.isArray(attrValue)) {
        const stringValueArray = attrValue as string[];
        expressionAttributeValues[`:value${index}`] = { L: stringValueArray.map(item => ({ S: item })) };
      } else {
        expressionAttributeValues[`:value${index}`] = { S: JSON.stringify(attrValue) };
      }
    });
  
    updateExpression = updateExpression.replace(/,$/, ''); // Remove trailing comma
  
    logger.info("Prepared update expression", { updateExpression, expressionAttributeNames, expressionAttributeValues });
  
    let userService = new UserManagementService(this.TableName, username);
  
    userService.updateItem(updateExpression, expressionAttributeNames, expressionAttributeValues)
      .then(success => {
        const responseMeta = success?.data.$metadata;
        const statusCode = success?.data.$metadata.httpStatusCode;
  
        logger.info("Profile updated successfully", { statusCode, responseMeta });
  
        res.status(statusCode).json({ "Data": responseMeta }).end();
      })
      .catch(error => {
        logger.error("Error updating profile", { error: error });
  
        res.status(500).json({ error });
      });
  }
  
  updateProfilePicture = async (req: Request, res: Response) => {
    // Validate request body
    const result = validationResult(req.body);
    if (!result.isEmpty()) {
      return res.status(422).json({ errors: result.array() });
    }
  
    const requestedFrom = req.headers['requestedfrom'];
    const logger = new Logger("user-management-service", `UPDATEPROFILEPICTURE-${req.body.username}`,requestedFrom);
    const { username, profilePicture } = req.body;
  
    logger.info("Received request to update profile picture", { username, profilePicture });
  
    let userService = new UserManagementService(this.TableName, username);
  
    try {
      const user = await userService.getItem(username);
  
      if (!user?.user) {
        logger.error("User not found", { username });
        return res.status(404).json({ error: "User not found" });
      }
  
      const updateExpression = 'SET #profilePicture = :profilePicture';
      const expressionAttributeNames: { [key: string]: string } = {};
      const expressionAttributeValues: { [key: string]: any } = {};
  
      let updatedProfilePictureUrl = '';
  
  
      // Perform the update operation
      const success = await userService.updateItem(
        updateExpression,
        expressionAttributeNames,
        expressionAttributeValues
      );
  
      if (success?.data) {
        const responseMeta = success?.data?.$metadata;
        const statusCode = success?.data.$metadata?.httpStatusCode;
  
        logger.info("Profile picture updated successfully", { statusCode, responseMeta });
  
        return res.status(statusCode).json({ "Data": responseMeta }).end();
      } else {
        logger.error("Failed to update profile picture", { username });
        return res.status(402).json({ "Data": "Failed" }).end();
      }
  
    } catch (error) {
      logger.error("Error updating profile picture", { error: error });
      return res.status(500).json({ error: 'Failed to update profile picture' });
    }
  }
  

  getProfile = (req: Request, res: Response) => {
    const requestedFrom = req.headers['requestedfrom'];
    const logger = new Logger("user-management-service", `GETITEM-${req.body.username}`,requestedFrom);
    const { username } = req.body;
  
    logger.info("Received request to get user item", { username });
  
    let userService = new UserManagementService(this.TableName, username);
  
    userService.getItem(username)
      .then(success => {
        const statusCode = success?.responseMeta?.httpStatusCode;
  
        // Check if the user is active
        if (success?.user && success.user.status === "active") {
          logger.info("User found and status is active", { username, statusCode });
          res.status(statusCode).json({ "data": success }).end();
        } else {
          logger.warning("User found but status is not active", { username });
          res.status(401).json({ error: "User status is not active" }).end();
        }
      })
      .catch(error => {
        logger.error("Error fetching user item", { username, error: error });
        res.status(403).json({ error: "Failed to fetch user item" }).end();
      });
  }

  

  updateSetting = (req: Request, res: Response) => {
    const requestedFrom = req.headers['requestedfrom'];
    const logger = new Logger("user-management-service", `UPDATESETTING-${req.body.username}`,requestedFrom);
    const { username, matchPreference } = req.body;

    logger.info("Received request to update match preferences", { username, matchPreference });

    let userService = new UserManagementService(this.TableName, username);

    userService.updateMatchPreference(username, matchPreference)
        .then(success => {
            if (success) {
                logger.info("Match preferences updated successfully", { username, matchPreference });
                res.status(200).json({ "Data": success }).end();
            } else {
                logger.warning("Failed to update match preferences, invalid response", { username, matchPreference });
                res.status(400).json({ error: "Failed to update match preferences" }).end();
            }
        })
        .catch(error => {
            logger.error("Error updating match preferences", { error });
            res.status(500).json({ error: error.message || "An error occurred while updating match preferences" });
        });
  };


  attrchange = async (req: Request, res: Response) => {
    const requestedFrom = req.headers['requestedfrom'];
    const logger = new Logger("user-management-service", `ATTRCHANGE-${req.body.username}`,requestedFrom);
    const myUUID = uuidv4();
    const { username, data } = req.body;

    // Adding necessary attributes to the request data
    data.user = username;
    data.id = myUUID;

    logger.info("Received request to create attribute change", { username, data });

    const userService = new UserManagementService(this.AttributeTableName, username);

    try {
        // Create an attribute change request
        const success = await userService.createAttributeChangeRequest(data);

        if (success) {
            logger.info("Attribute change request created successfully", { username, data });
            res.status(200).json({ "Data": success }).end();
        } else {
            logger.warning("Failed to create attribute change request, invalid response", { username, data });
            res.status(400).json({ error: "Failed to create attribute change request" }).end();
        }
    } catch (error) {
        logger.error("Error creating attribute change request", { error });
        res.status(500).json({ error: error.message || "An error occurred while creating the attribute change request" });
    }
  };

}

export default UserServiceController;