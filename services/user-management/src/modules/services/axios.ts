import axios, { AxiosResponse } from "axios";

interface GetItemParams {
  accessToken: string;
  url: string;
}

export class Axios {
  public async getItem({
    accessToken,
    url,
  }: GetItemParams): Promise<AxiosResponse> {
    return await axios.get(url, {
      headers: { authorization: accessToken },
    });
  }

  //   async setItem(
  //     accessToken: string,
  //     resource: IResource
  //   ): Promise<AxiosResponse> {
  //     return await axios.post(`${this.userManagement}/user/${resource}`, {
  //       headers: { authorization: accessToken },
  //     });
  //   }

  //   async updateItem(
  //     accessToken: string,
  //     resource: IResource,
  //     updates: unknown
  //   ): Promise<AxiosResponse> {
  //     return await axios.put(`${this.userManagement}/user/${resource}`, updates, {
  //       headers: { authorization: accessToken },
  //     });
  //   }
}
