interface NominatimResponse {
    lat: string;
    lon: string;
}

interface NominatimReverseResponse {
  display_name: string;
}

const geocodeAddress = async (address: string): Promise<{latitude: number, longitude: number}> => {
  const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`);
  const data = await response.json() as NominatimResponse[];

  if (data.length === 0) {
    throw new Error('Address not found');
  }

  const { lat, lon } = data[0];
  return { latitude: parseFloat(lat), longitude: parseFloat(lon) };
};

const reverseGeocode = async (latitude: number, longitude: number): Promise<string> => {
  const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
  const data = await response.json() as NominatimReverseResponse;

  if (!data.display_name) {
    throw new Error('Address not found');
  }

  return data.display_name;
};

export { geocodeAddress, reverseGeocode };