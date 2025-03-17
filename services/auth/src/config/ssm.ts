import { GetParameterCommand, SSMClient } from '@aws-sdk/client-ssm';

const ssm = new SSMClient({ region: process.env.REGION || 'ap-southeast-1' });
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
    const paramPath = name.startsWith('auth/') 
      ? `/careercanvas/auth/${name.replace('auth/', '')}` 
      : `/careercanvas/${name}`;
    
    const command = new GetParameterCommand({
      Name: paramPath,
      WithDecryption: true,
    });
    const response = await ssm.send(command);
    const value = response.Parameter?.Value;

    if (!value) {
      console.error(`Parameter ${paramPath} not found`);
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
  const [jwtSecret, mailHost, mailPassword, mailPort, mailUsername, s3Bucket] = await Promise.all([
    getParameter('auth/jwt-secret'),
    getParameter('auth/mail-host'),
    getParameter('auth/mail-password'),
    getParameter('auth/mail-port'),
    getParameter('auth/mail-username'),
    getParameter('s3-bucket'),
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
    s3: {
      bucket: s3Bucket,
    },
    port: process.env.PORT ? parseInt(process.env.PORT, 10) : 8001,
  };
}
