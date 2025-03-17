import axios from "axios";

export class Axios {
  public post = async ({
    authorization,
    data,
    url,
  }: {
    authorization: string;
    data: Record<string, unknown>;
    url: string;
  }): Promise<{ data: Record<string, unknown>; status: number }> => {
    const response = await axios.post(url, data, {
      headers: {
        Authorization: authorization,
        "Content-Type": "application/json",
      },
    });

    return { data: response.data, status: response.status };
  };
}
