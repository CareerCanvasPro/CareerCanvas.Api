import { GetParameterCommand, SSMClient } from '@aws-sdk/client-ssm';

const ssm = new SSMClient({ region: process.env.REGION });
const cache = new Map<string, { value: string; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

export async function getParameter(name: string, retryCount = 0): Promise<string> {
  const cachedParam = cache.get(name);
  if (cachedParam && Date.now() - cachedParam.timestamp < CACHE_TTL) {
    return cachedParam.value;
  }

  try {
    const paramPath = `/careercanvas/${process.env.NODE_ENV}/${name}`;
    const command = new GetParameterCommand({
      Name: paramPath,
      WithDecryption: true,
    });
    const response = await ssm.send(command);
    const value = response.Parameter?.Value;

    if (!value) {
      throw new Error(`Parameter ${paramPath} not found`);
    }

    cache.set(name, { value, timestamp: Date.now() });
    return value;
  } catch (error: any) {
    if (retryCount < MAX_RETRIES && (error?.name === 'ThrottlingException' || error?.name === 'RequestTimeout')) {
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY * (retryCount + 1)));
      return getParameter(name, retryCount + 1);
    }
    
    console.error(`Error fetching parameter ${name}:`, error);
    throw error;
  }
}

export async function loadConfig() {
  const [jwtSecret, mailHost, mailPassword, mailPort, mailUsername] = await Promise.all([
    getParameter('JWT_SECRET'),
    getParameter('MAIL_HOST'),
    getParameter('MAIL_PASSWORD'),
    getParameter('MAIL_PORT'),
    getParameter('MAIL_USERNAME'),
  ]);

  return {
    aws: {
      region: process.env.REGION,
    },
    jwt: {
      secret: jwtSecret,
    },
    mail: {
      host: mailHost,
      password: mailPassword,
      port: mailPort,
      username: mailUsername,
    },
    port: process.env.PORT ? parseInt(process.env.PORT, 10) : 8001,
  };
}