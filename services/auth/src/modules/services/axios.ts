import { get, post, put } from "axios";

import { config } from "@career-canvas/services/auth/config";

export class Axios {
  public async getItem(token: string): Promise<{ data: unknown }> {
    try {
      const response = await get(
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

  public async setItem(token: string): Promise<{ data: unknown }> {
    try {
      const response = await post(
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

  public async updateItem(
    accessToken: string,
    updates: unknown
  ): Promise<Axios.AxiosXHR<unknown>> {
    return await put(`${config.service.userManagement}/user/profile`, updates, {
      headers: { authorization: accessToken },
    });
  }
}
