export async function resolveSnsDomain(domain: string): Promise<string | null> {
  try {
    const normalizedDomain = domain.trim().toLowerCase();

    const cleanDomain = normalizedDomain.endsWith(".")
      ? normalizedDomain.slice(0, -1)
      : normalizedDomain;

    const response = await fetch(
      `https://sns-sdk-proxy.bonfida.workers.dev/resolve/${cleanDomain}`,
      {
        headers: {
          Accept: "application/json",
        },
      }
    );

    if (!response.ok) {
      console.log("Response not OK, status:", response.status);
      return null;
    }

    const data = await response.json();

    if (data && data.s === "ok" && data.result && data.result.length > 0) {
      return data.result;
    }

    if (data && data.address && data.address.length > 0) {
      return data.result;
    }

    return null;
  } catch (error) {
    console.error("Error resolving SNS domain:", error);

    // try {
    //   console.log("Trying alternative API...");
    //   const altResponse = await fetch(
    //     `https://api.sns.id/v1/domains/${domain}`,
    //     {
    //       headers: {
    //         Accept: "application/json",
    //       },
    //     },
    //   );

    //   if (altResponse.ok) {
    //     const altData = await altResponse.json();
    //     return !!altData?.owner || !!altData?.address;
    //   }
    // } catch (altError) {
    //   console.warn("Alternative SNS API also failed:", altError);
    // }

    return null;
  }
}

export function isSnsDomainFormat(input: string): boolean {
  const trimmed = input.trim();

  return /^[a-zA-Z0-9][a-zA-Z0-9-]*\.(sol|skr|backpack|pussy|bonk|abc|oorc|mbs|pog|nala|toly|gog|monke|portal)$/i.test(
    trimmed
  );
}
