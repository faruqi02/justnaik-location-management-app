// will be used later for .txt upload validation
export function parseTxt(content) {
  const lines = content.trim().split(/\r?\n/);
  if (lines.length < 2) throw new Error("No data rows");
  const [header] = lines;
  if (!/name/i.test(header) || !/lat/i.test(header) || !/lon/i.test(header)) {
    throw new Error("Invalid header, must include Name, Latitude, Longitude");
  }

  const results = [];
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    const [name, latStr, lonStr] = line.split(",").map((s) => s.trim());
    const latitude = Number(latStr);
    const longitude = Number(lonStr);
    if (!name || Number.isNaN(latitude) || Number.isNaN(longitude)) {
      throw new Error(`Invalid row at line ${i + 1}`);
    }
    results.push({ name, latitude, longitude });
  }
  return results;
}
