const API_URL = "https://stockscreenerapp-fb4k.onrender.com";

export async function getCompany(symbol: string) {
  const response = await fetch(
    `${API_URL}/api/company/${symbol.toUpperCase()}`
  );

  if (!response.ok) {
    throw new Error("Company not found");
  }

  return response.json();
}

export async function searchCompanies(query: string) {
  const response = await fetch(
    `${API_URL}/api/company/search?q=${encodeURIComponent(query)}`
  );

  if (!response.ok) {
    throw new Error("Company search failed");
  }

  return response.json();
}
