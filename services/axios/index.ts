import axios from "axios";

import { IResource } from "@career-canvas/types";

export class Axios {
  constructor(private readonly userManagement: string) {}

  async getItem(
    accessToken: string,
    resource: IResource // the possible value is profile
  ): Promise<Axios.AxiosXHR<unknown>> {
    return await axios.get(`${this.userManagement}/user/${resource}`, {
      headers: { authorization: accessToken },
    });
  }

  async setItem(
    accessToken: string,
    resource: IResource
  ): Promise<Axios.AxiosXHR<unknown>> {
    return await axios.post(`${this.userManagement}/user/${resource}`, {
      headers: { authorization: accessToken },
    });
  }

  async updateItem(
    accessToken: string,
    resource: IResource,
    updates: unknown
  ): Promise<Axios.AxiosXHR<unknown>> {
    return await axios.put(`${this.userManagement}/user/${resource}`, updates, {
      headers: { authorization: accessToken },
    });
  }
}
