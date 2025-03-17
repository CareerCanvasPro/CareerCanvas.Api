import axios from "axios";

export class Axios {
  public get = async ({
    authorization,
    url,
  }: {
    authorization: string;
    url: string;
  }): Promise<{
    data: Record<string, unknown>;
    status: number;
  }> => {
    const response = await axios.get(url, {
      headers: {
        Authorization: authorization,
      },
    });

    return { data: response.data, status: response.status };
  };

  public delete = async ({
    authorization,
    url,
  }: {
    authorization: string;
    url: string;
  }): Promise<{ data: Record<string, unknown>; status: number }> => {
    const response = await axios.delete(url, {
      headers: {
        Authorization: authorization,
      },
    });

    return { data: response.data, status: response.status };
  };
}
