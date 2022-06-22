import { Config } from '../../core/constants/Config';
import { SlackPayload } from '../../core';

export const sendFeedback = async (data: SlackPayload): Promise<Response> => {
  try {
    const result = await fetch(Config.SLACK_WEB_HOOK_URL, {
      method: 'POST',
      body: JSON.stringify(data)
    });
    return result;
  } catch (error) {
    return error;
  }
};
