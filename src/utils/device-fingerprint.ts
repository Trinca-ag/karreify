export function getDeviceId(): string {
  if (typeof window === "undefined") return "";
  let id = localStorage.getItem("karreify_device_id");
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("karreify_device_id", id);
  }
  return id;
}

export function getDeviceInfo() {
  const ua = navigator.userAgent;

  let browser = "Navegador desconhecido";
  if (ua.includes("Firefox")) browser = "Firefox";
  else if (ua.includes("Edg")) browser = "Edge";
  else if (ua.includes("OPR") || ua.includes("Opera")) browser = "Opera";
  else if (ua.includes("Chrome")) browser = "Chrome";
  else if (ua.includes("Safari")) browser = "Safari";

  let os = "Sistema desconhecido";
  if (ua.includes("Windows")) os = "Windows";
  else if (ua.includes("Mac")) os = "macOS";
  else if (ua.includes("Linux") && !ua.includes("Android")) os = "Linux";
  else if (ua.includes("Android")) os = "Android";
  else if (ua.includes("iPhone") || ua.includes("iPad")) os = "iOS";

  return {
    browser,
    os,
    deviceName: `${browser} em ${os}`,
  };
}
