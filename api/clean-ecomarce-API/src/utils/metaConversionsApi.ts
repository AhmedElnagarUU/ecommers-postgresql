import { createHash } from 'crypto';

export interface MetaUserData {
  email?: string;
  phone?: string;
}

export interface MetaCustomData {
  value?: number;
  currency?: string;
}

export interface MetaConversionEventParams {
  pixelId: string;
  accessToken: string;
  eventName: string;
  userData?: MetaUserData;
  customData?: MetaCustomData;
  testEventCode?: string;
  eventId?: string;
}

function hashSha256(value: string): string {
  return createHash('sha256').update(value.trim().toLowerCase()).digest('hex');
}

function buildUserData(userData?: MetaUserData): Record<string, string[]> | undefined {
  if (!userData) return undefined;

  const result: Record<string, string[]> = {};
  if (userData.email) {
    result.em = [hashSha256(userData.email)];
  }
  if (userData.phone) {
    const normalized = userData.phone.replace(/\D/g, '');
    if (normalized) {
      result.ph = [hashSha256(normalized)];
    }
  }

  return Object.keys(result).length ? result : undefined;
}

export async function sendMetaConversionEvent(
  params: MetaConversionEventParams
): Promise<{ success: boolean; error?: string }> {
  const { pixelId, accessToken, eventName, userData, customData, testEventCode, eventId } =
    params;

  const eventPayload: Record<string, unknown> = {
    event_name: eventName,
    event_time: Math.floor(Date.now() / 1000),
    action_source: 'website',
    ...(eventId ? { event_id: eventId } : {}),
    ...(buildUserData(userData) ? { user_data: buildUserData(userData) } : {}),
    ...(customData?.value !== undefined || customData?.currency
      ? {
          custom_data: {
            ...(customData.value !== undefined ? { value: customData.value } : {}),
            ...(customData.currency ? { currency: customData.currency } : {}),
          },
        }
      : {}),
  };

  const body: Record<string, unknown> = {
    data: [eventPayload],
    ...(testEventCode ? { test_event_code: testEventCode } : {}),
  };

  const url = `https://graph.facebook.com/v18.0/${pixelId}/events?access_token=${encodeURIComponent(accessToken)}`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      return { success: false, error: errorBody || response.statusText };
    }

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
