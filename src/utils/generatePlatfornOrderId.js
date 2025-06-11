export const generatePlatformOrderId = () => {
  const now = new Date();

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0"); // Aylar 0-11 arasında, bu yüzden +1 yapıyoruz
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");

  // "yyyyMMddHHmmss" formatında platform_order_id oluşturuyoruz
  const platformOrderId = `${year}${month}${day}${hours}${minutes}${seconds}`;

  return platformOrderId;
};
