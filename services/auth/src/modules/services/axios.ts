import axios from "axios";

import { config } from "@career-canvas/services/auth/config";

export class Axios {
  async getItem(token: string): Promise<{ data: unknown }> {
    try {
      const response = await axios.get(
        `${config.service.userManagement}/user/profile`,
        {
          headers: { authorization: token },
        }
      );

      return response.status === 200 && response.data["Data"].success
        ? { data: response.data["Data"].data }
        : { data: null };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
    }
  }

  async setItem(token: string): Promise<{ data: unknown }> {
    try {
      const response = await axios.post(
        `${config.service.userManagement}/user/profile`,
        {
          headers: { authorization: token },
        }
      );

      return response.status === 200 && response.data["Data"].success
        ? { data: response.data["Data"].data }
        : { data: null };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
    }
  }

  async updateItem(
    token: string,
    updates: unknown
  ): Promise<{ data: unknown }> {
    try {
      const response = await axios.put(
        `${config.service.userManagement}/user/profile`,
        updates,
        {
          headers: { authorization: token },
        }
      );

      return response.status === 200 && response.data["Data"].success
        ? { data: response.data["Data"].data }
        : { data: null };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
    }
  }
}
